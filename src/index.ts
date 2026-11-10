import "dotenv/config";
import { IntegrateAllRestarantsMenuItemsUseCase } from "./use-cases/integrate-all-restaurants-menu-items/integrate-all-restaurants-menu-items.js";
import { IntegrateSingleRestarantMenuItemsUseCase } from "./use-cases/integrate-single-restaurant-menu-items/integrate-single-restaurant-menu-items.js";
import { RestaurantsApiAdapter } from "./adapters/restaurant-api-adapter.js";
import { GetMenuItemsFromRestaurantUseCase } from "./use-cases/get-menu-items-from-restaurant/get-menu-items-from-restaurant.js";

const restaurantsApiAdapter = new RestaurantsApiAdapter();
const menuItemProcessor = new GetMenuItemsFromRestaurantUseCase();
const integrateSingleRestarantMenuItems =
  new IntegrateSingleRestarantMenuItemsUseCase(
    restaurantsApiAdapter,
    menuItemProcessor,
  );
const integrateAllRestarantsMenuItemsUseCase =
  new IntegrateAllRestarantsMenuItemsUseCase(integrateSingleRestarantMenuItems);
integrateAllRestarantsMenuItemsUseCase.integrateMenuItems();
