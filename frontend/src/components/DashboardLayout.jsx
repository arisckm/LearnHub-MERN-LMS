import { NavLink } from 'react-router-dom';

// Simple sidebar shell used by all three role dashboards.
export default function DashboardLayout({ title, subtitle, links, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {links && (
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-2 shadow-soft lg:sticky lg:top-24">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </aside>
        )}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
