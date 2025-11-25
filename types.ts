export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  price: number;
  size: number;
  timestamp: string;
  status: OrderStatus;
  pnl?: number;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface PortfolioMetrics {
  totalEquity: number;
  cashBalance: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  sharpeRatio: number;
  drawdown: number;
  openPositions: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export enum BacktestStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED'
}

export interface BacktestConfig {
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategy: string;
}