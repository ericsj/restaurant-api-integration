import { test, expect, vi } from "vitest";
import type { RestaurantsApi } from "../protocols/restaurants-api-adapter.js";
import { restaurantMock } from "../mocks/restaurant.js";
import type { GetMenuItemsFromRestaurant } from "../../domain/protocols.js";
import { menuItemsMock } from "../mocks/menu-item.js";
import { IntegrateSingleRestarantMenuItemsUseCase } from "./integrate-single-restaurant-menu-items.js";
import { describe } from "node:test";

const makeRestaurantsApiAdapterMock = () => {
  class RestaurantsApiAdapterMock implements RestaurantsApi {
    getRestaurantData = vi.fn().mockResolvedValue(restaurantMock);
    uploadMenuItem = vi.fn().mockResolvedValue(true);
  }
  return new RestaurantsApiAdapterMock();
};

const makeMenuItemsProcessorMock = () => {
  class GetMenuItemsFromRestaurantUseCaseMock implements GetMenuItemsFromRestaurant {
    getMenuItemsFromRestaurant = vi.fn().mockReturnValue(menuItemsMock);
  }
  return new GetMenuItemsFromRestaurantUseCaseMock();
};

const makeSut = () => {
  const restaurantsApiAdapterMock = makeRestaurantsApiAdapterMock();
  const menuItemsProcessorMock = makeMenuItemsProcessorMock();
  return {
    sut: new IntegrateSingleRestarantMenuItemsUseCase(
      restaurantsApiAdapterMock,
      menuItemsProcessorMock,
    ),
    restaurantsApiAdapterMock,
    menuItemsProcessorMock,
  };
};

describe("integrateMenuItems", () => {
  test("integrateMenuItems should call getRestaurantData with correct restaurant code", async () => {
    const { sut, restaurantsApiAdapterMock } = makeSut();
    const restaurant_id = "1234";
    await sut.integrateMenuItems(restaurant_id);
    expect(restaurantsApiAdapterMock.getRestaurantData).toHaveBeenCalledWith(
      restaurant_id,
    );
  });

  test("integrateMenuItems should call getMenuItemsFromRestaurant with output from getRestaurantData API", async () => {
    const { sut, menuItemsProcessorMock } = makeSut();
    const restaurant_id = "1234";
    await sut.integrateMenuItems(restaurant_id);
    expect(
      menuItemsProcessorMock.getMenuItemsFromRestaurant,
    ).toHaveBeenCalledWith(restaurantMock);
  });

  test("integrateMenuItems should call uploadMenuItem with processed restaurant data", async () => {
    const { sut, restaurantsApiAdapterMock } = makeSut();
    const restaurant_id = "1234";
    await sut.integrateMenuItems(restaurant_id);
    expect(restaurantsApiAdapterMock.uploadMenuItem).toHaveBeenNthCalledWith(
      1,
      menuItemsMock[0],
    );
  });

  test("integrateMenuItems should call uploadMenuItem once per menu item", async () => {
    const { sut, restaurantsApiAdapterMock } = makeSut();
    const restaurant_id = "1234";
    await sut.integrateMenuItems(restaurant_id);
    expect(restaurantsApiAdapterMock.uploadMenuItem).toHaveBeenCalledTimes(
      menuItemsMock.length,
    );
  });

  test("integrateMenuItems should return upload result with menu item data", async () => {
    const { sut } = makeSut();
    const restaurant_id = "1234";
    const uploadResult = await sut.integrateMenuItems(restaurant_id);
    expect(uploadResult).toStrictEqual([
      {
        restaurant: menuItemsMock[0]?.restaurant,
        category: menuItemsMock[0]?.category,
        item_name: menuItemsMock[0]?.item_name,
        success: true,
      },
    ]);
  });
});
