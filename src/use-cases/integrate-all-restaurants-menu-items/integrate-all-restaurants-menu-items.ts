import type {
  MenuItem,
  MenuItemUploadStatus,
} from "../../domain/entities/transformed-data.js";
import type {
  IntegrateAllRestarantsMenuItems,
  IntegrateSingleRestarantMenuItems,
} from "../../domain/use-cases.js";
import { GetMenuItemsFromRestaurantUseCase } from "../get-menu-items-from-restaurant/get-menu-items-from-restaurant.js";
import type { RestaurantsApiAdapter } from "../protocols/restaurants-api-adapter.js";

class IntegrateAllRestarantsMenuItemsUseCase implements IntegrateAllRestarantsMenuItems {
  constructor(
    private readonly singleRestaurantIntegrator: IntegrateSingleRestarantMenuItems,
  ) {}

  async integrateMenuItems(): Promise<void> {}
}
