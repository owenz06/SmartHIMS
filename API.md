# SHIMS API v1

REST JSON API for Smart Hospital Inventory Management System. Uses Laravel Sanctum for token-based authentication.

## Setup

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## Authentication

**Obtain a token**

```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "1|abc123...",
  "token_type": "Bearer",
  "user": { "id": 1, "name": "...", "email": "...", "role": "admin" }
}
```

**Use the token**

```http
Authorization: Bearer {token}
```

**Revoke token**

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/items` | List items (filters: `search`, `only_low_stock`, `per_page`) |
| GET | `/api/v1/items/{id}` | Get item detail |
| POST | `/api/v1/stock-transactions` | Dispense stock (body: `item_id`, `quantity_taken`, `dispensed_to?`, `notes?`) |
| GET | `/api/v1/purchase-orders` | List POs (filters: `status`, `supplier_id`, `per_page`) |
| GET | `/api/v1/purchase-orders/{id}` | Get PO detail |
| PATCH | `/api/v1/purchase-orders/{id}/status` | Update PO status (body: `status` = Pending\|Approved\|Received\|Cancelled) |
| GET | `/api/v1/requisitions` | List requisitions (filters: `status`, `department_id`, `per_page`) |
| GET | `/api/v1/requisitions/{id}` | Get requisition detail |
