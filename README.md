# 🍽 LocalBites - Karachi Restaurant Discovery

A modern, full-stack web app to **discover restaurants across Karachi**, **explore menus**, **read/write reviews**, and manage listings. Built as a feature-rich MERN stack application with **geolocation capabilities** and **role-based access control**.

---

## 🚀 Live Demo

> _Coming Soon_ — Stay tuned!

---

## 🎯 Project Goals

- Showcase MERN stack proficiency with CRUD operations
- Implement Karachi-focused restaurant discovery with geolocation
- Provide complete restaurant management for owners and admins
- Enable user reviews and ratings system
- Deliver responsive, icon-free UI with modern design principles

---

## 🔧 Tech Stack

| Layer     | Technologies                                                                 |
|-----------|------------------------------------------------------------------------------|
| Frontend  | React + TypeScript, TailwindCSS, React Router, ShadCN UI Components         |
| Backend   | Node.js, Express.js, MongoDB + Mongoose, JWT Auth, RESTful API               |
| DevTools  | ESLint, Prettier, Nodemon, Postman                                           |
| Hosting   | MongoDB Atlas for DB, Vercel/Netlify for frontend, Render/Heroku for backend  |

---

## 🧱 Core Features

| Feature              | Description                                           |
|----------------------|-------------------------------------------------------|
| **Restaurant Discovery** | Browse restaurants across Karachi with search & filters |
| **Menu Exploration**      | Detailed menu items with categories and pricing     |
| **Cart Management**      | Add/remove items, quantity control, order summary  |
| **Order Processing**     | Complete checkout flow with multiple payment options |
| **User Authentication**   | JWT-based auth with role-based access (Guest/User/Owner/Admin) |
| **Location Services**    | Karachi-focused geolocation and area-based search  |
| **Admin Dashboard**      | Order management, restaurant verification, analytics |

---

## 👥 User Roles

| Role              | Capabilities |
|-------------------|-------------|
| **Guest**         | Browse restaurants, view menus, search by location |
| **User**          | Place orders, manage cart, write reviews, view order history |
| **Restaurant Owner** | Manage restaurant profile, menu items, respond to reviews |
| **Admin**         | Full system access - manage users, restaurants, orders, analytics |

---

## 🗺️ Karachi-Focused Features

- **Area-Based Discovery**: Clifton, Saddar, DHA, Gulshan-e-Iqbal, Korangi and more
- **Local Cuisines**: Pakistani, Chinese, Italian, Fast Food, Biryani specialists
- **Location Accuracy**: Precise coordinates for Karachi neighborhoods
- **Cultural Relevance**: Local payment methods and food preferences

---

## 📦 Project Structure

```
localbites/
├── localbites-frontend/          # React frontend (TypeScript)
│   ├── src/
│   │   ├── api/                  # API service layer
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── context/             # React context providers
│   │   └── lib/                  # Utility functions
│   └── public/                  # Static assets
├── localbites-backend/           # Express backend
│   ├── controllers/              # Request handlers
│   ├── middleware/              # Auth, error handling
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API route definitions
│   ├── scripts/                 # Database seeding
│   └── utils/                  # Helper functions
├── .env.example
└── README.md
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/search` - Search restaurants
- `GET /api/restaurants/nearby` - Find nearby restaurants
- `POST /api/restaurants` - Create restaurant (OWNER/ADMIN)
- `PUT /api/restaurants/:id` - Update restaurant (OWNER/ADMIN)
- `DELETE /api/restaurants/:id` - Delete restaurant (ADMIN)

### Menu Items
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `GET /api/menu/item/:id` - Get menu item
- `POST /api/menu/:restaurantId` - Add menu item (OWNER)
- `PUT /api/menu/item/:id` - Update menu item (OWNER)
- `DELETE /api/menu/item/:id` - Delete menu item (OWNER)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove` - Remove item from cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/rate` - Rate completed order

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/restaurants` - Get all restaurants
- `PUT /api/admin/restaurants/:id/status` - Verify/unverify restaurant

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd localbites
   ```

2. **Backend Setup**
   ```bash
   cd localbites-backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../localbites-frontend
   npm install
   ```

4. **Database Seeding (Optional)**
   ```bash
   cd ../localbites-backend
   node scripts/seedRestaurants.js
   ```

5. **Run Development Servers**
   
   **Backend:**
   ```bash
   cd localbites-backend
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd localbites-frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🎨 UI/UX Design Principles

- **Icon-Free Interface**: Clean design using only typography, spacing, and emojis
- **Karachi-Focused**: All content and examples reference Karachi locations
- **Responsive Layout**: Mobile-first design with adaptive components
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Performance**: Optimized loading states and efficient data fetching

---

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control middleware
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration for secure API access
- Environment-based configuration management

---

## 📈 Current Development Status

✅ **Phase 1 - Core Functionality**
- Restaurant discovery and search
- Menu exploration and cart management
- User authentication and profiles
- Order placement and history

✅ **Phase 2 - Advanced Features**
- Admin dashboard with analytics
- Location-based restaurant discovery
- Role-based access control
- Complete API integration

🔲 **Phase 3 - Future Enhancements**
- Review and rating system
- Restaurant owner dashboard
- Mobile app development
- Advanced analytics and reporting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Muzammil Khan**
- GitHub: [MuhammadMuzammil21](https://github.com/MuhammadMuzammil21)
- LinkedIn: [MuhammadMuzammil21](https://www.linkedin.com/in/MuhammadMuzammil21)

---

## 🙏 Acknowledgments

- Karachi's vibrant food scene for inspiration
- MERN stack community for excellent tools and resources
- ShadCN for beautiful UI components
- TailwindCSS for efficient styling
