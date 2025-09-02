import React from "react";

interface GaugeSegment {
  start: number; // percentage start (0-100)
  end: number;   // percentage end (0-100)
  color: string;
}

interface SpeedometerGaugeProps {
  value: number;
  max: number;
  title: string;
  unit?: string;
  size?: number;              // overall width of the SVG viewport
  ticks?: number[];           // tick labels in percentage (0-100 scale)
  segments?: GaugeSegment[];  // custom segments (must span 0..100 in order)
  showValue?: boolean;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value,
  max,
  title,
  unit = "%",
  size = 160,
  ticks = [0, 25, 50],
  segments = [
    { start: 0,  end: 25, color: "#22c55e" },  // green
    { start: 25, end: 50, color: "#eab308" },  // yellow
    { start: 50, end: 75, color: "#f97316" },  // orange
    { start: 75, end: 100, color: "#ef4444" }  // red
  ],
  showValue = true
}) => {
  // Defensive value normalization
  const safeMax = (!isNaN(max) && isFinite(max) && max > 0) ? max : 1;
  const safeValue = (!isNaN(value) && isFinite(value) && value >= 0) ? value : 0;
  const percentage = Math.min((safeValue / safeMax) * 100, 100);

  // Display value (if unit = % we assume incoming value is fractional, e.g. 0.667)
  const displayValue = unit === "%" ? (safeValue * 100).toFixed(1) : safeValue.toFixed(2);

  // Geometry
  const strokeWidth = size * 0.14;                  // arc thickness
  const radius = (size / 2) - strokeWidth * 1.1;    // ensure stroke stays inside
  const centerX = size / 2;
  const centerY = radius + strokeWidth / 2;         // arc sits in upper portion
  const hubRadius = strokeWidth * 0.28;
  const needleLength = radius * 0.78;
  const labelRadius = radius + strokeWidth * 0.9;   // where numeric labels sit
  const gaugeHeight = centerY + hubRadius + strokeWidth * 0.3; // total SVG height needed

  /**
   * FIX: Previous version produced a vertical semicircle (rotated 90° right)
   * because it mapped 0..100 -> -90..+90 and used a polar conversion without
   * the -90 shift, yielding a top-to-bottom (vertical) arc.
   *
   * We now map 0..100 -> -180..0 degrees so the arc spans the TOP semicircle
   * from left (-180) through top (-90) to right (0).
   */
  const pctToAngle = (p: number) => -180 + (p / 100) * 180;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  // Arc path for a segment along the top semicircle
  const arcPath = (startPct: number, endPct: number) => {
    const startAngle = pctToAngle(startPct);
    const endAngle = pctToAngle(endPct);
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    // Sweep=1 keeps motion from left to right across the top with negative -> 0 angles
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, endAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Build progressive colored segments
  const renderedSegments = segments.map((seg, i) => {
    const segStart = seg.start;
    const segEnd = seg.end;
    if (percentage <= segStart) {
      // Not reached this segment yet
      return (
        <path
          key={`seg-bg-${i}`}
          d={arcPath(segStart, segEnd)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.35}
        />
      );
    }

    const effectiveEnd = Math.min(percentage, segEnd);

    return (
      <g key={`seg-${i}`}>
        <path
          d={arcPath(segStart, segEnd)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.25}
        />
        <path
          d={arcPath(segStart, effectiveEnd)}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>
    );
  });

  // Needle geometry
  const needleAngle = pctToAngle(percentage);
  const needleTip = polarToCartesian(centerX, centerY, needleLength, needleAngle);
  const needleBaseLeft = polarToCartesian(centerX, centerY, hubRadius * 0.6, needleAngle - 90);
  const needleBaseRight = polarToCartesian(centerX, centerY, hubRadius * 0.6, needleAngle + 90);

  const needlePath = `
    M ${needleBaseLeft.x} ${needleBaseLeft.y}
    L ${needleTip.x} ${needleTip.y}
    L ${needleBaseRight.x} ${needleBaseRight.y}
    Z
  `;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={gaugeHeight}
        viewBox={`0 0 ${size} ${gaugeHeight}`}
        role="img"
        aria-label={title}
      >
        {/* Segments */}
        {renderedSegments}

        {/* Tick labels */}
        {ticks.map((t, idx) => {
          const pos = polarToCartesian(centerX, centerY, labelRadius, pctToAngle(t));
          return (
            <text
              key={`tick-${idx}`}
              x={pos.x}
              y={pos.y + strokeWidth * 0.18}
              textAnchor="middle"
              fontSize={strokeWidth * 0.38}
              fontWeight={500}
              fill="#6b7280"
            >
              {t}
            </text>
          );
        })}

        {/* Needle shadow */}
        <path
          d={needlePath}
          fill="rgba(0,0,0,0.15)"
          style={{ filter: "blur(2px)" }}
        />

        {/* Needle */}
        <path
          d={needlePath}
          fill="#4b5563"
          style={{ transition: "d 0.6s ease" }}
        />

        {/* Hub */}
        <circle
          cx={centerX}
          cy={centerY}
          r={hubRadius}
          fill="#ffffff"
          stroke="#9ca3af"
          strokeWidth={hubRadius * 0.35}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={hubRadius * 0.35}
          fill="#6b7280"
        />
      </svg>

      {/* Value + Title */}
      <div className="mt-2 text-center">
        {showValue && (
          <div className="text-lg font-bold text-gray-900 leading-tight">
            {displayValue}{unit}
          </div>
        )}
        <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          {title}
        </div>
      </div>
    </div>
  );
};