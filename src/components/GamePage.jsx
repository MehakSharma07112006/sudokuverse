import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, RefreshCw, Zap, Pause, Play, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import SudokuBoard from './SudokuBoard';
import NumberPad from './NumberPad';
import VictoryModal from './VictoryModal';
import {
  generatePuzzle,
  cloneGrid,
  validateGrid,
  isComplete,
  getHint,
  countFilled,
  SAMPLE_PUZZLES,
  parseGrid,
} from '../utils/sudoku';
import { useTimer } from '../hooks/useTimer';

const DIFF_COLORS = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#f97316',
  expert: '#ef4444',
};

const DIFF_HINTS = {
  easy: 5,
  medium: 3,
  hard: 2,
  expert: 1,
};

const DIFF_LABELS = {
  easy: '🌱 Easy',
  medium: '🔥 Medium',
  hard: '⚡ Hard',
  expert: '💀 Expert',
};

export default function GamePage({ config, onHome }) {
  const { difficulty } = config;
  const accentColor = DIFF_COLORS[difficulty] || '#3b82f6';

  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [given, setGiven] = useState(null);
  const [grid, setGrid] = useState(null);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState([]);
  const [hintCell, setHintCell] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(DIFF_HINTS[difficulty] ?? 3);
  const [errorCount, setErrorCount] = useState(0);
  const [highlightNumber, setHighlightNumber] = useState(0);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [won, setWon] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [toast, setToast] = useState(null);
  const hintTimerRef = useRef(null);

  const { seconds, running, start, pause, reset: resetTimer, format } = useTimer();

  // Initialize puzzle
  useEffect(() => {
    initGame();
  }, [difficulty]);

  function initGame() {
    setGenerating(true);
    setWon(false);
    setErrors([]);
    setHintCell(null);
    setHintsUsed(0);
    setHintsLeft(DIFF_HINTS[difficulty] ?? 3);
    setErrorCount(0);
    setSelected(null);
    setHistory([]);
    setFuture([]);
    setHighlightNumber(0);
    setShowSolution(false);
    resetTimer();

    setTimeout(() => {
      try {
        const { puzzle: p, solution: s } = generatePuzzle(difficulty);
        const givenMap = p.map(row => row.map(cell => cell !== 0));
        setPuzzle(p);
        setSolution(s);
        setGiven(givenMap);
        setGrid(cloneGrid(p));
        setGenerating(false);
        start();
      } catch (e) {
        // Fallback to sample puzzle
        const sample = SAMPLE_PUZZLES[difficulty] || SAMPLE_PUZZLES.medium;
        const p = parseGrid(sample);
        const { solve } = require('../utils/sudoku');
        // Simple fallback
        setGenerating(false);
      }
    }, 50);
  }

  // Keyboard input
  useEffect(() => {
    function handleKey(e) {
      if (won || paused || !grid) return;
      const key = e.key;
      if (key >= '1' && key <= '9') {
        handleNumber(parseInt(key));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        handleErase();
      } else if (key === 'ArrowUp' && selected) {
        setSelected([Math.max(0, selected[0] - 1), selected[1]]);
      } else if (key === 'ArrowDown' && selected) {
        setSelected([Math.min(8, selected[0] + 1), selected[1]]);
      } else if (key === 'ArrowLeft' && selected) {
        setSelected([selected[0], Math.max(0, selected[1] - 1)]);
      } else if (key === 'ArrowRight' && selected) {
        setSelected([selected[0], Math.min(8, selected[1] + 1)]);
      } else if (e.ctrlKey && key === 'z') {
        handleUndo();
      } else if (e.ctrlKey && key === 'y') {
        handleRedo();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, grid, won, paused]);

  function handleCellClick(r, c) {
    setSelected([r, c]);
    const val = grid[r][c];
    if (val !== 0) {
      setHighlightNumber(val === highlightNumber ? 0 : val);
    } else {
      setHighlightNumber(0);
    }
  }

  function handleNumber(num) {
    if (!selected || won || paused) return;
    const [r, c] = selected;
    if (given[r][c]) return; // can't edit given cells

    // Save history
    setHistory(prev => [...prev, cloneGrid(grid)]);
    setFuture([]);

    const newGrid = cloneGrid(grid);
    newGrid[r][c] = num;
    setGrid(newGrid);
    setHighlightNumber(num);

    // Clear hint
    setHintCell(null);

    // Check for errors
    const newErrors = validateGrid(newGrid, solution);
    setErrors(newErrors);

    // Count new errors
    const wasError = errors.some(([er, ec]) => er === r && ec === c);
    const isNowError = newErrors.some(([er, ec]) => er === r && ec === c);
    if (isNowError && !wasError) {
      setErrorCount(prev => prev + 1);
      showToast('❌ Incorrect number!', 'error');
    } else if (!isNowError && num !== 0) {
      // correct placement
      if (num === solution[r][c]) {
        showToast('✅ Correct!', 'success');
      }
    }

    // Check win
    if (isComplete(newGrid) && newErrors.length === 0) {
      pause();
      setTimeout(() => setWon(true), 400);
    }
  }

  function handleErase() {
    if (!selected || won || paused) return;
    const [r, c] = selected;
    if (given[r][c]) return;

    setHistory(prev => [...prev, cloneGrid(grid)]);
    setFuture([]);

    const newGrid = cloneGrid(grid);
    newGrid[r][c] = 0;
    setGrid(newGrid);
    setHighlightNumber(0);
    setHintCell(null);

    const newErrors = validateGrid(newGrid, solution);
    setErrors(newErrors);
  }

  function handleHint() {
    if (hintsLeft <= 0 || won || paused || !grid) return;

    const hint = getHint(grid, solution, given);
    if (!hint) return;

    setHintsLeft(prev => prev - 1);
    setHintsUsed(prev => prev + 1);

    // Apply hint
    setHistory(prev => [...prev, cloneGrid(grid)]);
    setFuture([]);

    const newGrid = cloneGrid(grid);
    newGrid[hint.row][hint.col] = hint.value;
    setGrid(newGrid);
    setHintCell([hint.row, hint.col]);
    setSelected([hint.row, hint.col]);
    setHighlightNumber(hint.value);

    const newErrors = validateGrid(newGrid, solution);
    setErrors(newErrors);

    showToast(`💡 Hint: ${hint.value} placed at R${hint.row+1}C${hint.col+1}`, 'hint');

    // Clear hint highlight after 2s
    clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintCell(null), 2000);

    if (isComplete(newGrid) && newErrors.length === 0) {
      pause();
      setTimeout(() => setWon(true), 400);
    }
  }

  function handleUndo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [cloneGrid(grid), ...f]);
    setHistory(h => h.slice(0, -1));
    setGrid(prev);
    setErrors(validateGrid(prev, solution));
    setHintCell(null);
  }

  function handleRedo() {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, cloneGrid(grid)]);
    setFuture(f => f.slice(1));
    setGrid(next);
    setErrors(validateGrid(next, solution));
    setHintCell(null);
  }

  function handleAutoSolve() {
    if (!solution) return;
    setGrid(cloneGrid(solution));
    setErrors([]);
    setHintCell(null);
    pause();
    showToast('🤖 Puzzle solved automatically!', 'hint');
  }

  function togglePause() {
    if (paused) { start(); setPaused(false); }
    else { pause(); setPaused(true); }
  }

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  }

  // Progress
  const filled = grid ? countFilled(grid) - (given ? given.flat().filter(Boolean).length : 0) : 0;
  const totalEmpty = grid && given ? 81 - given.flat().filter(Boolean).length : 1;
  const progress = Math.round((filled / totalEmpty) * 100);

  if (generating || !grid) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-4xl animate-spin">⚙️</div>
        <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>Generating your puzzle…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <Home size={14} /> Home
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-black border"
            style={{
              color: accentColor,
              borderColor: accentColor,
              background: `${accentColor}18`,
            }}>
            {DIFF_LABELS[difficulty]}
          </div>
        </div>

        <button
          onClick={initGame}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <RefreshCw size={14} /> New
        </button>
      </header>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        {/* Timer */}
        <div className="flex items-center gap-2">
          <button onClick={togglePause} style={{ color: 'var(--text-secondary)' }}>
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <span className="font-mono text-sm font-bold" style={{ color: paused ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {paused ? 'PAUSED' : format()}
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 flex-1 mx-4">
          <div className="flex-1 progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)', width: '36px', textAlign: 'right' }}>
            {progress}%
          </span>
        </div>

        {/* Error counter */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1" style={{ color: errors.length > 0 ? '#ef4444' : 'var(--text-secondary)' }}>
            <XCircle size={12} />
            <span>{errorCount}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: '#60a5fa' }}>
            <span>💡 {hintsLeft}</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-20 left-1/2 z-50 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pop-in"
          style={{
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : toast.type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(59,130,246,0.9)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Main game area */}
      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-6 px-4 py-6">
        {/* Board */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
          {/* Pause overlay */}
          {paused && (
            <div className="absolute inset-0 z-10 flex items-center justify-center"
              style={{ background: 'rgba(10,13,20,0.9)', backdropFilter: 'blur(4px)' }}>
              <div className="text-center">
                <div className="text-5xl mb-3">⏸️</div>
                <p className="text-xl font-black mb-2">Game Paused</p>
                <button onClick={togglePause} className="px-6 py-2 rounded-xl font-bold"
                  style={{ background: accentColor, color: '#000' }}>Resume</button>
              </div>
            </div>
          )}

          <SudokuBoard
            grid={showSolution ? solution : grid}
            given={given}
            solution={solution}
            errors={showSolution ? [] : errors}
            selected={selected}
            hintCell={hintCell}
            highlightNumber={highlightNumber}
            onCellClick={handleCellClick}
          />

          {/* Number pad (shown below board on mobile) */}
          <div className="w-full lg:hidden">
            <NumberPad
              onNumber={handleNumber}
              onErase={handleErase}
              onHint={handleHint}
              onUndo={handleUndo}
              onRedo={handleRedo}
              highlightNumber={highlightNumber}
              hintCount={hintsLeft}
              difficulty={difficulty}
              canUndo={history.length > 0}
              canRedo={future.length > 0}
            />
          </div>
        </div>

        {/* Sidebar — desktop */}
        <div className="hidden lg:flex flex-col gap-4" style={{ width: '260px' }}>
          {/* Number pad */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>ENTER NUMBER</p>
            <NumberPad
              onNumber={handleNumber}
              onErase={handleErase}
              onHint={handleHint}
              onUndo={handleUndo}
              onRedo={handleRedo}
              highlightNumber={highlightNumber}
              hintCount={hintsLeft}
              difficulty={difficulty}
              canUndo={history.length > 0}
              canRedo={future.length > 0}
            />
          </div>

          {/* Guide */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>QUICK GUIDE</p>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--accent-green)', opacity: 0.7 }} />
                Green = your correct answers
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#ef4444', opacity: 0.7 }} />
                Red = incorrect entries
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--bg-cell-same-num)' }} />
                Teal = same number highlighted
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--bg-cell-highlight)' }} />
                Dark blue = same row/col/box
              </div>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <div>🎹 Use arrow keys to navigate</div>
              <div>⌨️ Type 1–9 to fill a cell</div>
              <div>⌫ Backspace to erase</div>
              <div>Ctrl+Z / Ctrl+Y to undo/redo</div>
            </div>
          </div>

          {/* Auto-solve */}
          <button
            onClick={handleAutoSolve}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-cell-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Zap size={14} /> Auto-Solve
          </button>
        </div>
      </main>

      {/* Mobile sidebar extras */}
      <div className="lg:hidden px-4 pb-6 flex gap-3">
        <button
          onClick={handleAutoSolve}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
        >
          <Zap size={14} /> Auto-Solve
        </button>
        {/* Legend */}
        <div className="flex-1 flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1">
            <span style={{ color: 'var(--accent-green)' }}>●</span> Correct
          </div>
          <div className="flex items-center gap-1">
            <span style={{ color: '#ef4444' }}>●</span> Wrong
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      {won && (
        <VictoryModal
          difficulty={difficulty}
          seconds={seconds}
          hintsUsed={hintsUsed}
          errors={errorCount}
          onPlayAgain={initGame}
          onHome={onHome}
        />
      )}
    </div>
  );
}
