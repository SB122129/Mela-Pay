import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { generateToken } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

/**
 * User signup
 */
export const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    throw new AppError('All fields are required', 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email address', 400);
  }

  // Password validation
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name,
    role: 'user'
  });

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail signup if email fails
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
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
 * User login
 */
export const login = asyncHandler(async (req, res) => {
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

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is inactive', 401);
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
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('purchasedCourses.courseId', 'title edxUrl price');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * Get user's purchased courses
 */
export const getPurchasedCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'purchasedCourses.courseId',
      select: 'title description edxUrl price imageUrl category'
    })
    .populate({
      path: 'purchasedCourses.paymentId',
      select: 'paymentId totalAmount totalAmountDOT status createdAt'
    });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const purchasedCourses = user.purchasedCourses.map(purchase => ({
    course: purchase.courseId,
    payment: purchase.paymentId,
    purchasedAt: purchase.purchasedAt
  }));

  res.json({
    success: true,
    data: purchasedCourses
  });
});

/**
 * Google OAuth callback handler
 */
export const googleCallback = asyncHandler(async (req, res) => {
  // User is already authenticated by passport
  const user = req.user;

  // Generate token
  const token = generateToken(user._id);

  // Get redirect from state parameter if present
  let redirectPath = '';
  try {
    const state = req.query.state;
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
      redirectPath = decoded.redirect ? `&redirect=${encodeURIComponent(decoded.redirect)}` : '';
    }
  } catch (err) {
    console.error('Error parsing state:', err);
  }

  // Redirect to frontend with token and optional redirect
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/auth/callback?token=${token}${redirectPath}`);
});
