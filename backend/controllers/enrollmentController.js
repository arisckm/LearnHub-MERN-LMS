const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll the logged-in student in a course
// @route   POST /api/enrollments
// @access  Private (student)
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('courseId is required');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const alreadyEnrolled = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  res.status(201).json(enrollment);
});

// @desc    Get the logged-in student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (student)
const getMyCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name' },
    })
    .sort({ createdAt: -1 });

  res.json(enrollments);
});

// @desc    Update lesson progress for an enrollment
// @route   PUT /api/enrollments/:id/progress
// @access  Private (student who owns the enrollment)
const updateProgress = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;

  const enrollment = await Enrollment.findById(req.params.id).populate('course');

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  if (enrollment.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this enrollment');
  }

  if (lessonId && !enrollment.completedLessons.some((l) => l.toString() === lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const totalLessons = enrollment.course.lessons.length || 1;
  enrollment.progress = Math.min(
    100,
    Math.round((enrollment.completedLessons.length / totalLessons) * 100)
  );
  enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active';

  const updated = await enrollment.save();
  res.json(updated);
});

// @desc    Get enrolled students for a specific course (instructor view)
// @route   GET /api/enrollments/course/:courseId
// @access  Private (owning instructor, admin)
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view these enrollments');
  }

  const enrollments = await Enrollment.find({ course: req.params.courseId }).populate(
    'student',
    'name email avatar'
  );

  res.json(enrollments);
});

module.exports = {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  getCourseEnrollments,
};
