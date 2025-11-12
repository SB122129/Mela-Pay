import paymentService from '../services/paymentService.js';
import emailService from '../services/emailService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * Create a new payment
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { userEmail, userName, courses } = req.body;

  // Validation
  if (!userEmail || !userName || !courses || courses.length === 0) {
    throw new AppError('Missing required fields', 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    throw new AppError('Invalid email address', 400);
  }

  // Create payment
  const payment = await paymentService.createPayment({
    userEmail,
    userName,
    courses
  });

  // Send email notification
  await emailService.sendPaymentPending(payment);

  res.status(201).json({
    success: true,
    message: 'Payment created successfully',
    data: payment
  });
});

/**
 * Get payment status
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await paymentService.getPaymentStatus(id);

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  res.json({
    success: true,
    data: payment
  });
});

/**
 * Handle NowPayments webhook
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-nowpayments-sig'];
  const webhookData = req.body;

  console.log('📨 Webhook received:', webhookData);

  const payment = await paymentService.handleWebhook(webhookData, signature);

  if (payment && payment.status === 'finished') {
    // Send confirmation email
    await emailService.sendPaymentConfirmation(payment);
  }

  res.json({
    success: true,
    message: 'Webhook processed'
  });
});

/**
 * Get all payments (admin only)
 */
export const getAllPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status = '',
    email = ''
  } = req.query;

  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (email) {
    query.userEmail = new RegExp(email, 'i');
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('courses.courseId'),
    Payment.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Simulate payment confirmation (for testing)
 */
export const simulateConfirmation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (process.env.NODE_ENV === 'production') {
    throw new AppError('This endpoint is only available in development', 403);
  }

  const payment = await paymentService.simulatePaymentConfirmation(id);

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Send confirmation email
  await emailService.sendPaymentConfirmation(payment);

  res.json({
    success: true,
    message: 'Payment confirmed successfully',
    data: payment
  });
});

/**
 * Get payment statistics
 */
export const getPaymentStatistics = asyncHandler(async (req, res) => {
  const stats = await paymentService.getPaymentStatistics();

  res.json({
    success: true,
    data: stats
  });
});

/**
 * Cancel payment
 */
export const cancelPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findOne({ paymentId: id });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.isSuccessful()) {
    throw new AppError('Cannot cancel completed payment', 400);
  }

  payment.status = 'expired';
  await payment.save();

  res.json({
    success: true,
    message: 'Payment cancelled',
    data: payment
  });
});
