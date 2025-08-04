# LocalBites - Enhanced MERN Stack Food Delivery App

A comprehensive food delivery platform built with the MERN stack, featuring advanced payment integration, real-time notifications, review systems, role-based dashboards, and complete pagination support.

## 🚀 Features

### High Priority (MVP-Critical)
- ✅ **Payment Integration**: Stripe payment processing, receipts, refunds
- ✅ **Review System**: User reviews, ratings, owner replies, helpful votes
- ✅ **Owner Dashboard**: Menu CRUD, order management, analytics
- ✅ **Real-time Notifications**: WebSocket-based updates, in-app alerts
- ✅ **Pagination System**: Complete pagination for restaurants and search results

### Medium Priority (UX-Focused)
- ✅ **Order Management**: Tracking, cancellations, reorders, delivery fees
- ✅ **Search & Filters**: Price, distance, dietary filters, sorting with pagination
- ✅ **User Features**: Order history, recommendations, saved addresses
- ✅ **Security**: Input validation, rate limiting, GDPR compliance

### Low Priority (Nice to Have)
- ✅ **Analytics**: Sales trends, top items, restaurant statistics
- ✅ **Performance**: Compression, caching, optimized queries
- ✅ **Content Tools**: Image uploads, SEO optimization
- ✅ **Mobile Optimization**: Responsive design, PWA-ready

## 🏗️ Architecture

```
LocalBites/
├── localbites-backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, validation, security
│   │   └── utils/              # Helper functions
│   ├── test-stripe.js          # Stripe configuration test
│   └── package.json
├── localbites-frontend/         # React + TypeScript
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API integration
│   │   ├── context/            # React context
│   │   └── types/              # TypeScript definitions
│   └── package.json
├── docs/                       # Documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── EMAIL_SETUP.md          # Email configuration
│   ├── ENHANCEMENTS_SUMMARY.md # Feature enhancements
│   ├── FORGOT_PASSWORD_README.md # Password reset setup
│   ├── PAGINATION_IMPLEMENTATION.md # Pagination guide
│   ├── STRIPE_SETUP.md         # Stripe integration guide
│   └── STRIPE_QUICK_REFERENCE.md # Stripe quick reference
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with pagination support
- **Mongoose** - ODM with optimized queries
- **Socket.io** - Real-time communication
- **Stripe** - Payment processing
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Rate limiting** - API protection

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library with custom pagination
- **React Router** - Navigation with URL state management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time updates

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Stripe account (for payments)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd LocalBites
```

### 2. Backend Setup
```bash
cd localbites-backend
npm install
```

Create a `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/localbites
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=LocalBites
FROM_EMAIL=noreply@localbites.com
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd localbites-frontend
npm install
```

### 4. Start Development Servers
```bash
# Backend (from localbites-backend directory)
npm run dev

# Frontend (from localbites-frontend directory)
npm run dev
```

### 5. Test Stripe Configuration (Optional)
```bash
# From localbites-backend directory
node test-stripe.js
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgotpassword` - Password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Restaurants (with Pagination)
- `GET /api/restaurants?page=1&limit=20` - Get paginated restaurants
- `GET /api/restaurants/search?q=query&page=1&limit=20` - Search with pagination
- `GET /api/restaurants/nearby?lat=24.8607&lng=67.0011` - Get nearby restaurants
- `GET /api/restaurants/geojson` - Get GeoJSON data for map
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin/owner)

### Menu Items
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/menu/:restaurantId` - Add menu item (owner)
- `PUT /api/menu/item/:id` - Update menu item (owner)
- `DELETE /api/menu/item/:id` - Delete menu item (owner)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/tracking/:trackingCode` - Track order
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `POST /api/orders/:orderId/reorder` - Reorder

### Payments (Stripe Integration)
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/history` - Payment history
- `GET /api/payments/:paymentId` - Get payment details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:restaurantId` - Get restaurant reviews
- `GET /api/reviews/user` - Get user reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/helpful` - Mark helpful
- `POST /api/reviews/:reviewId/reply` - Owner reply

### Admin Routes
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users (paginated)
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/restaurants` - Get all restaurants (paginated)
- `PUT /api/admin/restaurants/:id/status` - Update restaurant status
- `GET /api/admin/orders` - Get all orders (paginated)

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - API request throttling
- **Input Validation** - Request data sanitization
- **CORS Protection** - Cross-origin request security
- **Helmet** - Security headers
- **XSS Protection** - Cross-site scripting prevention
- **MongoDB Sanitization** - NoSQL injection prevention
- **Environment Variable Validation** - Startup configuration checks

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the dashboard
3. Add keys to environment variables
4. Run `node test-stripe.js` to verify configuration
5. Use test cards for development (see [docs/STRIPE_QUICK_REFERENCE.md](docs/STRIPE_QUICK_REFERENCE.md))

### Supported Features
- Payment intent creation and confirmation
- Refund processing
- Payment history tracking
- Receipt generation
- PKR currency support

## 📄 Pagination System

### Features
- **Complete Navigation**: Browse through all restaurants, not just the first 20
- **Smart Pagination**: Ellipsis for large page counts
- **URL State Management**: Shareable page links
- **Filter Integration**: Category filtering works across all pages
- **Search Integration**: Search results are properly paginated
- **Performance Optimized**: Only loads 20 items at a time

### Implementation
- Custom shadcn/ui pagination component
- Backend pagination with MongoDB aggregation
- Frontend state management with React hooks
- URL parameter synchronization
- Smooth page transitions with scroll-to-top

For detailed implementation guide, see [docs/PAGINATION_IMPLEMENTATION.md](docs/PAGINATION_IMPLEMENTATION.md)

## 📚 Documentation

All documentation has been organized in the `docs/` directory:

- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment guide
- **[EMAIL_SETUP.md](docs/EMAIL_SETUP.md)** - Email configuration for password reset
- **[ENHANCEMENTS_SUMMARY.md](docs/ENHANCEMENTS_SUMMARY.md)** - Feature enhancement details
- **[FORGOT_PASSWORD_README.md](docs/FORGOT_PASSWORD_README.md)** - Password reset implementation
- **[PAGINATION_IMPLEMENTATION.md](docs/PAGINATION_IMPLEMENTATION.md)** - Pagination system guide
- **[STRIPE_SETUP.md](docs/STRIPE_SETUP.md)** - Comprehensive Stripe integration guide
- **[STRIPE_QUICK_REFERENCE.md](docs/STRIPE_QUICK_REFERENCE.md)** - Quick Stripe reference

## 🎨 UI/UX Features

### Design System
- **Monochromatic Theme** - Professional black and white color scheme
- **shadcn/ui Components** - Consistent UI patterns with custom pagination
- **Clean Interface** - No external icons or images, typography-focused
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Page transitions and loading states

### User Experience
- **Intuitive Navigation** - Easy-to-use interface with pagination
- **Real-time Updates** - Live order tracking
- **Smart Search** - Advanced filtering with paginated results
- **Performance Optimized** - Lazy loading and efficient data fetching

## 🚀 Deployment

### Backend Deployment
```bash
# Set environment variables
export NODE_ENV=production
export MONGO_URI=your_mongodb_atlas_uri
export JWT_SECRET=your_jwt_secret
export STRIPE_SECRET_KEY=your_stripe_secret_key

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 🧪 Testing

### Backend Testing
```bash
cd localbites-backend
npm run dev  # Start development server
node test-stripe.js  # Test Stripe configuration
```

### Frontend Testing
```bash
cd localbites-frontend
npm run dev  # Start development server
# Navigate to http://localhost:5173
```

### Test Stripe Payments
Use these test card numbers:
- **Success**: 4242424242424242
- **Declined**: 4000000000000002
- **Insufficient Funds**: 4000000000009995

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**LocalBites** - Connecting local restaurants with food lovers 🍕
