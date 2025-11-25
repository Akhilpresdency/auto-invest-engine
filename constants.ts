export const APP_NAME = "QuantMind AI";
export const APP_VERSION = "2.4.0-beta";

export const MOCK_TICKERS = [
  { symbol: 'AAPL', basePrice: 175.50 },
  { symbol: 'TSLA', basePrice: 240.20 },
  { symbol: 'BTC-USD', basePrice: 42500.00 },
  { symbol: 'ETH-USD', basePrice: 2250.00 },
  { symbol: 'NVDA', basePrice: 480.10 },
  { symbol: 'MSFT', basePrice: 380.00 },
  { symbol: 'EUR/USD', basePrice: 1.0950 },
];

export const STRATEGIES = [
  "Momentum Trend Following (LSTM)",
  "Mean Reversion (Transformer)",
  "Statistical Arbitrage",
  "Sentiment Analysis (LLM)"
];

export const MOCK_NEWS = [
  { id: '1', headline: "Fed signals potential rate cuts in late 2024", source: "MacroWire", time: "10m ago", sentiment: "POSITIVE" },
  { id: '2', headline: "Tech sector faces regulatory headwinds in EU", source: "Global Markets", time: "25m ago", sentiment: "NEGATIVE" },
  { id: '3', headline: "Oil prices stabilize as supply concerns ease", source: "Energy Daily", time: "1h ago", sentiment: "NEUTRAL" },
  { id: '4', headline: "Crypto volatility index hits 6-month low", source: "CoinDesk", time: "2h ago", sentiment: "POSITIVE" },
  { id: '5', headline: "NVDA announces breakthrough in AI chip efficiency", source: "TechCrunch", time: "3h ago", sentiment: "POSITIVE" },
] as const;