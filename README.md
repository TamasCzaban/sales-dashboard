# Sales Analytics Dashboard

A small business sales analytics dashboard. Upload CSV sales data and get instant insights: revenue trends, product breakdowns, and churn signals.

## Prerequisites

- Go 1.22+
- Node.js 20+
- Docker & Docker Compose (optional)

## Quick Start

### Backend

```bash
cd backend
go mod download
go run ./cmd/server
# → http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Docker

```bash
docker compose up --build
# Frontend → http://localhost:3000
# Backend  → http://localhost:8080
```

## API Documentation

See [docs/api-contract.md](docs/api-contract.md) for the full API specification.

## Sample Data

A test CSV is provided at `sample-data/sample_sales.csv`.

## Project Structure

```
sales-dashboard/
├── backend/          # Go REST API
├── frontend/         # React + TypeScript + Plotly
├── docs/             # API contract
└── sample-data/      # Test CSV files
```
