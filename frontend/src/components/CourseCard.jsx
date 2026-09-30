import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, User2 } from 'lucide-react';

export default function CourseCard({ course, index = 0 }) {
  const totalDuration = course.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/courses/${course._id}`}
        className="card group block overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="badge absolute left-3 top-3 bg-white/90 text-brand-700 backdrop-blur">
            {course.category}
          </span>
          {course.price === 0 ? (
            <span className="badge absolute right-3 top-3 bg-emerald-500 text-white">Free</span>
          ) : (
            <span className="badge absolute right-3 top-3 bg-slate-900/80 text-white">
              ${course.price}
            </span>
          )}
        </div>
        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 font-bold text-slate-900 group-hover:text-brand-700">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-500">{course.description}</p>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User2 size={14} /> {course.instructor?.name || 'Instructor'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {totalDuration}m
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" /> {course.ratingsAverage?.toFixed(1) || '4.5'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
