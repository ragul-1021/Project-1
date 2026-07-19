# AllergyShield AI — Frontend

React + Vite frontend scaffold for the AllergyShield AI backend (FastAPI).

## Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router v6
- Axios
- React Icons
- Framer Motion
- Recharts (installed, ready for chart pages)

## Getting started

```bash
npm install
npm run dev
```

Set your backend URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Structure

```
src/
  api/
    axios.js          # shared Axios instance (JWT attach + 401 redirect)
    authApi.js         # login / register / profile calls
  context/
    AuthContext.jsx    # auth state, login/register/logout
  routes/
    ProtectedRoute.jsx # guards authenticated pages
    PublicRoute.jsx    # guards login/register from logged-in users
  components/
    layout/
      Sidebar.jsx
      Navbar.jsx
      DashboardLayout.jsx
    common/
      PagePlaceholder.jsx
  pages/
    Login.jsx
    Register.jsx
    DashboardHome.jsx   # placeholder
    ScanLabel.jsx        # placeholder
    MyAllergies.jsx       # placeholder
    ScanHistory.jsx       # placeholder
    Settings.jsx           # placeholder
    NotFound.jsx
```

## Notes
- Login posts `application/x-www-form-urlencoded` to `/auth/login` to match the backend's `OAuth2PasswordRequestForm`.
- JWT is stored in `localStorage` under `access_token` and attached to every request automatically.
- A 401 response anywhere clears the token and redirects to `/login`.
- Only routing/layout/auth scaffolding is included — feature pages are placeholders ready to be built out (scan upload, allergy management, dashboard charts with Recharts, etc).
