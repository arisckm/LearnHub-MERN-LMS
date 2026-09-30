// Run with: npm run seed
// Populates the database with demo admin/instructor/student accounts and sample courses.
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Course.deleteMany();
  await Enrollment.deleteMany();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@learnhub.com',
    password: 'password123',
    role: 'admin',
  });

  const instructor = await User.create({
    name: 'Sarah Instructor',
    email: 'instructor@learnhub.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Full-stack developer & educator with 8 years of experience.',
  });

  const student = await User.create({
    name: 'Alex Student',
    email: 'student@learnhub.com',
    password: 'password123',
    role: 'student',
  });

  const courses = await Course.insertMany([
    {
      title: 'The Complete MERN Stack Bootcamp',
      description:
        'Learn MongoDB, Express, React and Node.js from scratch by building real-world projects.',
      instructor: instructor._id,
      category: 'Web Development',
      price: 49.99,
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      lessons: [
        { title: 'Introduction to MERN', duration: 15, order: 1 },
        { title: 'Setting up Node & Express', duration: 25, order: 2 },
        { title: 'Building REST APIs', duration: 40, order: 3 },
        { title: 'React Fundamentals', duration: 35, order: 4 },
        { title: 'Connecting Frontend to Backend', duration: 30, order: 5 },
      ],
    },
    {
      title: 'Python for Data Science',
      description: 'Master pandas, numpy and data visualization to kickstart your data career.',
      instructor: instructor._id,
      category: 'Data Science',
      price: 39.99,
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      lessons: [
        { title: 'Python Basics Recap', duration: 20, order: 1 },
        { title: 'NumPy Deep Dive', duration: 30, order: 2 },
        { title: 'Pandas for Data Wrangling', duration: 45, order: 3 },
      ],
    },
    {
      title: 'UI/UX Design Foundations',
      description: 'Learn the principles of great design and build a professional portfolio.',
      instructor: instructor._id,
      category: 'Design',
      price: 0,
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      lessons: [
        { title: 'Design Thinking', duration: 20, order: 1 },
        { title: 'Color & Typography', duration: 25, order: 2 },
      ],
    },
  ]);

  await Enrollment.create({
    student: student._id,
    course: courses[0]._id,
    progress: 40,
    completedLessons: [courses[0].lessons[0]._id, courses[0].lessons[1]._id],
  });

  console.log('✅ Seed data created successfully!');
  console.log('----------------------------------');
  console.log('Admin:      admin@learnhub.com / password123');
  console.log('Instructor: instructor@learnhub.com / password123');
  console.log('Student:    student@learnhub.com / password123');
  console.log('----------------------------------');
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
