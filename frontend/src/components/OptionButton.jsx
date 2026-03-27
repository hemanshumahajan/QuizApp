import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const OPTION_STYLES = ['option-red', 'option-blue', 'option-yellow', 'option-green'];
const OPTION_ICONS = ['🔴', '🔵', '🟡', '🟢'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function OptionButton({ text, index, selected, correct, wrong, disabled, onClick }) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;

    // Ripple
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
    ripple.style.left = `${x - rect.width / 2}px`;
    ripple.style.top = `${y - rect.height / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    onClick?.(index);
  };

  let stateClass = OPTION_STYLES[index % 4];
  if (correct) stateClass = 'option-correct';
  if (wrong) stateClass = 'option-wrong';

  return (
    <motion.button
      ref={btnRef}
      className={`
        relative overflow-hidden w-full py-5 px-6 rounded-2xl
        border-2 text-left flex items-center gap-4
        font-body font-semibold text-white text-lg
        transition-all duration-200 cursor-pointer
        disabled:cursor-not-allowed
        ${stateClass}
      `}
      style={{ minHeight: '72px' }}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Label badge */}
      <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 font-display font-bold text-sm">
        {OPTION_LABELS[index % 4]}
      </span>

      {/* Text */}
      <span className="flex-1 leading-snug">{text}</span>

      {/* State icon */}
      {correct && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-2xl flex-shrink-0"
        >
          ✅
        </motion.span>
      )}
      {wrong && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl flex-shrink-0"
        >
          ❌
        </motion.span>
      )}

      {/* Selected ring */}
      {selected && !correct && !wrong && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/60 pointer-events-none" />
      )}
    </motion.button>
  );
}
