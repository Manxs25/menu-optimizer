# Menu Optimizer

A full-stack restaurant menu intelligence app that helps analyze dish performance, profitability, demand, and AI-powered optimization opportunities.

The app supports manual menu entry, CSV bulk upload, POS-style sales report upload, dashboard analytics, and AI recommendations.

## Features

- User registration and login with JWT authentication
- User-specific menu data and dashboards
- Add, edit, and delete menu items
- CSV bulk upload using `name,price,cost,orders`
- POS markdown report upload for Dish TypeWise Sales reports
- Dashboard KPIs for profit, menu health, and category counts
- Menu engineering classification:
  - Star
  - Plowhorse
  - Puzzle
  - Dog
- AI optimization recommendations using Groq
- Sample CSV data included for quick testing

## Tech Stack

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- multer
- papaparse
- Groq SDK

Frontend:

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts

## Project Structure

```text
menu-optimizer-backend/
  controllers/
  middleware/
  models/
  routes/
  sample-data/
  frontend/
    src/
      pages/
      services/
  server.js
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Do not commit `.env`. It is already ignored by Git.

## Install Dependencies

Backend:

```bash
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Run Locally

Start backend from the project root:

```bash
node server.js
```

Backend runs at:

```text
http://127.0.0.1:5000
```

Start frontend:

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

## Bulk Upload Format

Simple CSV format:

```csv
name,price,cost,orders
Butter Chicken,420,170,260
Paneer Tikka,360,120,230
```

The app also supports POS-style markdown reports containing columns like:

- `Dish`
- `Rate`
- `L/P`
- `Ala-carte Qty`

These are mapped internally to:

```text
Dish -> name
Rate -> price
L/P -> cost
Ala-carte Qty -> orders
```

## Sample Data

A sample CSV is included:

```text
sample-data/menu_sample.csv
```

Upload it from the Bulk Upload page to quickly populate a dashboard.

## Notes

- Each user has separate menu data.
- Existing global dishes without a user owner will not appear in user dashboards.
- Uploading the same CSV/report multiple times can create duplicate dishes. Duplicate handling is a future improvement.
