import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, createPicture } from '@shopify/react-native-skia';
import { KB_WARP_COUNT, KB_TREADLE_COUNT,KROKBRAGD_ROWS } from './krokbragd-data';
import { useSkiaResumeKey } from '@/hooks/use-skia-resume-key';


// Web default ratio: hw=6.67, dh=16.67 — warp thread is ~40% of cell width
const WEB_HW = 6.67;
const WEB_DH = 16.67;
// Web vshift=3.33 with dv=16.67 → ratio = 0.2
const VSHIFT_RATIO = 3.33 / 16.67;

type Props = {
  /** Per-cell treadle activation [row][treadle] */
  S: boolean[][];
  /** Per-cell treadle colors [row][treadle] */
  colorCells: string[][];
  /** Warp thread colors [KB_WARP_COUNT] */
  colorWa: string[];
  sNum: number;
  cellWidth: number;
  cellHeight: number;
  gridHeight: number;
  topOffset?: number;
  /** Extra pixels the warp threads extend upward into the spike area */
  topExtend?: number;
  selectedRowIndex?: number;
};

/**
 * Krokbragd-specific pattern grid.
 * Unlike the shared SkiaPatternGrid, this draws each active treadle's weft
 * at a vertical offset (vshift) per treadle, matching the web's layered rendering.
 */
export const SkiaKrokbragdGrid = React.memo(function SkiaKrokbragdGrid({
  S,
  colorCells,
  colorWa,
  sNum,
  cellWidth,
  cellHeight,
  gridHeight,
  topOffset = 0,
  topExtend = 0,
  selectedRowIndex = -1,
}: Props) {
  const resumeKey = useSkiaResumeKey();
  const width = KB_WARP_COUNT * cellWidth;
  const height = gridHeight + 2 * topOffset;

  const warpThreadWidth = Math.max(Math.round((WEB_HW / WEB_DH) * cellWidth), 1);
  const warpMargin = (cellWidth - warpThreadWidth) / 2;
  const vshift = VSHIFT_RATIO * cellHeight;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();

        // ── Draw warp threads (base layer) ──
        // Each thread spans from (topOffset - topExtend) down through the full content area
        const warpStartY = topOffset - topExtend;
        const warpTotalHeight = gridHeight + topExtend;
        for (let col = 0; col < KB_WARP_COUNT; col++) {
          paint.setColor(Skia.Color(colorWa[col]));
          canvas.drawRect(
            Skia.XYWHRect(
              col * cellWidth + warpMargin,
              warpStartY,
              warpThreadWidth,
              warpTotalHeight,
            ),
            paint,
          );
        }

        // ── Draw weft per active treadle (with vshift offset) ──
        // Matches web: for each row k, for each treadle l,
        // y = base - l * vshift. Later treadle overpaints earlier at overlapping cells.
        const weftWidth = cellWidth; // full cell width like web (dh)
        for (let k = 0; k < sNum; k++) {
          for (let l = 0; l < KB_TREADLE_COUNT; l++) {
            if (S[k][l]) {
              paint.setColor(Skia.Color(colorCells[k][l]));
              const encoding = KROKBRAGD_ROWS[l];
              const baseY = topOffset + gridHeight - cellHeight * (k + 1);
              const y = baseY - l * vshift;
              for (let n = 0; n < KB_WARP_COUNT; n++) {
                if (encoding[n] === 0) {
                  canvas.drawRect(
                    Skia.XYWHRect(n * cellWidth, y, weftWidth, cellHeight),
                    paint,
                  );
                }
              }
            }
          }
        }

        // ── Selected row ghost line highlight ──
        if (selectedRowIndex >= 0 && selectedRowIndex < sNum) {
          const rowY = topOffset + gridHeight - cellHeight * (selectedRowIndex + 1);
          paint.setColor(Skia.Color('rgba(255, 200, 0, 0.25)'));
          canvas.drawRect(Skia.XYWHRect(0, rowY, width, cellHeight), paint);
          paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
          canvas.drawRect(Skia.XYWHRect(0, rowY, width, 1), paint);
          canvas.drawRect(Skia.XYWHRect(0, rowY + cellHeight - 1, width, 1), paint);
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [
    S, colorCells, colorWa, sNum, cellWidth, cellHeight,
    warpMargin, warpThreadWidth, vshift,
    topOffset, topExtend, gridHeight, selectedRowIndex, width, height,
  ]);

  return (
    <Canvas key={resumeKey} style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
