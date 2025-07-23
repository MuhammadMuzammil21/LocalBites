# 🍽 LocalBites

A modern, full-stack web app to **discover local restaurants**, **explore menus**, **read/write reviews**, and manage listings. Built as a feature-rich portfolio project using the **MERN** stack with optional **AI enhancements** and **geolocation** capabilities.

---

## 🚀 Live Demo

> _Coming Soon_ — Stay tuned!

---

## 🎯 Project Goals

- Showcase MERN CRUD proficiency.
- Implement geolocation & map-based querying.
- Handle image uploads for restaurant and menu visuals.
- Support **role-based access** for users, owners, and admins.
- (Optional) Integrate **AI**: OCR menu parsing, sentiment analysis, auto-tagging.

---

## 🔧 Tech Stack

| Layer     | Tools / Libraries                                                                 |
|-----------|------------------------------------------------------------------------------------|
| Frontend  | React + Vite, TailwindCSS + DaisyUI, React Router, React Query, React Leaflet     |
| Backend   | Node.js, Express.js, MongoDB + Mongoose, JWT Auth, Multer, Zod/Joi                |
| DevTools  | Docker Compose, ESLint, Prettier, Nodemon, Postman                                |
| AI (Opt.) | Tesseract.js, Google Cloud Vision API, OpenAI (for NLP/sentiment)                 |
| Hosting   | Cloudinary / S3 for images, MongoDB Atlas / Docker for DB                         |

---

## 🧱 MVP Features

| Area        | Feature                                |
|-------------|----------------------------------------|
| Auth        | Signup/Login (JWT), bcrypt-hashed passwords |
| Directory   | Restaurant listing, filters, pagination     |
| Details     | Menus, reviews, photos per restaurant       |
| Reviews     | Add/edit ratings and comments               |
| Media       | Upload logos, dishes, gallery images        |
| Roles       | Guest, Registered User, Owner, Admin        |

---

## 👥 User Roles

| Role              | Capabilities |
|-------------------|-------------|
| Guest             | Browse restaurants, menus, reviews |
| Registered User   | Write/edit reviews, upload photos, bookmark |
| Restaurant Owner  | Claim + manage listing, respond to reviews |
| Admin             | Moderate listings, content, and user claims |

---

## 🌐 Maps & Location

- Interactive maps with markers via **Leaflet** or **Google Maps**.
- MongoDB `$geoWithin` and `$nearSphere` for proximity-based search.
- “Near Me” discovery using browser geolocation API.

---

## 📷 Image Upload Strategy

| Option       | Use Case       | Notes                         |
|--------------|----------------|-------------------------------|
| Local        | Dev/testing    | Not recommended in prod       |
| Cloudinary   | Recommended    | Easy setup, CDN, auto-scaling |
| AWS S3       | Advanced usage | More control, scalable        |

---

## 🤖 AI Enhancements (Optional)

| Feature                | Description |
|------------------------|-------------|
| OCR Menu Parsing       | Extract text from uploaded menus |
| Cuisine Auto-tagging   | NLP-based classification |
| Review Sentiment       | Analyze tone/mood of feedback |
| Top Dishes by Area     | Aggregate review data |

---

## 📦 Folder Structure

```

localbites/
├── client/               # React frontend
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── hooks/
│   └── context/
├── server/               # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── utils/
├── docs/                 # ERD, planning
├── .env.example
└── docker-compose.yml

````

---

## 📚 API Overview

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Restaurants**
- `GET /api/restaurants`
- `GET /api/restaurants/:idOrSlug`
- `POST /api/restaurants` (OWNER/ADMIN)
- `PUT /api/restaurants/:id` (OWNER/ADMIN)

**Menus**
- `GET /api/restaurants/:id/menu`
- `POST /api/restaurants/:id/menu` (OWNER)
- `PUT /api/menu/:menuItemId`

**Reviews**
- `POST /api/restaurants/:id/reviews` (USER)
- `PUT /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`

**Favorites**
- `GET /api/users/me/favorites`
- `POST /api/users/me/favorites/:restaurantId`

---

## 🛠 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/MuhammadMuzammil21/localbites.git
   cd localbites


2. **Install dependencies**

   **Client:**

   ```bash
   cd client
   npm install
   ```

   **Server:**

   ```bash
   cd ../server
   npm install
   ```

3. **Environment variables**

   * Copy `.env.example` → `.env` and update values.

4. **Run with Docker (Mongo + Backend)**

   ```bash
   docker-compose up
   ```

5. **Start frontend**

   ```bash
   cd client
   npm run dev
   ```

---

## Security & Best Practices

* Passwords hashed with bcrypt.
* Input validation using Zod or Joi.
* JWT auth with refresh token strategy (optional).
* Role-based middleware access control.
* Rate limiting and sanitization for endpoints.

---

## 📈 Roadmap

### Phase 1 (MVP)

✅ Restaurant directory
✅ User auth
✅ Review system
✅ Owner access

### Phase 2 (Stretch Goals)

🔲 Maps + geolocation
🔲 AI OCR + sentiment
🔲 Notifications + dish trends

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feat/your-feature`)
3. Commit your changes
4. Submit a Pull Request

---

## 📝 License

MIT License — free to use and modify.

---

## 👤 Author

Built with by **Muzammil Khan**
[LinkedIn](https://www.linkedin.com/in/MuhammadMuzammil21) • [GitHub](https://github.com/MuhammadMuzammil21)

---
