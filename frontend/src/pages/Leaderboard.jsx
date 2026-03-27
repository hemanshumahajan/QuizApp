import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import useGameStore from '../store';
import ParticlesBackground from '../components/ParticlesBackground';

const MOCK_LEADERS = [
  { name: 'NeonHunter', score: 5, timeTaken: 42, avatar: '🦁' },
  { name: 'StarBlaster', score: 5, timeTaken: 55, avatar: '🐉' },
  { name: 'CyberWolf', score: 4, timeTaken: 61, avatar: '🐺' },
  { name: 'QuantumFox', score: 4, timeTaken: 78, avatar: '🦊' },
  { name: 'ArcadeEagle', score: 3, timeTaken: 90, avatar: '🦅' },
  { name: 'GlitchBot', score: 3, timeTaken: 95, avatar: '🤖' },
  { name: 'PixelBrain', score: 2, timeTaken: 110, avatar: '🧠' },
];

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_COLORS = ['#ffd60a', '#c0c0c0', '#cd7f32'];

function formatTime(s) {
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { participant, results } = useGameStore();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // GET /api/Participant -> [{ ParticipantId, Name, Email, Score, TimeTaken }]
        const data = await getLeaderboard();
        const arr = Array.isArray(data) ? data : [];
        const sorted = [...arr]
          .filter(p => p.Score > 0 || p.TimeTaken > 0)   // only players who played
          .sort((a, b) => {
            if (b.Score !== a.Score) return b.Score - a.Score;
            return (a.TimeTaken || 999) - (b.TimeTaken || 999);
          });
        setLeaders(sorted.length ? sorted : buildMockWithPlayer());
      } catch {
        setLeaders(buildMockWithPlayer());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const buildMockWithPlayer = () => {
    if (!participant || !results) return MOCK_LEADERS;
    const entry = {
      Name: participant.Name || participant.name,
      Score: results.score,
      TimeTaken: results.timeTaken || 0,
      avatar: participant.avatar || '👤',
      isYou: true,
    };
    const combined = [...MOCK_LEADERS, entry].sort((a, b) => {
      const aScore = a.Score ?? a.score ?? 0;
      const bScore = b.Score ?? b.score ?? 0;
      if (bScore !== aScore) return bScore - aScore;
      const aTime = a.TimeTaken ?? a.timeTaken ?? 999;
      const bTime = b.TimeTaken ?? b.timeTaken ?? 999;
      return aTime - bTime;
    });
    return combined;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0a00 0%, #050510 40%, #00001a 100%)' }}
    >
      <div className="noise-overlay" />
      <ParticlesBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="font-display font-black text-4xl text-white mb-2">Leaderboard</h1>
          <p className="text-white/40 font-body">Top players of the arena</p>
        </motion.div>

        {/* Top 3 podium */}
        {!loading && leaders.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-end justify-center gap-3 mb-10"
          >
            {[1, 0, 2].map((rankIdx) => {
              const player = leaders[rankIdx];
              if (!player) return null;
              const heights = ['h-28', 'h-36', 'h-24'];
              const podiumHeight = heights[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2];
              return (
                <motion.div
                  key={rankIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * rankIdx + 0.3 }}
                  className="flex flex-col items-center gap-2 flex-1 max-w-[130px]"
                >
                  <span className="text-3xl">{player.avatar || '👤'}</span>
                  <span className="font-display font-bold text-sm text-white text-center truncate w-full text-center">
                    {player.Name || player.name}
                    {player.isYou && <span className="text-xs text-cyan-400 ml-1">(you)</span>}
                  </span>
                  <span className="font-display text-xs font-bold" style={{ color: RANK_COLORS[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2] }}>
                    {player.Score ?? player.score} pts
                  </span>
                  <div
                    className={`w-full ${podiumHeight} rounded-t-xl flex items-start justify-center pt-3`}
                    style={{
                      background: `linear-gradient(180deg, ${RANK_COLORS[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2]}33, ${RANK_COLORS[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2]}11)`,
                      border: `1px solid ${RANK_COLORS[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2]}44`,
                      borderBottom: 'none',
                    }}
                  >
                    <span className="text-2xl">{MEDALS[rankIdx === 0 ? 1 : rankIdx === 1 ? 0 : 2]}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))
            : leaders.map((player, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx + 0.1 }}
                  className={`lb-row flex items-center gap-4 px-5 py-4 rounded-xl ${player.isYou ? 'ring-1 ring-cyan-400/50' : ''}`}
                  style={{
                    background: player.isYou
                      ? 'rgba(0,245,255,0.08)'
                      : idx < 3
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${player.isYou ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {/* Rank */}
                  <span className="w-8 text-center font-display font-bold text-lg flex-shrink-0">
                    {idx < 3 ? MEDALS[idx] : <span className="text-white/40">#{idx + 1}</span>}
                  </span>

                  {/* Avatar */}
                  <span className="text-2xl flex-shrink-0">{player.avatar || '👤'}</span>

                  {/* Name */}
                  <span className="flex-1 font-body font-semibold text-white truncate">
                    {player.Name || player.name}
                    {player.isYou && <span className="text-xs text-cyan-400 ml-2">YOU</span>}
                  </span>

                  {/* Time */}
                  <span className="text-white/40 text-sm font-body flex-shrink-0">
                    ⏱ {formatTime(player.TimeTaken ?? player.timeTaken ?? 0)}
                  </span>

                  {/* Score */}
                  <span
                    className="font-display font-bold text-lg flex-shrink-0 w-12 text-right"
                    style={{ color: idx < 3 ? RANK_COLORS[idx] : 'white' }}
                  >
                    {player.Score ?? player.score}
                  </span>
                </motion.div>
              ))}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 justify-center mt-10"
        >
          <motion.button
            onClick={() => navigate('/quiz')}
            className="px-7 py-4 rounded-xl font-display font-bold text-base"
            style={{
              background: 'linear-gradient(135deg, #7b2fff, #00f5ff)',
              boxShadow: '0 0 25px rgba(123,47,255,0.4)',
              color: 'white',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            ↺ Play Again
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            className="px-7 py-4 rounded-xl font-display font-bold text-base"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
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
