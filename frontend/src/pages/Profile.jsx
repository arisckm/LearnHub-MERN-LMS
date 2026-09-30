import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, bio: form.bio };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      toast.success('Profile updated');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
      <p className="mt-1 text-slate-500">Manage your account information</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {user?.name?.[0]?.toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-slate-800">{user?.email}</p>
            <span className="badge mt-1 bg-slate-100 capitalize text-slate-600">{user?.role}</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">New password (optional)</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Leave blank to keep current password" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
