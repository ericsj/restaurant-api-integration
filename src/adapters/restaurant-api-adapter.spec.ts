import { describe, expect, test, afterEach, vi } from "vitest";
import { RestaurantsApiAdapter } from "./restaurant-api-adapter.js";
import { restaurantApiResponseMock } from "./mocks/api-response-mocks.js";
import { restaurantMock } from "../use-cases/mocks/restaurant.js";
import { menuItemMock, menuItemsMock } from "../use-cases/mocks/menu-item.js";

const RESTAURANT_ID = "foo777";
type FetchApiType = "successful_response" | "bad_request" | "throw";

const makeFetchApiMock = (responseBody: any, type: FetchApiType) => {
  switch (type) {
    case "successful_response":
      return vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: {
            "responseBody-Type": "application/json",
          },
        }),
      );
    case "bad_request":
      return vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: "Not Found" }), { status: 400 }),
        );
    case "throw":
      return vi.fn().mockRejectedValue(new TypeError("fetch failed"));
  }
};

const makeSut = (responseBody: any, fetchApiType: FetchApiType) => {
  const fetchApi = makeFetchApiMock(responseBody, fetchApiType);
  const restaurantApiAdapter = new RestaurantsApiAdapter(fetchApi);
  return { restaurantApiAdapter, fetchApi };
};

describe("RestaurantsApiAdapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("constructor", () => {
    test("should throw if BASE_API_URL is missing", async () => {
      vi.stubEnv("BASE_API_URL", undefined);
      expect(
        () =>
          new RestaurantsApiAdapter(
            makeFetchApiMock(restaurantMock, "successful_response"),
          ),
      ).toThrow();
    });

    test("should throw if USER_ID is missing", async () => {
      vi.stubEnv("USER_ID", undefined);
      expect(
        () =>
          new RestaurantsApiAdapter(
            makeFetchApiMock(restaurantMock, "successful_response"),
          ),
      ).toThrow();
    });
  });

  describe("getRestaurantData", () => {
    test("should call fetchApi with correct values", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter, fetchApi } = makeSut(
        restaurantApiResponseMock,
        "successful_response",
      );
      restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      await expect(fetchApi).toHaveBeenCalledWith(
        `https://foo.bar/restaurants/${RESTAURANT_ID}`,
      );
    });

    test("should return null in case fetch API returns status code out of 200-299 range", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(
        restaurantApiResponseMock,
        "bad_request",
      );
      const result =
        await restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      expect(result).toBeNull();
    });

    test("should return null in case fetch API throws", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(
        restaurantApiResponseMock,
        "throw",
      );
      const result =
        await restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      expect(result).toBeNull();
    });

    test("should return the API response", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(
        restaurantApiResponseMock,
        "successful_response",
      );
      const result =
        await restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      expect(result).toStrictEqual(restaurantMock);
    });
  });

  describe("uploadMenuItem", () => {
    test("should call fetchApi with correct values", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter, fetchApi } = makeSut(
        menuItemsMock,
        "successful_response",
      );
      restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      await expect(fetchApi).toHaveBeenCalledWith(
        `https://foo.bar/restaurants/${RESTAURANT_ID}`,
      );
    });

    test("should return false in case fetch API returns status code out of 200-299 range", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(menuItemMock, "bad_request");
      const result = await restaurantApiAdapter.uploadMenuItem(menuItemMock);
      expect(result).toBe(false);
    });

    test("should return false in case fetch API throws", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(menuItemMock, "throw");
      const result = await restaurantApiAdapter.uploadMenuItem(menuItemMock);
      expect(result).toBe(false);
    });

    test("should return true if successful response", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut(
        menuItemMock,
        "successful_response",
      );
      const result = await restaurantApiAdapter.uploadMenuItem(menuItemMock);
      expect(result).toBe(true);
    });
  });
});
