const dotenv = require('dotenv');
dotenv.config();

// Simple Stripe configuration test
async function testStripeConfig() {
  console.log('🔍 Testing Stripe Configuration...\n');
  
  // Check if environment variables are set
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  
  console.log('Environment Variables:');
  console.log('✓ STRIPE_SECRET_KEY:', stripeSecretKey ? 
    (stripeSecretKey.startsWith('sk_test_') ? '✅ Test key detected' : 
     stripeSecretKey.startsWith('sk_live_') ? '🔴 Live key detected' : 
     '❌ Invalid format') : '❌ Not set');
     
  console.log('✓ STRIPE_PUBLISHABLE_KEY:', stripePublishableKey ? 
    (stripePublishableKey.startsWith('pk_test_') ? '✅ Test key detected' : 
     stripePublishableKey.startsWith('pk_live_') ? '🔴 Live key detected' : 
     '❌ Invalid format') : '❌ Not set');
  
  // Test Stripe connection if keys are properly set
  if (stripeSecretKey && !stripeSecretKey.includes('your_stripe_secret_key_here')) {
    try {
      const stripe = require('stripe')(stripeSecretKey);
      
      console.log('\n🔗 Testing Stripe API connection...');
      
      // Test API connection by retrieving account info
      const account = await stripe.accounts.retrieve();
      console.log('✅ Stripe API connection successful!');
      console.log('📊 Account ID:', account.id);
      console.log('🌍 Country:', account.country);
      console.log('💰 Default currency:', account.default_currency);
      console.log('🔧 Account type:', account.type);
      
      // Test creating a payment intent
      console.log('\n💳 Testing payment intent creation...');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // $10.00 or equivalent
        currency: 'pkr',
        metadata: {
          test: 'true'
        }
      });
      
      console.log('✅ Payment intent created successfully!');
      console.log('🆔 Payment Intent ID:', paymentIntent.id);
      console.log('💵 Amount:', paymentIntent.amount, paymentIntent.currency.toUpperCase());
      console.log('📊 Status:', paymentIntent.status);
      
    } catch (error) {
      console.log('❌ Stripe API test failed:');
      console.log('Error:', error.message);
      
      if (error.type === 'StripeAuthenticationError') {
        console.log('💡 Tip: Check if your secret key is correct');
      } else if (error.type === 'StripeAPIError') {
        console.log('💡 Tip: Check your internet connection and Stripe service status');
      }
    }
  } else {
    console.log('\n⚠️  Skipping API test - Please set your actual Stripe keys first');
    console.log('📝 Follow the STRIPE_SETUP.md guide to get your keys');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Create a Stripe account at https://stripe.com');
  console.log('2. Get your test API keys from the Stripe Dashboard');
  console.log('3. Update the .env file with your actual keys');
  console.log('4. Run this test again: node test-stripe.js');
  console.log('5. Test payments in your application');
}

// Run the test
testStripeConfig().catch(console.error);
