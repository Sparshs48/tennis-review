## Tennis Courts — React + Node/Express + MongoDB

A full‑stack application for browsing tennis courts, viewing details, and posting reviews. The frontend is a modern React app (Vite + TypeScript + Tailwind), and the backend is a Node/Express API (TypeScript) with MongoDB for persistence.

### Demo (local)

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

---

### Contents

- Features
- Tech Stack
- Project Structure
- Quick Start
- Scripts
- Environment Variables
- API Reference
- Data Model
- Development Notes
- Troubleshooting

---

### Features

- Browse a curated list of tennis courts with search and filters (surface, rating)
- Detailed court pages with amenities, hours, and user reviews
- Submit reviews with automatic rating recalculation
- Fully typed codebase (TypeScript) on both client and server
- API with validation, error handling, and CORS

---

### Tech Stack

- Frontend: React 19, Vite, TypeScript, TailwindCSS
- Backend: Node.js, Express (v5), TypeScript, Mongoose
- Database: MongoDB (local or Atlas)

---

### Project Structure

```
frontend-challenge/
├── backend/                   # Node/Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose schemas/models
│   │   ├── routes/           # Express routers
│   │   ├── middleware/       # CORS, error handler, etc.
│   │   ├── database/         # DB connection
│   │   └── scripts/          # Data migration
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── README.md             # Backend specific docs
├── src/                       # React app source
│   ├── components/
│   ├── services/              # API client
│   ├── utils/                 # Helpers
│   ├── types/
│   └── main.tsx, App.tsx
├── start-dev.bat              # Windows one‑click startup
├── start-dev.sh               # Unix one‑click startup
├── SETUP_GUIDE.md             # Full setup instructions
└── README.md                  # You are here
```

---

### Quick Start

1. Backend

```bash
cd backend
npm install
cp .env.example .env   # create if missing and adjust values
npm run migrate        # seed sample courts + reviews
npm run dev            # start API on :5000
```

2. Frontend (in project root)

```bash
npm install
npm run dev            # start Vite dev server on :5173
```

3. Open the app at `http://localhost:5173`

Tip (Windows): double‑click `start-dev.bat` to install, seed, and start both servers.

---

### Scripts

Frontend (root `package.json`):

```bash
npm run dev       # start Vite
npm run build     # build frontend assets
npm run preview   # preview production build
```

Backend (`backend/package.json`):

```bash
npm run dev       # start API with nodemon
npm run build     # compile TypeScript to dist
npm start         # run compiled API
npm run migrate   # seed sample data
```

---

### Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tennis-courts
NODE_ENV=development
JWT_SECRET=replace-me-in-prod
```

---

### API Reference

Base URL: `http://localhost:5000/api`

Courts

- `GET /courts` — list courts (query: `search`, `surface`, `rating`)
- `GET /courts/:id` — get court by numeric id
- `POST /courts` — create court
- `PUT /courts/:id` — update court
- `DELETE /courts/:id` — delete court

Reviews

- `POST /courts/:courtId/reviews` — add review to a court
- `GET /courts/:courtId/reviews` — list reviews for a court
- `PUT /courts/reviews/:reviewId` — update a review
- `DELETE /courts/reviews/:reviewId` — delete a review

Health

- `GET /health` — API status

Typical error response

```json
{ "success": false, "message": "Error description" }
```

---

### Data Model

TennisCourt

```ts
{
  id: number,
  name: string,
  location: string,
  address: string,
  surface: 'Hard' | 'Clay' | 'Grass',
  price: string,
  hours: string,
  amenities: string[],
  rating: number,
  reviewCount: number,
  description: string,
  reviews: ObjectId[]
}
```

Review

```ts
{
  name: string,
  rating: number,  // 1-5
  date: string,
  text: string
}
```

---

### Development Notes

- Express v5 uses a different router engine; a catch‑all 404 handler must not use `'*'` path. This project uses a terminal middleware for 404s.
- CORS is enabled for common localhost ports (3000/5173). Adjust `backend/src/middleware/cors.ts` for deployment.
- The frontend API base URL is defined in `src/services/api.ts` (`API_BASE_URL`).

---

### Troubleshooting

- Backend won’t start
  - Ensure MongoDB is running and the `MONGODB_URI` is correct
  - Delete `backend/dist` and re‑build if running in production mode
- Frontend loads but shows “Error Loading Courts”
  - Verify the backend is running on `:5000`
  - Check browser console for CORS errors
- Can’t submit a review
  - Confirm routes are available: `POST /api/courts/:id/reviews`
  - Check server logs for validation errors

---

### License

ISC — see repository for details.
