import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, #1a0040 0%, #050510 40%, #001030 100%)',
      }}
    >
      <div className="noise-overlay" />
      <ParticlesBackground />

      {/* Glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)',
          top: '-10%',
          left: '-15%',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
          filter: 'blur(40px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(0,245,255,0.1)',
            border: '1px solid rgba(0,245,255,0.3)',
          }}
        >
          <span className="text-lg">⚡</span>
          <span className="font-display text-xs tracking-widest text-cyan-300 uppercase">Live Quiz Arena</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black leading-none mb-4"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
        >
          <span className="text-white">ULTIMATE</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #7b2fff, #ff006e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            QUIZ BATTLE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-body text-white/60 text-lg md:text-xl mb-12 max-w-md mx-auto"
        >
          How smart are you? Test your limits and rise to the top of the leaderboard.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="relative btn-glow font-display font-bold text-xl tracking-wider px-12 py-5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #7b2fff, #00f5ff)',
              boxShadow: '0 0 30px rgba(123,47,255,0.5), 0 0 80px rgba(0,245,255,0.2)',
              color: 'white',
              border: 'none',
            }}
            whileHover={{
              scale: 1.07,
              boxShadow: '0 0 50px rgba(123,47,255,0.8), 0 0 100px rgba(0,245,255,0.3)',
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(123,47,255,0.5), 0 0 80px rgba(0,245,255,0.2)',
                '0 0 50px rgba(123,47,255,0.7), 0 0 100px rgba(0,245,255,0.35)',
                '0 0 30px rgba(123,47,255,0.5), 0 0 80px rgba(0,245,255,0.2)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            ⚡ START GAME
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-12"
        >
          {[
            { label: 'Players', value: '10K+' },
            { label: 'Questions', value: '500+' },
            { label: 'Categories', value: '12' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-display font-bold text-2xl"
                style={{ color: '#00f5ff', textShadow: '0 0 15px rgba(0,245,255,0.6)' }}
              >
                {stat.value}
              </div>
              <div className="text-white/40 text-sm font-body">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
      </motion.div>
    </div>
  );
}
