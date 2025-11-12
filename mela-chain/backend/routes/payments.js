import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/create', paymentController.createPayment);
router.get('/:id', paymentController.getPaymentStatus);
router.post('/webhook', paymentController.handleWebhook);

// Development/testing route
router.post('/:id/simulate', paymentController.simulateConfirmation);

// Admin routes
router.get('/', verifyToken, isAdmin, paymentController.getAllPayments);
router.get('/stats/all', verifyToken, isAdmin, paymentController.getPaymentStatistics);
router.post('/:id/cancel', verifyToken, isAdmin, paymentController.cancelPayment);

export default router;
