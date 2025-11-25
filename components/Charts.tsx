import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DataPoint {
  time: string;
  value: number;
  benchmark?: number;
}

interface EquityChartProps {
  data: DataPoint[];
  color?: string;
}

export const EquityChart: React.FC<EquityChartProps> = ({ data, color = "#3b82f6" }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#e5e7eb' }}
            itemStyle={{ color: '#e5e7eb' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface FeatureImportanceProps {
  data: { feature: string; score: number }[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceProps> = ({ data }) => {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis type="number" stroke="#6b7280" fontSize={12} />
          <YAxis 
            dataKey="feature" 
            type="category" 
            stroke="#6b7280" 
            fontSize={12} 
            width={100}
          />
          <Tooltip 
            cursor={{fill: '#1f2937'}}
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }}
          />
          <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};