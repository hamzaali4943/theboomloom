import { useCallback, useMemo, useReducer } from 'react';
import {
  WARP_COUNT,
  MAX_WEFT,
  TREADLE_COUNT,
  LOOM_HEIGHT,
  DEFAULT_WARP_COLOR,
  DEFAULT_WEFT_COLOR,
  PATTERN_ROWS,
  type PatternIndex,
} from './weaving-data';

// ── State Shape ────────────────────────────────────────
export interface WeavingState {
  currentPattern: PatternIndex;
  colorWa: string[];       // warp thread colors  [WARP_COUNT]
  colorS: string[];        // weft thread colors   [MAX_WEFT]
  S: boolean[][];          // treadling activations [MAX_WEFT][TREADLE_COUNT]
  usedS: boolean[];        // row-in-use flags     [MAX_WEFT]
  pattern: number[][];     // weave matrix          [MAX_WEFT][WARP_COUNT]
  selectedColor: string;
  cellHeight: number;      // row height (weft slider)
  cellWidth: number;       // col width  (warp slider)
}

// ── Actions ────────────────────────────────────────────
type Action =
  | { type: 'SELECT_PATTERN'; index: PatternIndex }
  | { type: 'COLOR_WARP'; column: number }
  | { type: 'TOGGLE_TREADLE'; row: number; col: number }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_CELL_HEIGHT'; value: number }
  | { type: 'SET_CELL_WIDTH'; value: number }
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
    cellHeight: 8,
    cellWidth: 8,
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
      const sNum = Math.floor(LOOM_HEIGHT / state.cellHeight);
      const newPattern = recalcAll(action.index, state.S, state.pattern, sNum);
      return { ...state, currentPattern: action.index, pattern: newPattern };
    }

    case 'COLOR_WARP': {
      const newColorWa = [...state.colorWa];
      newColorWa[action.column] = state.selectedColor;
      return { ...state, colorWa: newColorWa };
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

    case 'RESET':
      return { ...createInitialState(), selectedColor: state.selectedColor };

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────
export function useWeavingState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const sNum = useMemo(
    () => Math.floor(LOOM_HEIGHT / state.cellHeight),
    [state.cellHeight],
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
  const resetAll = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    ...state,
    sNum,
    treadlingSequence,
    selectPattern,
    colorWarp,
    toggleTreadle,
    setSelectedColor,
    setCellHeight,
    setCellWidth,
    resetAll,
  };
}
