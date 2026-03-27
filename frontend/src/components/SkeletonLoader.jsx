import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Question card skeleton */}
      <div className="glass-strong p-8 rounded-3xl space-y-4">
        <div className="skeleton h-5 w-28 rounded-full" />
        <div className="skeleton h-8 w-full rounded-xl" />
        <div className="skeleton h-8 w-3/4 rounded-xl" />
      </div>

      {/* Options skeleton */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-[72px] rounded-2xl" />
      ))}
    </div>
  );
}
