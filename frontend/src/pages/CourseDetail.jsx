import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Clock, Star, User2, PlayCircle, CheckCircle2, Lock, ChevronLeft,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [myEnrollments, setMyEnrollments] = useState([]);

  const load = () => {
    setLoading(true);
    api
      .get(`/courses/${id}`)
      .then(({ data }) => setCourse(data))
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/enrollments/my-courses').then(({ data }) => setMyEnrollments(data)).catch(() => {});
    }
  }, [user]);

  const isEnrolled = myEnrollments.some((e) => e.course?._id === id);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only student accounts can enroll in courses');
      return;
    }
    setEnrolling(true);
    try {
      await api.post('/enrollments', { courseId: id });
      toast.success('Enrolled successfully! 🎉');
      navigate('/student/my-courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loader full />;
  if (!course) return null;

  const totalDuration = course.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/courses" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-700">
        <ChevronLeft size={16} /> Back to courses
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={course.thumbnail}
            alt={course.title}
            className="mb-6 h-72 w-full rounded-2xl object-cover shadow-soft"
          />
          <span className="badge bg-brand-100 text-brand-700">{course.category}</span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{course.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><User2 size={16} /> {course.instructor?.name}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {totalDuration} minutes</span>
            <span className="flex items-center gap-1 text-amber-500"><Star size={16} fill="currentColor" /> {course.ratingsAverage?.toFixed(1)}</span>
            <span className="badge bg-slate-100 text-slate-600">{course.level}</span>
          </div>
          <p className="mt-6 leading-relaxed text-slate-600">{course.description}</p>

          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Course Curriculum</h2>
            <div className="card divide-y divide-slate-100">
              {course.lessons?.length ? (
                course.lessons.map((lesson, idx) => (
                  <div key={lesson._id || idx} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {isEnrolled ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Lock size={18} className="text-slate-300" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {idx + 1}. {lesson.title}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <PlayCircle size={14} /> {lesson.duration}m
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-400">No lessons added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="h-fit lg:sticky lg:top-24">
          <div className="card p-6">
            <p className="text-3xl font-extrabold text-slate-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </p>
            {isEnrolled ? (
              <Link to="/student/my-courses" className="btn-primary mt-5 w-full">
                Go to Course
              </Link>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary mt-5 w-full">
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {course.lessons?.length || 0} lessons</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Full lifetime access</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
