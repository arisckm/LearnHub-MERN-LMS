import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap size={18} />
            </span>
            LearnHub
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} LearnHub. Built with the MERN stack.
          </p>
        </div>
      </div>
    </footer>
  );
}
