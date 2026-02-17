export interface Fund {
  id: string;
  name: string;
  code: string;
  type: FundType;
  riskLevel: number;
  managementFee: number;
  totalValue: number;
  monthlyReturn: number;
  annualReturn: number;
  dailyReturn: number;
  fundSize: number;
  investorCount: number;
  launchDate: string;
}

export type FundType =
  | "Hisse Senedi"
  | "Tahvil/Bono"
  | "Karma"
  | "Para Piyasasi"
  | "Altin"
  | "Degisken"
  | "Katilim";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  dailyChange: number;
  dailyChangeAmount: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  weeklyReturn: number;
  monthlyReturn: number;
  annualReturn: number;
  sector: string;
  lastUpdate: string;
}

export interface StockDetail extends Stock {
  description?: string;
  website?: string;
  employees?: number;
  founded?: string;
  ceo?: string;
  headquarters?: string;

  eps?: number;
  dividendYield?: number;
  roe?: number;
  roa?: number;
  netMargin?: number;
  grossMargin?: number;
  debtToEquity?: number;
  currentRatio?: number;
  beta?: number;

  high52w?: number;
  low52w?: number;
  avgVolume?: number;
  openPrice?: number;
  previousClose?: number;
  dayHigh?: number;
  dayLow?: number;

  revenue?: number;
  netIncome?: number;
  ebitda?: number;

  priceHistory?: { date: string; close: number; volume: number }[];
  syncedAt?: string;
}

export interface Analysis {
  id: string;
  title: string;
  createdAt: string;
  type: "fund" | "stock";
  summary: string;
  recommendations: AnalysisRecommendation[];
  rawData: Record<string, unknown>[];
  fileName: string;
}

export interface AnalysisRecommendation {
  name: string;
  action: "AL" | "TUT" | "SAT" | "IZLE";
  score: number;
  reasoning: string;
}
