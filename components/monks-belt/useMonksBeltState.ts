import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  WARP_COUNT,
  MAX_WEFT,
  TREADLE_COUNT,
  MB_DEFAULT_WARP_COLOR,
  MB_DEFAULT_WEFT_COLOR,
  MB_DEFAULT_SELECTED_COLOR,
  MONKS_BELT_ROWS,
} from './monks-belt-data';
import { LOOM_HEIGHT, ROW_HEIGHT } from '@/components/shared/weaving-data';
import type { MonksBeltSnapshot } from '@/types/saved-design';

// ── State Shape ────────────────────────────────────────
export interface MonksBeltState {
  colorWa: string[];       // warp thread colors  [WARP_COUNT]
  colorS: string[];        // weft thread colors   [MAX_WEFT]
  S: boolean[][];          // treadling activations [MAX_WEFT][TREADLE_COUNT]
  usedS: boolean[];        // row-in-use flags     [MAX_WEFT]
  pattern: number[][];     // weave matrix          [MAX_WEFT][WARP_COUNT]
  selectedColor: string;
  cellHeight: number;
  cellWidth: number;
  selectedWarpIndex: number;
  gridHeight: number;
}

// ── Actions ────────────────────────────────────────────
type Action =
  | { type: 'COLOR_WARP'; column: number }
  | { type: 'RESET_WARP'; column: number }
  | { type: 'TOGGLE_TREADLE'; row: number; col: number }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_GRID_HEIGHT'; value: number }
  | { type: 'SET_SELECTED_WARP'; index: number }
  | { type: 'LOAD_DESIGN'; snapshot: MonksBeltSnapshot }
  | { type: 'RESET' };

// ── Helpers ────────────────────────────────────────────
function createInitialState(): MonksBeltState {
  return {
    colorWa: Array(WARP_COUNT).fill(MB_DEFAULT_WARP_COLOR),
    colorS: Array(MAX_WEFT).fill(MB_DEFAULT_WEFT_COLOR),
    S: Array.from({ length: MAX_WEFT }, () => Array(TREADLE_COUNT).fill(false)),
    usedS: Array(MAX_WEFT).fill(false),
    pattern: Array.from({ length: MAX_WEFT }, () => Array(WARP_COUNT).fill(1)),
    selectedColor: MB_DEFAULT_SELECTED_COLOR,
    cellHeight: ROW_HEIGHT,
    cellWidth: 16,
    selectedWarpIndex: -1,
    gridHeight: LOOM_HEIGHT,
  };
}

function applyPatternForRow(
  treadleCol: number,
  row: number,
  pattern: number[][],
): number[][] {
  const newPattern = pattern.map((r, i) => (i === row ? [...r] : r));
  const encoding = MONKS_BELT_ROWS[treadleCol];
  for (let l = 1; l < WARP_COUNT - 1; l++) {
    newPattern[row][l] = encoding[l - 1];
  }
  return newPattern;
}

// ── Reducer ────────────────────────────────────────────
function reducer(state: MonksBeltState, action: Action): MonksBeltState {
  switch (action.type) {
    case 'COLOR_WARP': {
      const newColorWa = [...state.colorWa];
      newColorWa[action.column] = state.selectedColor;
      return { ...state, colorWa: newColorWa };
    }

    case 'RESET_WARP': {
      const newColorWa = [...state.colorWa];
      newColorWa[action.column] = MB_DEFAULT_WARP_COLOR;
      return { ...state, colorWa: newColorWa, selectedWarpIndex: -1 };
    }

    case 'TOGGLE_TREADLE': {
      const { row, col } = action;
      const wasActive = state.S[row][col];

      const newS = state.S.map((r, i) => (i === row ? [...r] : r));
      const newUsedS = [...state.usedS];
      const newColorS = [...state.colorS];
      let newPattern: number[][];

      newColorS[row] = state.selectedColor;

      if (!wasActive) {
        newUsedS[row] = true;
        for (let k = 0; k < TREADLE_COUNT; k++) {
          newS[row][k] = k === col;
        }
        newPattern = applyPatternForRow(col, row, state.pattern);
      } else {
        newS[row][col] = false;
        newUsedS[row] = false;
        newPattern = state.pattern.map((r, i) =>
          i === row ? Array(WARP_COUNT).fill(1) : r,
        );
      }

      return { ...state, S: newS, usedS: newUsedS, colorS: newColorS, pattern: newPattern };
    }

    case 'SET_COLOR':
      return { ...state, selectedColor: action.color };

    case 'SET_GRID_HEIGHT':
      return { ...state, gridHeight: action.value };

    case 'SET_SELECTED_WARP':
      return { ...state, selectedWarpIndex: action.index };

    // Restore a saved design — device-computed fields are preserved
    case 'LOAD_DESIGN':
      return {
        ...state,
        colorWa: action.snapshot.colorWa,
        colorS: action.snapshot.colorS,
        S: action.snapshot.S,
        usedS: action.snapshot.usedS,
        pattern: action.snapshot.pattern,
        selectedColor: action.snapshot.selectedColor,
      };

    case 'RESET':
      return { ...createInitialState(), selectedColor: state.selectedColor };

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────
export function useMonksBeltState(gridHeight?: number) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const stateRef = useRef(state);
  stateRef.current = state;

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
          seq.push(m + 1);
          break;
        }
      }
    }
    return seq;
  }, [state.S, sNum]);

  const colorWarp = useCallback(
    (col: number) => dispatch({ type: 'COLOR_WARP', column: col }),
    [],
  );
  const resetWarp = useCallback(
    (col: number) => dispatch({ type: 'RESET_WARP', column: col }),
    [],
  );
  const toggleTreadle = useCallback(
    (row: number, col: number) => dispatch({ type: 'TOGGLE_TREADLE', row, col }),
    [],
  );
  const setSelectedColor = useCallback(
    (c: string) => dispatch({ type: 'SET_COLOR', color: c }),
    [],
  );
  const setSelectedWarp = useCallback(
    (idx: number) => dispatch({ type: 'SET_SELECTED_WARP', index: idx }),
    [],
  );
  const resetAll = useCallback(() => dispatch({ type: 'RESET' }), []);

  const loadDesign = useCallback(
    (snapshot: MonksBeltSnapshot) =>
      dispatch({ type: 'LOAD_DESIGN', snapshot }),
    [],
  );

  const getSnapshot = useCallback((): MonksBeltSnapshot => {
    const s = stateRef.current;
    return {
      colorWa: s.colorWa,
      colorS: s.colorS,
      S: s.S,
      usedS: s.usedS,
      pattern: s.pattern,
      selectedColor: s.selectedColor,
    };
  }, []);

  const loomData = useMemo(() => ({
    currentPattern: 1 as 0 | 1 | 2,
    colorWa: state.colorWa,
    colorS: state.colorS,
    S: state.S,
    pattern: state.pattern,
    sNum,
    cellWidth: state.cellWidth,
    cellHeight: state.cellHeight,
    selectedWarpIndex: state.selectedWarpIndex,
  }), [
    state.colorWa, state.colorS, state.S, state.pattern,
    sNum, state.cellWidth, state.cellHeight, state.selectedWarpIndex,
  ]);

  return {
    selectedColor: state.selectedColor,
    loomData,
    treadlingSequence,
    colorWarp,
    resetWarp,
    toggleTreadle,
    setSelectedColor,
    setSelectedWarp,
    resetAll,
    loadDesign,
    getSnapshot,
  };
}
