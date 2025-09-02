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
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  
  // Get colors based on percentage for dynamic theming
  const getSegmentColor = (segmentPercentage: number) => {
    if (segmentPercentage <= 25) return "hsl(142 76% 36%)"; // Green - safe
    if (segmentPercentage <= 50) return "hsl(48 96% 53%)"; // Yellow - caution
    if (segmentPercentage <= 75) return "hsl(25 95% 53%)"; // Orange - warning
    return "hsl(0 84% 60%)"; // Red - danger
  };
  
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
    <div className="flex flex-col items-center space-y-6">
      <div className="relative" style={{ width: size, height: size * 0.65, transform: 'rotate(-90deg)' }}>
        <svg 
          width={size} 
          height={size * 0.65} 
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="absolute inset-0 drop-shadow-lg"
        >
          <defs>
            {/* Enhanced gradient definitions */}
            <linearGradient id="track-bg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--muted))" />
              <stop offset="100%" stopColor="hsl(var(--muted))" />
            </linearGradient>
            
            <linearGradient id="segment-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Enhanced shadow and glow filters */}
            <filter id="segment-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offset"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
            
            <filter id="needle-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background track with subtle gradient */}
          <path
            d={createArcPath(0, 180, radius)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Active progress arc based on value */}
          <path
            d={createArcPath(0, (percentage * 180) / 100, radius)}
            fill="none"
            stroke={getSegmentColor(percentage)}
            strokeWidth={strokeWidth * 0.9}
            strokeLinecap="round"
            filter="url(#segment-shadow)"
            style={{
              transition: 'stroke-dasharray 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
          
          {/* Enhanced scale markers */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark, index) => {
            const angle = mark * 1.8;
            const isMajor = mark % 25 === 0;
            const outerRadius = radius - strokeWidth * 0.2;
            const innerRadius = radius - strokeWidth * (isMajor ? 0.7 : 0.4);
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
                strokeWidth={isMajor ? size * 0.012 : size * 0.006}
                opacity={isMajor ? "0.9" : "0.5"}
              />
            );
          })}
          
          {/* Scale numbers with better typography */}
          {[0, 25, 50, 75, 100].map((mark, index) => {
            const angle = mark * 1.8;
            const textRadius = radius - strokeWidth * 1.4;
            const pos = polarToCartesian(centerX, centerY, textRadius, angle);
            
            return (
              <text
                key={index}
                x={pos.x}
                y={pos.y + size * 0.015}
                textAnchor="middle"
                className="fill-muted-foreground font-semibold"
                style={{ fontSize: size * 0.09 }}
              >
                {mark}
              </text>
            );
          })}
        </svg>
        
        {/* Enhanced needle with glow effect */}
        <div 
          className="absolute rounded-full"
          style={{
            width: size * 0.025,
            height: radius * 0.9,
            left: '50%',
            bottom: size * 0.08,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            filter: 'drop-shadow(0 0 6px hsl(var(--accent) / 0.6))',
            zIndex: 10,
            background: `linear-gradient(to top, hsl(var(--accent)), hsl(var(--primary)))`
          }}
        />
        
        {/* Enhanced center hub with gradient */}
        <div 
          className="absolute rounded-full border-2 border-background"
          style={{
            width: size * 0.12,
            height: size * 0.12,
            left: '50%',
            bottom: size * 0.02,
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, hsl(var(--accent)), hsl(var(--primary)))`,
            boxShadow: 'var(--shadow-elegant)',
            zIndex: 20
          }}
        />
        
        {/* Center accent ring */}
        <div 
          className="absolute rounded-full border-2"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            left: '50%',
            bottom: size * 0.05,
            transform: 'translateX(-50%)',
            borderColor: 'hsl(var(--background))',
            background: 'hsl(var(--accent))',
            zIndex: 30
          }}
        />
      </div>
      
      {/* Enhanced value display */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {displayValue}{unit}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
      </div>
    </div>
  );
};