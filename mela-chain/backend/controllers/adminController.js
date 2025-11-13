import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import edxService from '../services/edxService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { generateToken } from '../middleware/auth.js';

/**
 * Admin login
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if admin
  if (user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  });
});

/**
 * Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalCourses,
    totalPayments,
    successfulPayments,
    pendingPayments,
    totalRevenue,
    recentPayments,
    topCourses
  ] = await Promise.all([
    Course.countDocuments({ isActive: true }),
    Payment.countDocuments(),
    Payment.countDocuments({ status: { $in: ['finished', 'confirmed'] } }),
    Payment.countDocuments({ status: { $in: ['pending', 'waiting', 'confirming'] } }),
    Payment.aggregate([
      { $match: { status: { $in: ['finished', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, totalDOT: { $sum: '$totalAmountDOT' } } }
    ]),
    Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('courses.courseId'),
    Course.find({ isActive: true })
      .sort({ totalEnrollments: -1 })
      .limit(5)
  ]);

  const revenue = totalRevenue[0] || { total: 0, totalDOT: 0 };

  res.json({
    success: true,
    data: {
      overview: {
        totalCourses,
        totalPayments,
        successfulPayments,
        pendingPayments,
        revenue: revenue.total,
        revenueDOT: revenue.totalDOT,
        conversionRate: totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(2) : 0
      },
      recentPayments,
      topCourses
    }
  });
});

/**
 * Get all payments with filters
 */
export const getPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status = '',
    email = '',
    startDate = '',
    endDate = ''
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (email) {
    query.userEmail = new RegExp(email, 'i');
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
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
 * Get payment details
 */
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('courses.courseId');

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  res.json({
    success: true,
    data: payment
  });
});

/**
 * Update course
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const course = await Course.findByIdAndUpdate(
    id,
    { ...updates, lastSynced: new Date() },
    { new: true, runValidators: true }
  );

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
});

/**
 * Delete course
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    message: 'Course deactivated successfully',
    data: course
  });
});

/**
 * Sync courses from EdX
 */
export const syncCoursesFromEdX = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.body;

  const result = await edxService.syncCourses(limit);
  const message = result.isMock
    ? 'Courses synced successfully (mock EdX data)'
    : 'Courses synced successfully from EdX';

  res.json({
    success: true,
    message,
    data: result
  });
});

/**
 * Get revenue analytics
 */
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  let startDate = new Date();
  
  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  const analytics = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['finished', 'confirmed'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        revenueDOT: { $sum: '$totalAmountDOT' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  res.json({
    success: true,
    data: analytics
  });
});

/**
 * Export payments to CSV
 */
export const exportPayments = asyncHandler(async (req, res) => {
  const { status = '', startDate = '', endDate = '' } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query)
    .sort({ createdAt: -1 })
    .populate('courses.courseId');

  // Generate CSV
  const csv = [
    ['Payment ID', 'Email', 'Name', 'Status', 'Amount (USD)', 'Amount (DOT)', 'Courses', 'Date'].join(','),
    ...payments.map(p => [
      p.paymentId,
      p.userEmail,
      p.userName,
      p.status,
      p.totalAmount,
      p.totalAmountDOT,
      p.courses.length,
      p.createdAt.toISOString()
    ].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
  res.send(csv);
});
