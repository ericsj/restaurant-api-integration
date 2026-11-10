import type {
  Menu,
  MenuCategory,
  Product,
  ProductVariation,
  Restaurant,
} from "../../domain/entities/raw-data.js";
import type { MenuItem } from "../../domain/entities/transformed-data.js";
import type { GetMenuItemsFromRestaurant } from "../../domain/protocols.js";

export class GetMenuItemsFromRestaurantUseCase implements GetMenuItemsFromRestaurant {
  getMenuItemsFromRestaurant(restaurant: Restaurant): MenuItem[] {
    const { name, rating } = restaurant;
    let menuItems: MenuItem[] = [];
    for (const menu of restaurant.menus) {
      menuItems = menuItems.concat(
        this.getMenuItemsFromMenu(menu, name, rating),
      );
    }
    return menuItems;
  }

  private getMenuItemsFromMenu(
    menu: Menu,
    restaurantName: string,
    rating: number,
  ): MenuItem[] {
    let menuItems: MenuItem[] = [];
    for (const menuCat of menu.menu_categories) {
      menuItems = menuItems.concat(
        this.getMenuItemsFromMenuCategory(menuCat, restaurantName, rating),
      );
    }
    return menuItems;
  }

  private getMenuItemsFromMenuCategory(
    menuCategory: MenuCategory,
    restaurantName: string,
    rating: number,
  ): MenuItem[] {
    let menuItems: MenuItem[] = [];
    for (const product of menuCategory.products) {
      menuItems = menuItems.concat(
        this.getMenuItemsFromProduct(
          product,
          menuCategory.name,
          restaurantName,
          rating,
        ),
      );
    }
    return menuItems;
  }

  private getMenuItemsFromProduct(
    product: Product,
    category: string,
    restaurantName: string,
    rating: number,
  ): MenuItem[] {
    let menuItems: MenuItem[] = [];
    for (const productVar of product.product_variations) {
      menuItems.push(
        this.getMenuItemFromProductVariation(
          productVar,
          category,
          restaurantName,
          rating,
          product.name,
        ),
      );
    }
    return menuItems;
  }

  private getMenuItemFromProductVariation(
    productVariation: ProductVariation,
    category: string,
    restaurantName: string,
    rating: number,
    itemName: string,
  ): MenuItem {
    return {
      rating,
      restaurant: restaurantName,
      category,
      item_id: String(productVariation.id),
      item_name: itemName,
      item_price: productVariation.price,
    };
  }
}
