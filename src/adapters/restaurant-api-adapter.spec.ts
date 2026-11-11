import { describe, expect, test, afterEach, vi } from "vitest";
import { RestaurantsApiAdapter } from "./restaurant-api-adapter.js";

const RESTAURANT_ID = "foo777";
type FetchApiType = "successful_response" | "bad_request" | "throw";

const makeFetchApiMock = (type: FetchApiType) => {
  switch (type) {
    case "successful_response":
      return vi.fn<typeof fetch>();
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

const makeSut = (fetchApiType: FetchApiType) => {
  const fetchApi = makeFetchApiMock(fetchApiType);
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
          new RestaurantsApiAdapter(makeFetchApiMock("successful_response")),
      ).toThrow();
    });

    test("should throw if USER_ID is missing", async () => {
      vi.stubEnv("USER_ID", undefined);
      expect(
        () =>
          new RestaurantsApiAdapter(makeFetchApiMock("successful_response")),
      ).toThrow();
    });
  });

  describe("getRestaurantData", () => {
    test("should call fetchApi with correct values", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter, fetchApi } = makeSut("successful_response");
      restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      await expect(fetchApi).toHaveBeenCalledWith(
        `https://foo.bar/restaurants/${RESTAURANT_ID}`,
      );
    });

    test("should return null in case fetch API returns status code out of 200-299 range", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut("bad_request");
      const result =
        await restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      expect(result).toBeNull();
    });

    test("should return null in case fetch API throws", async () => {
      vi.stubEnv("USER_ID", "foo123");
      vi.stubEnv("BASE_API_URL", "https://foo.bar");
      const { restaurantApiAdapter } = makeSut("throw");
      const result =
        await restaurantApiAdapter.getRestaurantData(RESTAURANT_ID);
      expect(result).toBeNull();
    });
  });
});
