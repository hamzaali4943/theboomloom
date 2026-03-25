/**
 * All types related to saving and loading user designs.
 *
 * Three distinct snapshot shapes exist because each pattern tool
 * has a different state structure:
 *  - WeavingSnapshot  → Plain, Twill, Diamond  (share useWeavingState)
 *  - MonksBeltSnapshot → Monk's Belt
 *  - KrokbragdSnapshot → Krokbragd
 *
 * Only the user-authored data is saved (colors, activations, pattern matrix).
 * Device-specific values like cellHeight, cellWidth, gridHeight are NOT saved
 * — they are re-computed from screen dimensions on load.
 */

export type PatternType =
  | 'plain'
  | 'twill'
  | 'diamond'
  | 'monks-belt'
  | 'krokbragd';

// ── Snapshot for Plain / Twill / Diamond ─────────────────────────────────────
export interface WeavingSnapshot {
  currentPattern: 0 | 1 | 2;    // 0=Plain, 1=Twill, 2=Diamond
  colorWa: string[];             // warp thread colors  [WARP_COUNT]
  colorS: string[];              // weft thread colors  [MAX_WEFT]
  S: boolean[][];                // treadle activations [MAX_WEFT][TREADLE_COUNT]
  usedS: boolean[];              // row-in-use flags    [MAX_WEFT]
  pattern: number[][];           // weave matrix        [MAX_WEFT][WARP_COUNT]
  selectedColor: string;
}

// ── Snapshot for Monk's Belt ─────────────────────────────────────────────────
export interface MonksBeltSnapshot {
  colorWa: string[];
  colorS: string[];
  S: boolean[][];
  usedS: boolean[];
  pattern: number[][];
  selectedColor: string;
}

// ── Snapshot for Krokbragd ───────────────────────────────────────────────────
export interface KrokbragdSnapshot {
  S: boolean[][];                // treadle activations [MAX_WEFT][KB_TREADLE_COUNT]
  colorCells: string[][];        // per-cell colors     [MAX_WEFT][KB_TREADLE_COUNT]
  selectedColor: string;
  // colorWa is always the same default gray — no need to save
}

export type DesignSnapshot = WeavingSnapshot | MonksBeltSnapshot | KrokbragdSnapshot;

// ── A single saved design entry ──────────────────────────────────────────────
export interface SavedDesign {
  id: string;
  name: string;          // auto-generated, e.g. "Plain Weave #2"
  patternType: PatternType;
  savedAt: number;       // Unix timestamp in ms
  snapshot: DesignSnapshot;
}
