import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer
} from "recharts";

interface ChartData {
  month: string;
  pd_percent: number;
  risk_category: string;
  features?: any;
}

interface PDTrendChartProps {
  data: ChartData[];
}

export default function PDTrendChart({ data }: PDTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No timeline yet. Upload a monthly CSV to see trends.
      </div>
    );
  }

  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === "pd_percent") {
      const features = props.payload?.features;
      return [
        <div key="tooltip" className="space-y-1">
          <div>{`PD Score: ${value.toFixed(1)}%`}</div>
          {features && (
            <>
              <div className="text-xs opacity-75">
                Payment Delay: {(features.payment_delay_ratio * 100).toFixed(1)}%
              </div>
              <div className="text-xs opacity-75">
                Cart Abandonment: {(features.cart_abandonment_rate * 100).toFixed(1)}%
              </div>
            </>
          )}
        </div>,
        ""
      ];
    }
    return [value, name];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {/* Risk band reference areas */}
        <ReferenceArea y1={0} y2={30} fill="hsl(var(--chart-1))" fillOpacity={0.1} />
        <ReferenceArea y1={30} y2={60} fill="hsl(var(--chart-2))" fillOpacity={0.1} />
        <ReferenceArea y1={60} y2={100} fill="hsl(var(--chart-3))" fillOpacity={0.1} />
        
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          domain={[0, 100]}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          formatter={formatTooltip}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px"
          }}
        />
        <Line
          type="monotone"
          dataKey="pd_percent"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}