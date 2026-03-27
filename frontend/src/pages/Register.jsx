import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createParticipant } from '../services/api';
import useGameStore from '../store';
import ParticlesBackground from '../components/ParticlesBackground';

const AVATARS = ['🦁', '🐺', '🦊', '🐉', '🦅', '🤖', '👾', '🧠'];

export default function Register() {
  const navigate = useNavigate();
  const setParticipant = useGameStore((s) => s.setParticipant);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // POST /api/Participant -> { ParticipantId, Name, Email, Score, TimeTaken }
      const result = await createParticipant({ name: name.trim(), email: email.trim() });
      setParticipant({ ...result, avatar });
      toast.success('Welcome to the arena!');
      setTimeout(() => navigate('/quiz'), 400);
    } catch (err) {
      toast.error(err.message || 'Registration failed — is the API running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{
        background: 'radial-gradient(ellipse at 70% 30%, #001040 0%, #050510 50%, #0d001a 100%)',
      }}
    >
      <div className="noise-overlay" />
      <ParticlesBackground />

      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-body"
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong p-8 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎮</div>
            <h2 className="font-display font-bold text-3xl text-white mb-2">Join the Battle</h2>
            <p className="text-white/50 font-body">Create your player profile</p>
          </div>

          {/* Avatar picker */}
          <div className="mb-6">
            <p className="text-white/50 text-sm font-body mb-3 uppercase tracking-widest">Pick your avatar</p>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((a) => (
                <motion.button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className="py-3 rounded-xl text-2xl transition-all"
                  style={{
                    background: avatar === a ? 'rgba(123,47,255,0.4)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${avatar === a ? 'rgba(123,47,255,0.8)' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: avatar === a ? '0 0 20px rgba(123,47,255,0.4)' : 'none',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {a}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-sm font-body mb-2 uppercase tracking-widest">
                Player Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-4 rounded-xl font-body text-white placeholder-white/30 outline-none focus:ring-2 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  focusRingColor: '#7b2fff',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#7b2fff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            </div>

            <div>
              <label className="block text-white/50 text-sm font-body mb-2 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-4 rounded-xl font-body text-white placeholder-white/30 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00f5ff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-display font-bold text-lg text-white mt-2 relative overflow-hidden"
              style={{
                background: loading
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #7b2fff, #00f5ff)',
                boxShadow: loading ? 'none' : '0 0 30px rgba(123,47,255,0.5)',
              }}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 50px rgba(123,47,255,0.7)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Entering arena...
                </span>
              ) : (
                `${avatar} Enter Game`
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
