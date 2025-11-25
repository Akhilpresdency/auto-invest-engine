import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: number; // percentage
  subValue?: string;
  icon?: any;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  trend, 
  subValue, 
  icon: Icon,
  highlight = false
}) => {
  const isPositive = trend && trend >= 0;

  return (
    <div className={`p-6 rounded-xl border ${highlight ? 'bg-blue-900/10 border-blue-800' : 'bg-gray-900 border-gray-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
      </div>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold font-mono text-white tracking-tight">{value}</h3>
        {trend !== undefined && (
          <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subValue && (
        <p className="mt-2 text-xs text-gray-500">{subValue}</p>
      )}
    </div>
  );
};