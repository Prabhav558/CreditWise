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
          {/* Green segment (0-25%) */}
          <path
            d={`M ${size * 0.1} ${size * 0.5} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.3} ${size * 0.18}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth={size * 0.12}
            strokeLinecap="round"
          />
          
          {/* Yellow segment (25-50%) */}
          <path
            d={`M ${size * 0.35} ${size * 0.15} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.5} ${size * 0.1}`}
            fill="none"
            stroke="#eab308"
            strokeWidth={size * 0.12}
            strokeLinecap="round"
          />
          
          {/* Orange segment (50-75%) */}
          <path
            d={`M ${size * 0.65} ${size * 0.15} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.8} ${size * 0.3}`}
            fill="none"
            stroke="#f97316"
            strokeWidth={size * 0.12}
            strokeLinecap="round"
          />
          
          {/* Red segment (75-100%) */}
          <path
            d={`M ${size * 0.82} ${size * 0.35} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size * 0.5}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth={size * 0.12}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Needle with circle end */}
        <div 
          className="absolute"
          style={{
            width: size * 0.025,
            height: size * 0.35,
            backgroundColor: '#1f2937',
            left: '50%',
            bottom: size * 0.08,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            borderRadius: `${size * 0.012}px`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        
        {/* Needle circle end */}
        <div 
          className="absolute bg-gray-800 rounded-full border-2 border-white"
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