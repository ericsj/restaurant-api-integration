import type {
  MenuItem,
  MenuItemUploadStatus,
} from "./entities/transformed-data.js";
import type { Restaurant } from "./entities/raw-data.js";

export interface IntegrateSingleRestarantMenuItems {
  integrateMenuItems: (
    restaurantCode: string,
  ) => Promise<MenuItemUploadStatus[]>;
}

export interface IntegrateAllRestarantsMenuItems {
  integrateMenuItems: () => Promise<void>;
}

export interface UploadMenuItems {
  uploadMenuItems: (menuItems: MenuItem[]) => Promise<MenuItemUploadStatus[]>;
}

export interface GetMenuItemsFromRestaurant {
  getMenuItemsFromRestaurant: (restaurant: Restaurant) => MenuItem[];
}
