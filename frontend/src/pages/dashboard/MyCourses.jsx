import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen, CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/enrollments/my-courses').then(({ data }) => {
      setEnrollments(data);
      if (data.length && !active) setActive(data[0]);
    }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markComplete = async (enrollmentId, lessonId) => {
    try {
      const { data } = await api.put(`/enrollments/${enrollmentId}/progress`, { lessonId });
      setEnrollments((prev) => prev.map((e) => (e._id === data._id ? { ...e, ...data } : e)));
      setActive((prev) => (prev?._id === data._id ? { ...prev, ...data } : prev));
      toast.success('Lesson marked complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) return <Loader />;

  if (enrollments.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="You haven't enrolled in any courses"
        description="Explore the catalog to get started."
        action={<Link to="/courses" className="btn-primary">Browse Courses</Link>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        {enrollments.map((e) => (
          <button
            key={e._id}
            onClick={() => setActive(e)}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
              active?._id === e._id ? 'border-brand-400 bg-brand-50' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <img src={e.course.thumbnail} className="h-10 w-14 rounded-md object-cover" alt="" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{e.course.title}</p>
              <p className="text-xs text-slate-400">{e.progress}% complete</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{active.course.title}</h2>
              <p className="text-sm text-slate-500">by {active.course.instructor?.name}</p>
            </div>
            <span className={`badge ${active.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
              {active.status === 'completed' ? 'Completed' : `${active.progress}% Progress`}
            </span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${active.progress}%` }} />
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            {active.course.lessons?.map((lesson, idx) => {
              const isDone = active.completedLessons?.some((l) => l === lesson._id || l._id === lesson._id);
              return (
                <div key={lesson._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <PlayCircle size={20} className="text-brand-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-800">{idx + 1}. {lesson.title}</p>
                      <p className="text-xs text-slate-400">{lesson.duration} minutes</p>
                    </div>
                  </div>
                  {!isDone && (
                    <button
                      onClick={() => markComplete(active._id, lesson._id)}
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              );
            })}
            {!active.course.lessons?.length && (
              <p className="py-6 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                <Lock size={14} /> No lessons in this course yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
