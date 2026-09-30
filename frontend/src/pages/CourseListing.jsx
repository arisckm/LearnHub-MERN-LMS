import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, BookX } from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const categories = [
  'All',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'AI & Machine Learning',
  'Design',
  'Business',
  'Other',
];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseListing() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (level !== 'All') params.set('level', level);

    api
      .get(`/courses?${params.toString()}`)
      .then(({ data }) => {
        setCourses(data.courses);
        setPages(data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, level, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Courses</h1>
        <p className="mt-1 text-slate-500">Find the perfect course to level up your skills</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search courses..."
            className="input-field !pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={16} className="mr-1 text-slate-400" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setPage(1);
                setCategory(c);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => {
                setPage(1);
                setLevel(l);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                level === l
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No courses found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c._id} course={c} index={i} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    page === p ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
