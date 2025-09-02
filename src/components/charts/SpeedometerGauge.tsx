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
  const strokeWidth = size * 0.1;
  
  // Create semicircle path
  const createArcPath = (startAngle: number, endAngle: number, r: number) => {
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
      <div className="relative" style={{ width: size, height: size * 0.65, transform: 'rotate(-90deg)' }}>
        <svg 
          width={size} 
          height={size * 0.65} 
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="absolute inset-0"
        >
          <defs>
            {/* Gradient for the track */}
            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            
            {/* Shadow filter */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(var(--foreground))" floodOpacity="0.1"/>
            </filter>
          </defs>
          
          {/* Background semicircle */}
          <path
            d={createArcPath(0, 180, radius)}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.2"
          />
          
          {/* Colored track segments */}
          {/* Green segment (0-25%) */}
          <path
            d={createArcPath(0, 45, radius)}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          
          {/* Yellow segment (25-50%) */}
          <path
            d={createArcPath(45, 90, radius)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          
          {/* Orange segment (50-75%) */}
          <path
            d={createArcPath(90, 135, radius)}
            fill="none"
            stroke="#f97316"
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          
          {/* Red segment (75-100%) */}
          <path
            d={createArcPath(135, 180, radius)}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          
          {/* Scale markers */}
          {[0, 20, 40, 60, 80, 100].map((mark, index) => {
            const angle = mark * 1.8; // 180 degrees / 100 = 1.8
            const outerRadius = radius - strokeWidth * 0.3;
            const innerRadius = radius - strokeWidth * 0.6;
            const pos1 = polarToCartesian(centerX, centerY, innerRadius, angle);
            const pos2 = polarToCartesian(centerX, centerY, outerRadius, angle);
            
            return (
              <line
                key={index}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={size * 0.008}
                opacity="0.8"
              />
            );
          })}
          
          {/* Scale numbers */}
          {[0, 25, 50, 75, 100].map((mark, index) => {
            const angle = mark * 1.8;
            const textRadius = radius - strokeWidth * 1.2;
            const pos = polarToCartesian(centerX, centerY, textRadius, angle);
            
            return (
              <text
                key={index}
                x={pos.x}
                y={pos.y + size * 0.012}
                textAnchor="middle"
                className="fill-muted-foreground text-xs font-medium"
                style={{ fontSize: size * 0.08 }}
              >
                {mark}
              </text>
            );
          })}
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute bg-foreground shadow-md"
          style={{
            width: size * 0.015,
            height: radius * 0.85,
            left: '50%',
            bottom: size * 0.1,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            borderRadius: `${size * 0.008}px`,
            transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 10
          }}
        />
        
        {/* Center hub */}
        <div 
          className="absolute bg-foreground rounded-full shadow-lg border-2 border-background"
          style={{
            width: size * 0.1,
            height: size * 0.1,
            left: '50%',
            bottom: size * 0.05,
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
        />
        
        {/* Inner center dot */}
        <div 
          className="absolute bg-background rounded-full"
          style={{
            width: size * 0.04,
            height: size * 0.04,
            left: '50%',
            bottom: size * 0.08,
            transform: 'translateX(-50%)',
            zIndex: 30
          }}
        />
      </div>
      
      {/* Value display below the speedometer */}
      <div className="text-lg font-bold text-foreground">
        {displayValue}{unit}
      </div>
      
      <div className="text-sm font-medium text-muted-foreground text-center">
        {title}
      </div>
    </div>
  );
};