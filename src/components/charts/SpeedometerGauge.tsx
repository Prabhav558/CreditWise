import React from "react";

interface GaugeSegment {
  start: number; // start (in domain units, NOT percent)
  end: number;   // end (in domain units)
  color: string;
}

interface SpeedometerGaugeProps {
  value: number;          // current raw value (same scale as max)
  max: number;            // domain maximum (e.g. 100 or 1)
  title: string;
  unit?: string;          // display unit, default '%'
  size?: number;          // overall width (px)
  segments?: GaugeSegment[];
  tickCount?: number;     // how many tick labels (including min & max)
  showValue?: boolean;
  valueAsFraction?: boolean; // if true, value is already 0..1 and max ignored for % display
}

/**
 * Fully dynamic speedometer:
 * - Works for max = 100 (0..100) and max = 1 (0..1) seamlessly.
 * - Auto builds 4 color segments spanning the full domain if none provided.
 * - Generates evenly spaced ticks across the full domain (not capped at 50 anymore).
 * - Correct central geometry; needle pivots at true center; full 180° sweep covers entire domain.
 */
export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value,
  max,
  title,
  unit = "%",
  size = 170,
  segments,
  tickCount = 5,
  showValue = true,
  valueAsFraction
}) => {
  // Defensive domain
  const safeMax = (!isNaN(max) && isFinite(max) && max > 0) ? max : 1;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);

  // Determine fraction (0..1) of domain covered
  const fraction = valueAsFraction ? Math.min(Math.max(value, 0), 1) : (clampedValue / safeMax);
  const percent = fraction * 100;

  // Display formatting
  let displayValue: string;
  if (unit === "%") {
    // If domain is 0..1 (max <= 1.00001) OR explicitly valueAsFraction, treat value as fraction
    const frac = (safeMax <= 1.000001 || valueAsFraction) ? clampedValue : (clampedValue / safeMax);
    displayValue = (frac * 100).toFixed(1);
  } else {
    // Numeric display respecting magnitude
    displayValue = (safeMax <= 1 ? clampedValue.toFixed(2) : clampedValue.toFixed(1));
  }

  // Geometry
  const strokeWidth = size * 0.14;                       // arc thickness
  const radius = (size / 2) - strokeWidth * 1.1;         // radius inside viewBox
  const centerX = size / 2;
  const centerY = radius + strokeWidth / 2;
  const hubRadius = strokeWidth * 0.28;
  const needleLength = radius * 0.80;
  const labelRadius = radius + strokeWidth * 0.85;
  const gaugeHeight = centerY + hubRadius + strokeWidth * 0.35;

  // Helper conversions
  const fracToAngle = (f: number) => -90 + f * 180; // f in [0,1]
  const valueToAngle = (v: number) => fracToAngle(v / safeMax);

  const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Build default segments if not provided: 4 quartiles
  const defaultSegments: GaugeSegment[] = Array.from({ length: 4 }).map((_, i) => {
    const start = (i * safeMax) / 4;
    const end = ((i + 1) * safeMax) / 4;
    const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444"];
    return { start, end, color: colors[i] };
  });

  const segs = segments && segments.length ? segments : defaultSegments;

  // Arc path builder for segment from domain start->end
  const arcPath = (domainStart: number, domainEnd: number) => {
    const startAngle = valueToAngle(domainStart);
    const endAngle = valueToAngle(domainEnd);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = 1;
    const start = polar(centerX, centerY, radius, startAngle);
    const end = polar(centerX, centerY, radius, endAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  };

  // Render segments with progressive fill
  const renderedSegments = segs.map((seg, idx) => {
    const reachedStart = fraction * safeMax >= seg.start;
    const segmentEndValue = Math.min(fraction * safeMax, seg.end);
    const hasFill = segmentEndValue > seg.start;

    return (
      <g key={`seg-${idx}`}>
        {/* background for full segment span */}
        <path
          d={arcPath(seg.start, seg.end)}
          fill="none"
          stroke="#e6e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.25}
        />
        {reachedStart && hasFill && (
          <path
            d={arcPath(seg.start, segmentEndValue)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </g>
    );
  });

  // Tick generation across full domain
  const ticks: number[] = (() => {
    const n = Math.max(2, tickCount);
    return Array.from({ length: n }, (_, i) => (i / (n - 1)) * safeMax);
  })();

  // Needle (triangle) for precise pivot
  const needleAngle = valueToAngle(clampedValue);
  const tip = polar(centerX, centerY, needleLength, needleAngle);
  const baseLeft = polar(centerX, centerY, hubRadius * 0.6, needleAngle - 90);
  const baseRight = polar(centerX, centerY, hubRadius * 0.6, needleAngle + 90);
  const needlePath = `
    M ${baseLeft.x} ${baseLeft.y}
    L ${tip.x} ${tip.y}
    L ${baseRight.x} ${baseRight.y}
    Z
  `;

  // Number formatting for ticks
  const formatTick = (v: number) => {
    if (safeMax <= 1.000001) {
      // small domain (0..1)
      if (v === 0 || v === safeMax) return v.toFixed(0);
      return v.toFixed(2).replace(/0+$/,'').replace(/\.$/,''); // trim
    } else {
      // larger domain
      if (safeMax <= 10) return v.toFixed(1).replace(/\.0$/,'');
      return Math.round(v).toString();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={gaugeHeight}
        viewBox={`0 0 ${size} ${gaugeHeight}`}
        role="img"
        aria-label={title}
      >
        {/* Full domain faint background (optional subtle base) */}
        <path
          d={arcPath(0, safeMax)}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Segments */}
        {renderedSegments}

        {/* Ticks & Labels */}
        {ticks.map((t, i) => {
            const angle = valueToAngle(t);
            const labelPos = polar(centerX, centerY, labelRadius, angle);
            return (
              <text
                key={`tick-${i}`}
                x={labelPos.x}
                y={labelPos.y + strokeWidth * 0.15}
                textAnchor="middle"
                fontSize={strokeWidth * 0.35}
                fontWeight={500}
                fill="#6b7280"
              >
                {formatTick(t)}
              </text>
            );
          })}

        {/* Needle shadow */}
        <path
          d={needlePath}
          fill="rgba(0,0,0,0.18)"
          style={{ filter: "blur(2px)" }}
        />

        {/* Needle */}
        <path
          d={needlePath}
          fill="#4b5563"
          style={{
            transition: "d 0.6s ease"
          }}
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

      {/* Value & Title */}
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