import express from 'express';
import * as courseController from '../controllers/courseController.js';
import * as paymentController from '../controllers/paymentController.js';
import * as adminController from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Mela Chain unified API routes
 * All routes are prefixed with /api/mela
 */

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Mela Chain API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Course routes
router.get('/courses', courseController.getCourses);
router.get('/courses/featured', courseController.getFeaturedCourses);
router.get('/courses/search', courseController.searchCourses);
router.get('/courses/stats', courseController.getCourseStats);
router.get('/courses/:id', courseController.getCourseById);

// Payment routes
router.post('/payments/create', paymentController.createPayment);
router.get('/payments/:id', paymentController.getPaymentStatus);
router.post('/payments/webhook', paymentController.handleWebhook);
router.post('/payments/:id/simulate', paymentController.simulateConfirmation);

// Admin routes
router.post('/admin/login', adminController.adminLogin);
router.get('/admin/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);
router.get('/admin/payments', verifyToken, isAdmin, adminController.getPayments);
router.get('/admin/analytics', verifyToken, isAdmin, adminController.getRevenueAnalytics);

export default router;
