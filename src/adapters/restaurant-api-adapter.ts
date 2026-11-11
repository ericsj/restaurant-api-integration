import type {
  Restaurant,
  RestaurantApiResponse,
} from "../domain/entities/raw-data.js";
import type { MenuItem } from "../domain/entities/transformed-data.js";
import type { RestaurantsApi } from "../use-cases/protocols/restaurants-api-adapter.js";

export type FetchFn = typeof fetch;

export class RestaurantsApiAdapter implements RestaurantsApi {
  private baseUrl: string | undefined;
  private userId: string | undefined;

  constructor(private readonly fetchApi: FetchFn = fetch) {
    this.baseUrl = process.env.BASE_API_URL;
    this.userId = process.env.USER_ID;
    if (!this.baseUrl) {
      throw new Error("missing BASE_API_URL in environment variables");
    }
    if (!this.userId) {
      throw new Error("missing USER_ID in environment variables");
    }
  }

  async getRestaurantData(restaurantId: string): Promise<Restaurant | null> {
    const url = `${this.baseUrl}/restaurants/${restaurantId}`;
    try {
      const api_response = await this.fetchApi(url);
      if (api_response.ok) {
        const jsonResponse =
          (await api_response.json()) as RestaurantApiResponse;
        return jsonResponse.data;
      }
      return null;
    } catch {
      return null;
    }
  }

  async uploadMenuItem(menuItem: MenuItem): Promise<boolean> {
    const url = `${this.baseUrl}/${this.userId}/items`;
    try {
      const api_response = await this.fetchApi(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItem),
      });
      return api_response.ok;
    } catch {
      return false;
    }
  }
}
