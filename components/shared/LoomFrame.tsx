import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

// ── Types ──────────────────────────────────────────────
type Props = {
  /** Total width of the warp area (waNum * cellWidth) */
  loomWidth: number;
  /** Total height of the SVG canvas */
  canvasHeight: number;
  /** Spacing between spikes — typically cellWidth * 2 */
  spikeSpacing: number;
  /** Color of the loom wood */
  loomColor?: string;
  /** Background color for oval cutouts */
  backgroundColor?: string;
};

// ── Component ──────────────────────────────────────────
export const LoomFrame = React.memo(function LoomFrame({
  loomWidth,
  canvasHeight,
  spikeSpacing,
  loomColor = '#e5f0ff',
  backgroundColor = '#FFFFFF',
}: Props) {
  const canH = canvasHeight;

  // Vertical spacing constants (matching drawLoom)
  const vert0 = 8;   // Top margin
  const vert1 = 34;  // Spike height
  const vert2 = 134; // Heddle bar height
  const vert3 = 84;  // Frame curve depth
  const vert4 = 100; // Additional frame depth

  // Horizontal positioning — loom starts at x=0 within SVG
  const loomStartX = 0;
  const loomEndX = loomWidth;

  // Curve insets (proportional to loom width)
  const curveInset1 = Math.min(112, loomWidth * 0.175);
  const curveInset2 = Math.min(195, loomWidth * 0.305);

  // Spike details
  const spikeCount = Math.max(1, Math.floor(loomWidth / spikeSpacing / 2));
  const spikeWidth = 10;

  // Center X
  const centerX = loomWidth / 2;

  // ── Build SVG elements ───────────────────────────────

  // Top spikes
  const topSpikes: React.ReactNode[] = [];
  for (let k = 0; k < spikeCount; k++) {
    const x = loomStartX + 2 * k * (spikeSpacing / 2) + spikeSpacing / 2 - spikeWidth / 2;
    topSpikes.push(
      <Rect
        key={`ts-${k}`}
        x={x}
        y={vert0}
        width={spikeWidth}
        height={vert1}
        rx={spikeWidth / 2}
        ry={spikeWidth / 2}
        fill={loomColor}
      />,
    );
  }

  // Bottom spikes
  const bottomSpikes: React.ReactNode[] = [];
  for (let k = 0; k < spikeCount; k++) {
    const x = loomStartX + 2 * k * (spikeSpacing / 2) + spikeSpacing / 2 - spikeWidth / 2;
    bottomSpikes.push(
      <Rect
        key={`bs-${k}`}
        x={x}
        y={canH - vert0 - vert1}
        width={spikeWidth}
        height={vert1}
        rx={spikeWidth / 2}
        ry={spikeWidth / 2}
        fill={loomColor}
      />,
    );
  }

  // Main body rectangle (top)
  const bodyY = vert0 + vert1;
  const bodyH = vert2 + vert3;

  // Bottom rectangle
  const bottomRectY = canH - (vert0 + vert1 + vert3);

  // Side curves (hourglass shape connecting top body to bottom body)
  const sideY1 = vert0 + vert1 + vert2 + vert3;
  const sideY2 = sideY1 + vert4;
  const botSideY1 = canH - vert0 - vert1 - vert3;
  const botSideY2 = canH - vert0 - vert1 - vert3 - vert4;

  const sideCurvesD = [
    // Left side curve down
    `M ${loomStartX} ${sideY1}`,
    `C ${loomStartX} ${sideY1 + 25}, ${loomStartX + curveInset1} ${sideY2 - 25}, ${loomStartX + curveInset1} ${sideY2}`,
    `L ${loomStartX + curveInset1} ${botSideY2}`,
    `C ${loomStartX + curveInset1} ${botSideY2 + 25}, ${loomStartX} ${botSideY1 - 25}, ${loomStartX} ${botSideY1}`,
    // Right side curve up
    `L ${loomEndX} ${botSideY1}`,
    `C ${loomEndX} ${botSideY1 - 25}, ${loomEndX - curveInset1} ${botSideY2 + 25}, ${loomEndX - curveInset1} ${botSideY2}`,
    `L ${loomEndX - curveInset1} ${sideY2}`,
    `C ${loomEndX - curveInset1} ${sideY2 - 25}, ${loomEndX} ${sideY1 + 25}, ${loomEndX} ${sideY1}`,
    'Z',
  ].join(' ');

  // Bottom bar
  const barY = canH - vert0 - vert1 - vert1 / 2;
  const barH = vert1 / 2;

  // Left bottom bracket
  const lbX = loomStartX - spikeWidth;
  const lbY1 = canH - vert0 - vert1 + vert1 / 2;
  const lbY2 = canH - vert0 - 2 * vert1;
  const leftBracketD = [
    `M ${lbX} ${lbY1}`,
    `C ${lbX - 20} ${lbY1}, ${lbX - 20} ${lbY2}, ${lbX} ${lbY2}`,
    'Z',
  ].join(' ');

  // Right bottom bracket
  const rbX = loomEndX + spikeWidth;
  const rightBracketD = [
    `M ${rbX} ${lbY1}`,
    `C ${rbX + 20} ${lbY1}, ${rbX + 20} ${lbY2}, ${rbX} ${lbY2}`,
    'Z',
  ].join(' ');

  // Top oval cutout
  const ovalTopY = vert0 + vert1 + vert2 + vert3 + vert4 / 2;
  const topOvalD = [
    `M ${loomStartX + curveInset2} ${ovalTopY}`,
    `C ${loomStartX + curveInset2} ${ovalTopY - 50}, ${loomEndX - curveInset2} ${ovalTopY - 50}, ${loomEndX - curveInset2} ${ovalTopY}`,
    `C ${loomEndX - curveInset2} ${ovalTopY + 75}, ${loomStartX + curveInset2} ${ovalTopY + 75}, ${loomStartX + curveInset2} ${ovalTopY}`,
    'Z',
  ].join(' ');

  // Bottom oval cutout
  const ovalBotY = canH - (vert0 + vert1 + vert3 + vert4 / 2);
  const bottomOvalD = [
    `M ${loomStartX + curveInset2} ${ovalBotY}`,
    `C ${loomStartX + curveInset2} ${ovalBotY + 50}, ${loomEndX - curveInset2} ${ovalBotY + 50}, ${loomEndX - curveInset2} ${ovalBotY}`,
    `C ${loomEndX - curveInset2} ${ovalBotY - 75}, ${loomStartX + curveInset2} ${ovalBotY - 75}, ${loomStartX + curveInset2} ${ovalBotY}`,
    'Z',
  ].join(' ');

  // Center dots
  const vert6 = 251;
  const dotY1 = canH - (canH - vert2) / 2 - vert6 / 2;
  const dotY2 = canH - (canH - vert2) / 2 + vert6 / 2;

  // SVG needs extra horizontal space for brackets
  const bracketOverhang = spikeWidth + 20;
  const svgWidth = loomWidth + bracketOverhang * 2;

  return (
    <Svg
      width={svgWidth}
      height={canH}
      viewBox={`${-bracketOverhang} 0 ${svgWidth} ${canH}`}
    >
      {/* Top spikes */}
      {topSpikes}

      {/* Main body rectangle */}
      <Rect
        x={loomStartX}
        y={bodyY}
        width={loomWidth}
        height={bodyH}
        rx={spikeWidth / 2}
        ry={spikeWidth / 2}
        fill={loomColor}
      />

      {/* Side curves (hourglass connector) */}
      <Path d={sideCurvesD} fill={loomColor} />

      {/* Bottom rectangle */}
      <Rect
        x={loomStartX}
        y={bottomRectY}
        width={loomWidth}
        height={vert3}
        rx={spikeWidth / 2}
        ry={spikeWidth / 2}
        fill={loomColor}
      />

      {/* Bottom spikes */}
      {bottomSpikes}

      {/* Bottom bar */}
      <Rect
        x={loomStartX - spikeWidth}
        y={barY}
        width={loomWidth + 2 * spikeWidth}
        height={barH}
        fill={loomColor}
      />

      {/* Left bottom bracket */}
      <Path d={leftBracketD} fill={loomColor} />

      {/* Right bottom bracket */}
      <Path d={rightBracketD} fill={loomColor} />

      {/* Top oval cutout */}
      <Path d={topOvalD} fill={backgroundColor} />

      {/* Bottom oval cutout */}
      <Path d={bottomOvalD} fill={backgroundColor} />

      {/* Center dots */}
      <Circle cx={centerX} cy={dotY1} r={6} fill={backgroundColor} />
      <Circle cx={centerX} cy={dotY2} r={6} fill={backgroundColor} />
    </Svg>
  );
});