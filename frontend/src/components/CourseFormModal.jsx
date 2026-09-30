import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

const categories = [
  'Web Development', 'Data Science', 'Mobile Development',
  'AI & Machine Learning', 'Design', 'Business', 'Other',
];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const emptyLesson = () => ({ title: '', duration: 10, videoUrl: '' });

export default function CourseFormModal({ open, onClose, onSubmit, initialData, saving }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development',
    price: 0, level: 'Beginner', thumbnail: '', lessons: [emptyLesson()],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Web Development',
        price: initialData.price ?? 0,
        level: initialData.level || 'Beginner',
        thumbnail: initialData.thumbnail || '',
        lessons: initialData.lessons?.length ? initialData.lessons : [emptyLesson()],
      });
    } else {
      setForm({
        title: '', description: '', category: 'Web Development',
        price: 0, level: 'Beginner', thumbnail: '', lessons: [emptyLesson()],
      });
    }
  }, [initialData, open]);

  const updateLesson = (idx, field, value) => {
    const lessons = [...form.lessons];
    lessons[idx] = { ...lessons[idx], [field]: value };
    setForm({ ...form, lessons });
  };

  const addLesson = () => setForm({ ...form, lessons: [...form.lessons, emptyLesson()] });
  const removeLesson = (idx) => setForm({ ...form, lessons: form.lessons.filter((_, i) => i !== idx) });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      lessons: form.lessons
        .filter((l) => l.title.trim())
        .map((l, i) => ({ ...l, duration: Number(l.duration) || 0, order: i + 1 })),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {initialData ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field">
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
                  <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Thumbnail URL</label>
                  <input placeholder="https://..." value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="input-field" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Lessons</label>
                  <button type="button" onClick={addLesson} className="flex items-center gap-1 text-xs font-semibold text-brand-700">
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Course Lessons</label>
                    <button type="button" onClick={addLesson} className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800">
                      <Plus size={14} /> Add Lesson
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.lessons.map((lesson, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            placeholder={`Lesson ${idx + 1} title`}
                            value={lesson.title}
                            onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                            className="input-field flex-1 text-sm bg-white"
                          />
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min={0}
                              placeholder="Duration"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(idx, 'duration', e.target.value)}
                              className="input-field w-24 pr-12 text-sm bg-white"
                            />
                            <span className="absolute right-3 text-xs text-slate-400 pointer-events-none">mins</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLesson(idx)}
                            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 transition"
                            title="Remove Lesson"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div>
                          <input
                            type="url"
                            placeholder="Video URL (e.g., YouTube embed link or MP4 link)"
                            value={lesson.videoUrl || ''}
                            onChange={(e) => updateLesson(idx, 'videoUrl', e.target.value)}
                            className="input-field w-full text-sm bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : initialData ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
