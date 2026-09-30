import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function CourseStudents() {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/enrollments/course/${courseId}`).then(({ data }) => setEnrollments(data)).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Loader />;

  return (
    <div>
      <Link to="/instructor/courses" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-700">
        <ChevronLeft size={16} /> Back to courses
      </Link>
      <h3 className="mb-4 text-lg font-bold text-slate-900">Enrolled Students ({enrollments.length})</h3>

      {enrollments.length === 0 ? (
        <EmptyState icon={Users} title="No students enrolled yet" description="Once students enroll, they'll appear here." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((e) => (
                <tr key={e._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{e.student?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{e.student?.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${e.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{e.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${e.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
