import React, { useState } from 'react';
import { Zap, Brain, Trophy, Star, ChevronRight, BookOpen, Swords, Cpu } from 'lucide-react';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    emoji: '🌱',
    tagline: 'Perfect for beginners',
    description: 'Fewer empty cells. Lots of hints. Learn the ropes without stress.',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    tips: [
      'Numbers 1–9 go in each row, column, and 3×3 box',
      'No number can repeat in the same row, column, or box',
      'Use hints freely — they\'re here to help you learn!',
      'Tap any cell, then tap a number to fill it in',
    ],
    emptyCells: '~35 empty cells',
    avgTime: '5–10 min',
  },
  {
    id: 'medium',
    label: 'Medium',
    emoji: '🔥',
    tagline: 'Getting interesting',
    description: 'More empties, light logic required. Great for casual players.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    tips: [
      'Look for rows/columns/boxes with only one empty cell',
      'If a number appears 8 times, the 9th spot is obvious!',
      'Highlight a number to see all its occurrences',
      'Eliminate possibilities systematically',
    ],
    emptyCells: '~45 empty cells',
    avgTime: '10–20 min',
  },
  {
    id: 'hard',
    label: 'Hard',
    emoji: '⚡',
    tagline: 'For serious solvers',
    description: 'Requires logical deduction. Think before you fill.',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    tips: [
      'Use "naked pairs" — two cells in same unit sharing same 2 candidates',
      'Pointing pairs: if candidates in a box align in a row/col, eliminate elsewhere',
      'Don\'t guess — every move should have logical justification',
      'Work in pencil marks mode mentally',
    ],
    emptyCells: '~52 empty cells',
    avgTime: '20–40 min',
  },
  {
    id: 'expert',
    label: 'Expert',
    emoji: '💀',
    tagline: 'Only for grandmasters',
    description: 'Brutally sparse. Advanced techniques required. No mercy.',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.25)',
    tips: [
      'X-Wing: if a candidate in two rows only appears in same 2 columns, eliminate',
      'Swordfish: X-Wing extended across 3 rows/columns',
      'Forcing chains: follow implications of assuming a digit',
      'If you\'re here, you don\'t need tips.',
    ],
    emptyCells: '~58 empty cells',
    avgTime: '40–90 min',
  },
];

const HOW_TO_PLAY = [
  { icon: '1️⃣', title: 'The Grid', body: 'A 9×9 board divided into nine 3×3 boxes.' },
  { icon: '🎯', title: 'The Goal', body: 'Fill every empty cell with a digit from 1 to 9.' },
  { icon: '🚫', title: 'The Rule', body: 'No digit can repeat in any row, column, or 3×3 box.' },
  { icon: '✅', title: 'Win', body: 'All 81 cells filled correctly. Every row, column, box: 1–9 exactly once.' },
];

export default function LandingPage({ onStart }) {
  const [selected, setSelected] = useState(null);
  const [showHow, setShowHow] = useState(false);
  const [phase, setPhase] = useState('hero'); // 'hero' | 'choose'

  function handleDiffSelect(diff) {
    setSelected(diff.id === selected ? null : diff.id);
  }

  function handlePlay() {
    if (!selected) return;
    onStart({ difficulty: selected });
  }

  const selectedDiff = DIFFICULTIES.find(d => d.id === selected);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
            S
          </div>
          <span className="font-black text-xl tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Sudoku<span style={{ color: 'var(--accent-green)' }}>Verse</span>
          </span>
        </div>
        <button
          onClick={() => setShowHow(!showHow)}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
        >
          <BookOpen size={14} /> How to Play
        </button>
      </header>

      {/* How to Play Modal */}
      {showHow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowHow(false)}
        >
          <div
            className="glass-card p-8 max-w-lg w-full animate-pop-in"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black mb-2">How to Play Sudoku</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              The rules are simple. Mastery takes a lifetime.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {HOW_TO_PLAY.map(step => (
                <div key={step.title} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <div className="font-bold text-sm mb-1">{step.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.body}</div>
                </div>
              ))}
            </div>

            {/* Mini demo grid */}
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-xs mb-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>EXAMPLE — 3×3 BOX</p>
              <div className="grid grid-cols-3 gap-1" style={{ maxWidth: '120px' }}>
                {[5,3,0,6,0,0,0,9,8].map((n, i) => (
                  <div key={i} className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold"
                    style={{
                      background: n === 0 ? 'var(--bg-cell-selected)' : 'var(--bg-cell)',
                      border: '1px solid var(--border-cell)',
                      color: n === 0 ? 'var(--accent-blue)' : 'var(--text-given)',
                      fontFamily: 'Space Mono'
                    }}>
                    {n || '?'}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                The missing numbers are <span style={{ color: 'var(--accent-green)' }}>1, 2, 4, 7</span> — figure out which goes where!
              </p>
            </div>

            <button
              onClick={() => setShowHow(false)}
              className="w-full py-3 rounded-xl font-bold transition-all"
              style={{ background: 'var(--accent-green)', color: '#000' }}
            >
              Got it! Let's play →
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-10 animate-fade-in-up">
          {/* Decorative grid preview */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-9 gap-0.5 p-2 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
              {[
                5,3,0,0,7,0,0,0,0,
                6,0,0,1,9,5,0,0,0,
                0,9,8,0,0,0,0,6,0,
                8,0,0,0,6,0,0,0,3,
                4,0,0,8,0,3,0,0,1,
                7,0,0,0,2,0,0,0,6,
                0,6,0,0,0,0,2,8,0,
                0,0,0,4,1,9,0,0,5,
                0,0,0,0,8,0,0,7,9,
              ].map((n, i) => {
                const row = Math.floor(i / 9), col = i % 9;
                const isBoxBorder = (col === 2 || col === 5);
                const isRowBorder = (row === 2 || row === 5);
                return (
                  <div key={i}
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm`}
                    style={{
                      background: n === 0 ? 'var(--bg-primary)' : 'var(--bg-cell)',
                      color: n === 0 ? 'transparent' : 'var(--text-given)',
                      fontFamily: 'Space Mono',
                      marginRight: isBoxBorder ? '2px' : '0',
                      marginBottom: isRowBorder ? '2px' : '0',
                    }}>
                    {n || '·'}
                  </div>
                );
              })}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            Sudoku<span style={{
              background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Verse</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Learn. Solve. Compete. Master.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            The Chess.com of Sudoku — free, beautiful, powerful.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="w-full max-w-2xl">
          <h2 className="text-center font-bold text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            CHOOSE YOUR CHALLENGE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                onClick={() => handleDiffSelect(diff)}
                className="flex flex-col items-center p-4 rounded-2xl transition-all text-left"
                style={{
                  background: selected === diff.id ? `rgba(${hexToRgb(diff.color)}, 0.15)` : 'var(--bg-card)',
                  border: `2px solid ${selected === diff.id ? diff.color : 'var(--border-subtle)'}`,
                  boxShadow: selected === diff.id ? `0 0 24px ${diff.glow}` : 'none',
                  transform: selected === diff.id ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <span className="text-3xl mb-2">{diff.emoji}</span>
                <span className="font-black text-sm" style={{ color: selected === diff.id ? diff.color : 'var(--text-primary)' }}>
                  {diff.label}
                </span>
                <span className="text-xs mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
                  {diff.tagline}
                </span>
              </button>
            ))}
          </div>

          {/* Selected difficulty info */}
          {selectedDiff && (
            <div className="glass-card p-5 mb-6 animate-pop-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-lg mb-1">{selectedDiff.emoji} {selectedDiff.label} Mode</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedDiff.description}</p>
                </div>
                <div className="text-right text-xs ml-4" style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  <div>{selectedDiff.emptyCells}</div>
                  <div>{selectedDiff.avgTime}</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {selectedDiff.id === 'easy' ? '💡 BEGINNER TIPS' : '⚡ STRATEGY TIPS'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDiff.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      <span style={{ color: selectedDiff.color, flexShrink: 0 }}>→</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Play Button */}
          <button
            onClick={handlePlay}
            disabled={!selected}
            className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all"
            style={{
              background: selected
                ? `linear-gradient(135deg, ${selectedDiff?.color}, ${lightenColor(selectedDiff?.color)})`
                : 'var(--bg-card)',
              color: selected ? '#000' : 'var(--text-secondary)',
              border: selected ? 'none' : '1px solid var(--border-subtle)',
              boxShadow: selected ? `0 4px 32px ${selectedDiff?.glow}` : 'none',
              transform: selected ? 'translateY(-1px)' : 'none',
              opacity: selected ? 1 : 0.5,
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            {selected ? (
              <>Play {selectedDiff.label} <ChevronRight size={20} /></>
            ) : (
              'Select a difficulty above'
            )}
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            { icon: '🧠', text: 'Smart Hints' },
            { icon: '✅', text: 'Error Detection' },
            { icon: '⚡', text: 'Number Highlight' },
            { icon: '⏱️', text: 'Timer' },
            { icon: '↩️', text: 'Undo / Redo' },
            { icon: '🔍', text: 'Auto-Solve' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <span>{f.icon}</span>{f.text}
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', opacity: 0.5 }}>
        SudokuVerse v1.0 — Built with ❤️
      </footer>
    </div>
  );
}

function hexToRgb(hex) {
  if (!hex) return '255,255,255';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '255,255,255';
}

function lightenColor(hex) {
  if (!hex) return '#fff';
  return hex;
}
