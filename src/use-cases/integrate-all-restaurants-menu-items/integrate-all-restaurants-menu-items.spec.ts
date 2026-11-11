import { describe, expect, vi, test } from "vitest";
import type { IntegrateSingleRestarantMenuItems } from "../../domain/protocols.js";
import { menuItemUploadStatusMock } from "../mocks/menu-item-upload-status.js";
import { IntegrateAllRestarantsMenuItemsUseCase } from "./integrate-all-restaurants-menu-items.js";

const makeIntegrateSingleRestarantMenuItemsMock = () => {
  class IntegrateSingleRestarantMenuItemsMock implements IntegrateSingleRestarantMenuItems {
    integrateMenuItems = vi.fn().mockResolvedValue(menuItemUploadStatusMock);
  }
  return new IntegrateSingleRestarantMenuItemsMock();
};

const makeSut = () => {
  const integrateSingleRestarantMenuItemsMock =
    makeIntegrateSingleRestarantMenuItemsMock();
  const integrateAllRestarantsMenuItemsUseCase =
    new IntegrateAllRestarantsMenuItemsUseCase(
      integrateSingleRestarantMenuItemsMock,
    );
  return {
    integrateSingleRestarantMenuItemsMock,
    integrateAllRestarantsMenuItemsUseCase,
  };
};

describe("IntegrateAllRestarantsMenuItemsUseCase", () => {
  test("should throw if restaurant codes are not present in env vars", async () => {
    vi.stubEnv("RESTAURANT_CODES", undefined);
    const { integrateAllRestarantsMenuItemsUseCase } = makeSut();
    await expect(
      integrateAllRestarantsMenuItemsUseCase.integrateMenuItems(),
    ).rejects.toThrow();
  });

  test("should call integrateMenuItems once per restaurant code", async () => {
    const restaurantCodes = "123,555";
    vi.stubEnv("RESTAURANT_CODES", restaurantCodes);
    const {
      integrateSingleRestarantMenuItemsMock,
      integrateAllRestarantsMenuItemsUseCase,
    } = makeSut();
    await integrateAllRestarantsMenuItemsUseCase.integrateMenuItems();
    expect(
      integrateSingleRestarantMenuItemsMock.integrateMenuItems,
    ).toHaveBeenCalledTimes(restaurantCodes.split(",").length);
  });

  test("should call integrateMenuItems sending restaurant code as argument", async () => {
    const restaurantCodes = "123,555";
    vi.stubEnv("RESTAURANT_CODES", restaurantCodes);
    const {
      integrateSingleRestarantMenuItemsMock,
      integrateAllRestarantsMenuItemsUseCase,
    } = makeSut();
    await integrateAllRestarantsMenuItemsUseCase.integrateMenuItems();
    for (let i = 0; i < restaurantCodes.split(",").length; i++) {
      expect(
        integrateSingleRestarantMenuItemsMock.integrateMenuItems,
      ).toHaveBeenNthCalledWith(i + 1, restaurantCodes.split(",")[i]);
    }
  });
});
