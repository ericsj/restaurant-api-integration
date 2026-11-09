import type { Restaurant } from "../../domain/entities/raw-data.js";
import type { MenuItem } from "../../domain/entities/transformed-data.js";

export interface RestaurantsApiAdapter {
  getRestaurantData: (restaurantId: string) => Promise<Restaurant>;
  uploadMenuItem: (menuItem: MenuItem) => Promise<boolean>;
}
