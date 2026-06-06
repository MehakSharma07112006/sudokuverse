import React from 'react';
import SudokuCell from './SudokuCell';

export default function SudokuBoard({
  grid,
  given,
  solution,
  errors,
  selected,
  hintCell,
  highlightNumber,
  onCellClick,
}) {
  const selectedVal = selected ? grid[selected[0]]?.[selected[1]] : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: '2px',
        background: 'rgba(255,255,255,0.1)',
        border: '2.5px solid rgba(255,255,255,0.2)',
        borderRadius: '14px',
        padding: '4px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.06)',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      {grid.map((row, r) =>
        row.map((val, c) => {
          const key = `${r},${c}`;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const isError = errors.some(([er, ec]) => er === r && ec === c);
          const isHint = hintCell && hintCell[0] === r && hintCell[1] === c;

          // Highlight peers of selected cell
          let isHighlighted = false;
          if (selected && !isSelected) {
            const [sr, sc] = selected;
            const sameRow = sr === r;
            const sameCol = sc === c;
            const sameBox = Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3);
            isHighlighted = sameRow || sameCol || sameBox;
          }

          // Same number highlight: if selected cell has a value, highlight all same-value cells
          const isSameNumber =
            selectedVal !== 0 && val !== 0 && val === selectedVal && !isSelected;

          // Also highlight if user clicked a number on the pad (highlightNumber)
          const isHighlightedByPad =
            highlightNumber !== 0 && val !== 0 && val === highlightNumber;

          return (
            <SudokuCell
              key={key}
              value={val}
              row={r}
              col={c}
              isGiven={given[r][c]}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isSameNumber={isSameNumber || isHighlightedByPad}
              isError={isError}
              isHint={isHint}
              onClick={() => onCellClick(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
