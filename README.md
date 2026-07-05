# II. Budafoki Sátras Cigányok

Duna Party Fesztivál weboldal React és Vite alapokon.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

The dev server starts the React app and the SQLite ticket API together on `http://127.0.0.1:3000`.
Ticket data is stored in `data/tickets.sqlite` by default.

## Admin

Open the admin dashboard at `http://127.0.0.1:3000/#/admin`.
If `ADMIN_TOKEN` is set, admin API requests must include that token.
