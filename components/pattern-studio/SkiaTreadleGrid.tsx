import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, PaintStyle, createPicture } from '@shopify/react-native-skia';
import { TREADLE_COUNT, DH, TREADLING_BG, GRID_BORDER } from './weaving-data';

const CELL_HEIGHT = 16;

type Props = {
  S: boolean[][];
  colorS: string[];
  sNum: number;
  /** Fixed canvas height — canvas never resizes, content draws from bottom up */
  gridHeight: number;
};

/**
 * Draws the treadling grid on a single Skia Canvas.
 * Uses a fixed-size canvas (like the web) so the element never resizes.
 * Content is drawn from the bottom up, matching web's drawS logic.
 */
export const SkiaTreadleGrid = React.memo(function SkiaTreadleGrid({
  S,
  colorS,
  sNum,
  gridHeight,
}: Props) {
  const cellHeight = CELL_HEIGHT;
  const cellWidth = DH;
  const width = TREADLE_COUNT * cellWidth;
  // Canvas height is fixed — never changes with cellHeight
  const height = gridHeight;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();
        const borderColor = Skia.Color(GRID_BORDER);
        const bgColor = Skia.Color(TREADLING_BG);

        // Draw from bottom up, matching web: y = height - cellHeight * (n + 1)
        // Row index n=0 is the bottom-most row.

        // ── Draw cell fills ──
        for (let n = 0; n < sNum; n++) {
          const sRow = S[n];
          const y = height - cellHeight * (n + 1);

          for (let col = 0; col < TREADLE_COUNT; col++) {
            const x = col * cellWidth;

            if (sRow[col]) {
              paint.setColor(Skia.Color(colorS[n]));
            } else {
              paint.setColor(bgColor);
            }

            canvas.drawRect(
              Skia.XYWHRect(x, y, cellWidth, cellHeight),
              paint,
            );
          }
        }

        // ── Draw grid borders ──
        paint.setColor(borderColor);
        paint.setStrokeWidth(0.5);
        paint.setStyle(PaintStyle.Stroke);

        // Horizontal lines (only for the rows that have content)
        for (let n = 0; n <= sNum; n++) {
          const y = height - cellHeight * n;
          canvas.drawLine(0, y, width, y, paint);
        }

        // Vertical lines (full height of content area)
        const contentTop = height - cellHeight * sNum;
        for (let col = 0; col <= TREADLE_COUNT; col++) {
          const x = col * cellWidth;
          canvas.drawLine(x, contentTop, x, height, paint);
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [S, colorS, sNum, cellHeight, cellWidth, width, height]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
