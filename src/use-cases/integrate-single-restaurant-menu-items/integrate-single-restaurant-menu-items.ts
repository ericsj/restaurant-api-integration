import type { MenuItemUploadStatus } from "../../domain/entities/transformed-data.js";
import type {
  GetMenuItemsFromRestaurant,
  IntegrateSingleRestarantMenuItems,
} from "../../domain/use-cases.js";
import type { RestaurantsApiAdapter } from "./../protocols/restaurants-api-adapter.js";

export class IntegrateSingleRestarantMenuItemsUseCase implements IntegrateSingleRestarantMenuItems {
  constructor(
    private readonly restaurantsApiAdapter: RestaurantsApiAdapter,

    private readonly menuItemsProcessor: GetMenuItemsFromRestaurant,
  ) {}

  async integrateMenuItems(
    restaurantCode: string,
  ): Promise<MenuItemUploadStatus[]> {
    const rawRestaurantData =
      await this.restaurantsApiAdapter.getRestaurantData(restaurantCode);
    let menuItems =
      this.menuItemsProcessor.getMenuItemsFromRestaurant(rawRestaurantData);
    const uploadResult: MenuItemUploadStatus[] = [];
    for (let menuItem of menuItems) {
      const uploadSuccess =
        await this.restaurantsApiAdapter.uploadMenuItem(menuItem);
      uploadResult.push({
        category: menuItem.category,
        item_name: menuItem.item_name,
        restaurant: menuItem.restaurant,
        success: uploadSuccess,
      });
    }
    return uploadResult;
  }
}
