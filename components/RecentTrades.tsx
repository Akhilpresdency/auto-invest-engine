import React from 'react';
import { Trade, OrderSide, OrderStatus } from '../types';

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-semibold text-gray-200">Execution Log</h3>
        <span className="text-xs text-gray-500 font-mono">LIVE FEED</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950/50 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Side</th>
              <th className="px-6 py-3 text-right">Size</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-gray-500">{trade.timestamp.split(' ')[1]}</td>
                <td className="px-6 py-3 font-medium text-gray-200">{trade.symbol}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    trade.side === OrderSide.BUY 
                      ? 'bg-emerald-400/10 text-emerald-400' 
                      : 'bg-rose-400/10 text-rose-400'
                  }`}>
                    {trade.side}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-mono text-gray-300">{trade.size}</td>
                <td className="px-6 py-3 text-right font-mono text-gray-300">${trade.price.toFixed(2)}</td>
                <td className="px-6 py-3 text-right">
                   <span className={`text-xs ${
                     trade.status === OrderStatus.FILLED ? 'text-gray-400' : 'text-yellow-500'
                   }`}>
                     {trade.status}
                   </span>
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No trades executed today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};