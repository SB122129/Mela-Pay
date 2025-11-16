import express from 'express';
import passport from 'passport';
import { signup, login, getProfile, getPurchasedCourses, googleCallback } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', verifyToken, getProfile);

/**
 * @route   GET /api/auth/courses
 * @desc    Get user's purchased courses
 * @access  Private
 */
router.get('/courses', verifyToken, getPurchasedCourses);

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth
 * @access  Public
 */
router.get('/google',
  (req, res, next) => {
    // Pass redirect as state parameter
    const redirect = req.query.redirect;
    const state = redirect ? Buffer.from(JSON.stringify({ redirect })).toString('base64') : '';
    req.authInfo = { state };
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    state: true
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false
  }),
  googleCallback
);

export default router;
