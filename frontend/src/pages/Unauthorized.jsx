import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <ShieldAlert size={48} className="mb-4 text-rose-400" />
      <h1 className="text-3xl font-extrabold text-slate-900">Access Denied</h1>
      <p className="mt-2 text-slate-500">You don't have permission to view this page.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
