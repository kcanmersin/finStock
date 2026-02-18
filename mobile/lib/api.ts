import { Fund, FundDetail, Stock, StockDetail, Analysis } from "./types";

// Gelistirme: bilgisayarinin yerel IP adresini yaz
// Android emulator icin: 10.0.2.2
// iOS simulator icin: localhost
// Fiziksel cihaz icin: bilgisayarinin Wi-Fi IP adresi (ornek: 192.168.1.42)
const BASE_URL = __DEV__
  ? "http://10.0.2.2:8000"
  : "https://api.finstock.app"; // production URL

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API hatasi: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getFunds: () => fetchJSON<Fund[]>("/api/funds"),
  getFund: (code: string) => fetchJSON<FundDetail>(`/api/funds/${code}`),
  syncFund: async (code: string): Promise<FundDetail> => {
    const res = await fetch(`${BASE_URL}/api/funds/${code}/sync`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Sync hatasi: ${res.status}`);
    return res.json();
  },
  getStocks: () => fetchJSON<Stock[]>("/api/stocks"),
  getAnalyses: () => fetchJSON<Analysis[]>("/api/analyses"),
  getAnalysis: (id: string) => fetchJSON<Analysis>(`/api/analyses/${id}`),
  getStock: (symbol: string) => fetchJSON<StockDetail>(`/api/stocks/${symbol}`),
  syncStock: async (symbol: string): Promise<StockDetail> => {
    const res = await fetch(`${BASE_URL}/api/stocks/${symbol}/sync`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Sync hatasi: ${res.status}`);
    return res.json();
  },
  deleteAnalysis: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/analyses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Silme hatasi: ${res.status}`);
    return res.json();
  },
};
