import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { MetricCard } from './components/MetricCard';
import { EquityChart, FeatureImportanceChart } from './components/Charts';
import { RecentTrades } from './components/RecentTrades';
import { analyzeMarketSentiment, explainStrategy } from './services/geminiService';
import { 
  PortfolioMetrics, 
  Trade, 
  OrderSide, 
  OrderStatus, 
  MarketTicker, 
  BacktestStatus
} from './types';
import { MOCK_TICKERS, MOCK_NEWS, STRATEGIES } from './constants';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  CheckCircle, 
  TrendingUp,
  Skull,
  BrainCircuit,
  Settings
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLive, setIsLive] = useState(false);
  
  // -- State: Market Data --
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  
  // -- State: Portfolio --
  const [portfolio, setPortfolio] = useState<PortfolioMetrics>({
    totalEquity: 100000,
    cashBalance: 45000,
    dailyPnL: 1250.50,
    dailyPnLPercent: 1.25,
    sharpeRatio: 2.1,
    drawdown: -4.5,
    openPositions: 3
  });

  // -- State: Trades --
  const [trades, setTrades] = useState<Trade[]>([
    { id: 't1', symbol: 'AAPL', side: OrderSide.BUY, price: 175.20, size: 100, timestamp: '2023-10-27 09:30:05', status: OrderStatus.FILLED },
    { id: 't2', symbol: 'TSLA', side: OrderSide.SELL, price: 239.50, size: 50, timestamp: '2023-10-27 10:15:22', status: OrderStatus.FILLED },
    { id: 't3', symbol: 'BTC-USD', side: OrderSide.BUY, price: 42100, size: 0.5, timestamp: '2023-10-27 11:05:00', status: OrderStatus.FILLED },
  ]);

  // -- State: Chart Data --
  const [equityData, setEquityData] = useState<{time: string, value: number}[]>([]);
  
  // -- State: AI Analysis --
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // -- State: Backtest --
  const [backtestStatus, setBacktestStatus] = useState<BacktestStatus>(BacktestStatus.IDLE);
  const [backtestProgress, setBacktestProgress] = useState(0);

  // -- Simulation: Market Data Tick --
  useEffect(() => {
    // Initial Tick
    const initTickers = MOCK_TICKERS.map(t => ({
      symbol: t.symbol,
      price: t.basePrice,
      change: 0,
      changePercent: 0,
      volume: Math.floor(Math.random() * 1000000)
    }));
    setTickers(initTickers);

    // Initial Equity Data
    const initEquity = Array.from({ length: 30 }, (_, i) => ({
      time: `Oct ${i + 1}`,
      value: 100000 + Math.random() * 5000 - 2000 + (i * 200)
    }));
    setEquityData(initEquity);

    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const move = (Math.random() - 0.5) * (t.price * 0.005);
        const newPrice = t.price + move;
        return {
          ...t,
          price: newPrice,
          change: newPrice - t.price, // approximate for demo
          changePercent: ((newPrice - t.price) / t.price) * 100,
          volume: t.volume + Math.floor(Math.random() * 500)
        };
      }));

      // Update Equity Curve occasionally
      if (Math.random() > 0.8) {
        setPortfolio(prev => ({
          ...prev,
          totalEquity: prev.totalEquity + (Math.random() - 0.4) * 100,
          dailyPnL: prev.dailyPnL + (Math.random() - 0.4) * 100
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // -- Handler: Run AI Analysis --
  const handleAnalyzeMarket = useCallback(async () => {
    setIsAnalyzing(true);
    const result = await analyzeMarketSentiment(Array.from(MOCK_NEWS), tickers);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  }, [tickers]);

  // -- Handler: Run Backtest --
  const handleRunBacktest = () => {
    setBacktestStatus(BacktestStatus.RUNNING);
    setBacktestProgress(0);
    const interval = setInterval(() => {
      setBacktestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBacktestStatus(BacktestStatus.COMPLETED);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // -- Render Pages --

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Equity" value={`$${portfolio.totalEquity.toLocaleString(undefined, {maximumFractionDigits: 0})}`} trend={portfolio.dailyPnLPercent} highlight />
        <MetricCard label="Daily PnL" value={`$${portfolio.dailyPnL.toFixed(2)}`} trend={portfolio.dailyPnLPercent} />
        <MetricCard label="Sharpe Ratio" value={portfolio.sharpeRatio.toFixed(2)} subValue="Risk-Adjusted Return" />
        <MetricCard label="Active Positions" value={portfolio.openPositions.toString()} subValue="Exposure: 65%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-semibold text-gray-200">Equity Curve</h3>
               <div className="flex space-x-2">
                 {['1D', '1W', '1M', 'YTD'].map(tf => (
                   <button key={tf} className="px-3 py-1 text-xs font-medium rounded bg-gray-800 text-gray-400 hover:text-white transition-colors">{tf}</button>
                 ))}
               </div>
             </div>
             <EquityChart data={equityData} />
          </div>
          <RecentTrades trades={trades} />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Live Market</h3>
            <div className="space-y-3">
              {tickers.map(t => (
                <div key={t.symbol} className="flex justify-between items-center p-3 bg-gray-950/50 rounded-lg">
                  <div>
                    <div className="font-bold text-gray-200">{t.symbol}</div>
                    <div className="text-xs text-gray-500">Vol: {(t.volume/1000).toFixed(1)}k</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-gray-200">${t.price.toFixed(2)}</div>
                    <div className={`text-xs font-mono ${t.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.changePercent > 0 ? '+' : ''}{t.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-24 h-24 text-blue-500" />
             </div>
             <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Analyst</h3>
             <p className="text-sm text-gray-400 mb-4">Gemini 2.5 is monitoring news flow and market structure.</p>
             <button onClick={() => setActiveTab('analysis')} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
               Open Intelligence Hub
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Market Intelligence</h2>
           <p className="text-gray-400">Powered by Gemini 2.5 Flash • Sentiment & Macro Analysis</p>
        </div>
        <button 
          onClick={handleAnalyzeMarket}
          disabled={isAnalyzing}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
          {isAnalyzing ? 'Analyzing...' : 'Generate New Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Live News Feed</h3>
          <div className="space-y-4">
            {MOCK_NEWS.map(news => (
              <div key={news.id} className="flex items-start pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 mr-3 ${
                  news.sentiment === 'POSITIVE' ? 'bg-emerald-500' : 
                  news.sentiment === 'NEGATIVE' ? 'bg-rose-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h4 className="text-sm font-medium text-gray-200">{news.headline}</h4>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-blue-400">{news.source}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-500">{news.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Gemini Insight</h3>
          <div className="flex-1 bg-gray-950/50 rounded-lg p-4 border border-gray-800 font-mono text-sm text-gray-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {aiAnalysis ? aiAnalysis : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <BrainCircuit className="w-12 h-12 mb-3 opacity-20" />
                <p>Click "Generate New Report" to analyze current market conditions.</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
             <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
             <span>AI generated content can be inaccurate. Always verify before trading.</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBacktest = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Strategy Lab</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Environment:</span>
          <span className="px-2 py-1 text-xs font-mono bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20">SANDBOX</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Strategy Model</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500">
                {STRATEGIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                 <input type="date" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200" defaultValue="2023-01-01" />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                 <input type="date" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200" defaultValue="2023-12-31" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Initial Capital</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input type="number" className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-6 pr-3 py-2 text-sm text-gray-200" defaultValue="100000" />
              </div>
            </div>

             <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slippage Model</label>
              <select className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200">
                <option>Fixed (0.01%)</option>
                <option>Variable (Volatility Based)</option>
                <option>Zero (Ideal)</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleRunBacktest}
                disabled={backtestStatus === BacktestStatus.RUNNING}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {backtestStatus === BacktestStatus.RUNNING ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          {backtestStatus === BacktestStatus.RUNNING && (
             <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
               <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${backtestProgress}%` }} />
             </div>
          )}

          {backtestStatus === BacktestStatus.COMPLETED ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                  <div className="text-gray-500 text-xs">Total Return</div>
                  <div className="text-xl font-bold text-emerald-400">+24.5%</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                   <div className="text-gray-500 text-xs">Max Drawdown</div>
                   <div className="text-xl font-bold text-rose-400">-12.3%</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                   <div className="text-gray-500 text-xs">Sharpe</div>
                   <div className="text-xl font-bold text-gray-200">1.85</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-4">Cumulative Returns vs Benchmark</h3>
                <EquityChart data={equityData} color="#10b981" />
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-4">Feature Importance (Model Explainability)</h3>
                <FeatureImportanceChart data={[
                  { feature: 'RSI_14', score: 0.85 },
                  { feature: 'MACD_Diff', score: 0.65 },
                  { feature: 'Vol_SMA_20', score: 0.55 },
                  { feature: 'News_Sentiment', score: 0.45 },
                  { feature: 'SPY_Corr', score: 0.30 },
                ]} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
               <Cpu className="w-16 h-16 mb-4 opacity-20" />
               <p>Configure parameters and run simulation to view results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderExecution = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-xl">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isLive ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
            <div>
              <h2 className="text-lg font-bold text-white">{isLive ? 'LIVE TRADING ENABLED' : 'PAPER TRADING MODE'}</h2>
              <p className="text-xs text-gray-400 font-mono">Gateway: IBKR Pro (Fix Protocol)</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
               <div className="text-xs text-gray-500">Risk Utilization</div>
               <div className="text-sm font-bold text-emerald-400">12% / 100%</div>
            </div>
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                isLive 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isLive ? 'Switch to Paper' : 'Go Live'}
            </button>
            <button className="p-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/40" title="Emergency Kill Switch">
              <Skull className="w-5 h-5" />
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-200 mb-4">Active Orders</h3>
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-500 font-medium">
                    <tr>
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Side</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="py-3 font-medium text-gray-200">NVDA</td>
                      <td className="py-3 text-gray-400">LMT</td>
                      <td className="py-3 text-emerald-400">BUY</td>
                      <td className="py-3 text-right font-mono">10</td>
                      <td className="py-3 text-right font-mono">$475.00</td>
                      <td className="py-3 text-right text-red-400 cursor-pointer hover:underline">Cancel</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-gray-200">MSFT</td>
                      <td className="py-3 text-gray-400">STP</td>
                      <td className="py-3 text-rose-400">SELL</td>
                      <td className="py-3 text-right font-mono">25</td>
                      <td className="py-3 text-right font-mono">$378.50</td>
                      <td className="py-3 text-right text-red-400 cursor-pointer hover:underline">Cancel</td>
                    </tr>
                  </tbody>
                </table>
             </div>
             
             <RecentTrades trades={trades} />
          </div>

          <div className="space-y-6">
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
               <h3 className="text-sm font-semibold text-gray-200 mb-4">Manual Override</h3>
               <div className="space-y-3">
                 <input type="text" placeholder="Symbol (e.g. AAPL)" className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                 <div className="grid grid-cols-2 gap-3">
                   <button className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-medium">BUY</button>
                   <button className="bg-rose-600 hover:bg-rose-500 text-white py-2 rounded font-medium">SELL</button>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Qty" className="bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                    <input type="number" placeholder="Price" className="bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                 </div>
               </div>
             </div>

             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
               <h3 className="text-sm font-semibold text-gray-200 mb-4">System Health</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Data Feed Latency</span>
                   <span className="text-emerald-400">12ms</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Execution Gateway</span>
                   <span className="text-emerald-400">Connected</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Risk Checks</span>
                   <span className="text-emerald-400">Passing</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Model Drift</span>
                   <span className="text-emerald-400">0.02 (Low)</span>
                 </div>
               </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      systemStatus={isLive ? 'ONLINE' : 'MAINTENANCE'}
    >
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'analysis' && renderAnalysis()}
      {activeTab === 'backtest' && renderBacktest()}
      {activeTab === 'execution' && renderExecution()}
      {activeTab === 'settings' && (
        <div className="text-center py-20 text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold">System Configuration</h2>
          <p className="mt-2">API Keys, Docker container status, and database connections are managed in the secure backend env.</p>
        </div>
      )}
    </Layout>
  );
};

export default App;