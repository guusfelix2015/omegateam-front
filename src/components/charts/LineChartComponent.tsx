/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface LineChartComponentProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  yAxisLabel?: string;
  formatValue?: (value: number) => string;
}

export function LineChartComponent({
  title,
  description,
  data,
  dataKey,
  xAxisKey,
  color = '#8b5cf6',
  yAxisLabel,
  formatValue,
}: LineChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
