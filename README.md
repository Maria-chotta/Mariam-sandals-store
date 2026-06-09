# Mariam Sandal Store

A simple e-commerce landing page for Mariam Sandal Store, built with a static frontend and a Node.js backend API.

## Project structure

- `index.html` - landing page and shop UI
- `style.css` - page styling and responsive layout
- `script.js` - frontend behaviors (cart, modal, chat, search, WhatsApp order flow)
- `backend/` - Express API backend for product data
  - `backend/server.js` - Express server entry point
  - `backend/routes/productRoutes.js` - API routes for products
  - `backend/models/Product.js` - Mongoose product schema
  - `backend/package.json` - backend dependencies and scripts

## Features

- product gallery with filters and search
- product modal with quantity, reviews, and WhatsApp order button
- cart support with localStorage persistence
- dark mode toggle
- WhatsApp quick order and chat button
- Google Analytics tracking via `G-7TNHTPZ8VY`

## Live Demo

The site is available at:

```text
https://maria-chotta.github.io/Mariam-sandals-store/
```

## Run locally

### Frontend

You can open `index.html` directly in a browser for a static preview.

For a better local setup, run a simple server from the project root:

```bash
# from /home/mariam/chatbot-project
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Backend

Install dependencies and start the Express server:

```bash
cd backend
npm install
npm start
```

The backend API runs by default on:

```text
http://localhost:5000
```

### Notes

- The frontend includes a product loader that fetches from `http://localhost:5000/api/products`.
- If the backend is unavailable, the current static product listing will remain visible.
- Orders are saved using the backend at `http://localhost:5000/api/orders`.
- To view captured orders locally, open `orders.html` while the backend is running.
- To see website visitors, open the Google Analytics property for ID `G-7TNHTPZ8VY`.

## Git

Commit your changes with a message like:

```bash
git add .
git commit -m "Add README and fix UI behavior"
git push origin main
```
