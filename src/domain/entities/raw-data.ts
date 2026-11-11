export type ProductVariation = {
  id: number;
  code: string;
  price: number;
  is_vegetarian: boolean;
  name: null;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  description: string;
  product_variations: ProductVariation[];
};

export type MenuCategory = {
  id: number;
  code: string;
  name: string;
  description: string;
  products: Product[];
};

export type Menu = {
  id: number;
  code: string;
  name: string;
  description: string;
  menu_categories: MenuCategory[];
};

export type Restaurant = RestaurantIdAndCode & {
  name: string;
  description: string;
  rating: number;
  menus: Menu[];
};

export type RestaurantIdAndCode = {
  id: number;
  code: string;
};

export type RestaurantApiResponse = {
  status_code: number;
  data: Restaurant;
};
