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

// ── Exported vertical constants so WeavingLoom can compute matching offsets ──
export const LOOM_VERT0 = 8;   // Top margin
export const LOOM_VERT1 = 18;  // Spike height
export const LOOM_VERT4 = 100; // Additional frame depth

/** Top decoration height: margin + spikes (no extra gap) */
export const LOOM_TOP_PAD = LOOM_VERT0 + LOOM_VERT1;  // 42
/** Bottom decoration height: spikes + margin */
export const LOOM_BOTTOM_PAD = LOOM_VERT1 + LOOM_VERT0; // 42

// ── Component ──────────────────────────────────────────
export const LoomFrame = React.memo(function LoomFrame({
  loomWidth,
  canvasHeight,
  spikeSpacing,
  loomColor = '#e5f0ff',
  backgroundColor = '#FFFFFF',
}: Props) {
  const canH = canvasHeight;

  const vert0 = LOOM_VERT0;
  const vert1 = LOOM_VERT1;
  const vert4 = LOOM_VERT4;

  // Horizontal positioning — loom starts at x=0 within SVG
  const loomStartX = 0;
  const loomEndX = loomWidth;

  // Curve insets (proportional to loom width)
  const curveInset1 = Math.min(112, loomWidth * 0.175);
  const curveInset2 = Math.min(195, loomWidth * 0.305);

  // Spike details
  const spikeCount = Math.max(1, Math.floor(loomWidth / spikeSpacing));
  const spikeWidth = 6;

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

  // Side curves (hourglass shape) — start right at spike bottom
  const sideY1 = vert0 + vert1;
  const sideY2 = sideY1 + vert4;
  const botSideY1 = canH - vert0 - vert1;
  const botSideY2 = canH - vert0 - vert1 - vert4;

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

  // Top oval cutout
  const ovalTopY = vert0 + vert1 + vert4 / 2;
  const topOvalD = [
    `M ${loomStartX + curveInset2} ${ovalTopY}`,
    `C ${loomStartX + curveInset2} ${ovalTopY - 50}, ${loomEndX - curveInset2} ${ovalTopY - 50}, ${loomEndX - curveInset2} ${ovalTopY}`,
    `C ${loomEndX - curveInset2} ${ovalTopY + 75}, ${loomStartX + curveInset2} ${ovalTopY + 75}, ${loomStartX + curveInset2} ${ovalTopY}`,
    'Z',
  ].join(' ');

  // Bottom oval cutout
  const ovalBotY = canH - (vert0 + vert1 + vert4 / 2);
  const bottomOvalD = [
    `M ${loomStartX + curveInset2} ${ovalBotY}`,
    `C ${loomStartX + curveInset2} ${ovalBotY + 50}, ${loomEndX - curveInset2} ${ovalBotY + 50}, ${loomEndX - curveInset2} ${ovalBotY}`,
    `C ${loomEndX - curveInset2} ${ovalBotY - 75}, ${loomStartX + curveInset2} ${ovalBotY - 75}, ${loomStartX + curveInset2} ${ovalBotY}`,
    'Z',
  ].join(' ');

  // Center dots
  const dotY1 = canH / 2 - 125;
  const dotY2 = canH / 2 + 125;

  // No brackets needed — just fit the loom width
  const svgWidth = loomWidth;

  return (
    <Svg
      width={svgWidth}
      height={canH}
      viewBox={`0 0 ${svgWidth} ${canH}`}
    >
      {/* Top spikes */}
      {topSpikes}

      {/* Side curves (hourglass connector) */}
      <Path d={sideCurvesD} fill={loomColor} />

      {/* Bottom spikes */}
      {bottomSpikes}

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
