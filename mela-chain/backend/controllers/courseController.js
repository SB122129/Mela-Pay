import Course from '../models/Course.js';
import edxService from '../services/edxService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * Get all courses with filtering and pagination
 */
export const getCourses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    institution = '',
    level = '',
    subject = '',
    minPrice = 0,
    maxPrice = 1000,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Only apply search if search term exists and is not empty after trimming
  const trimmedSearch = search ? search.trim() : '';
  if (trimmedSearch && trimmedSearch.length > 0) {
    // Use regex to search in title, description, and institution
    // Case-insensitive search that matches courses starting with or containing the search term
    const searchRegex = new RegExp(trimmedSearch, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { institution: searchRegex },
      { subjects: searchRegex }
    ];
  }

  if (institution) {
    query.institution = new RegExp(institution, 'i');
  }

  if (level) {
    query.level = level;
  }

  if (subject) {
    query.subjects = subject;
  }

  if (minPrice || maxPrice) {
    query.price = {
      $gte: parseFloat(minPrice),
      $lte: parseFloat(maxPrice)
    };
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [courses, total] = await Promise.all([
    Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Course.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: courses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get single course by ID
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course
  });
});

/**
 * Get course by EdX ID
 */
export const getCourseByEdxId = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ edxId: req.params.edxId });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course
  });
});

/**
 * Sync courses from EdX
 */
export const syncCourses = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const result = await edxService.syncCourses(parseInt(limit));
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
 * Get course statistics
 */
export const getCourseStats = asyncHandler(async (req, res) => {
  const [
    totalCourses,
    activeCourses,
    totalEnrollments,
    institutionStats,
    levelStats,
    subjectStats
  ] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ isActive: true }),
    Course.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEnrollments' } } }
    ]),
    Course.aggregate([
      { $group: { _id: '$institution', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    Course.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]),
    Course.aggregate([
      { $unwind: '$subjects' },
      { $group: { _id: '$subjects', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.json({
    success: true,
    data: {
      totalCourses,
      activeCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      byInstitution: institutionStats,
      byLevel: levelStats,
      bySubject: subjectStats
    }
  });
});

/**
 * Get featured courses
 */
export const getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true })
    .sort({ totalEnrollments: -1 })
    .limit(6);

  res.json({
    success: true,
    data: courses
  });
});

/**
 * Search courses
 */
export const searchCourses = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const courses = await Course.find({
    $text: { $search: q },
    isActive: true
  })
    .limit(20)
    .select('title institution price priceInDOT imageUrl level');

  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

/**
 * Get unique institutions
 */
export const getInstitutions = asyncHandler(async (req, res) => {
  const institutions = await Course.distinct('institution', { isActive: true });

  res.json({
    success: true,
    data: institutions.sort()
  });
});

/**
 * Get unique subjects
 */
export const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Course.distinct('subjects', { isActive: true });

  res.json({
    success: true,
    data: subjects.sort()
  });
});
