# LocalBites Deployment Guide

This guide covers deploying the enhanced LocalBites MERN stack application to production environments.

## 🚀 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or self-hosted MongoDB)
- Stripe account for payments
- Cloud hosting provider (Heroku, Vercel, Railway, etc.)
- Domain name (optional but recommended)

## 📋 Environment Setup

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access (username/password)
4. Configure network access (IP whitelist or 0.0.0.0/0 for all)
5. Get your connection string

### 2. Stripe Setup

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Set up webhook endpoints (optional but recommended)
4. Configure payment methods

### 3. Email Service Setup

1. Set up a transactional email service (SendGrid, Mailgun, etc.)
2. Configure SMTP settings
3. Verify your domain

## 🔧 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   cd localbites-backend
   heroku create localbites-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   heroku config:set CLIENT_URL=https://your-frontend-domain.com
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_email_password
   heroku config:set EMAIL_FROM=noreply@yourdomain.com
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

### Option 2: Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory

2. **Set Environment Variables**
   - Add all environment variables in Railway dashboard
   - Same variables as Heroku above

3. **Deploy**
   - Railway automatically deploys on git push

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository
   - Select Node.js environment

2. **Configure Environment**
   - Set environment variables
   - Configure build commands

3. **Deploy**
   - DigitalOcean handles the deployment

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd localbites-frontend
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_STRIPE_PUBLISHABLE_KEY
   vercel env add VITE_APP_NAME
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Go to Netlify
   - Connect your GitHub repository
   - Set build directory to `localbites-frontend`

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Add in Netlify dashboard

### Option 3: GitHub Pages

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/localbites",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔒 Security Configuration

### 1. CORS Settings

Update your backend CORS configuration:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://www.your-frontend-domain.com']
    : "http://localhost:5173",
  credentials: true,
}));
```

### 2. Rate Limiting

Configure rate limiting for production:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: 'Too many requests from this IP, please try again later.',
});
```

### 3. Helmet Configuration

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 📊 Monitoring & Analytics

### 1. Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking
- **New Relic**: Application performance monitoring

### 2. Database Monitoring

- **MongoDB Atlas**: Built-in monitoring and alerts
- **MongoDB Compass**: Database management tool

### 3. Payment Monitoring

- **Stripe Dashboard**: Payment analytics and fraud detection
- **Stripe CLI**: Local development and webhook testing

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "localbites-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Testing in Production

### 1. Payment Testing

Use Stripe test cards:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Declined**: 4000 0000 0000 0002

### 2. Webhook Testing

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Test webhook
stripe trigger payment_intent.succeeded
```

### 3. Load Testing

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

## 📈 Performance Optimization

### 1. Backend Optimization

- **Database Indexing**: Add indexes for frequently queried fields
- **Caching**: Implement Redis for session and data caching
- **Compression**: Enable gzip compression
- **CDN**: Use CloudFlare or AWS CloudFront

### 2. Frontend Optimization

- **Code Splitting**: Implement lazy loading
- **Image Optimization**: Use WebP format and lazy loading
- **Bundle Analysis**: Monitor bundle size
- **PWA**: Implement service workers for offline functionality

### 3. Database Optimization

```javascript
// Add indexes for better performance
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', description: 'text' });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration
   - Verify frontend URL in backend settings

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings

3. **Payment Issues**
   - Verify Stripe keys
   - Check webhook configuration
   - Test with Stripe test cards

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

### Debug Commands

```bash
# Check application logs
heroku logs --tail

# Check database connection
heroku run node -e "console.log(process.env.MONGO_URI)"

# Test Stripe connection
heroku run node -e "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); stripe.paymentIntents.list({limit: 1}).then(console.log)"
```

## 📞 Support

For deployment issues:

1. Check the application logs
2. Verify environment variables
3. Test locally with production settings
4. Contact support with error details

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks

1. **Security Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular security audits

2. **Performance Monitoring**
   - Monitor response times
   - Check database performance
   - Review error rates

3. **Backup Strategy**
   - Regular database backups
   - Configuration backups
   - Disaster recovery plan

### Update Process

1. **Staging Environment**
   - Deploy to staging first
   - Test all features
   - Performance testing

2. **Production Deployment**
   - Blue-green deployment
   - Rollback plan
   - Monitoring during deployment

3. **Post-Deployment**
   - Verify all features work
   - Monitor error rates
   - Performance validation 