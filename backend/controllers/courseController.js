const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all published courses (with optional search/filter/pagination)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level, page = 1, limit = 9 } = req.query;

  const query = { isPublished: true };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (category && category !== 'All') {
    query.category = category;
  }
  if (level && level !== 'All') {
    query.level = level;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('instructor', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Course.countDocuments(query),
  ]);

  res.json({
    courses,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// @desc    Get single course by id
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'name email avatar bio'
  );

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json(course);
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (instructor, admin)
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, price, thumbnail, level, lessons } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please provide title, description and category');
  }

  const course = await Course.create({
    title,
    description,
    category,
    price: price || 0,
    thumbnail,
    level,
    lessons: lessons || [],
    instructor: req.user._id,
  });

  res.status(201).json(course);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (owning instructor, admin)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const fields = ['title', 'description', 'category', 'price', 'thumbnail', 'level', 'lessons', 'isPublished'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  const updated = await course.save();
  res.json(updated);
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (owning instructor, admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const isOwner = course.instructor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ message: 'Course removed', _id: req.params.id });
});

// @desc    Get courses created by the logged-in instructor
// @route   GET /api/courses/instructor/mine
// @access  Private (instructor, admin)
const getMyTaughtCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

  const withCounts = await Promise.all(
    courses.map(async (c) => {
      const enrolledCount = await Enrollment.countDocuments({ course: c._id });
      return { ...c.toObject(), enrolledCount };
    })
  );

  res.json(withCounts);
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyTaughtCourses,
};
