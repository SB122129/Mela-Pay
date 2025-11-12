import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/search', courseController.searchCourses);
router.get('/institutions', courseController.getInstitutions);
router.get('/subjects', courseController.getSubjects);
router.get('/stats', courseController.getCourseStats);
router.get('/:id', courseController.getCourseById);
router.get('/edx/:edxId', courseController.getCourseByEdxId);

// Admin routes
router.post('/sync', verifyToken, isAdmin, courseController.syncCourses);

export default router;
