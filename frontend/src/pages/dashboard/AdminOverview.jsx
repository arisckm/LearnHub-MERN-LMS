import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import { Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4f46e5', '#312e81', '#f59e0b'];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/analytics').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
        <StatCard icon={GraduationCap} label="Students" value={data.totalStudents} tint="emerald" />
        <StatCard icon={BookOpen} label="Courses" value={data.totalCourses} tint="amber" />
        <StatCard icon={ClipboardList} label="Enrollments" value={data.totalEnrollments} tint="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-bold text-slate-800">Courses by Category</h3>
          {data.coursesByCategory.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.coursesByCategory}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ _id, count }) => `${_id}: ${count}`}
                >
                  {data.coursesByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-bold text-slate-800">Top Courses by Enrollment</h3>
          {data.topCourses.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No enrollments yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.topCourses} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="title" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="enrollCount" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
