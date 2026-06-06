import React from 'react';

export default function SudokuCell({
  value,
  row, col,
  isGiven,
  isSelected,
  isHighlighted, // same row/col/box
  isSameNumber,  // same digit as selected
  isError,
  isHint,
  onClick,
}) {
  const borderRight = (col === 2 || col === 5) ? '2.5px solid rgba(255,255,255,0.22)' : '1px solid var(--border-cell)';
  const borderBottom = (row === 2 || row === 5) ? '2.5px solid rgba(255,255,255,0.22)' : '1px solid var(--border-cell)';

  let bg = 'var(--bg-cell)';
  let color = 'var(--text-given)';
  let boxShadow = 'none';
  let transform = 'scale(1)';
  let zIndex = 1;
  let border = `1px solid var(--border-cell)`;

  if (isSelected) {
    bg = 'var(--bg-cell-selected)';
    border = `2px solid var(--accent-blue)`;
    boxShadow = '0 0 0 2px rgba(59,130,246,0.5), 0 0 12px rgba(59,130,246,0.3)';
    transform = 'scale(1.06)';
    zIndex = 5;
  } else if (isSameNumber && value !== 0) {
    bg = 'rgba(34, 197, 94, 0.12)';
    border = '1px solid rgba(34,197,94,0.35)';
    boxShadow = 'inset 0 0 8px rgba(34,197,94,0.15)';
    zIndex = 3;
  } else if (isHighlighted) {
    bg = 'var(--bg-cell-highlight)';
    zIndex = 2;
  }

  if (isError) {
    bg = 'rgba(239, 68, 68, 0.15)';
    border = '1px solid rgba(239,68,68,0.5)';
    boxShadow = '0 0 8px rgba(239,68,68,0.2)';
    color = 'var(--accent-red)';
  } else if (isHint) {
    color = '#60a5fa';
  } else if (!isGiven && value !== 0) {
    color = 'var(--accent-green)';
    if (isSameNumber) color = '#4ade80';
  } else if (isGiven) {
    color = isSameNumber ? 'var(--accent-green)' : 'var(--text-given)';
  }

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        cursor: isGiven ? 'pointer' : 'pointer',
        background: bg,
        color: color,
        border: border,
        borderRight: isSelected ? border : borderRight,
        borderBottom: isSelected ? border : borderBottom,
        borderRadius: '5px',
        transition: 'all 0.12s ease',
        position: 'relative',
        userSelect: 'none',
        boxShadow,
        transform,
        zIndex,
        fontSize: 'clamp(13px, 2.2vw, 21px)',
      }}
    >
      {value !== 0 ? value : ''}
    </div>
  );
}
