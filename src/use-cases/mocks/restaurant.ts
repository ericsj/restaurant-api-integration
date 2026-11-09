import type { Restaurant } from "../../domain/entities/raw-data.js";

export const restaurantMock: Restaurant = {
  id: 30373,
  code: "b2bi",
  name: "Domino's (Jurong East)",
  description: "",
  rating: 4,
  menus: [
    {
      id: 90023,
      code: "",
      name: "Main Menu",
      description: "",
      menu_categories: [
        {
          id: 1027595,
          code: "dbebb4f4-9ae8-43a5-9c6c-26fc719b2ada",
          name: "Pasta",
          description:
            "Comforting oven-baked pasta, ideal as a meal for one or as a side to share.",
          products: [
            {
              id: 17190569,
              code: "613d2e22-55ad-4d3d-bc52-a468b5700596",
              name: "Mac & Cheese (Chicken)",
              description:
                "This classic mac & cheese is bursting with flavors! Made of macaroni, cream sauce, chicken ham, mozzarella cheese and garnished with oregano.",
              product_variations: [
                {
                  id: 18377777,
                  code: "57722cae-532f-4c30-b1f1-8220f7bc5955",
                  price: 7.140000000000001,
                  is_vegetarian: false,
                  name: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
