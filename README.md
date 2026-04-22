# Non-Emergency Home Healthcare API (Node.js + Express)

A simple, beginner-friendly REST API for QA practice.

## Tech stack
- JavaScript
- Node.js
- Express.js
- JWT authentication
- In-memory seed data (no database)

## Folder structure
```
src/
  app.js
  server.js
  controllers/
  routes/
  middleware/
  services/
  data/
  utils/
```

## How to run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start server:
   ```bash
   npm start
   ```
3. API base URL:
   `http://localhost:3000`

## Seed users
- Admin: `admin@careapp.com` / `admin123`
- Doctor: `doctor1@careapp.com` / `admin123`
- Nurse: `nurse1@careapp.com` / `admin123`
- Nutritionist: `nutrition1@careapp.com` / `admin123`

## Services seed data
- wound dressing change
- prescription renewal
- medical certificate renewal
- nutrition consultation
- blood pressure check

## Time windows
- 12:00 to 14:00
- 14:00 to 16:00
- 16:00 to 18:00

## Main business rules implemented
- Non-emergency only.
- Blocks request when severe symptoms are present:
  chest pain, severe shortness of breath, heavy bleeding, seizure,
  loss of consciousness, stroke symptoms.
- Patient must have address before requesting.
- One active appointment per patient.
- Professional must be approved, available, compatible with service, and in area.

## Endpoint list
- `POST /auth/register/patient`
- `POST /auth/register/professional`
- `POST /auth/login`
- `GET /services`
- `GET /patients/:id`
- `PUT /patients/:id`
- `GET /professionals/:id`
- `PUT /professionals/:id`
- `PATCH /professionals/:id/availability`
- `POST /appointments/windows`
- `POST /appointments`
- `GET /appointments/:id`
- `PATCH /appointments/:id/status`
- `PATCH /appointments/:id/cancel`
- `PATCH /admin/professionals/:id/approve`

## Example requests/responses

### 1) Register patient
`POST /auth/register/patient`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "555-1234",
  "address": "123 Main St, Downtown"
}
```

Response (201):
```json
{
  "id": 5,
  "role": "patient",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "address": "123 Main St, Downtown"
}
```

### 2) Login
`POST /auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "token": "<jwt>",
  "user": {
    "id": 5,
    "role": "patient",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St, Downtown"
  }
}
```

### 3) Get windows
`POST /appointments/windows`

Headers:
`Authorization: Bearer <jwt>`

Response:
```json
{
  "windows": [
    "12:00 to 14:00",
    "14:00 to 16:00",
    "16:00 to 18:00"
  ]
}
```

### 4) Create appointment
`POST /appointments`

Headers:
`Authorization: Bearer <patient_jwt>`

Request:
```json
{
  "serviceName": "blood pressure check",
  "area": "Downtown",
  "window": "14:00 to 16:00",
  "symptoms": ["dizziness", "headache"]
}
```

Success response (201):
```json
{
  "id": 1,
  "patientId": 5,
  "serviceName": "blood pressure check",
  "area": "Downtown",
  "window": "14:00 to 16:00",
  "symptoms": ["dizziness", "headache"],
  "professionalId": 2,
  "status": "matched",
  "createdAt": "2026-04-22T00:00:00.000Z"
}
```

Emergency blocking response (403):
```json
{
  "message": "Emergency symptoms detected. This non-emergency app cannot process this request. Please contact emergency services.",
  "blockedAppointment": {
    "id": 2,
    "status": "blocked_emergency"
  }
}
```

## Notes for QA practice
- App uses simple modules and pure functions in services for easy unit testing.
- Suitable for adding:
  - Mocha + Chai unit tests
  - Supertest API integration tests
  - Cypress end-to-end tests (if connected to a front-end)
