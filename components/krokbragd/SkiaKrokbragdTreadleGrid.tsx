import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, PaintStyle, createPicture } from '@shopify/react-native-skia';
import { KB_TREADLE_COUNT } from './krokbragd-data';
import { DH, TREADLING_BG, GRID_BORDER, ROW_HEIGHT } from '@/components/shared/weaving-data';
import { useSkiaResumeKey } from '@/hooks/use-skia-resume-key';

const CELL_HEIGHT = ROW_HEIGHT;
// Web: hshift=8.33 with dh=16.67 → ratio ≈ 0.5
const HSHIFT_RATIO = 8.33 / 16.67;
// Web: vshift=3.33 with dv=16.67 → ratio ≈ 0.2
const VSHIFT_RATIO = 3.33 / 16.67;

type Props = {
  S: boolean[][];
  colorCells: string[][];
  sNum: number;
  gridHeight: number;
  topOffset?: number;
  selectedRowIndex?: number;
};

/**
 * Krokbragd-specific treadle grid with staggered columns.
 * Each column l is offset by l*hshift horizontally and l*vshift vertically,
 * matching the web's diagonal stair-step layout.
 */
export const SkiaKrokbragdTreadleGrid = React.memo(function SkiaKrokbragdTreadleGrid({
  S,
  colorCells,
  sNum,
  gridHeight,
  topOffset = 0,
  selectedRowIndex = -1,
}: Props) {
  const resumeKey = useSkiaResumeKey();
  const cellHeight = CELL_HEIGHT;
  const cellWidth = DH;
  const hshift = HSHIFT_RATIO * cellWidth;
  const vshift = VSHIFT_RATIO * cellHeight;

  // Total width accounts for stagger: last column starts at (tr-1)*(cellWidth+hshift)
  const width = KB_TREADLE_COUNT * cellWidth + (KB_TREADLE_COUNT - 1) * hshift;
  const height = gridHeight + 2 * topOffset;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();
        const borderColor = Skia.Color(GRID_BORDER);
        const bgColor = Skia.Color(TREADLING_BG);

        // ── Draw cell fills per column (staggered) ──
        for (let col = 0; col < KB_TREADLE_COUNT; col++) {
          const colX = col * (cellWidth + hshift);
          const colVOffset = col * vshift;

          for (let n = 0; n < sNum; n++) {
            const y = topOffset + gridHeight - cellHeight * (n + 1) - colVOffset;

            if (S[n][col]) {
              paint.setColor(Skia.Color(colorCells[n][col]));
            } else {
              paint.setColor(bgColor);
            }

            canvas.drawRect(
              Skia.XYWHRect(colX, y, cellWidth, cellHeight),
              paint,
            );
          }
        }

        // ── Draw grid borders per column (staggered) ──
        paint.setColor(borderColor);
        paint.setStrokeWidth(0.5);
        paint.setStyle(PaintStyle.Stroke);

        for (let col = 0; col < KB_TREADLE_COUNT; col++) {
          const colX = col * (cellWidth + hshift);
          const colVOffset = col * vshift;

          // Horizontal lines for this column
          for (let n = 0; n <= sNum; n++) {
            const y = topOffset + gridHeight - cellHeight * n - colVOffset;
            canvas.drawLine(colX, y, colX + cellWidth, y, paint);
          }

          // Vertical lines (left and right edges of this column)
          const contentTop = topOffset + gridHeight - cellHeight * sNum - colVOffset;
          const contentBottom = topOffset + gridHeight - colVOffset;
          canvas.drawLine(colX, contentTop, colX, contentBottom, paint);
          canvas.drawLine(colX + cellWidth, contentTop, colX + cellWidth, contentBottom, paint);
        }

        // ── Selected row highlight (staggered per column) ──
        if (selectedRowIndex >= 0 && selectedRowIndex < sNum) {
          paint.setStyle(PaintStyle.Fill);
          for (let col = 0; col < KB_TREADLE_COUNT; col++) {
            const colX = col * (cellWidth + hshift);
            const colVOffset = col * vshift;
            const rowY = topOffset + gridHeight - cellHeight * (selectedRowIndex + 1) - colVOffset;

            paint.setColor(Skia.Color('rgba(255, 200, 0, 0.25)'));
            canvas.drawRect(Skia.XYWHRect(colX, rowY, cellWidth, cellHeight), paint);
            paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
            canvas.drawRect(Skia.XYWHRect(colX, rowY, cellWidth, 1), paint);
            canvas.drawRect(Skia.XYWHRect(colX, rowY + cellHeight - 1, cellWidth, 1), paint);
          }
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [S, colorCells, sNum, cellHeight, cellWidth, hshift, vshift, topOffset, gridHeight, selectedRowIndex, width, height]);

  return (
    <Canvas key={resumeKey} style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});

/** Exported so the screen can compute total treadle grid width */
export function getKrokbragdTreadleGridWidth() {
  const cellWidth = DH;
  const hshift = HSHIFT_RATIO * cellWidth;
  return KB_TREADLE_COUNT * cellWidth + (KB_TREADLE_COUNT - 1) * hshift;
}

/** Exported for touch hit-testing */
export function getKrokbragdTreadleHitTest(
  x: number,
  y: number,
  topOffset: number,
  gridHeight: number,
): { row: number; col: number } | null {
  const cellHeight = CELL_HEIGHT;
  const cellWidth = DH;
  const hshift = HSHIFT_RATIO * cellWidth;
  const vshift = VSHIFT_RATIO * cellHeight;

  // Check each column for a hit (right-to-left so topmost column wins)
  for (let col = KB_TREADLE_COUNT - 1; col >= 0; col--) {
    const colX = col * (cellWidth + hshift);
    const colVOffset = col * vshift;

    if (x >= colX && x < colX + cellWidth) {
      const row = Math.floor((topOffset + gridHeight - y - colVOffset) / cellHeight);
      if (row >= 0) {
        return { row, col };
      }
    }
  }
  return null;
}
