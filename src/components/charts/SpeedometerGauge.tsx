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
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative" style={{ width: size, height: size * 0.6 }}>
        <svg 
          width={size} 
          height={size * 0.6} 
          viewBox={`0 0 ${size} ${size * 0.6}`}
          className="absolute inset-0"
        >
          {/* Green segment */}
          <path
            d={`M ${size * 0.15} ${size * 0.45} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.3} ${size * 0.2}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth={size * 0.1}
            strokeLinecap="round"
          />
          
          {/* Light Green segment */}
          <path
            d={`M ${size * 0.35} ${size * 0.15} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.5} ${size * 0.125}`}
            fill="none"
            stroke="#84cc16"
            strokeWidth={size * 0.1}
            strokeLinecap="round"
          />
          
          {/* Yellow segment */}
          <path
            d={`M ${size * 0.55} ${size * 0.15} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.7} ${size * 0.2}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={size * 0.1}
            strokeLinecap="round"
          />
          
          {/* Orange segment */}
          <path
            d={`M ${size * 0.75} ${size * 0.25} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.82} ${size * 0.35}`}
            fill="none"
            stroke="#f97316"
            strokeWidth={size * 0.1}
            strokeLinecap="round"
          />
          
          {/* Red/Pink segment */}
          <path
            d={`M ${size * 0.84} ${size * 0.4} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.85} ${size * 0.45}`}
            fill="none"
            stroke="#ec4899"
            strokeWidth={size * 0.1}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute"
          style={{
            width: size * 0.02,
            height: size * 0.32,
            backgroundColor: '#1e293b',
            left: '50%',
            bottom: size * 0.08,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            borderRadius: `${size * 0.01}px ${size * 0.01}px 0 0`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute bg-slate-800 rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            left: '50%',
            bottom: size * 0.04,
            transform: 'translateX(-50%)'
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