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
  size = 120 
}: SpeedometerGaugeProps) => {
  // Comprehensive NaN protection
  const safeValue = (!isNaN(value) && isFinite(value) && value >= 0) ? value : 0;
  const safeMax = (!isNaN(max) && isFinite(max) && max > 0) ? max : 1;
  
  const percentage = Math.min((safeValue / safeMax) * 100, 100);
  const displayValue = unit === "%" ? (safeValue * 100).toFixed(1) : safeValue.toFixed(2);
  
  // Calculate needle rotation (180 degrees range: -90deg to +90deg)
  const needleRotation = -90 + (percentage * 180) / 100;
  
  const centerX = size / 2;
  const centerY = size * 0.5;
  const radius = size * 0.35;
  const segmentWidth = size * 0.12;
  
  // Define color segments matching the reference image
  const segments = [
    { start: 0, end: 25, color: "#4ade80" },    // Green
    { start: 25, end: 50, color: "#facc15" },   // Yellow  
    { start: 50, end: 75, color: "#fb923c" },   // Orange
    { start: 75, end: 100, color: "#ef4444" }   // Red
  ];
  
  // Create arc path for segments with gaps
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
    <div className="flex flex-col items-center space-y-4">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg 
          width={size} 
          height={size * 0.65} 
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="absolute inset-0"
        >
          {/* Draw segments with gaps between them */}
          {segments.map((segment, index) => {
            // Add small gaps between segments
            const gapSize = 2; // degrees
            const adjustedStart = segment.start * 1.8 + (index > 0 ? gapSize : 0);
            const adjustedEnd = segment.end * 1.8 - (index < segments.length - 1 ? gapSize : 0);
            
            // Determine if this segment should be active
            const isActive = percentage > segment.start;
            const opacity = isActive ? 1 : 0.2;
            
            return (
              <path
                key={index}
                d={createSegmentPath(adjustedStart, adjustedEnd, radius)}
                fill="none"
                stroke={segment.color}
                strokeWidth={segmentWidth}
                strokeLinecap="round"
                opacity={opacity}
                style={{
                  transition: 'opacity 0.8s ease-in-out'
                }}
              />
            );
          })}
        </svg>
        
        {/* Needle - thick and dark like the reference */}
        <div 
          className="absolute bg-gray-800 rounded-full"
          style={{
            width: size * 0.04,
            height: radius * 0.85,
            left: '50%',
            bottom: size * 0.08,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 10
          }}
        />
        
        {/* Center hub - simple circle like the reference */}
        <div 
          className="absolute rounded-full bg-gray-800 border-2 border-white"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            left: '50%',
            bottom: size * 0.04,
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
        />
        
        {/* Small white center dot */}
        <div 
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.03,
            height: size * 0.03,
            left: '50%',
            bottom: size * 0.065,
            transform: 'translateX(-50%)',
            zIndex: 30
          }}
        />
      </div>
      
      {/* Value display */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-foreground">
          {displayValue}{unit}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
      </div>
    </div>
  );
};