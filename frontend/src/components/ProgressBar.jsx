import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 flex-1">
      <span className="text-white/50 text-sm font-body whitespace-nowrap">
        <span className="text-white font-semibold">{current}</span> / {total}
      </span>
      <div className="flex-1 h-3 rounded-full overflow-hidden bg-white/10 relative">
        <motion.div
          className="h-full rounded-full progress-shimmer"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
