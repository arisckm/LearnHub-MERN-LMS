import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const stats = [
  { icon: BookOpen, label: 'Courses', value: '50+' },
  { icon: Users, label: 'Students', value: '2,000+' },
  { icon: Award, label: 'Instructors', value: '30+' },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses?limit=3')
      .then(({ data }) => setCourses(data.courses))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge mb-5 gap-1 bg-brand-100 text-brand-700">
              <Sparkles size={14} /> Learn without limits
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {/* Hand-Drawn Circle SVG integrated right here */}
              <span className="relative inline-block px-3 py-1">
                <svg
                  className="absolute -inset-x-2 -inset-y-3 w-[125%], h-[160%] text-teal-600 pointer-events-none scale-105"
                  viewBox="0 0 100 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 23C12 35 75 42 92 27C105 16 88 3 48 4C18 5 1 18 12 28"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                Learn
              </span>{' '}
              on your schedule with <span className="text-brand-600">LearnHub</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              A modern learning platform where students master new skills and
              instructors share their expertise — from web development to design. Anywhere, anytime.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary">
                Browse Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-secondary">
                Become an Instructor
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
              alt="Students learning"
              className="rounded-3xl shadow-soft"
            />
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-sm font-semibold text-slate-800">🔥 Trending course</p>
              <p className="text-xs text-slate-500">The Complete MERN Stack Bootcamp</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Featured Courses</h2>
            <p className="mt-1 text-slate-500">Hand-picked courses to get you started</p>
          </div>
          <Link to="/courses" className="hidden text-sm font-semibold text-brand-700 sm:flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c._id} course={c} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* How LearnHub Works */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How LearnHub Works</h2>

        <div className="space-y-12">
          {/* Step 01 */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl font-extrabold text-indigo-200">01</span>
            <img src="https://media.istockphoto.com/id/2209569906/vector/happy-boy-carries-backpack-waving-hand-for-welcoming-student-with-schoolbag-greeting.jpg?s=612x612&w=0&k=20&c=UfkaDtdUowYnAUcF461RVCtNaN_xqli49FnFV608lk4=" alt="Browse Courses" className="w-36 h-36 object-contain" />
            <div>
              <h3 className="text-xl font-bold mb-2">Browse & Enroll</h3>
              <p className="text-gray-600">Explore a wide range of courses created by expert instructors and enroll with a single click.</p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl font-extrabold text-indigo-200">02</span>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqvxhQJCxuc8BQGCKQv4_kDSwXPHQdPEm6scYYU5USNQ&s=10" alt="Learn Content" className="w-36 h-36 object-contain" />
            <div>
              <h3 className="text-xl font-bold mb-2">Learn at Your Own Pace</h3>
              <p className="text-gray-600">Access your enrolled courses anytime, track your progress, and master new skills seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">Ready to start learning?</h2>
          <p className="mt-3 text-brand-100">
            Join thousands of students building real skills on LearnHub today.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-soft transition hover:bg-brand-50"
          >
            Get Started for Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}