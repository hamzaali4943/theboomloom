import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, createPicture } from '@shopify/react-native-skia';
import { WARP_COUNT } from './weaving-data';

// Web default ratio: hw=5, dh=16.5 — warp thread is ~30% of cell width
const WEB_HW = 7;
const WEB_DH = 16.5;

type Props = {
  pattern: number[][];
  colorWa: string[];
  colorS: string[];
  sNum: number;
  cellWidth: number;
  cellHeight: number;
  /** Content area height — used for bottom-up y calculations */
  gridHeight: number;
  /** Pixels of empty canvas above (and below) the content; canvas height = gridHeight + 2*topOffset */
  topOffset?: number;
  /** Row index to highlight with a ghost line (-1 = none) */
  selectedRowIndex?: number;
};

/**
 * Draws the weave pattern grid on a single Skia Canvas.
 * Canvas height = gridHeight + 2*topOffset so LoomFrame spikes show through
 * the transparent top/bottom bands while content sits in the middle.
 */
export const SkiaPatternGrid = React.memo(function SkiaPatternGrid({
  pattern,
  colorWa,
  colorS,
  sNum,
  cellWidth,
  cellHeight,
  gridHeight,
  topOffset = 0,
  selectedRowIndex = -1,
}: Props) {
  const width = WARP_COUNT * cellWidth;
  // Canvas is taller than the content area so top/bottom bands stay transparent
  const height = gridHeight + 2 * topOffset;

  // Standard warp width: web default ratio hw=5/dh=16.5 scaled to current cellWidth
  const warpThreadWidth = Math.max(Math.round((WEB_HW / WEB_DH) * cellWidth), 1);
  const weftThreadHeight = cellHeight;
  const warpMargin = (cellWidth - warpThreadWidth) / 2;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();

        // Draw from bottom up, matching web: y = height - cellHeight * (n + 1)
        // Row index n=0 is the bottom-most row.

        // Content draws from bottom up; row n bottom-edge = topOffset + gridHeight - n*cellHeight
        // ── Draw warp threads (base layer) ──
        for (let n = 0; n < sNum; n++) {
          const y = topOffset + gridHeight - cellHeight * (n + 1);

          for (let col = 0; col < WARP_COUNT; col++) {
            paint.setColor(Skia.Color(colorWa[col]));
            canvas.drawRect(
              Skia.XYWHRect(
                col * cellWidth + warpMargin,
                y,
                warpThreadWidth,
                cellHeight,
              ),
              paint,
            );
          }
        }

        // ── Draw weft threads (on top where pattern === 0) ──
        for (let n = 0; n < sNum; n++) {
          const patternRow = pattern[n];
          const y = topOffset + gridHeight - cellHeight * (n + 1);

          paint.setColor(Skia.Color(colorS[n]));

          const weftWidth = 2 * cellWidth - warpThreadWidth;
          for (let col = 0; col < WARP_COUNT; col++) {
            if (patternRow[col] === 0) {
              canvas.drawRect(
                Skia.XYWHRect(
                  col * cellWidth - warpMargin,
                  y,
                  weftWidth,
                  weftThreadHeight,
                ),
                paint,
              );
            }
          }
        }

        // ── Selected row ghost line highlight ──
        if (selectedRowIndex >= 0 && selectedRowIndex < sNum) {
          const rowY = topOffset + gridHeight - cellHeight * (selectedRowIndex + 1);

          paint.setColor(Skia.Color('rgba(255, 200, 0, 0.25)'));
          canvas.drawRect(
            Skia.XYWHRect(0, rowY, width, cellHeight),
            paint,
          );

          paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
          canvas.drawRect(Skia.XYWHRect(0, rowY, width, 1), paint);
          canvas.drawRect(Skia.XYWHRect(0, rowY + cellHeight - 1, width, 1), paint);
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [
    pattern, colorWa, colorS, sNum, cellWidth, cellHeight,
    warpMargin, warpThreadWidth, weftThreadHeight,
    topOffset, gridHeight,
    selectedRowIndex, width, height,
  ]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
