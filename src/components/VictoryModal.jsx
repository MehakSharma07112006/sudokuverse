import React from 'react';
import { Trophy, RotateCcw, Home } from 'lucide-react';

const RANK_THRESHOLDS = {
  easy:   [120, 300, 600],    // seconds: S, A, B
  medium: [300, 600, 1200],
  hard:   [600, 1200, 2400],
  expert: [1200, 2400, 4800],
};

function getRank(difficulty, seconds) {
  const t = RANK_THRESHOLDS[difficulty] || [300, 600, 1200];
  if (seconds <= t[0]) return { rank: 'S', color: '#f59e0b', label: 'Lightning Fast! 🏆' };
  if (seconds <= t[1]) return { rank: 'A', color: '#22c55e', label: 'Excellent! ⭐' };
  if (seconds <= t[2]) return { rank: 'B', color: '#3b82f6', label: 'Well Done! 👍' };
  return { rank: 'C', color: '#8b5cf6', label: 'Solved it! ✅' };
}

export default function VictoryModal({ difficulty, seconds, hintsUsed, errors, onPlayAgain, onHome }) {
  const { rank, color, label } = getRank(difficulty, seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="glass-card p-8 max-w-sm w-full text-center animate-pop-in"
        style={{ border: `1px solid ${color}44` }}
      >
        {/* Trophy */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: `${color}22`, border: `2px solid ${color}` }}>
            <Trophy size={40} style={{ color }} />
          </div>
        </div>

        {/* Rank */}
        <div className="text-7xl font-black mb-2" style={{ color, fontFamily: 'Space Mono', lineHeight: 1 }}>
          {rank}
        </div>
        <p className="text-lg font-bold mb-1">{label}</p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Puzzle Solved!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Time" value={timeStr} color={color} />
          <Stat label="Hints" value={hintsUsed} color={hintsUsed === 0 ? '#22c55e' : '#f59e0b'} />
          <Stat label="Errors" value={errors} color={errors === 0 ? '#22c55e' : '#ef4444'} />
        </div>

        {hintsUsed === 0 && (
          <div className="mb-4 p-3 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
            🎯 Perfect — No hints used!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <Home size={16} /> Home
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all"
            style={{ background: color, color: '#000' }}
          >
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-xl font-black" style={{ color, fontFamily: 'Space Mono' }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}
