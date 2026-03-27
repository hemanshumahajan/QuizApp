import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ duration = 30, onTimeUp, running = true, reset = 0 }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [reset, duration]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, reset]);

  const progress = timeLeft / duration;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isLow = timeLeft <= 5;
  const isMid = timeLeft <= 10 && timeLeft > 5;

  const strokeColor = isLow ? '#ff006e' : isMid ? '#ffd60a' : '#00f5ff';

  return (
    <motion.div
      className={`relative flex items-center justify-center ${isLow ? 'timer-warning' : ''}`}
      animate={isLow ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      <svg width="90" height="90" className="timer-ring">
        {/* Background circle */}
        <circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
            filter: `drop-shadow(0 0 6px ${strokeColor})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span
          className="font-display font-bold text-xl leading-none"
          style={{
            color: strokeColor,
            textShadow: `0 0 10px ${strokeColor}`,
            transition: 'color 0.3s ease',
          }}
        >
          {timeLeft}
        </span>
        <span className="text-white/40 text-xs font-body">sec</span>
      </div>
    </motion.div>
  );
}
