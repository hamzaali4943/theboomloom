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
  warpThreadWidth: number;
  weftThreadHeight: number;
  selectedWarpIndex: number;
  rowIndices: number[];
};

/**
 * Draws the weave pattern grid on a single Skia Canvas.
 * Uses a recorded Picture for GPU-accelerated rendering —
 * zero React reconciliation, redraws in <1ms.
 */
export const SkiaPatternGrid = React.memo(function SkiaPatternGrid({
  pattern,
  colorWa,
  colorS,
  sNum,
  cellWidth,
  cellHeight,
  warpThreadWidth: rawWarpWidth,
  weftThreadHeight: _weftThreadHeight,
  selectedWarpIndex,
  rowIndices,
}: Props) {
  const width = WARP_COUNT * cellWidth;
  const height = sNum * cellHeight;

  // Scale warp slider value proportionally to cellWidth.
  // Slider values are in web-scale pixels (web dh = 16.5).
  const WEB_DH = 16.5;
  const warpThreadWidth = Math.max(Math.round((rawWarpWidth / WEB_DH) * cellWidth), 1);
  const weftThreadHeight = cellHeight;
  const warpMargin = (cellWidth - warpThreadWidth) / 2;

  // Record all drawing commands into a Skia Picture (GPU buffer).
  // When any dep changes the picture is re-recorded, but the Canvas
  // component itself never reconciles child elements.
  const picture = useMemo(() => {
    return createPicture(
      (canvas) => {
        const paint = Skia.Paint();

        // ── Draw warp threads (base layer) ──
        for (let screenRow = 0; screenRow < rowIndices.length; screenRow++) {
          const ri = rowIndices[screenRow];
          const y = screenRow * cellHeight;

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
        for (let screenRow = 0; screenRow < rowIndices.length; screenRow++) {
          const ri = rowIndices[screenRow];
          const patternRow = pattern[ri];
          const y = screenRow * cellHeight;

          paint.setColor(Skia.Color(colorS[ri]));

          // Weft rect covers thread area + left/right gaps (matches web logic:
          // x = col*dh - (dh-hw)/2, width = 2*dh - hw)
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

        // ── Selected warp highlight overlay (only when a thread is selected) ──
        if (selectedWarpIndex >= 0) {
          const highlightX = selectedWarpIndex * cellWidth;

          // Yellow fill overlay
          paint.setColor(Skia.Color('rgba(255, 200, 0, 0.35)'));
          canvas.drawRect(
            Skia.XYWHRect(highlightX, 0, cellWidth, height),
            paint,
          );

          // Left border
          paint.setColor(Skia.Color('rgba(255, 160, 0, 0.8)'));
          canvas.drawRect(
            Skia.XYWHRect(highlightX, 0, 1, height),
            paint,
          );

          // Right border
          canvas.drawRect(
            Skia.XYWHRect(highlightX + cellWidth - 1, 0, 1, height),
            paint,
          );
        }
      },
      { x: 0, y: 0, width, height },
    );
  }, [
    pattern, colorWa, colorS, rowIndices, cellWidth, cellHeight,
    warpMargin, warpThreadWidth, weftThreadHeight, selectedWarpIndex,
    width, height,
  ]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={picture} />
    </Canvas>
  );
});
