import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 18;

const SHAPES = ['circle', 'triangle', 'square', 'diamond'];
const COLORS = ['#00f5ff', '#7b2fff', '#ff006e', '#06d6a0', '#ffd60a'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ParticlesBackground() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(8, 28),
    left: randomBetween(0, 100),
    duration: randomBetween(8, 20),
    delay: randomBetween(0, 15),
    opacity: randomBetween(0.15, 0.45),
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-60px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ${p.delay}s linear infinite`,
          }}
        >
          {p.shape === 'circle' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          )}
          {p.shape === 'square' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: `2px solid ${p.color}`,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          )}
          {p.shape === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${p.size / 2}px solid transparent`,
                borderRight: `${p.size / 2}px solid transparent`,
                borderBottom: `${p.size}px solid ${p.color}`,
                filter: `drop-shadow(0 0 4px ${p.color})`,
              }}
            />
          )}
          {p.shape === 'diamond' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: 'transparent',
                border: `2px solid ${p.color}`,
                transform: 'rotate(45deg)',
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
