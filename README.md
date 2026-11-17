# GameVault - Frontend

GameVault is a game review and backlog tracker. Users can browse a catalogue of games, write reviews, keep a personal backlog (wishlist, playing, completed) and see statistics about their gaming activity. Admins manage the game catalogue.

This is the React + TypeScript frontend for the ITS2020 Rapid Application Development final coursework.

## Links

| | URL |
|---|---|
| Live frontend | `https://rad-coursework-gaming-vault-fronten.vercel.app/` |
| Live backend API | `https://rad-coursework-gaming-vault-backend.onrender.com/` |
| Backend repository | https://github.com/Neon2598-bit/RAD_Coursework_Gaming_Vault_Backend |
| Frontend repository | https://github.com/Neon2598-bit/RAD_Coursework_Gaming_Vault_Frontend |

## Technologies

| Area | Tools |
|---|---|
| Language | TypeScript |
| UI | React (functional components and hooks), TailwindCSS |
| State management | Redux Toolkit, React Redux |
| Routing | React Router |
| HTTP | Axios (with interceptors) |
| Build tool | Vite |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Features

**Visitors**
- Browse games with search, genre and platform filters, and pagination (filters are kept in the URL)
- View game details, ratings and reviews
- Register and log in

**Logged-in users**
- Write, edit and delete their own review (one per game) with a 1-5 star rating
- "My reviews" page
- Backlog with Wishlist, Playing and Completed statuses, add, change status and remove
- Dashboard with statistics: backlog breakdown, top genres, reviews written and average rating
- Profile page with account deactivation

**Admins**
- Add, edit, delete and restore games
- Delete any user's review

**Security and state**
- JWT authentication with a short-lived access token and a refresh token
- Axios interceptor adds the token to every request and refreshes it automatically when it expires
- Route guards: protected routes, admin-only routes, and guest-only routes (login and register)
- Global state in Redux slices: auth, games, reviews, backlog, dashboard and admin
- Form validation that matches the backend rules

## Screenshots

| | |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Games](docs/screenshots/games.png) |
| ![Game details](docs/screenshots/game-details.png) | ![Backlog](docs/screenshots/backlog.png) |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Admin](docs/screenshots/admin.png) |

## Project structure

```
src/
  api/          axios instance (token refresh) and API calls per feature
  components/   reusable UI: navbar, route guards, forms, cards, pagination
  pages/        one component per route
  store/        Redux store and slices
  types/        shared TypeScript types
  utils/        constants, token storage, helpers
```

## Setup and run locally

You need Node.js 20 or newer and the [GameVault backend](https://github.com/Neon2598-bit/RAD_Coursework_Gaming_Vault_Backend) running.

1. Clone the repository and install the packages
   ```bash
   git clone https://github.com/Neon2598-bit/RAD_Coursework_Gaming_Vault_Frontend.git
   cd RAD_Coursework_Gaming_Vault_Frontend
   npm install
   ```
2. Create the environment file
   ```bash
   cp .env.example .env
   ```
   Set the backend URL (it must end with `/api`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the backend (see its README), then start the frontend
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Type-checks and builds for production |
| `npm run preview` | Previews the production build |

To get an admin account, register a user and change its `role` to `admin` in MongoDB Atlas.

## Deployment

1. **Database:** create a free cluster on MongoDB Atlas and allow network access from anywhere (`0.0.0.0/0`).
2. **Backend (Render):** create a Web Service from the backend repository.
   - Build command: `npm install --include=dev && npm run build`
   - Start command: `npm start`
   - Environment variables: `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (the Vercel URL, without a trailing slash)
3. **Frontend (Vercel):** import this repository.
   - Framework preset: Vite
   - Environment variable: `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
   - `vercel.json` makes page refreshes work with React Router.
4. Update `CLIENT_URL` on Render with the final Vercel URL and redeploy the backend, then add both URLs to the table at the top of this README.

The free Render plan sleeps after a period of inactivity, so the first request can take around a minute.
