# Inventory Data Management System

A simple Node.js, Express, MongoDB and Mongoose REST API.

## Setup
1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Put your MongoDB Atlas connection string in `.env`. Never share or commit `.env`.
4. Run `npm start`.

## Routes
- `POST /api/products` — create product
- `GET /api/products` — list products
- `GET /api/products/:id` — get one product
- `PUT /api/products/:id` — update product
- `PATCH /api/products/:id/stock` — adjust stock
- `DELETE /api/products/:id` — delete product
- `GET /api/products/low-stock` — low-stock report
- `GET /api/products/summary` — category report

List examples:
- `/api/products?category=Stationery`
- `/api/products?search=pen`
- `/api/products?sort=price&page=1&limit=10`

Example product:
```json
{
  "name": "Blue Pen",
  "sku": "PEN-001",
  "category": "Stationery",
  "price": 10,
  "quantity": 40,
  "reorderLevel": 10
}
```

Stock adjustment body: `{ "change": 5 }`. Use a negative value to subtract stock.

## DNS note
`src/app.js` includes the two DNS workaround lines needed on your current PC because Node.js SRV lookup failed. They are a troubleshooting workaround, not an inventory feature.
