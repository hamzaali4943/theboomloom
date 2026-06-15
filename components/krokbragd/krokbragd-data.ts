/**
 * Krokbragd weaving pattern data.
 * Ported from the Krokbragd HTML canvas pattern picker.
 *
 * Key differences from other patterns:
 * - 38 warp threads (not 40)
 * - 3 treadles (not 4)
 * - Multiple treadles can be active per row
 * - Per-cell colors (each treadle cell has its own color)
 * - No warp coloring — single gray warp color
 */

// Re-export shared constants that are the same
export {
  MAX_WEFT,
  DH,
  PATTERN_ASPECT,
  COLOR_PRESETS,
} from '@/components/shared/weaving-data';

// ── Krokbragd-specific constants ─────────────────────
export const KB_WARP_COUNT = 30;
export const KB_TREADLE_COUNT = 3;
export const KB_WEAVE_LENGTH = 48; // fixed number of rows

// ── Default Colors ───────────────────────────────────
export const KB_DEFAULT_WARP_COLOR = '#cccccc';
export const KB_DEFAULT_WEFT_COLOR = '#cccccc';
export const KB_DEFAULT_SELECTED_COLOR = '#708df4';

// ── Pattern Encoding Arrays ──────────────────────────
// 3 treadles × 38 values (all warp columns, no edge skipping)
// 0 = weft on top, 1 = warp on top
export const KROKBRAGD_ROWS: number[][] = [
        [
          0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
          1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
        ],
        [
          1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
          0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
        ],
        [
          1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0,
          1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
        ],
      ];