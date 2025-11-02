/* eslint-disable @typescript-eslint/no-explicit-any */
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface AreaChartComponentProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  yAxisLabel?: string;
  formatValue?: (value: number) => string;
}

export function AreaChartComponent({
  title,
  description,
  data,
  dataKey,
  xAxisKey,
  color = '#8b5cf6',
  yAxisLabel,
  formatValue,
}: AreaChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={xAxisKey}
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs"
              tickLine={false}
              axisLine={false}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={formatValue}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
