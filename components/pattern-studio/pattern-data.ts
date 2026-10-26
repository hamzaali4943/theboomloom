/**
 * Pattern-specific data for the plain, twill, diamond, waffle and rosepath
 * pattern picker.
 * Only used by pattern-studio components — not shared with other patterns.
 */

// ── Types ──────────────────────────────────────────────
export type PatternIndex = 0 | 1 | 2 | 3 | 4;

// ── Default Colors ─────────────────────────────────────
export const DEFAULT_WARP_COLOR = '#cccccc';
export const DEFAULT_WEFT_COLOR = '#2657ff';

// ── Pattern Metadata ───────────────────────────────────
export const PATTERN_META: { label: string; bg: string; fg: string }[] = [
  { label: 'PLAIN',     bg: '#FFFFF0', fg: '#000000' },
  { label: '2/2 TWILL', bg: '#761616', fg: '#ffffff' },
  { label: 'DIAMOND',   bg: '#9ba2dd', fg: '#000000' },
  // TODO: replace bg/fg with the client's brand colours for waffle
  { label: 'WAFFLE',    bg: '#d9a05b', fg: '#000000' },
  // TODO: replace bg/fg with the client's brand colours for rosepath
  { label: 'ROSEPATH',  bg: '#c9697f', fg: '#ffffff' },
];

// ── Pattern Encoding Arrays ────────────────────────────
// 5 patterns × 4 treadles × 38 values (excluding edge warps)
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

// Waffle: each treadle lifts one more warp thread than the last (1,2,3,4 per
// 6-warp repeat), so the weft floats shrink row by row into nested terraces.
// Extracted from the client's reference image; columns 0 and 39 are grey in
// all four rows, matching the selvedge convention applyPatternForRow relies on.
const WAFFLE: number[][] = [
  [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1],
];

// Rosepath: a balanced weave — every treadle lifts exactly 4 of each 8-warp
// repeat, but the lifted block walks sideways row by row, which is what makes
// the motif step across the cloth. Contrast with waffle, where the lift count
// itself increases (1,2,3,4) and the floats shrink instead.
// Extracted from the client's reference image; columns 0 and 39 are grey in
// all four rows, matching the selvedge convention applyPatternForRow relies on.
const ROSEPATH: number[][] = [
  [0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0],
  [0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1],
  [1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1],
  [1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0],
];

export const PATTERN_ROWS: number[][][] = [PLAIN, TWILL, DIAMOND, WAFFLE, ROSEPATH];
