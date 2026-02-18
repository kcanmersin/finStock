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

export interface FundDetail extends Fund {
  // Portfoy dagilimi
  portfolio?: { asset: string; weight: number }[];

  // Performans metrikleri
  weeklyReturn?: number;
  threeMonthReturn?: number;
  sixMonthReturn?: number;
  ytdReturn?: number;
  threeYearReturn?: number;
  fiveYearReturn?: number;

  // Risk metrikleri
  sharpeRatio?: number;
  standardDeviation?: number;
  maxDrawdown?: number;
  beta?: number;
  alpha?: number;
  trackingError?: number;

  // Fon bilgileri
  benchmark?: string;
  manager?: string;
  custodian?: string;
  kap?: string;
  minInvestment?: number;
  entryFee?: number;
  exitFee?: number;

  // Varlik dagilimi ozeti
  totalBondWeight?: number;
  totalStockWeight?: number;
  totalCashWeight?: number;
  totalOtherWeight?: number;

  // Tarihsel birim pay degeri
  navHistory?: { date: string; nav: number }[];

  // Meta
  syncedAt?: string;
}

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
  // Temel bilgiler
  description?: string;
  website?: string;
  employees?: number;
  founded?: string;
  ceo?: string;
  headquarters?: string;

  // Finansal metrikler
  eps?: number;           // Hisse basina kar
  dividendYield?: number; // Temettü verimi %
  roe?: number;           // Ozkaynak karliligi %
  roa?: number;           // Aktif karliligi %
  netMargin?: number;     // Net kar marji %
  grossMargin?: number;   // Brut kar marji %
  debtToEquity?: number;  // Borc/Ozkaynak orani
  currentRatio?: number;  // Cari oran
  beta?: number;          // Beta katsayisi

  // Fiyat seviyeleri
  high52w?: number;       // 52 haftalik en yuksek
  low52w?: number;        // 52 haftalik en dusuk
  avgVolume?: number;     // Ortalama hacim
  openPrice?: number;     // Acilis fiyati
  previousClose?: number; // Onceki kapanis
  dayHigh?: number;       // Gun ici en yuksek
  dayLow?: number;        // Gun ici en dusuk

  // Gelir tablosu (son donem)
  revenue?: number;       // Gelir
  netIncome?: number;     // Net kar
  ebitda?: number;        // FAVOK

  // Tarihsel fiyat verisi
  priceHistory?: { date: string; close: number; volume: number }[];

  // Meta
  syncedAt?: string;      // Son sync zamani
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

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith";

export interface ColumnFilter {
  columnId: string;
  operator: FilterOperator;
  value: string | number;
}
