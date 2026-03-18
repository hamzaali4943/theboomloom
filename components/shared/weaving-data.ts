/**
 * Shared weaving constants used across all pattern types.
 * Pattern-specific data (encoding arrays, metadata) lives in each pattern's own folder.
 */

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
export const WEB_WARP_LENGTH = 740;                         // warpLength on web
export const PATTERN_ASPECT = WEB_WARP_LENGTH / WEB_PATTERN_WIDTH; // ≈1.18788

// Kept for backward compat — prefer computing grid height from cellWidth at runtime
export const LOOM_HEIGHT = 784;

// ── Shared Colors ─────────────────────────────────────
export const TREADLING_BG = '#C4E9F2';     // inactive treadle cell
export const GRID_BORDER = '#012B35';       // grid line color

// ── Color Palette (matches web version — 6 colors in 3×2 grid) ────────────
export const COLOR_PRESETS: string[] = [
  '#802215', // red
  '#FA42AB', // pink
  '#00bf63', // green
  '#FDFF89', // yellow
  '#ffffff', // white
  '#000000', // black
];
