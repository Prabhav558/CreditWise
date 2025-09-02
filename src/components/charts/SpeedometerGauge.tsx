interface SpeedometerGaugeProps {
  value: number;
  max: number;
  title: string;
  unit?: string;
  size?: number;
}

export const SpeedometerGauge = ({ 
  value, 
  max, 
  title, 
  unit = "%", 
  size = 140 
}: SpeedometerGaugeProps) => {
  // Comprehensive NaN protection
  const safeValue = (!isNaN(value) && isFinite(value) && value >= 0) ? value : 0;
  const safeMax = (!isNaN(max) && isFinite(max) && max > 0) ? max : 1;
  
  const percentage = Math.min((safeValue / safeMax) * 100, 100);
  const displayValue = unit === "%" ? (safeValue * 100).toFixed(1) : safeValue.toFixed(2);
  
  // Calculate needle rotation (180 degrees range: -90deg to +90deg)
  const needleRotation = -90 + (percentage * 180) / 100;
  
  const centerX = size / 2;
  const centerY = size * 0.6;
  const radius = size * 0.32;
  const segmentWidth = size * 0.08;
  
  // Define color segments matching the reference
  const segments = [
    { start: 0, end: 25, color: "#22c55e" },    // Green
    { start: 25, end: 50, color: "#eab308" },   // Yellow  
    { start: 50, end: 75, color: "#f97316" },   // Orange
    { start: 75, end: 100, color: "#ef4444" }   // Red
  ];
  
  // Create arc path for segments
  const createSegmentPath = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(centerX, centerY, r, endAngle);
    const end = polarToCartesian(centerX, centerY, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };
  
  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative" style={{ width: size, height: size * 0.7 }}>
        <svg 
          width={size} 
          height={size * 0.7} 
          viewBox={`0 0 ${size} ${size * 0.7}`}
          className="absolute inset-0"
        >
          {/* Background arc - light gray */}
          <path
            d={createSegmentPath(0, 180, radius)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={segmentWidth}
            strokeLinecap="round"
          />
          
          {/* Draw active segments */}
          {segments.map((segment, index) => {
            const gapSize = 1; // Small gap between segments
            const adjustedStart = segment.start * 1.8 + (index > 0 ? gapSize : 0);
            const adjustedEnd = segment.end * 1.8 - (index < segments.length - 1 ? gapSize : 0);
            
            // Only show segment if value reaches it
            const shouldShow = percentage > segment.start;
            const segmentEndPercentage = Math.min(percentage, segment.end);
            const actualEnd = shouldShow ? (segmentEndPercentage * 1.8) - (index < segments.length - 1 ? gapSize : 0) : adjustedStart;
            
            if (!shouldShow) return null;
            
            return (
              <path
                key={index}
                d={createSegmentPath(adjustedStart, actualEnd, radius)}
                fill="none"
                stroke={segment.color}
                strokeWidth={segmentWidth * 0.9}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.8s ease-in-out'
                }}
              />
            );
          })}
          
          {/* Scale markers and numbers */}
          {[0, 25, 50].map((mark, index) => {
            const angle = mark * 1.8;
            const markerRadius = radius + segmentWidth * 0.7;
            const pos = polarToCartesian(centerX, centerY, markerRadius, angle);
            
            return (
              <g key={index}>
                {/* Scale number */}
                <text
                  x={pos.x}
                  y={pos.y + size * 0.02}
                  textAnchor="middle"
                  className="fill-gray-400 text-xs font-medium"
                  style={{ fontSize: size * 0.08 }}
                >
                  {mark}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute"
          style={{
            width: size * 0.03,
            height: radius * 0.8,
            left: '50%',
            bottom: size * 0.1,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            transition: 'transform 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            background: 'linear-gradient(to top, #374151, #6b7280)',
            borderRadius: '2px',
            zIndex: 10
          }}
        />
        
        {/* Center hub */}
        <div 
          className="absolute rounded-full bg-white border-2 border-gray-300 shadow-sm"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            left: '50%',
            bottom: size * 0.06,
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute rounded-full bg-gray-600"
          style={{
            width: size * 0.025,
            height: size * 0.025,
            left: '50%',
            bottom: size * 0.088,
            transform: 'translateX(-50%)',
            zIndex: 30
          }}
        />
      </div>
      
      {/* Value display */}
      <div className="text-center space-y-1">
        <div className="text-xl font-bold text-gray-900">
          {displayValue}{unit}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {title}
        </div>
      </div>
    </div>
  );
};