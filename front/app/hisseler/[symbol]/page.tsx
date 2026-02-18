"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, TrendingUp, BarChart3, Calculator, Building2, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockDetail } from "@/lib/types";
import { formatCurrency, formatPercentage, formatLargeNumber, formatNumber, cn } from "@/lib/utils";

function ReturnBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted p-3">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </span>
      <span
        className={cn(
          "text-base font-bold tabular-nums",
          value > 0 ? "text-green-600 dark:text-green-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
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

export default function StockDetailPage() {
  const params = useParams<{ symbol: string }>();
  const router = useRouter();
  const symbol = params.symbol;

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch(`/api/stocks/${symbol}`);
      if (!res.ok) throw new Error();
      setStock(await res.json());
    } catch {
      setStock(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/stocks/${symbol}/sync`, { method: "POST" });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStock(updated);
    } catch {
      // hata
    } finally {
      setSyncing(false);
    }
  }, [symbol, syncing]);

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

  if (!stock) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Hisse bulunamadi</h1>
        </div>
      </div>
    );
  }

  const lastSync = stock.syncedAt
    ? new Date(stock.syncedAt).toLocaleString("tr-TR")
    : "Henuz sync yapilmadi";

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" className="-ml-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-2xl font-extrabold font-mono text-primary md:text-3xl">
              {stock.symbol}
            </span>
            <Badge variant="outline">{stock.sector}</Badge>
          </div>
          <p className="text-sm text-muted-foreground ml-8">{stock.name}</p>
        </div>

        <div className="flex flex-col items-start sm:items-end ml-8 sm:ml-0">
          <span className="text-2xl font-extrabold tabular-nums md:text-3xl">
            {formatCurrency(stock.price)}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-semibold",
                stock.dailyChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {formatPercentage(stock.dailyChange)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({stock.dailyChangeAmount > 0 ? "+" : ""}{formatCurrency(stock.dailyChangeAmount)})
            </span>
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="flex items-center gap-3 ml-8 sm:ml-0">
        <Button onClick={handleSync} disabled={syncing} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          {syncing ? "Veriler cekiliyor..." : "Verileri Guncelle"}
        </Button>
        <span className="text-xs text-muted-foreground">Son sync: {lastSync}</span>
      </div>

      {/* Returns */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ReturnBadge value={stock.dailyChange} label="Gunluk" />
        <ReturnBadge value={stock.weeklyReturn} label="Haftalik" />
        <ReturnBadge value={stock.monthlyReturn} label="Aylik" />
        <ReturnBadge value={stock.annualReturn} label="Yillik" />
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fiyat Bilgileri */}
        <SectionCard title="Fiyat Bilgileri" icon={DollarSign}>
          <MetricRow label="Acilis" value={stock.openPrice != null ? formatCurrency(stock.openPrice) : null} />
          <MetricRow label="Onceki Kapanis" value={stock.previousClose != null ? formatCurrency(stock.previousClose) : null} />
          <MetricRow label="Gun Ici En Yuksek" value={stock.dayHigh != null ? formatCurrency(stock.dayHigh) : null} />
          <MetricRow label="Gun Ici En Dusuk" value={stock.dayLow != null ? formatCurrency(stock.dayLow) : null} />
          <MetricRow label="52H En Yuksek" value={stock.high52w != null ? formatCurrency(stock.high52w) : null} />
          <MetricRow label="52H En Dusuk" value={stock.low52w != null ? formatCurrency(stock.low52w) : null} />
        </SectionCard>

        {/* Piyasa Verileri */}
        <SectionCard title="Piyasa Verileri" icon={BarChart3}>
          <MetricRow label="Piyasa Degeri" value={formatLargeNumber(stock.marketCap)} />
          <MetricRow label="Islem Hacmi" value={formatLargeNumber(stock.volume)} />
          <MetricRow label="Ort. Hacim" value={stock.avgVolume != null ? formatLargeNumber(stock.avgVolume) : null} />
          <MetricRow label="F/K Orani" value={stock.peRatio.toFixed(2)} />
          <MetricRow label="PD/DD Orani" value={stock.pbRatio.toFixed(2)} />
          <MetricRow label="Beta" value={stock.beta?.toFixed(2)} />
        </SectionCard>

        {/* Finansal Oranlar */}
        {(stock.eps != null || stock.roe != null || stock.dividendYield != null) && (
          <SectionCard title="Finansal Oranlar" icon={Calculator}>
            <MetricRow label="Hisse Basina Kar (EPS)" value={stock.eps?.toFixed(2)} />
            <MetricRow label="Temettu Verimi" value={stock.dividendYield != null ? `${stock.dividendYield.toFixed(2)}%` : null} />
            <MetricRow label="Ozkaynak Karliligi (ROE)" value={stock.roe != null ? `${stock.roe.toFixed(2)}%` : null} />
            <MetricRow label="Aktif Karliligi (ROA)" value={stock.roa != null ? `${stock.roa.toFixed(2)}%` : null} />
            <MetricRow label="Net Kar Marji" value={stock.netMargin != null ? `${stock.netMargin.toFixed(2)}%` : null} />
            <MetricRow label="Brut Kar Marji" value={stock.grossMargin != null ? `${stock.grossMargin.toFixed(2)}%` : null} />
            <MetricRow label="Borc/Ozkaynak" value={stock.debtToEquity?.toFixed(2)} />
            <MetricRow label="Cari Oran" value={stock.currentRatio?.toFixed(2)} />
          </SectionCard>
        )}

        {/* Gelir Tablosu */}
        {(stock.revenue != null || stock.netIncome != null) && (
          <SectionCard title="Gelir Tablosu (Son Donem)" icon={FileText}>
            <MetricRow label="Gelir" value={stock.revenue != null ? formatLargeNumber(stock.revenue) : null} />
            <MetricRow label="Net Kar" value={stock.netIncome != null ? formatLargeNumber(stock.netIncome) : null} />
            <MetricRow label="FAVOK (EBITDA)" value={stock.ebitda != null ? formatLargeNumber(stock.ebitda) : null} />
          </SectionCard>
        )}

        {/* Sirket Bilgileri */}
        {(stock.description || stock.ceo) && (
          <SectionCard title="Sirket Bilgileri" icon={Building2}>
            {stock.description && (
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {stock.description}
              </p>
            )}
            <MetricRow label="CEO" value={stock.ceo} />
            <MetricRow label="Merkez" value={stock.headquarters} />
            <MetricRow label="Calisan Sayisi" value={stock.employees != null ? formatNumber(stock.employees) : null} />
            <MetricRow label="Kurulus" value={stock.founded} />
            <MetricRow label="Website" value={stock.website} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
