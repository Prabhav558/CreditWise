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
        {/* Background gauge track */}
        <div 
          className="absolute inset-0 rounded-t-full"
          style={{
            background: `conic-gradient(from 180deg, 
              #22c55e 0%, 
              #84cc16 25%, 
              #eab308 50%, 
              #f97316 75%, 
              #ef4444 100%)`,
            borderRadius: '50% 50% 0 0',
            border: `${size * 0.08}px solid transparent`,
            backgroundClip: 'padding-box'
          }}
        />
        
        {/* Inner white circle */}
        <div 
          className="absolute bg-background rounded-t-full"
          style={{
            top: size * 0.08,
            left: size * 0.08,
            right: size * 0.08,
            bottom: 0,
            borderRadius: '50% 50% 0 0'
          }}
        />
        
        {/* Needle */}
        <div 
          className="absolute"
          style={{
            width: size * 0.02,
            height: size * 0.35,
            backgroundColor: '#1e293b',
            left: '50%',
            bottom: 0,
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
            bottom: -size * 0.04,
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
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