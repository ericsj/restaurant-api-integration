import type { MenuItem } from "../../domain/entities/transformed-data.js";

export const menuItemMock: MenuItem = {
  rating: 4,
  restaurant: "Domino's (Jurong East)",
  category: "Pasta",
  item_id: "18377777",
  item_name: "Mac & Cheese (Chicken)",
  item_price: 7.140000000000001,
};

export const menuItemsMock: MenuItem[] = [menuItemMock];
