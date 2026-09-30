import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'instructor'
      ? '/instructor'
      : '/student';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <GraduationCap size={20} />
          </span>
          <span className="text-lg tracking-tight">
            Learn<span className="text-brand-600">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:border-brand-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-soft"
                  >
                    <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-400">
                      Signed in as <span className="capitalize font-semibold text-slate-600">{user.role}</span>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-700">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <NavLink onClick={() => setOpen(false)} to="/" end className="py-2 text-slate-700">Home</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/courses" className="py-2 text-slate-700">Courses</NavLink>
              {user ? (
                <>
                  <NavLink onClick={() => setOpen(false)} to={dashboardPath} className="py-2 text-slate-700">Dashboard</NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/profile" className="py-2 text-slate-700">Profile</NavLink>
                  <button onClick={handleLogout} className="py-2 text-left text-rose-600">Log out</button>
                </>
              ) : (
                <>
                  <NavLink onClick={() => setOpen(false)} to="/login" className="py-2 text-slate-700">Log in</NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/register" className="py-2 font-semibold text-brand-700">Get Started</NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
