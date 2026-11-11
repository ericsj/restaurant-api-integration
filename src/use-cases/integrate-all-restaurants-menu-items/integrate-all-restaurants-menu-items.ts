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
      await Promise.all(
        splitRestaurantCodes.map((code) =>
          this.singleRestaurantIntegrator.integrateMenuItems(code),
        ),
      )
    ).flat();
    const successCount = allRestaurantsResults.filter(
      (result) => result.success,
    ).length;
    const failureCount = allRestaurantsResults.length - successCount;
    console.log(
      `Saved ${successCount} items, ${failureCount} failure:\n---\nRestaurant, Category, Item, Success\n---`,
    );
    for (const singleRestaurantResult of allRestaurantsResults) {
      const { restaurant, category, item_name, success } =
        singleRestaurantResult;
      console.log(`${restaurant}, ${category}, ${item_name}, ${success}`);
    }
  }
}
