import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Users, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import CourseFormModal from '../../components/CourseFormModal';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/courses/instructor/mine').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/courses/${editing._id}`, payload);
        toast.success('Course updated');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created');
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This will remove all student enrollments too.')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">My Courses ({courses.length})</h3>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={16} /> New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You haven't created any courses yet"
          description="Create your first course to start teaching students."
          action={<button onClick={() => setModalOpen(true)} className="btn-primary">Create Course</button>}
        />
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={c.thumbnail} className="h-16 w-24 rounded-lg object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">{c.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="badge bg-slate-100">{c.category}</span>
                  <span>{c.lessons?.length || 0} lessons</span>
                  <span>&bull;</span>
                  <span>{c.enrolledCount || 0} students</span>
                  <span>&bull;</span>
                  <span>{c.price === 0 ? 'Free' : `$${c.price}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/instructor/courses/${c._id}/students`} className="btn-secondary !px-3 !py-1.5 text-xs">
                  <Users size={14} /> Students
                </Link>
                <button onClick={() => { setEditing(c); setModalOpen(true); }} className="btn-secondary !px-3 !py-1.5 text-xs">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(c._id)} className="btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialData={editing}
        saving={saving}
      />
    </div>
  );
}
