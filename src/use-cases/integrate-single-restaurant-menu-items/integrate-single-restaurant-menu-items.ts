import type { MenuItemUploadStatus } from "../../domain/entities/transformed-data.js";
import type {
  GetMenuItemsFromRestaurant,
  IntegrateSingleRestarantMenuItems,
} from "../../domain/protocols.js";
import type { RestaurantsApi } from "./../protocols/restaurants-api-adapter.js";
import { setTimeout } from "node:timers/promises";

const intervalBetweenResuests = 100; //ms

export class IntegrateSingleRestarantMenuItemsUseCase implements IntegrateSingleRestarantMenuItems {
  constructor(
    private readonly restaurantsApiAdapter: RestaurantsApi,
    private readonly menuItemsProcessor: GetMenuItemsFromRestaurant,
  ) {}

  async integrateMenuItems(
    restaurantCode: string,
  ): Promise<MenuItemUploadStatus[]> {
    console.log(`Getting Menu: ${restaurantCode}`);
    const rawRestaurantData =
      await this.restaurantsApiAdapter.getRestaurantData(restaurantCode);
    if (rawRestaurantData) {
      console.log(`Loaded menu: ${restaurantCode} - ${rawRestaurantData.name}`);
      let menuItems =
        this.menuItemsProcessor.getMenuItemsFromRestaurant(rawRestaurantData);
      return Promise.all(
        menuItems.map(async (menuItem, index) => {
          await setTimeout(index * intervalBetweenResuests);
          console.log(
            `Adding item ${menuItem.item_id} (${menuItem.item_name}) from ${rawRestaurantData.code} to the storage`,
          );
          const uploadSuccess =
            await this.restaurantsApiAdapter.uploadMenuItem(menuItem);
          if (uploadSuccess) {
            console.log(
              `Added item ${menuItem.item_id} (${menuItem.item_name}) from ${rawRestaurantData.code} to the storage`,
            );
          }
          return {
            category: menuItem.category,
            item_name: menuItem.item_name,
            restaurant: menuItem.restaurant,
            success: uploadSuccess,
          };
        }),
      );
    }
    return [];
  }
}
