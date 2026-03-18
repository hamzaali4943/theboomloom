import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  KB_WARP_COUNT,
  KB_TREADLE_COUNT,
  MAX_WEFT,
  KB_DEFAULT_WARP_COLOR,
  KB_DEFAULT_WEFT_COLOR,
  KB_DEFAULT_SELECTED_COLOR,
} from './krokbragd-data';
import { LOOM_HEIGHT } from '@/components/shared/weaving-data';

// ── State Shape ────────────────────────────────────────
export interface KrokbragdState {
  colorWa: string[];       // warp thread colors  [KB_WARP_COUNT] (all same gray)
  S: boolean[][];          // treadling activations [MAX_WEFT][KB_TREADLE_COUNT]
  colorCells: string[][];  // per-cell treadle colors [MAX_WEFT][KB_TREADLE_COUNT]
  selectedColor: string;
  cellHeight: number;
  gridHeight: number;
}

// ── Actions ────────────────────────────────────────────
type Action =
  | { type: 'TOGGLE_TREADLE'; row: number; col: number }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'SET_GRID_HEIGHT'; value: number }
  | { type: 'RESET' };

// ── Helpers ────────────────────────────────────────────
function createInitialState(): KrokbragdState {
  return {
    colorWa: Array(KB_WARP_COUNT).fill(KB_DEFAULT_WARP_COLOR),
    S: Array.from({ length: MAX_WEFT }, () => Array(KB_TREADLE_COUNT).fill(false)),
    colorCells: Array.from({ length: MAX_WEFT }, () =>
      Array(KB_TREADLE_COUNT).fill(KB_DEFAULT_WEFT_COLOR),
    ),
    selectedColor: KB_DEFAULT_SELECTED_COLOR,
    cellHeight: 16,
    gridHeight: LOOM_HEIGHT,
  };
}

// ── Reducer ────────────────────────────────────────────
function reducer(state: KrokbragdState, action: Action): KrokbragdState {
  switch (action.type) {
    case 'TOGGLE_TREADLE': {
      const { row, col } = action;
      const wasActive = state.S[row][col];

      const newS = state.S.map((r, i) => (i === row ? [...r] : r));
      const newColorCells = state.colorCells.map((r, i) => (i === row ? [...r] : r));

      if (wasActive) {
        newS[row][col] = false;
        newColorCells[row][col] = KB_DEFAULT_WEFT_COLOR;
      } else {
        newS[row][col] = true;
        newColorCells[row][col] = state.selectedColor;
      }

      return { ...state, S: newS, colorCells: newColorCells };
    }

    case 'SET_COLOR':
      return { ...state, selectedColor: action.color };

    case 'SET_GRID_HEIGHT':
      return { ...state, gridHeight: action.value };

    case 'RESET':
      return { ...createInitialState(), selectedColor: state.selectedColor };

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────
export function useKrokbragdState(gridHeight?: number) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

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

  // Color sequence — groups of active treadle numbers per row, from bottom up
  const colorSequence = useMemo(() => {
    const seq: { treadle: number; color: string }[][] = [];
    for (let n = 0; n < sNum; n++) {
      const group: { treadle: number; color: string }[] = [];
      for (let t = 0; t < KB_TREADLE_COUNT; t++) {
        if (state.S[n][t]) {
          group.push({ treadle: t + 1, color: state.colorCells[n][t] });
        }
      }
      if (group.length > 0) {
        seq.push(group);
      }
    }
    return seq;
  }, [state.S, state.colorCells, sNum]);

  // Stable action creators
  const toggleTreadle = useCallback(
    (row: number, col: number) => dispatch({ type: 'TOGGLE_TREADLE', row, col }),
    [],
  );
  const setSelectedColor = useCallback(
    (c: string) => dispatch({ type: 'SET_COLOR', color: c }),
    [],
  );
  const resetAll = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    selectedColor: state.selectedColor,
    colorWa: state.colorWa,
    S: state.S,
    colorCells: state.colorCells,
    sNum,
    cellHeight: state.cellHeight,
    colorSequence,
    toggleTreadle,
    setSelectedColor,
    resetAll,
  };
}
