"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  PieChart,
  Info,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FundDetail } from "@/lib/types";
import { formatCurrency, formatPercentage, formatLargeNumber, formatNumber, cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  "Hisse Senedi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Tahvil/Bono": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Karma: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Para Piyasasi": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  Altin: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Degisken: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Katilim: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
};

const riskColors: Record<number, string> = {
  1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  2: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  4: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  5: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  6: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  7: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function ReturnBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted p-3">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </span>
      <span
        className={cn(
          "text-base font-bold tabular-nums",
          value > 0
            ? "text-green-600 dark:text-green-400"
            : value < 0
              ? "text-red-600 dark:text-red-400"
              : "text-muted-foreground"
        )}
      >
        {formatPercentage(value)}
      </span>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function FundDetailPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code;

  const [fund, setFund] = useState<FundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchFund = useCallback(async () => {
    try {
      const res = await fetch(`/api/funds/${code}`);
      if (!res.ok) throw new Error();
      setFund(await res.json());
    } catch {
      setFund(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchFund();
  }, [fetchFund]);

  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/funds/${code}/sync`, { method: "POST" });
      if (!res.ok) throw new Error();
      setFund(await res.json());
    } catch {
      // hata
    } finally {
      setSyncing(false);
    }
  }, [code, syncing]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">Yukleniyor...</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Fon bulunamadi</h1>
        </div>
      </div>
    );
  }

  const lastSync = fund.syncedAt
    ? new Date(fund.syncedAt).toLocaleString("tr-TR")
    : "Henuz sync yapilmadi";

  const returns = [
    { label: "Gunluk", value: fund.dailyReturn },
    { label: "Haftalik", value: fund.weeklyReturn },
    { label: "Aylik", value: fund.monthlyReturn },
    { label: "3 Aylik", value: fund.threeMonthReturn },
    { label: "6 Aylik", value: fund.sixMonthReturn },
    { label: "YBB", value: fund.ytdReturn },
    { label: "Yillik", value: fund.annualReturn },
    { label: "3 Yillik", value: fund.threeYearReturn },
    { label: "5 Yillik", value: fund.fiveYearReturn },
  ].filter((r) => r.value != null);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Button variant="ghost" size="sm" className="-ml-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-2xl font-extrabold font-mono text-primary md:text-3xl">
            {fund.code}
          </span>
          <Badge className={cn("text-xs", typeColors[fund.type] ?? "")} variant="outline">
            {fund.type}
          </Badge>
          <Badge className={cn("text-xs", riskColors[fund.riskLevel] ?? "")} variant="outline">
            Risk {fund.riskLevel}/7
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground ml-8">{fund.name}</p>
      </div>

      {/* Sync */}
      <div className="flex items-center gap-3 ml-8 sm:ml-0">
        <Button onClick={handleSync} disabled={syncing} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          {syncing ? "Veriler cekiliyor..." : "Verileri Guncelle"}
        </Button>
        <span className="text-xs text-muted-foreground">Son sync: {lastSync}</span>
      </div>

      {/* Returns Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {returns.map((r) => (
          <ReturnBadge key={r.label} value={r.value!} label={r.label} />
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fon Bilgileri */}
        <SectionCard title="Fon Bilgileri" icon={Info}>
          <MetricRow label="Fon Buyuklugu" value={formatLargeNumber(fund.fundSize)} />
          <MetricRow label="Toplam Deger" value={formatLargeNumber(fund.totalValue)} />
          <MetricRow label="Yatirimci Sayisi" value={formatNumber(fund.investorCount)} />
          <MetricRow label="Yonetim Ucreti" value={`${fund.managementFee.toFixed(2)}%`} />
          <MetricRow label="Giris Komisyonu" value={fund.entryFee != null ? `${fund.entryFee.toFixed(2)}%` : null} />
          <MetricRow label="Cikis Komisyonu" value={fund.exitFee != null ? `${fund.exitFee.toFixed(2)}%` : null} />
          <MetricRow label="Min. Yatirim" value={fund.minInvestment != null ? formatCurrency(fund.minInvestment) : null} />
          <MetricRow label="Kurulus Tarihi" value={fund.launchDate} />
          <MetricRow label="Benchmark" value={fund.benchmark} />
          <MetricRow label="Fon Yoneticisi" value={fund.manager} />
          <MetricRow label="Saklayici" value={fund.custodian} />
        </SectionCard>

        {/* Risk Metrikleri */}
        {(fund.sharpeRatio != null || fund.standardDeviation != null || fund.maxDrawdown != null) && (
          <SectionCard title="Risk Metrikleri" icon={ShieldCheck}>
            <MetricRow label="Sharpe Orani" value={fund.sharpeRatio?.toFixed(2)} />
            <MetricRow label="Std. Sapma (Volatilite)" value={fund.standardDeviation != null ? `${fund.standardDeviation.toFixed(2)}%` : null} />
            <MetricRow label="Maks. Dusus" value={fund.maxDrawdown != null ? `${fund.maxDrawdown.toFixed(2)}%` : null} />
            <MetricRow label="Beta" value={fund.beta?.toFixed(2)} />
            <MetricRow label="Alpha" value={fund.alpha?.toFixed(2)} />
            <MetricRow label="Tracking Error" value={fund.trackingError?.toFixed(2)} />
          </SectionCard>
        )}

        {/* Varlik Dagilimi */}
        {(fund.totalStockWeight != null || fund.totalBondWeight != null) && (
          <SectionCard title="Varlik Dagilimi" icon={PieChart}>
            <MetricRow label="Hisse" value={fund.totalStockWeight != null ? `${fund.totalStockWeight.toFixed(1)}%` : null} />
            <MetricRow label="Tahvil/Bono" value={fund.totalBondWeight != null ? `${fund.totalBondWeight.toFixed(1)}%` : null} />
            <MetricRow label="Nakit" value={fund.totalCashWeight != null ? `${fund.totalCashWeight.toFixed(1)}%` : null} />
            <MetricRow label="Diger" value={fund.totalOtherWeight != null ? `${fund.totalOtherWeight.toFixed(1)}%` : null} />
          </SectionCard>
        )}

        {/* Portfoy Detay */}
        {fund.portfolio && fund.portfolio.length > 0 && (
          <SectionCard title="Portfoy Dagilimi (Detay)" icon={List}>
            {fund.portfolio.map((p, i) => (
              <MetricRow key={i} label={p.asset} value={`${p.weight.toFixed(1)}%`} />
            ))}
          </SectionCard>
        )}
      </div>
    </div>
  );
}
