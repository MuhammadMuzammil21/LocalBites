# LocalBites - Enhanced MERN Stack Food Delivery App

A comprehensive food delivery platform built with the MERN stack, featuring advanced payment integration, real-time notifications, review systems, and role-based dashboards.

## 🚀 Features

### High Priority (MVP-Critical)
- ✅ **Payment Integration**: Stripe payment processing, receipts, refunds
- ✅ **Review System**: User reviews, ratings, owner replies, helpful votes
- ✅ **Owner Dashboard**: Menu CRUD, order management, analytics
- ✅ **Real-time Notifications**: WebSocket-based updates, in-app alerts

### Medium Priority (UX-Focused)
- ✅ **Order Management**: Tracking, cancellations, reorders, delivery fees
- ✅ **Search & Filters**: Price, distance, dietary filters, sorting
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
│   └── package.json
├── localbites-frontend/         # React + TypeScript
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API integration
│   │   ├── context/            # React context
│   │   └── types/              # TypeScript definitions
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
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
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **React Router** - Navigation
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
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 3. Frontend Setup
```bash
cd localbites-frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Start Development Servers
```bash
# Backend (from localbites-backend directory)
npm run dev

# Frontend (from localbites-frontend directory)
npm run dev
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/profile` - Get user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin/owner)

### Menu Items
- `GET /api/menu/restaurant/:id` - Get restaurant menu
- `POST /api/menu` - Add menu item (owner)
- `PUT /api/menu/:id` - Update menu item (owner)
- `DELETE /api/menu/:id` - Delete menu item (owner)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/tracking/:code` - Track order
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/reorder` - Reorder

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/history` - Payment history

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark helpful
- `POST /api/reviews/:id/reply` - Owner reply

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

### Owner Dashboard
- `GET /api/owner/dashboard/:id` - Dashboard overview
- `GET /api/owner/:id/orders` - Restaurant orders
- `PUT /api/owner/orders/:id/status` - Update order status
- `GET /api/owner/:id/menu` - Restaurant menu
- `POST /api/owner/:id/menu` - Add menu item
- `GET /api/owner/:id/analytics` - Restaurant analytics

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - API request throttling
- **Input Validation** - Request data sanitization
- **CORS Protection** - Cross-origin request security
- **Helmet** - Security headers
- **XSS Protection** - Cross-site scripting prevention
- **MongoDB Sanitization** - NoSQL injection prevention

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Test payments using Stripe test cards

### Supported Payment Methods
- Credit/Debit cards
- Digital wallets (Apple Pay, Google Pay)
- Bank transfers (ACH)

## 🔔 Real-time Features

### WebSocket Events
- Order status updates
- Payment confirmations
- New review notifications
- Real-time chat (future)

### Notification Types
- Order confirmations
- Payment success/failure
- Review received/replied
- Delivery updates
- System announcements

## 📊 Analytics & Reporting

### Owner Dashboard
- Revenue analytics
- Order statistics
- Popular menu items
- Customer insights
- Sales trends

### Admin Dashboard
- Platform overview
- Restaurant management
- User statistics
- System health monitoring

## 🎨 UI/UX Features

### Design System
- **Monochromatic Theme** - Professional color scheme
- **shadcn/ui Components** - Consistent UI patterns
- **Lucide Icons** - Clean, modern iconography
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - User preference support

### User Experience
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Updates** - Live order tracking
- **Smart Search** - Advanced filtering options
- **Progressive Web App** - Offline capabilities

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Set up Heroku
heroku create localbites-backend
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret_key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🧪 Testing

### Backend Testing
```bash
cd localbites-backend
npm test
```

### Frontend Testing
```bash
cd localbites-frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/localbites
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@localbites.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_NAME=LocalBites
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@localbites.com or create an issue in the repository.

## 🔄 Version History

- **v2.0.0** - Enhanced features (Payment, Reviews, Notifications, Owner Dashboard)
- **v1.0.0** - Initial release (Basic CRUD operations)

---

**LocalBites** - Connecting local restaurants with food lovers 🍕
