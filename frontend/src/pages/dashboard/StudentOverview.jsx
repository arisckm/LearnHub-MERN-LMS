import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';

export default function StudentOverview() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses').then(({ data }) => setEnrollments(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white shadow-soft">
        <h2 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="mt-1 text-brand-100">Keep up the momentum on your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={enrollments.length} />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} tint="emerald" />
        <StatCard icon={TrendingUp} label="Avg. Progress" value={`${avgProgress}%`} tint="amber" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Continue Learning</h3>
          <Link to="/student/my-courses" className="flex items-center gap-1 text-sm font-semibold text-brand-700">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Browse the catalog and enroll in your first course."
            action={<Link to="/courses" className="btn-primary">Browse Courses</Link>}
          />
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 4).map((e) => (
              <Link
                key={e._id}
                to={`/courses/${e.course._id}`}
                className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5"
              >
                <img src={e.course.thumbnail} className="h-14 w-20 rounded-lg object-cover" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{e.course.title}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-700">{e.progress}%</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
