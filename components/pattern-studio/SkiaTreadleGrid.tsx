import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, PaintStyle, createPicture } from '@shopify/react-native-skia';
import { TREADLE_COUNT, DH, TREADLING_BG, GRID_BORDER } from './weaving-data';

type Props = {
  S: boolean[][];
  colorS: string[];
  sNum: number;
  cellHeight: number;
  rowIndices: number[];
};

/**
 * Draws the treadling grid on a single Skia Canvas.
 * Uses a recorded Picture for GPU-accelerated rendering.
 */
export const SkiaTreadleGrid = React.memo(function SkiaTreadleGrid({
  S,
  colorS,
  sNum,
  cellHeight,
  rowIndices,
}: Props) {
  const cellWidth = DH;
  const width = TREADLE_COUNT * cellWidth;
  const height = sNum * cellHeight;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();
        const borderColor = Skia.Color(GRID_BORDER);
        const bgColor = Skia.Color(TREADLING_BG);

        // ── Draw cell fills ──
        for (let screenRow = 0; screenRow < rowIndices.length; screenRow++) {
          const ri = rowIndices[screenRow];
          const sRow = S[ri];
          const y = screenRow * cellHeight;

          for (let col = 0; col < TREADLE_COUNT; col++) {
            const x = col * cellWidth;

            if (sRow[col]) {
              paint.setColor(Skia.Color(colorS[ri]));
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

        // Horizontal lines
        for (let row = 0; row <= rowIndices.length; row++) {
          const y = row * cellHeight;
          canvas.drawLine(0, y, width, y, paint);
        }

        // Vertical lines
        for (let col = 0; col <= TREADLE_COUNT; col++) {
          const x = col * cellWidth;
          canvas.drawLine(x, 0, x, height, paint);
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [S, colorS, rowIndices, cellHeight, width, height]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
