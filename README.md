# Sanchari (Rentavec) — Rental Platform

A full-stack rental application:
- Backend: Django + Django REST Framework (API for vehicles, rentals, onboarding, wishlist, dealer contacts, etc.)
- Frontend: React + Vite (single-page app with admin and user flows)
- Auth: JWT (djangorestframework_simplejwt)
- Media/Files: Django serves media in development (MEDIA_URL / MEDIA_ROOT)
- Cache: Redis for django-redis (configured in settings)

Repository: Dxv-404/Sanchari

---

## Quick demo (local)
1. Start the backend (Django)
2. Start the frontend (Vite)
3. Register/login, then use the UI or API endpoints

---

## Tech stack
- Python 3.11+ (compatible with packages in requirements.txt)
- Django 5.2.x
- Django REST Framework
- PostgreSQL (configured in settings.py)
- Redis (django-redis cache)
- Node.js + npm/yarn (Frontend)
- Vite + React

---

## Repo layout (high level)
- config/ — Django project settings, urls, asgi, wsgi
- rental/ — Django app: models, serializers, views, URLs
- frontend/ — React + Vite frontend app
- media/ — runtime uploaded media files (images, docs)
- requirements.txt — Python dependencies
- manage.py — Django CLI

---

## Prerequisites
- Python 3.10+ (3.11 recommended)
- PostgreSQL running locally (or change settings to your DB)
- Redis running locally (optional for cache but configured)
- Node.js 18+ and npm/yarn

---

## Environment configuration

Important env vars (create a `.env` in project root or export to shell). Example `.env`:

SECRET_KEY should be set in production (the repo currently contains a development secret in settings.py — replace it).

Example `.env`:
```
# .env (example)
DJANGO_SECRET_KEY=replace-this-in-prod
MSG91_AUTH_KEY=your-msg91-key-if-needed
DATABASE_URL=postgres://postgres:password@localhost:5432/rentavec_db  # optional if you change settings to use dj-database-url
```

Notes:
- config/settings.py currently contains DB credentials:
  - NAME: rentavec_db
  - USER: postgres
  - PASSWORD: train2A
  - HOST: localhost
  - PORT: 5432
  Update as necessary before running.

- CORS: config/settings.py allows `http://localhost:5173` by default and sets CORS_ALLOW_ALL_ORIGINS = True. Adjust for production.

---

## Backend — Setup & Run

1. Create virtualenv and install dependencies
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure DB & environment
- Ensure PostgreSQL is running and a database `rentavec_db` exists (or change settings).
- If using different DB credentials, update `config/settings.py` or manage with env vars.

3. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create admin user
```bash
python manage.py createsuperuser
```

5. Run development server
```bash
python manage.py runserver
```
Django will serve APIs under `http://127.0.0.1:8000/api/` and media files under `/media/` (mapped in config/urls.py for development).

---

## Frontend — Setup & Run

1. Install dependencies
```bash
cd frontend
npm install
```

2. Run dev server (Vite)
```bash
npm run dev
```
Open `http://localhost:5173` (or the URL shown by Vite) to view the frontend. The React app expects the backend API at `http://127.0.0.1:8000/api` by default (see frontend/src/services/api.js).

3. Build for production
```bash
npm run build
npm run preview
```

---

## Running tests
From repository root:
```bash
source .venv/bin/activate
python manage.py test
```
(test discovery will run tests present under `rental/tests.py`)

---

## API Overview

Base API: `http://127.0.0.1:8000/api/`

Authentication (JWT)
- Obtain token:
  - POST /api/token/
  - Body: { "username": "<username>", "password": "<password>" }
- Refresh:
  - POST /api/token/refresh/
  - Body: { "refresh": "<refresh_token>" }
- Use `Authorization: Bearer <access_token>` header on protected endpoints.

Example: obtain tokens (curl)
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

User endpoints
- POST /api/register/ — register (username, email, password)
- GET /api/user/me/ — get current logged-in user's details (requires Authorization)

Vehicles
- GET /api/vehicles/ — list vehicles (public)
  - Query params:
    - q (search across name, city, district, state, location_tags and pickup/dropoff cities)
    - types (comma-separated): example `types=car,bike`
    - fuels (comma-separated): example `fuels=petrol,electric`
    - conditions (comma-separated)
    - cities (comma-separated)
    - price_min, price_max
    - mileage_min, mileage_max
    - available=true
    - ordering (e.g. `ordering=price_daily` or `ordering=-id`)
    - limit, offset (for infinite scroll)
- GET /api/vehicles/meta/ — aggregate metadata: min/max price, mileage, types, fuels, conditions, cities
- POST /api/vehicles/ — create vehicle (admin-only)
- PUT/PATCH /api/vehicles/{id}/ — update vehicle (admin-only)
- DELETE /api/vehicles/{id}/ — delete (admin-only)

Example: fetch vehicles (curl)
```bash
curl "http://127.0.0.1:8000/api/vehicles/?q=Honda&price_max=2000&available=true"
```

Wishlist
- GET /api/wishlist/ — list current user's wishlist (auth required)
- POST /api/wishlist/ — add to wishlist (body: { "vehicle_id": <id> })
- DELETE /api/wishlist/{id}/ — remove wishlist entry

Onboarding
- New simplified onboarding (no OTP): POST /api/onboarding/complete/
  - Auth required
  - multipart/form-data fields:
    - full_name (string)
    - age (integer)
    - gender (Male|Female|Other)
    - contact_number (string)
    - profile_picture (file) optional
    - aadhar_front (file) required
    - aadhar_back (file) required
    - license (file) optional — only used if no_license is false
    - no_license (boolean/string "true"/"false")
  - Response: updated user object
  - Example curl:
```bash
curl -X POST "http://127.0.0.1:8000/api/onboarding/complete/" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "full_name=John Doe" \
  -F "age=30" \
  -F "gender=Male" \
  -F "contact_number=9999999999" \
  -F "aadhar_front=@/path/to/front.jpg" \
  -F "aadhar_back=@/path/to/back.jpg" \
  -F "license=@/path/to/license.jpg" \
  -F "no_license=false"
```

Other endpoints
- Locations: /api/locations/
- Requirements: /api/requirements/
- Rentals: /api/rentals/ (auth; staff can list all, users only see their rentals)
- Tickets: /api/tickets/
- Return requests, dropoff changes, renewal requests, status logs
- Dealer contacts: /api/dealer-contacts/ (admin-only)

---

## File uploads & media
- Media files (profile pictures, aadhar, license, vehicle images) are saved under `media/` (MEDIA_ROOT).
- In development, media is served using django static helper (mapped in config/urls.py).
- When creating/updating vehicles or onboarding, submit multipart/form-data.
- VehicleSerializer and VehicleViewSet expect JSON/strings for nested fields (pickup_locations, dropoff_locations, requirements) — the serializer handles JSON string decoding.

---

## Frontend integration details
- The frontend axios instance is configured to use `http://127.0.0.1:8000/api`.
- axios automatically attempts token refresh when the access token is expired (see frontend/src/services/api.js).
- Onboarding flow in frontend uses `completeOnboarding(formData)` which posts to `/api/onboarding/complete/`.
- The React router includes protected routes and onboarding gates — the frontend enforces onboarding completion and redirects.

---

## Admin considerations
- Create vehicles, dealer contacts and delete operations require admin privileges (IsAdminUser in views).
- For production, replace DEBUG=True and the insecure SECRET_KEY in `config/settings.py`. Use environment variables for secrets and DB credentials.

---

## Common troubleshooting
- JWT issues: If the frontend token refresh fails, the axios interceptor will clear localStorage and redirect to `/`. Ensure refresh token is present and /api/token/refresh/ is reachable.
- Database connection: If Django cannot connect to PostgreSQL, check connection details and that the DB is created and accepting connections.
- Redis: If Redis is not running, django-redis cache will error — either run Redis locally or set CACHES to local-memory during development.
- Media not visible: Ensure `MEDIA_ROOT` exists and DEBUG is true for development. Production should use proper media hosting (S3, CDN).

---

## Contributing
- Fork the repository, create a feature branch, and open a pull request.
- Keep migrations up-to-date when changing models.
- Run tests before submitting.

---
