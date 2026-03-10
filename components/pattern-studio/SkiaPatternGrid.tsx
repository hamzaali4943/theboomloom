import React, { useMemo } from 'react';
import { Canvas, Picture, Skia, createPicture } from '@shopify/react-native-skia';
import { WARP_COUNT } from './weaving-data';

type Props = {
  pattern: number[][];
  colorWa: string[];
  colorS: string[];
  sNum: number;
  cellWidth: number;
  cellHeight: number;
  /** Fixed canvas height — canvas never resizes, content draws from bottom up */
  gridHeight: number;
  warpThreadWidth: number;
  weftThreadHeight: number;
  selectedWarpIndex: number;
  /** Row index to highlight with a ghost line (-1 = none) */
  selectedRowIndex?: number;
};

/**
 * Draws the weave pattern grid on a single Skia Canvas.
 * Uses a fixed-size canvas (like the web) so the element never resizes.
 * Content is drawn from the bottom up, matching web's drawPattern logic.
 */
export const SkiaPatternGrid = React.memo(function SkiaPatternGrid({
  pattern,
  colorWa,
  colorS,
  sNum,
  cellWidth,
  cellHeight,
  gridHeight,
  warpThreadWidth: rawWarpWidth,
  weftThreadHeight: _weftThreadHeight,
  selectedWarpIndex,
  selectedRowIndex = -1,
}: Props) {
  const width = WARP_COUNT * cellWidth;
  // Canvas height is fixed — never changes with cellHeight
  const height = gridHeight;

  // Scale warp slider value proportionally to cellWidth.
  const WEB_DH = 16.5;
  const warpThreadWidth = Math.max(Math.round((rawWarpWidth / WEB_DH) * cellWidth), 1);
  const weftThreadHeight = cellHeight;
  const warpMargin = (cellWidth - warpThreadWidth) / 2;

  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();

        // Draw from bottom up, matching web: y = height - cellHeight * (n + 1)
        // Row index n=0 is the bottom-most row.

        // ── Draw warp threads (base layer) ──
        for (let n = 0; n < sNum; n++) {
          const y = height - cellHeight * (n + 1);

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
          const y = height - cellHeight * (n + 1);

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

        // ── Selected warp highlight overlay ──
        if (selectedWarpIndex >= 0) {
          const highlightX = selectedWarpIndex * cellWidth;

          paint.setColor(Skia.Color('rgba(255, 200, 0, 0.35)'));
          canvas.drawRect(
            Skia.XYWHRect(highlightX, 0, cellWidth, height),
            paint,
          );

          paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
          canvas.drawRect(
            Skia.XYWHRect(highlightX, 0, 1, height),
            paint,
          );

          canvas.drawRect(
            Skia.XYWHRect(highlightX + cellWidth - 1, 0, 1, height),
            paint,
          );
        }

        // ── Selected row ghost line highlight ──
        if (selectedRowIndex >= 0 && selectedRowIndex < sNum) {
          const rowY = height - cellHeight * (selectedRowIndex + 1);

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
    warpMargin, warpThreadWidth, weftThreadHeight, selectedWarpIndex,
    selectedRowIndex, width, height,
  ]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
