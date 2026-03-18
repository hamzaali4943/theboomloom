import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, PaintStyle, createPicture } from '@shopify/react-native-skia';
import { TREADLE_COUNT, DH, TREADLING_BG, GRID_BORDER } from './weaving-data';
import { useSkiaResumeKey } from '@/hooks/use-skia-resume-key';

const CELL_HEIGHT = 16;

type Props = {
  S: boolean[][];
  colorS: string[];
  sNum: number;
  /** Content area height — used for bottom-up y calculations */
  gridHeight: number;
  /** Pixels of empty canvas above (and below) the content; canvas height = gridHeight + 2*topOffset */
  topOffset?: number;
  /** Row index to highlight (-1 = none) — mirrors the pattern grid selection */
  selectedRowIndex?: number;
};

/**
 * Draws the treadling grid on a single Skia Canvas.
 * Canvas height = gridHeight + 2*topOffset so LoomFrame spikes show through
 * the transparent top/bottom bands while content sits in the middle.
 */
export const SkiaTreadleGrid = React.memo(function SkiaTreadleGrid({
  S,
  colorS,
  sNum,
  gridHeight,
  topOffset = 0,
  selectedRowIndex = -1,
}: Props) {
  const resumeKey = useSkiaResumeKey();
  const cellHeight = CELL_HEIGHT;
  const cellWidth = DH;
  const width = TREADLE_COUNT * cellWidth;
  const height = gridHeight + 2 * topOffset;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();
        const borderColor = Skia.Color(GRID_BORDER);
        const bgColor = Skia.Color(TREADLING_BG);

        // Draw from bottom up, matching web: y = height - cellHeight * (n + 1)
        // Row index n=0 is the bottom-most row.

        // Content draws from bottom up inside the content band [topOffset, topOffset+gridHeight]
        // ── Draw cell fills ──
        for (let n = 0; n < sNum; n++) {
          const sRow = S[n];
          const y = topOffset + gridHeight - cellHeight * (n + 1);

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
          const y = topOffset + gridHeight - cellHeight * n;
          canvas.drawLine(0, y, width, y, paint);
        }

        // Vertical lines (full height of content area)
        const contentTop = topOffset + gridHeight - cellHeight * sNum;
        for (let col = 0; col <= TREADLE_COUNT; col++) {
          const x = col * cellWidth;
          canvas.drawLine(x, contentTop, x, topOffset + gridHeight, paint);
        }

        // ── Selected row highlight (mirrors pattern grid selection) ──
        if (selectedRowIndex >= 0 && selectedRowIndex < sNum) {
          const rowY = topOffset + gridHeight - cellHeight * (selectedRowIndex + 1);
          paint.setStyle(PaintStyle.Fill);
          paint.setColor(Skia.Color('rgba(255, 200, 0, 0.25)'));
          canvas.drawRect(Skia.XYWHRect(0, rowY, width, cellHeight), paint);
          paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
          canvas.drawRect(Skia.XYWHRect(0, rowY, width, 1), paint);
          canvas.drawRect(Skia.XYWHRect(0, rowY + cellHeight - 1, width, 1), paint);
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [S, colorS, sNum, cellHeight, cellWidth, topOffset, gridHeight, selectedRowIndex, width, height]);

  return (
    <Canvas key={resumeKey} style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
