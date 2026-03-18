/**
 * Monk's Belt weaving pattern data.
 * Ported from the Monk's Belt HTML canvas pattern picker.
 *
 * Shares grid constants with pattern-studio (WARP_COUNT, TREADLE_COUNT, DH, etc.)
 * but has its own fixed pattern encoding rows.
 */

// Re-export shared constants so screens can import from one place
export {
  WARP_COUNT,
  MAX_WEFT,
  TREADLE_COUNT,
  DH,
  PATTERN_ASPECT,
  COLOR_PRESETS,
} from '@/components/shared/weaving-data';

// ── Monk's Belt Defaults ──────────────────────────────
export const MB_DEFAULT_WARP_COLOR = '#cccccc';
export const MB_DEFAULT_WEFT_COLOR = '#cccccc';
export const MB_DEFAULT_SELECTED_COLOR = '#802215';

// ── Monk's Belt Pattern Encoding ──────────────────────
// 4 treadles × 38 values (excluding the 2 edge warps)
// 0 = weft on top, 1 = warp on top
export const MONKS_BELT_ROWS: number[][] = [
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1],
];
