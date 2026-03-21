# Sales Dashboard API Contract

Base URL: `http://localhost:8080/api/v1`

## Response Envelope

All endpoints return:

```json
{
  "data": <payload | null>,
  "error": <string | null>
}
```

---

## GET /health

Health check.

**Response 200:**
```json
{"status": "ok"}
```

---

## POST /upload

Upload a CSV file of sales records.

**Request:** `Content-Type: multipart/form-data`
- Field: `file` (.csv, max 10MB)

**Expected CSV columns:**
```
date,customer_id,product,quantity,unit_price,total_amount
```

**Response 200:**
```json
{
  "data": {
    "rows_imported": 150,
    "rows_skipped": 2,
    "validation_errors": [
      {"row": 12, "field": "total_amount", "message": "invalid number format"}
    ]
  },
  "error": null
}
```

**Response 400:** Missing file, wrong content type, or entirely unparseable.

---

## GET /analytics/revenue

Revenue aggregated by time period.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `from` | ISO date | — | Start date filter |
| `to` | ISO date | — | End date filter |
| `group_by` | `day`\|`week`\|`month` | `month` | Aggregation period |

**Response 200:**
```json
{
  "data": {
    "periods": [
      {"period": "2025-01", "revenue": 12450.00, "order_count": 87},
      {"period": "2025-02", "revenue": 9830.50, "order_count": 64}
    ],
    "total_revenue": 22280.50
  },
  "error": null
}
```

---

## GET /analytics/products

Revenue and quantity breakdown by product.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `top` | int | all | Limit to top N products |
| `sort_by` | `revenue`\|`quantity` | `revenue` | Sort order |

**Response 200:**
```json
{
  "data": {
    "products": [
      {"product": "Widget Pro", "total_revenue": 8500.00, "total_quantity": 170, "percentage": 38.1},
      {"product": "Gadget Basic", "total_revenue": 5200.00, "total_quantity": 260, "percentage": 23.3}
    ]
  },
  "error": null
}
```

---

## GET /analytics/churn

Customer purchase frequency analysis.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `window_days` | int | 30 | Days per analysis window |

**Response 200:**
```json
{
  "data": {
    "customers": [
      {
        "customer_id": "CUST-042",
        "windows": [
          {"period": "2025-01", "purchases": 5},
          {"period": "2025-02", "purchases": 3},
          {"period": "2025-03", "purchases": 1}
        ],
        "trend": "declining"
      }
    ],
    "summary": {
      "total_customers": 48,
      "declining": 12,
      "stable": 30,
      "growing": 6
    }
  },
  "error": null
}
```
