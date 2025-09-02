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
          {/* Define the colored segments with gaps */}
          <defs>
            <mask id="gaugeMask">
              <rect width="100%" height="100%" fill="black"/>
              <circle 
                cx={size/2} 
                cy={size * 0.6} 
                r={size * 0.25} 
                fill="white"
              />
            </mask>
          </defs>
          
          {/* Green segment (0-25%) */}
          <path
            d={`M ${size * 0.1} ${size * 0.5} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.35} ${size * 0.15}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            mask="url(#gaugeMask)"
          />
          
          {/* Light Green segment (25-50%) */}
          <path
            d={`M ${size * 0.4} ${size * 0.12} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.5} ${size * 0.1}`}
            fill="none"
            stroke="#84cc16"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            mask="url(#gaugeMask)"
          />
          
          {/* Yellow segment (50-75%) */}
          <path
            d={`M ${size * 0.6} ${size * 0.12} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.75} ${size * 0.25}`}
            fill="none"
            stroke="#eab308"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            mask="url(#gaugeMask)"
          />
          
          {/* Orange segment (75-87.5%) */}
          <path
            d={`M ${size * 0.78} ${size * 0.28} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.85} ${size * 0.4}`}
            fill="none"
            stroke="#f97316"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            mask="url(#gaugeMask)"
          />
          
          {/* Red segment (87.5-100%) */}
          <path
            d={`M ${size * 0.87} ${size * 0.43} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size * 0.5}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            mask="url(#gaugeMask)"
          />
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute"
          style={{
            width: size * 0.015,
            height: size * 0.35,
            backgroundColor: '#1e293b',
            left: '50%',
            bottom: 0,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            borderRadius: `${size * 0.008}px ${size * 0.008}px 0 0`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute bg-slate-800 rounded-full"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            left: '50%',
            bottom: -size * 0.03,
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="text-lg font-bold text-foreground">
            {displayValue}{unit}
          </div>
        </div>
      </div>
      <div className="text-sm font-medium text-muted-foreground text-center">
        {title}
      </div>
    </div>
  );
};