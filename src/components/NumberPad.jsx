import React from 'react';
import { Eraser, Lightbulb, RotateCcw, RotateCw } from 'lucide-react';

export default function NumberPad({
  onNumber,
  onErase,
  onHint,
  onUndo,
  onRedo,
  highlightNumber,
  hintCount,
  difficulty,
  canUndo,
  canRedo,
}) {
  const diffColors = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#f97316',
    expert: '#ef4444',
  };
  const accentColor = diffColors[difficulty] || '#3b82f6';

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      {/* Number buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: '6px',
        marginBottom: '12px',
      }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => onNumber(n)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(14px, 2vw, 20px)',
              fontWeight: 700,
              background: highlightNumber === n
                ? accentColor
                : 'var(--bg-card)',
              border: `1.5px solid ${highlightNumber === n ? accentColor : 'var(--border-subtle)'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: highlightNumber === n ? '#000' : 'var(--text-primary)',
              transition: 'all 0.15s ease',
              boxShadow: highlightNumber === n ? `0 0 16px ${accentColor}55` : 'none',
            }}
            onMouseEnter={e => {
              if (highlightNumber !== n) {
                e.currentTarget.style.background = 'var(--bg-cell-selected)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (highlightNumber !== n) {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <ActionBtn
          icon={<Eraser size={16} />}
          label="Erase"
          onClick={onErase}
          color="var(--text-secondary)"
        />
        <ActionBtn
          icon={<Lightbulb size={16} />}
          label={`Hint (${hintCount})`}
          onClick={onHint}
          color="#60a5fa"
          disabled={hintCount <= 0}
          glow="rgba(96,165,250,0.3)"
        />
        <ActionBtn
          icon={<RotateCcw size={16} />}
          label="Undo"
          onClick={onUndo}
          color="var(--text-secondary)"
          disabled={!canUndo}
        />
        <ActionBtn
          icon={<RotateCw size={16} />}
          label="Redo"
          onClick={onRedo}
          color="var(--text-secondary)"
          disabled={!canRedo}
        />
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, color, disabled, glow }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '10px 4px',
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--text-secondary)' : color,
        opacity: disabled ? 0.4 : 1,
        fontSize: '10px',
        fontWeight: 600,
        transition: 'all 0.15s ease',
        letterSpacing: '0.05em',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--bg-cell-hover)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (glow) e.currentTarget.style.boxShadow = `0 4px 16px ${glow}`;
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}
