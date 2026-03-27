import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useGameStore from '../store';
import ParticlesBackground from '../components/ParticlesBackground';

function getPerformance(score, total) {
  const pct = total > 0 ? score / total : 0;
  if (pct === 1) return { label: 'GENIUS', emoji: '🧠', color: '#00f5ff', msg: 'Perfect score! Absolutely flawless.' };
  if (pct >= 0.6) return { label: 'GREAT JOB', emoji: '🔥', color: '#ffd60a', msg: "You're on fire! Keep it up." };
  return { label: 'KEEP GOING', emoji: '💪', color: '#ff006e', msg: 'Every master was once a beginner.' };
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function Result() {
  const navigate = useNavigate();
  const { results, participant, questions, resetGame } = useGameStore();
  const fired = useRef(false);

  useEffect(() => {
    if (!results) { navigate('/'); return; }
    if (fired.current) return;
    fired.current = true;

    const pct = results.total > 0 ? results.score / results.total : 0;

    if (pct >= 0.6) {
      const duration = pct === 1 ? 4000 : 2500;
      const end = Date.now() + duration;
      const colors = pct === 1
        ? ['#00f5ff', '#7b2fff', '#ff006e', '#ffd60a', '#06d6a0']
        : ['#ffd60a', '#06d6a0', '#7b2fff'];

      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [results]);

  if (!results) return null;

  const { score, total, timeTaken } = results;
  const perf = getPerformance(score, total);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #100025 0%, #050510 50%, #001520 100%)',
      }}
    >
      <div className="noise-overlay" />
      <ParticlesBackground />

      {/* Big glow behind score */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${perf.color}22 0%, transparent 70%)`,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Trophy / emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
          className="text-8xl mb-4 select-none"
        >
          {perf.emoji}
        </motion.div>

        {/* Performance label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="inline-block px-5 py-2 rounded-full font-display font-bold text-sm tracking-widest mb-4"
          style={{
            background: `${perf.color}22`,
            border: `1px solid ${perf.color}55`,
            color: perf.color,
            textShadow: `0 0 10px ${perf.color}`,
          }}
        >
          {perf.label}
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
          className="mb-2"
        >
          <span
            className="font-display font-black leading-none"
            style={{ fontSize: 'clamp(4rem, 18vw, 8rem)', color: perf.color, textShadow: `0 0 30px ${perf.color}88` }}
          >
            {score}
          </span>
          <span className="font-display font-bold text-white/30" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
            /{total}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 font-body text-lg mb-8"
        >
          {perf.msg}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass rounded-2xl p-5 mb-8 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Score', value: `${pct}%`, icon: '🎯' },
            { label: 'Time', value: formatTime(timeTaken || 0), icon: '⏱️' },
            { label: 'Correct', value: `${score}/${total}`, icon: '✅' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-xl text-white">{s.value}</div>
              <div className="text-white/40 text-xs font-body uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Player info */}
        {participant && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-white/40 font-body text-sm mb-6"
          >
            {participant.avatar} {participant.name}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <motion.button
            onClick={() => navigate('/leaderboard')}
            className="px-7 py-4 rounded-xl font-display font-bold text-base"
            style={{
              background: 'linear-gradient(135deg, #7b2fff, #00f5ff)',
              boxShadow: '0 0 25px rgba(123,47,255,0.5)',
              color: 'white',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(123,47,255,0.7)' }}
            whileTap={{ scale: 0.97 }}
          >
            🏆 Leaderboard
          </motion.button>

          <motion.button
            onClick={() => {
              resetGame();
              navigate('/quiz');
            }}
            className="px-7 py-4 rounded-xl font-display font-bold text-base"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
            }}
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.14)' }}
            whileTap={{ scale: 0.97 }}
          >
            ↺ Play Again
          </motion.button>

          <motion.button
            onClick={() => { resetGame(); navigate('/'); }}
            className="px-7 py-4 rounded-xl font-display font-bold text-base"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            🏠 Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
