import type {
  IntegrateAllRestarantsMenuItems,
  IntegrateSingleRestarantMenuItems,
} from "../../domain/protocols.js";

export class IntegrateAllRestarantsMenuItemsUseCase implements IntegrateAllRestarantsMenuItems {
  constructor(
    private readonly singleRestaurantIntegrator: IntegrateSingleRestarantMenuItems,
  ) {}

  async integrateMenuItems(): Promise<void> {
    const restaurantCodes = process.env.RESTAURANT_CODES;
    if (!restaurantCodes) {
      throw new Error("Restaurant codes not present in config");
    }
    const splitRestaurantCodes = restaurantCodes.split(",");
    const allRestaurantsResults = (
      await Promise.allSettled(
        splitRestaurantCodes.map((code) =>
          this.singleRestaurantIntegrator.integrateMenuItems(code),
        ),
      )
    ).flat();
    for (const singleRestaurantResult of allRestaurantsResults) {
      console.log(singleRestaurantResult);
    }
  }
}
