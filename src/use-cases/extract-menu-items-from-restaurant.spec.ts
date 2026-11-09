import { test, expect } from "vitest";
import { GetMenuItemsFromRestaurantUseCase } from "./extract-menu-items-from-restaurant.js";
import { restaurantMock } from "./mocks/restaurant.js";
import { menuItemsMock } from "./mocks/menu-item.js";

test("getMenuItemsFromRestaurant should return the expected menu item", () => {
  expect(
    new GetMenuItemsFromRestaurantUseCase().getMenuItemsFromRestaurant(
      restaurantMock,
    ),
  ).toStrictEqual(menuItemsMock);
});
