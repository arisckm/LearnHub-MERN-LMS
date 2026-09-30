import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, BookOpen, PenSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      toast.success(`Welcome to LearnHub, ${data.name.split(' ')[0]}!`);
      navigate(data.role === 'instructor' ? '/instructor' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <GraduationCap size={24} />
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Start learning or teaching today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input required placeholder="Full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field !pl-11" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" required placeholder="Email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field !pl-11" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" required minLength={6} placeholder="Password (min. 6 characters)" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field !pl-11" />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">I want to join as</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'student' })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
                  form.role === 'student' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                }`}
              >
                <BookOpen size={22} className={form.role === 'student' ? 'text-brand-600' : 'text-slate-400'} />
                <span className="text-sm font-semibold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'instructor' })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
                  form.role === 'instructor' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
                }`}
              >
                <PenSquare size={22} className={form.role === 'instructor' ? 'text-brand-600' : 'text-slate-400'} />
                <span className="text-sm font-semibold">Instructor</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
