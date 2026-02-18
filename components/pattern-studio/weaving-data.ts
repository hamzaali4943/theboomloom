/**
 * Weaving pattern data — constants, pattern encoding arrays, and types.
 * Ported from the BoomLoom HTML canvas weaving simulator.
 */

// ── Types ──────────────────────────────────────────────
export type PatternIndex = 0 | 1 | 2;

// ── Grid Constants ─────────────────────────────────────
export const WARP_COUNT = 40;        // number of vertical warp threads
export const MAX_WEFT = 100;         // max weft rows in state arrays
export const TREADLE_COUNT = 4;      // number of treadles (foot pedals)
export const LOOM_HEIGHT = 392;      // virtual loom height for sNum calc

// ── Default Colors ─────────────────────────────────────
export const DEFAULT_WARP_COLOR = '#cccccc';
export const DEFAULT_WEFT_COLOR = '#2657ff';
export const TREADLING_BG = '#C4E9F2';     // inactive treadle cell
export const GRID_BORDER = '#012B35';       // grid line color

// ── Pattern Metadata ───────────────────────────────────
export const PATTERN_META: { label: string; bg: string; fg: string }[] = [
  { label: 'PLAIN',     bg: '#FFFFF0', fg: '#000000' },
  { label: '2/2 TWILL', bg: '#761616', fg: '#ffffff' },
  { label: 'DIAMOND',   bg: '#9ba2dd', fg: '#000000' },
];

// ── Color Presets (for modal picker) ───────────────────
export const COLOR_PRESETS: string[] = [
  '#5170ff', '#FA42AB', '#00bf63',
  '#FDFF89', '#ffffff', '#000000',
  '#FF3B30', '#FF8C00', '#8B5CF6',
  '#0F434F', '#8B4513', '#808080',
];

// ── Pattern Encoding Arrays ────────────────────────────
// 3 patterns × 4 treadles × 38 values (excluding edge warps)
// 0 = weft on top, 1 = warp on top

const PLAIN: number[][] = [
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
];

const TWILL: number[][] = [
  [0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0],
  [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
];

const DIAMOND: number[][] = [
  [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0],
  [0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0,1],
  [1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0],
];

export const PATTERN_ROWS: number[][][] = [PLAIN, TWILL, DIAMOND];
