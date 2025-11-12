import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Authentication
router.post('/login', adminController.adminLogin);

// Protected admin routes
router.use(verifyToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics/revenue', adminController.getRevenueAnalytics);

// Payments
router.get('/payments', adminController.getPayments);
router.get('/payments/:id', adminController.getPaymentDetails);
router.get('/payments/export/csv', adminController.exportPayments);

// Courses
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.post('/courses/sync', adminController.syncCoursesFromEdX);

export default router;
