# Restaurant API Integration

## About

This project is an API integration. It fetches restaurant dishes from an API (`/restaurants/{restaurant_id}`), formats the data and uploads each dish to another endpoint (`/{user_id}/items`). The last section shows samples of the external API data models.

## Architecture

The project is organized in three layers, inspired by Clean Architecture:

- **Domain** (`src/domain`): entities describing the raw API data and the transformed menu items, plus the shared protocols (interfaces).
- **Use cases** (`src/use-cases`): the business rules — extracting menu items from a restaurant, integrating a single restaurant, and orchestrating the integration of all restaurants. Each use case depends only on interfaces, such as `RestaurantsApi` in `use-cases/protocols`.
- **Adapters** (`src/adapters`): the concrete implementation that talks to the external API over HTTP.

Dependencies are wired through constructor injection: each use case receives the use cases it builds on and the API adapter, instead of instantiating them itself. `index.ts` is the only place where concrete classes are created and connected. As a result, every use case can be unit tested in isolation with mocks, without network calls, and the HTTP adapter can be replaced (for example, by a different API client) without changing any business logic.

## Features

**Concurrency**: menus from all restaurants are fetched in parallel, and the formatted menu items are uploaded concurrently.

**External API rate limiting**: a 100 ms delay is applied between menu item upload requests to avoid hitting the external API's rate limits.

## Local Setup

**Prerequisites**: Node.js 22+

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   BASE_API_URL=https://integration.vercel.app
   RESTAURANT_CODES=b2bi,v6zw
   USER_ID=foo123
   ```

3. Start the project and follow the integration logs in the terminal:

   ```bash
   npm run dev
   ```

## Tests

```bash
npm test
```

## External API Endpoints

### GET /restaurants/{restaurant_id}

Returns a restaurant and its menus.

Example response body:

```json
{
  "status_code": 200,
  "data": {
    "id": 30373,
    "code": "b2bi",
    "name": "Domino's (Jurong East)",
    "description": "",
    "rating": 4,
    "menus": [
      {
        "id": 90023,
        "code": "",
        "name": "Main Menu",
        "description": "",
        "menu_categories": [
          {
            "id": 1027595,
            "code": "dbebb4f4-9ae8-43a5-9c6c-26fc719b2ada",
            "name": "Pasta",
            "description": "Comforting oven-baked pasta, ideal as a meal for one or as a side to share.",
            "products": [
              {
                "id": 17190569,
                "code": "613d2e22-55ad-4d3d-bc52-a468b5700596",
                "name": "Mac & Cheese (Chicken)",
                "description": "This classic mac & cheese is bursting with flavors! Made of macaroni, cream sauce, chicken ham, mozzarella cheese and garnished with oregano.",
                "product_variations": [
                  {
                    "id": 18377777,
                    "code": "57722cae-532f-4c30-b1f1-8220f7bc5955",
                    "price": 7.14,
                    "is_vegetarian": false,
                    "name": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### POST /{user_id}/items

Uploads a menu item, scoped to the given user ID.

Example request body:

```json
{
  "item_id": "18377777",
  "item_name": "Mac & Cheese (Chicken)",
  "item_price": 7.14,
  "restaurant": "Domino's (Jurong East)",
  "rating": 4,
  "category": "Pasta"
}
```

### GET /{user_id}/items

Returns all menu items uploaded for the given user ID.

Example response body:

```json
[
  {
    "item_id": "18377777",
    "item_name": "Mac & Cheese (Chicken)",
    "item_price": 7.14,
    "restaurant": "Domino's (Jurong East)",
    "rating": 4,
    "category": "Pasta"
  }
]
```
