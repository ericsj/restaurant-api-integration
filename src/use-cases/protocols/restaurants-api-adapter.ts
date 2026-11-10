import type { Restaurant } from "../../domain/entities/raw-data.js";
import type { MenuItem } from "../../domain/entities/transformed-data.js";

export interface RestaurantsApi {
  getRestaurantData: (restaurantId: string) => Promise<Restaurant | null>;
  uploadMenuItem: (menuItem: MenuItem) => Promise<boolean>;
}
