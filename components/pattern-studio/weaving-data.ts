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
export const DH = 11.5;              // horizontal grid square size — matches web's dh

// ── Web Canvas Reference Dimensions ───────────────────
// Web canvas: 950 × 1066, patternStart = 140, weftTop = 240, weftBottom = 42
// Pattern area: waNum*dh = 660 wide, warpLength = canH−weftTop−weftBottom = 784 tall
// Aspect ratio of the pattern area: 784 / 660 ≈ 1.18788
export const WEB_PATTERN_WIDTH = WARP_COUNT * DH;          // 660
export const WEB_WARP_LENGTH = 784;                         // warpLength on web
export const PATTERN_ASPECT = WEB_WARP_LENGTH / WEB_PATTERN_WIDTH; // ≈1.18788

// Kept for backward compat — prefer computing grid height from cellWidth at runtime
export const LOOM_HEIGHT = 784;

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

// ── Color Palette (matches web version — 6 colors in 3×2 grid) ────────────
export const COLOR_PRESETS: string[] = [
  '#802215', // red
  '#FA42AB', // pink
  '#00bf63', // green
  '#FDFF89', // yellow
  '#ffffff', // white
  '#000000', // black
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
