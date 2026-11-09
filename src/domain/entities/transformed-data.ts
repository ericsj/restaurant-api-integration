export type MenuItem = {
  rating: number;
  restaurant: string;
  category: string;
  item_id: string;
  item_name: string;
  item_price: number;
};

export type MenuItemUploadStatus = {
  restaurant: string;
  category: string;
  item_name: string;
  success: boolean;
};
