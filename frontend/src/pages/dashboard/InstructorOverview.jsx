import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, Plus } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

export default function InstructorOverview() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/instructor/mine').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const totalStudents = courses.reduce((s, c) => s + (c.enrolledCount || 0), 0);
  const totalRevenue = courses.reduce((s, c) => s + (c.enrolledCount || 0) * (c.price || 0), 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Courses Created" value={courses.length} />
        <StatCard icon={Users} label="Total Students" value={totalStudents} tint="emerald" />
        <StatCard icon={DollarSign} label="Est. Revenue" value={`$${totalRevenue.toFixed(2)}`} tint="amber" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Your Courses</h3>
        <Link to="/instructor/courses" className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={16} /> New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {courses.slice(0, 4).map((c) => (
          <Link key={c._id} to="/instructor/courses" className="card flex items-center gap-4 p-4 hover:-translate-y-0.5">
            <img src={c.thumbnail} className="h-14 w-20 rounded-lg object-cover" alt="" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">{c.title}</p>
              <p className="text-xs text-slate-500">{c.enrolledCount || 0} students enrolled</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
