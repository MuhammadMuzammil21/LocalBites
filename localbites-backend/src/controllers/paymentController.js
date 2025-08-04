const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('../utils/asyncHandler');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// Create payment intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  const order = await Order.findById(orderId)
    .populate('restaurant', 'name')
    .populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to pay for this order',
    });
  }

  if (order.paymentStatus === 'Paid') {
    return res.status(400).json({
      success: false,
      message: 'Order is already paid',
    });
  }

  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'pkr',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
        restaurantId: order.restaurant._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      user: req.user.id,
      restaurant: order.restaurant._id,
      amount: order.totalAmount,
      paymentMethod: paymentMethod || 'Stripe',
      stripePaymentIntentId: paymentIntent.id,
      status: 'Pending',
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
});

// Confirm payment
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, paymentId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      payment.status = 'Completed';
      payment.stripeChargeId = paymentIntent.latest_charge;
      payment.processedAt = new Date();
      payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
      await payment.save();

      // Update order status
      const order = await Order.findById(payment.order);
      order.paymentStatus = 'Paid';
      order.paymentIntentId = paymentIntentId;
      order.status = 'Confirmed';
      await order.save();

      // Create notification
      await Notification.create({
        recipient: payment.user,
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        message: `Your payment of PKR ${payment.amount} for order #${order.trackingCode} has been processed successfully.`,
        data: {
          orderId: order._id,
          amount: payment.amount,
          trackingCode: order.trackingCode,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount,
          receiptUrl: payment.receiptUrl,
        },
      });
    } else {
      payment.status = 'Failed';
      payment.errorMessage = paymentIntent.last_payment_error?.message || 'Payment failed';
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: paymentIntent.last_payment_error?.message,
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment confirmation failed',
      error: error.message,
    });
  }
});

// Process refund
const processRefund = asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  const payment = await Payment.findById(paymentId)
    .populate('order', 'status trackingCode')
    .populate('user', 'name email');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (payment.status !== 'Completed') {
    return res.status(400).json({
      success: false,
      message: 'Payment is not completed',
    });
  }

  if (amount > payment.amount) {
    return res.status(400).json({
      success: false,
      message: 'Refund amount cannot exceed payment amount',
    });
  }

  try {
    let stripeRefund;
    if (payment.stripeChargeId) {
      stripeRefund = await stripe.refunds.create({
        charge: payment.stripeChargeId,
        amount: Math.round(amount * 100), // Convert to cents
        reason: 'requested_by_customer',
        metadata: {
          reason: reason || 'Customer request',
          orderId: payment.order._id.toString(),
        },
      });
    }

    // Update payment record
    payment.refundAmount = amount;
    payment.refundReason = reason;
    payment.status = amount >= payment.amount ? 'Refunded' : 'Partially_Refunded';
    payment.stripeRefundId = stripeRefund?.id;
    payment.refundedAt = new Date();
    await payment.save();

    // Update order status if full refund
    if (amount >= payment.amount) {
      const order = await Order.findById(payment.order);
      order.status = 'Cancelled';
      order.paymentStatus = 'Refunded';
      await order.save();
    }

    // Create notification
    await Notification.create({
      recipient: payment.user,
      type: 'REFUND_PROCESSED',
      title: 'Refund Processed',
      message: `Your refund of PKR ${amount} for order #${payment.order.trackingCode} has been processed.`,
      data: {
        orderId: payment.order._id,
        amount: amount,
        trackingCode: payment.order.trackingCode,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: stripeRefund?.id,
        amount: amount,
        status: payment.status,
        processedAt: payment.refundedAt,
      },
    });
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message,
    });
  }
});

// Get payment history
const getPaymentHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  const payments = await Payment.find(filter)
    .populate('order', 'trackingCode status')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Payment.countDocuments(filter);

  res.status(200).json({
    success: true,
    payments,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Get payment details
const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate('order', 'trackingCode status items totalAmount')
    .populate('restaurant', 'name address')
    .populate('user', 'name email');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Check authorization
  if (payment.user._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this payment',
    });
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentHistory,
  getPaymentDetails,
}; 