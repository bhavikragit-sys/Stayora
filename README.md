# Stayora

A full-stack vacation rental platform where users can discover stays, create listings, make bookings, and leave reviews.

 🔗 **Live Demo:** [Stayora](https://stayora-chi.vercel.app/)

---

## Features

- JWT authentication with HttpOnly cookies
- Create, edit, and delete listings
- Search and filter stays
- Date-based availability and booking
- Server-side booking price calculation
- Reviews and ratings
- User profiles
- Cloudinary image uploads
- Responsive UI
- Loading, error, and 404 states

---

## Tech Stack

|      Layer     |                    Technology                     |
|----------------|---------------------------------------------------|
| Frontend       | React, React Router, Tailwind CSS, TanStack Query |
| Backend        | Node.js, Express.js                               |
| Database       | MongoDB, Mongoose                                 |
| Authentication | JWT + HttpOnly Cookies                            |
| Media          | Cloudinary                                        |
| Deployment     | Vercel, Render, MongoDB Atlas                     |

---

## Architecture

```text
React SPA
    ↓
Express REST API
    ↓
MongoDB
```

The frontend communicates with the backend exclusively through REST APIs. Authentication, validation, authorization, booking logic, and other business rules are all handled server-side.

---

## Key Engineering

- Backend-enforced listing ownership
- Date-range overlap checking for booking conflicts
- Server-side booking price calculation
- Reviews restricted to eligible, completed bookings
- Centralized API error handling
- Protected routes and resource-level authorization
- Environment-based configuration
- Persistent authentication using HttpOnly cookies

---

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Create the required `.env` files in both `backend/` and `frontend/` before running the application.

---

## Deployment

| Component|    Platform   |
|----------|---------------|
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |
| Images   | Cloudinary    |

---

## Future Scope

- Payment integration
- Messaging
- Notifications
- Maps
- AI-powered recommendations
