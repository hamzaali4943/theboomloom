import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  LOOM_HEIGHT,
  MAX_WEFT,
  TREADLE_COUNT,
  WARP_COUNT,
} from '@/components/shared/weaving-data';
import {
  DEFAULT_WARP_COLOR,
  DEFAULT_WEFT_COLOR,
  PATTERN_ROWS,
  type PatternIndex,
} from './pattern-data';

// ── State Shape ────────────────────────────────────────
export interface WeavingState {
  currentPattern: PatternIndex;
  colorWa: string[];       // warp thread colors  [WARP_COUNT]
  colorS: string[];        // weft thread colors   [MAX_WEFT]
  S: boolean[][];          // treadling activations [MAX_WEFT][TREADLE_COUNT]
  usedS: boolean[];        // row-in-use flags     [MAX_WEFT]
  pattern: number[][];     // weave matrix          [MAX_WEFT][WARP_COUNT]
  selectedColor: string;
  cellHeight: number;      // fixed row height for grid layout
  cellWidth: number;       // fixed col width for grid layout
  selectedWarpIndex: number; // currently highlighted warp thread
  gridHeight: number;      // fixed pixel height of the grid area (scales with cellWidth)
}

// ── Actions ────────────────────────────────────────────
type Action =
  | { type: 'SELECT_PATTERN'; index: PatternIndex }
  | { type: 'COLOR_WARP'; column: number }
  | { type: 'RESET_WARP'; column: number }
  | { type: 'TOGGLE_TREADLE'; row: number; col: number }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_CELL_HEIGHT'; value: number }
  | { type: 'SET_CELL_WIDTH'; value: number }
  | { type: 'SET_GRID_HEIGHT'; value: number }
  | { type: 'MOVE_WARP_LEFT' }
  | { type: 'MOVE_WARP_RIGHT' }
  | { type: 'SET_SELECTED_WARP'; index: number }
  | { type: 'RESET' };

// ── Helpers ────────────────────────────────────────────
function createInitialState(): WeavingState {
  const colorWa = Array(WARP_COUNT).fill(DEFAULT_WARP_COLOR);
  const colorS = Array(MAX_WEFT).fill(DEFAULT_WEFT_COLOR);
  const S = Array.from({ length: MAX_WEFT }, () =>
    Array(TREADLE_COUNT).fill(false),
  );
  const usedS = Array(MAX_WEFT).fill(false);
  const pattern = Array.from({ length: MAX_WEFT }, () =>
    Array(WARP_COUNT).fill(1),
  );


  return {
    currentPattern: 0,
    colorWa,
    colorS,
    S,
    usedS,
    pattern,
    selectedColor: '#5170ff',
    cellHeight: 16,
    cellWidth: 16,
    selectedWarpIndex: -1,
    gridHeight: LOOM_HEIGHT, // default; overridden by the hook via SET_GRID_HEIGHT
  };
}

/** Apply pattern encoding for a single weft row based on active treadle. */
function applyPatternForRow(
  patternIdx: PatternIndex,
  treadleCol: number,
  row: number,
  pattern: number[][],
): number[][] {
  const newPattern = pattern.map((r, i) => (i === row ? [...r] : r));
  const encoding = PATTERN_ROWS[patternIdx][treadleCol];
  for (let l = 1; l < WARP_COUNT - 1; l++) {
    newPattern[row][l] = encoding[l - 1];
  }
  return newPattern;
}

/** Recalculate entire pattern matrix after pattern type change. */
function recalcAll(
  patternIdx: PatternIndex,
  S: boolean[][],
  oldPattern: number[][],
  sNum: number,
): number[][] {
  // Start from a fresh matrix
  const newPattern = Array.from({ length: MAX_WEFT }, () =>
    Array(WARP_COUNT).fill(1),
  );
  for (let n = 0; n < sNum; n++) {
    for (let k = 0; k < TREADLE_COUNT; k++) {
      if (S[n][k]) {
        const encoding = PATTERN_ROWS[patternIdx][k];
        for (let l = 1; l < WARP_COUNT - 1; l++) {
          newPattern[n][l] = encoding[l - 1];
        }
      }
    }
  }
  return newPattern;
}

// ── Reducer ────────────────────────────────────────────
function reducer(state: WeavingState, action: Action): WeavingState {
  switch (action.type) {
    case 'SELECT_PATTERN': {
      const sNum = Math.floor(state.gridHeight / state.cellHeight);
      const newPattern = recalcAll(action.index, state.S, state.pattern, sNum);
      return { ...state, currentPattern: action.index, pattern: newPattern };
    }

    case 'COLOR_WARP': {
      const newColorWa = [...state.colorWa];
      newColorWa[action.column] = state.selectedColor;
      return { ...state, colorWa: newColorWa };
    }

    case 'RESET_WARP': {
      const newColorWa = [...state.colorWa];
      newColorWa[action.column] = DEFAULT_WARP_COLOR;
      return { ...state, colorWa: newColorWa, selectedWarpIndex: -1 };
    }

    case 'TOGGLE_TREADLE': {
      const { row, col } = action;
      const wasActive = state.S[row][col];

      // Clone only the changed row
      const newS = state.S.map((r, i) => (i === row ? [...r] : r));
      const newUsedS = [...state.usedS];
      const newColorS = [...state.colorS];
      let newPattern: number[][];

      newColorS[row] = state.selectedColor;

      if (!wasActive) {
        // Activate this treadle, deactivate others in the same row
        newUsedS[row] = true;
        for (let k = 0; k < TREADLE_COUNT; k++) {
          newS[row][k] = k === col;
        }
        newPattern = applyPatternForRow(
          state.currentPattern,
          col,
          row,
          state.pattern,
        );
      } else {
        // Deactivate
        newS[row][col] = false;
        newUsedS[row] = false;
        // Reset pattern row to default (all warp showing)
        newPattern = state.pattern.map((r, i) =>
          i === row ? Array(WARP_COUNT).fill(1) : r,
        );
      }

      return {
        ...state,
        S: newS,
        usedS: newUsedS,
        colorS: newColorS,
        pattern: newPattern,
      };
    }

    case 'SET_COLOR':
      return { ...state, selectedColor: action.color };

    case 'SET_CELL_HEIGHT':
      return { ...state, cellHeight: action.value };

    case 'SET_CELL_WIDTH':
      return { ...state, cellWidth: action.value };

    case 'SET_GRID_HEIGHT':
      return { ...state, gridHeight: action.value };

    case 'MOVE_WARP_LEFT': {
      const idx = state.selectedWarpIndex < 0 ? 0 : (state.selectedWarpIndex - 1 + WARP_COUNT) % WARP_COUNT;
      return { ...state, selectedWarpIndex: idx };
    }

    case 'MOVE_WARP_RIGHT': {
      const idx = state.selectedWarpIndex < 0 ? 0 : (state.selectedWarpIndex + 1) % WARP_COUNT;
      return { ...state, selectedWarpIndex: idx };
    }

    case 'SET_SELECTED_WARP':
      return { ...state, selectedWarpIndex: action.index };

    case 'RESET':
      return { ...createInitialState(), selectedColor: state.selectedColor };

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────
/**
 * @param gridHeight – the pixel height of the grid area on the current device.
 *   Derived from cellWidth × PATTERN_ASPECT so mobile scales uniformly.
 *   Falls back to LOOM_HEIGHT (784) when omitted (web parity).
 */
export function useWeavingState(gridHeight?: number) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // Keep reducer in sync with the externally-computed gridHeight
  const effectiveHeight = gridHeight ?? LOOM_HEIGHT;
  useEffect(() => {
    if (state.gridHeight !== effectiveHeight) {
      dispatch({ type: 'SET_GRID_HEIGHT', value: effectiveHeight });
    }
  }, [effectiveHeight, state.gridHeight]);

  const sNum = useMemo(
    () => Math.floor(effectiveHeight / state.cellHeight),
    [effectiveHeight, state.cellHeight],
  );

  const treadlingSequence = useMemo(() => {
    const seq: number[] = [];
    for (let n = 0; n < sNum; n++) {
      for (let m = 0; m < TREADLE_COUNT; m++) {
        if (state.S[n][m]) {
          const display =
            state.currentPattern === 0 ? (m % 2) + 1 : m + 1;
          seq.push(display);
          break;
        }
      }
    }
    return seq;
  }, [state.S, sNum, state.currentPattern]);

  // Stable action creators
  const selectPattern = useCallback(
    (idx: PatternIndex) => dispatch({ type: 'SELECT_PATTERN', index: idx }),
    [],
  );
  const colorWarp = useCallback(
    (col: number) => dispatch({ type: 'COLOR_WARP', column: col }),
    [],
  );
  const resetWarp = useCallback(
    (col: number) => dispatch({ type: 'RESET_WARP', column: col }),
    [],
  );
  const toggleTreadle = useCallback(
    (row: number, col: number) =>
      dispatch({ type: 'TOGGLE_TREADLE', row, col }),
    [],
  );
  const setSelectedColor = useCallback(
    (c: string) => dispatch({ type: 'SET_COLOR', color: c }),
    [],
  );
  const setCellHeight = useCallback(
    (v: number) => dispatch({ type: 'SET_CELL_HEIGHT', value: v }),
    [],
  );
  const setCellWidth = useCallback(
    (v: number) => dispatch({ type: 'SET_CELL_WIDTH', value: v }),
    [],
  );
  const moveWarpLeft = useCallback(
    () => dispatch({ type: 'MOVE_WARP_LEFT' }),
    [],
  );
  const moveWarpRight = useCallback(
    () => dispatch({ type: 'MOVE_WARP_RIGHT' }),
    [],
  );
  const setSelectedWarp = useCallback(
    (idx: number) => dispatch({ type: 'SET_SELECTED_WARP', index: idx }),
    [],
  );
  const resetAll = useCallback(() => dispatch({ type: 'RESET' }), []);

  // ── Memoized data slices ──────────────────────────────
  // Each slice only creates a new object when its specific deps change,
  // so child components wrapped in React.memo skip re-renders when
  // unrelated state changes.

  const loomData = useMemo(() => ({
    currentPattern: state.currentPattern,
    colorWa: state.colorWa,
    colorS: state.colorS,
    S: state.S,
    pattern: state.pattern,
    sNum,
    cellWidth: state.cellWidth,
    cellHeight: state.cellHeight,
    selectedWarpIndex: state.selectedWarpIndex,
  }), [
    state.currentPattern, state.colorWa, state.colorS,
    state.S, state.pattern, sNum,
    state.cellWidth, state.cellHeight,
    state.selectedWarpIndex,
  ]);

  const navigatorData = useMemo(() => ({
    selectedWarpIndex: state.selectedWarpIndex,
    selectedColor: state.selectedColor,
  }), [state.selectedWarpIndex, state.selectedColor]);

  return {
    // Individual values needed by PatternStudioScreen's own render
    currentPattern: state.currentPattern,
    selectedColor: state.selectedColor,
    // Memoized data slices for child components
    loomData,
    navigatorData,
    treadlingSequence,
    // Stable action creators
    selectPattern,
    colorWarp,
    resetWarp,
    toggleTreadle,
    setSelectedColor,
    setCellHeight,
    setCellWidth,
    moveWarpLeft,
    moveWarpRight,
    setSelectedWarp,
    resetAll,
  };
}
