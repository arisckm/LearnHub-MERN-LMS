import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, tint = 'brand' }) {
  const tints = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4 p-5"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tints[tint]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}
