const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  getCourseEnrollments,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.put('/:id/progress', protect, authorize('student'), updateProgress);
router.get(
  '/course/:courseId',
  protect,
  authorize('instructor', 'admin'),
  getCourseEnrollments
);

module.exports = router;
