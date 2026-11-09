import type { MenuItemUploadStatus } from "../domain/entities/transformed-data.js";
import type { IntegrateSingleRestarantMenuItems } from "../domain/use-cases.js";
import { GetMenuItemsFromRestaurantUseCase } from "./extract-menu-items-from-restaurant.js";
import type { RestaurantsApiAdapter } from "./protocols/restaurants-api-adapter.js";

class IntegrateSingleRestarantMenuItemsUseCase implements IntegrateSingleRestarantMenuItems {
  constructor(private readonly restaurantsApiAdapter: RestaurantsApiAdapter) {}

  async integrateMenuItems(
    restaurantCode: string,
  ): Promise<MenuItemUploadStatus[]> {
    const getMenuItemsFromRestaurantUseCase =
      new GetMenuItemsFromRestaurantUseCase();
    const rawRestaurantData =
      await this.restaurantsApiAdapter.getRestaurantData(restaurantCode);
    let menuItems =
      getMenuItemsFromRestaurantUseCase.getMenuItemsFromRestaurant(
        rawRestaurantData,
      );
    const uploadResult: MenuItemUploadStatus[] = [];
    for (let menuItem of menuItems) {
      const uploadSuccess = this.restaurantsApiAdapter.uploadMenuItem(menuItem);
    }
    return uploadResult;
  }
}
