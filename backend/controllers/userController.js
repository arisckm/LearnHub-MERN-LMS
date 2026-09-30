const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private (admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['student', 'instructor', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  await user.deleteOne();
  res.json({ message: 'User removed', _id: req.params.id });
});

// @desc    Get platform-wide analytics
// @route   GET /api/users/analytics
// @access  Private (admin)
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalStudents, totalInstructors, totalCourses, totalEnrollments] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
    ]);

  const coursesByCategory = await Course.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const topCourses = await Enrollment.aggregate([
    { $group: { _id: '$course', enrollCount: { $sum: 1 } } },
    { $sort: { enrollCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    { $project: { title: '$course.title', enrollCount: 1 } },
  ]);

  res.json({
    totalUsers,
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    coursesByCategory,
    topCourses,
  });
});

module.exports = { getUsers, updateUserRole, deleteUser, getAnalytics };
