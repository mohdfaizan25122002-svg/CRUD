# CRUD — Frontend

React + Vite frontend for a JWT-authenticated CRUD app against Salesforce objects, via a Node/Express backend.

## Setup

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api/*` requests to `http://localhost:5000` (your Express backend). Change the proxy target in `vite.config.js` if your backend runs elsewhere.

## Expected backend API

This frontend calls the following routes (see `src/Services/api.js`) — adjust the paths there if your Express routes differ:

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/api/auth/signup` | `{ name, email, password }` | `{ token, user }` |
| GET | `/api/records/:object?page=&limit=` | — | `{ records: [], total, page, totalPages }` |
| GET | `/api/records/:object/:id` | — | record object |
| POST | `/api/records/:object` | field data | created record |
| PUT | `/api/records/:object/:id` | field data | updated record |
| DELETE | `/api/records/:object/:id` | — | `{ success: true }` |

The JWT is sent as `Authorization: Bearer <token>` on every request (see the axios interceptor in `src/Services/api.js`).

## Structure

- `src/Context/AuthContext.jsx` — login/signup/logout state, persists JWT + user in `localStorage`
- `src/Services/api.js` — single axios instance + all API calls
- `src/Components/` — reusable pieces: `Navbar`, `Loader`, `ObjectSelector`, `Pagination`, `RecordForm`, `RecordTable`, `EditRecord`, `DeleteButton`, `LoginButton`
- `src/Pages/` — routed pages: `Login`, `Signup`, `Dashboard`
- `src/App.jsx` — routes + protected-route guard

## Notes

- `ObjectSelector` currently hardcodes common standard objects (Contact, Account, Lead, Opportunity, Case, Task). Add custom objects (`MyObject__c`) to the list in `src/Components/ObjectSelector.jsx`, or wire it to a live objects-list endpoint if you'd rather it come from Salesforce's `describeGlobal`.
- `RecordForm` is field-agnostic: it renders whatever fields are on the record being edited, and starts new records with a sensible default field set per object. Add/remove fields freely in the form itself.
