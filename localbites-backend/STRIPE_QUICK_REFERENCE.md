# Stripe Quick Reference for LocalBites

## 🚀 Quick Setup (5 minutes)

### 1. Get Stripe Account
- Visit: https://stripe.com
- Sign up with your email
- Verify email and complete setup

### 2. Get Test Keys
- Login to Stripe Dashboard
- Ensure you're in **Test mode** (toggle on left)
- Go to **Developers** → **API keys**
- Copy both keys:
  - Secret key (sk_test_...)
  - Publishable key (pk_test_...)

### 3. Update .env File
Replace the placeholder values in your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 4. Test Configuration
```bash
cd localbites-backend
node test-stripe.js
```

## 💳 Test Cards (for development)

| Card Number | Brand | Result |
|-------------|-------|--------|
| 4242424242424242 | Visa | Success |
| 4000000000000002 | Visa | Declined |
| 4000000000009995 | Visa | Insufficient funds |
| 5555555555554444 | Mastercard | Success |
| 378282246310005 | Amex | Success |

**Test Details:**
- Expiry: Any future date (12/25)
- CVC: Any 3 digits (4 for Amex)
- ZIP: Any valid code

## 🔧 API Endpoints

### Create Payment Intent
```bash
POST /api/payments/create-payment-intent
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "orderId": "ORDER_ID",
  "paymentMethod": "Stripe"
}
```

### Confirm Payment
```bash
POST /api/payments/confirm-payment
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "paymentIntentId": "pi_...",
  "paymentId": "PAYMENT_ID"
}
```

### Get Payment History
```bash
GET /api/payments/history?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🛠️ Frontend Integration

### Install Stripe.js
```bash
npm install @stripe/stripe-js
```

### Basic Payment Form
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

// Create payment intent
const response = await fetch('/api/payments/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ orderId: 'order_123' })
});

const { clientSecret } = await response.json();

// Confirm payment
const stripe = await stripePromise;
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Customer Name'
    }
  }
});
```

## 🔍 Troubleshooting

### Common Errors:
1. **"Invalid API key"** → Check if key is correct and matches test/live mode
2. **"No such payment_intent"** → Verify payment intent ID
3. **"Your card was declined"** → Use test card numbers above
4. **CORS errors** → Check if frontend URL is in CORS settings

### Debug Steps:
1. Run `node test-stripe.js` to verify configuration
2. Check server logs for detailed error messages
3. Use Stripe Dashboard → Logs to see API calls
4. Verify JWT token is valid for protected endpoints

## 📊 Monitoring

### Stripe Dashboard:
- **Payments** → View all transactions
- **Logs** → API call history
- **Events** → Webhook events
- **Testing** → Test your integration

### LocalBites Logs:
- Payment creation logs in console
- Error logs with stack traces
- Database payment records

## 🔒 Security Notes

- ✅ Secret key is server-side only
- ✅ Publishable key can be in frontend
- ✅ Use HTTPS in production
- ✅ Validate webhooks with signatures
- ❌ Never log sensitive payment data

## 📞 Support

- **Stripe Docs**: https://stripe.com/docs
- **Test Integration**: https://stripe.com/docs/testing
- **Stripe Support**: https://support.stripe.com
- **LocalBites Issues**: Check server logs and payment controller
