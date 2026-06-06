// ─── Sudoku Core Utilities ────────────────────────────────────────────────────

/** Parse a flat 81-char string into 9x9 grid (0 = empty) */
export function parseGrid(str) {
  return Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => {
      const ch = str[r * 9 + c];
      return ch && ch !== '.' && ch !== '0' ? parseInt(ch) : 0;
    })
  );
}

/** Deep clone a 9x9 grid */
export function cloneGrid(grid) {
  return grid.map(row => [...row]);
}

/** Check if placing `num` at (row, col) is valid */
export function isValid(grid, row, col, num) {
  // Row check
  if (grid[row].includes(num)) return false;
  // Column check
  if (grid.some(r => r[col] === num)) return false;
  // Box check
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (grid[r][c] === num) return false;
  return true;
}

/** Get all valid candidates for a cell */
export function getCandidates(grid, row, col) {
  if (grid[row][col] !== 0) return [];
  return [1,2,3,4,5,6,7,8,9].filter(n => isValid(grid, row, col, n));
}

/** Backtracking solver — returns solved grid or null */
export function solve(grid) {
  const g = cloneGrid(grid);
  if (_solve(g)) return g;
  return null;
}

function _solve(g) {
  // Find empty cell with fewest candidates (MRV heuristic)
  let bestRow = -1, bestCol = -1, bestCount = 10;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        const cands = getCandidates(g, r, c);
        if (cands.length === 0) return false;
        if (cands.length < bestCount) {
          bestCount = cands.length;
          bestRow = r;
          bestCol = c;
          if (bestCount === 1) break;
        }
      }
    }
    if (bestCount === 1) break;
  }
  if (bestRow === -1) return true; // solved

  for (const num of getCandidates(g, bestRow, bestCol)) {
    g[bestRow][bestCol] = num;
    if (_solve(g)) return true;
    g[bestRow][bestCol] = 0;
  }
  return false;
}

/** Count solutions (up to 2) to check uniqueness */
export function countSolutions(grid, limit = 2) {
  const g = cloneGrid(grid);
  let count = 0;
  function bt() {
    if (count >= limit) return;
    let bestRow = -1, bestCol = -1, bestCount = 10;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === 0) {
          const cands = getCandidates(g, r, c);
          if (cands.length === 0) return;
          if (cands.length < bestCount) {
            bestCount = cands.length;
            bestRow = r;
            bestCol = c;
          }
        }
      }
    }
    if (bestRow === -1) { count++; return; }
    for (const num of getCandidates(g, bestRow, bestCol)) {
      g[bestRow][bestCol] = num;
      bt();
      g[bestRow][bestCol] = 0;
    }
  }
  bt();
  return count;
}

/** Shuffle array in place */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Generate a full valid Sudoku solution */
export function generateSolution() {
  const g = Array.from({ length: 9 }, () => Array(9).fill(0));
  const nums = shuffle([1,2,3,4,5,6,7,8,9]);
  // Fill diagonal boxes first (they don't interfere with each other)
  for (let box = 0; box < 3; box++) {
    const boxNums = shuffle([1,2,3,4,5,6,7,8,9]);
    let idx = 0;
    for (let r = box * 3; r < box * 3 + 3; r++)
      for (let c = box * 3; c < box * 3 + 3; c++)
        g[r][c] = boxNums[idx++];
  }
  _solve(g);
  return g;
}

// Cells to remove per difficulty
const REMOVE_MAP = {
  easy: 35,
  medium: 45,
  hard: 52,
  expert: 58,
};

/** Generate a puzzle with a unique solution */
export function generatePuzzle(difficulty = 'medium') {
  const solution = generateSolution();
  const puzzle = cloneGrid(solution);
  const remove = REMOVE_MAP[difficulty] || 45;

  const positions = shuffle([...Array(81).keys()]);
  let removed = 0;

  for (const pos of positions) {
    if (removed >= remove) break;
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    if (countSolutions(puzzle) !== 1) {
      puzzle[r][c] = backup; // restore if not unique
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

/** Validate entire user grid vs solution */
export function validateGrid(userGrid, solution) {
  const errors = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (userGrid[r][c] !== 0 && userGrid[r][c] !== solution[r][c])
        errors.push([r, c]);
  return errors;
}

/** Check if puzzle is complete */
export function isComplete(grid) {
  return grid.every(row => row.every(cell => cell !== 0));
}

/** Get a hint: first empty cell's answer from solution */
export function getHint(userGrid, solution, given) {
  // Find first error first
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!given[r][c] && userGrid[r][c] !== 0 && userGrid[r][c] !== solution[r][c])
        return { row: r, col: c, value: solution[r][c], type: 'fix' };

  // Then first empty cell
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!given[r][c] && userGrid[r][c] === 0)
        return { row: r, col: c, value: solution[r][c], type: 'fill' };

  return null;
}

/** Get cells in same row, col, box as (row, col) */
export function getPeers(row, col) {
  const peers = new Set();
  for (let i = 0; i < 9; i++) {
    peers.add(`${row},${i}`);
    peers.add(`${i},${col}`);
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      peers.add(`${r},${c}`);
  peers.delete(`${row},${col}`);
  return peers;
}

/** Count filled cells */
export function countFilled(grid) {
  return grid.reduce((a, row) => a + row.filter(c => c !== 0).length, 0);
}

/** Analyze difficulty of a puzzle */
export function analyzeDifficulty(puzzle) {
  const empty = 81 - countFilled(puzzle);
  if (empty <= 36) return 'easy';
  if (empty <= 46) return 'medium';
  if (empty <= 53) return 'hard';
  return 'expert';
}

export const SAMPLE_PUZZLES = {
  easy: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  medium: '800000000003600000070090200060005030004010700090200010200400009500080003000000061',  
  hard: '000000000290005070000004500060050030000270000040060010002900000010500049000000000',
};
