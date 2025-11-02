/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface PieChartComponentProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  formatValue?: (value: number) => string;
  showPercentage?: boolean;
}

const DEFAULT_COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
];

export function PieChartComponent({
  title,
  description,
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  formatValue,
  showPercentage = true,
}: PieChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={
                showPercentage
                  ? (entry: any) => `${entry[nameKey]}: ${(entry.percentage as number)?.toFixed(1) || 0}%`
                  : undefined
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={formatValue}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
