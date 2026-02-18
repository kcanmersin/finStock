import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StockDetail } from "@/lib/types";
import { api } from "@/lib/api";
import { formatCurrency, formatPercentage, formatLargeNumber, formatNumber } from "@/lib/format";
import { Badge } from "@/components/Badge";
import { ReturnText } from "@/components/ReturnText";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

// Metric kartı
function MetricRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string | undefined;
  colors: (typeof Colors)["light"];
}) {
  if (!value && value !== "0") return null;
  return (
    <View style={[styles.metricRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

// Section başlığı
function SectionHeader({
  title,
  icon,
  colors,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: (typeof Colors)["light"];
}) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={colors.tint} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Sync buton animasyonu
  const rotation = useSharedValue(0);
  const syncIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const fetchStock = useCallback(async () => {
    if (!symbol) return;
    try {
      const data = await api.getStock(symbol);
      setStock(data);
    } catch {
      // stock bulunamadı
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleSync = useCallback(async () => {
    if (!symbol || syncing) return;
    setSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Döndürme animasyonu başlat
    rotation.value = withRepeat(
      withTiming(360, { duration: 800 }),
      -1, // sonsuz
      false
    );

    try {
      const updated = await api.syncStock(symbol);
      setStock(updated);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert("Sync Hatasi", "Veriler cekilemedi. Backend endpoint'ini kontrol edin.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      cancelAnimation(rotation);
      rotation.value = 0;
      setSyncing(false);
    }
  }, [symbol, syncing, rotation]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!stock) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.notFound, { color: colors.textSecondary }]}>
          Hisse bulunamadi
        </Text>
      </View>
    );
  }

  const lastSync = stock.syncedAt
    ? new Date(stock.syncedAt).toLocaleString("tr-TR")
    : "Henuz sync yapilmadi";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.symbol, { color: colors.tint }]}>{stock.symbol}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{stock.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={stock.sector} color="#3b82f6" bgColor="#dbeafe" />
          </View>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(stock.price)}
          </Text>
          <ReturnText value={stock.dailyChange} size="md" />
          <Text style={[styles.changeAmount, { color: colors.textSecondary }]}>
            {stock.dailyChangeAmount > 0 ? "+" : ""}
            {formatCurrency(stock.dailyChangeAmount)}
          </Text>
        </View>
      </View>

      {/* ========== SYNC BUTONU ========== */}
      <Pressable
        onPress={handleSync}
        disabled={syncing}
        style={[
          styles.syncBtn,
          {
            backgroundColor: syncing ? colors.muted : colors.tint,
            opacity: syncing ? 0.7 : 1,
          },
        ]}
      >
        <Animated.View style={syncIconStyle}>
          <Ionicons
            name="sync"
            size={20}
            color={syncing ? colors.textSecondary : "#fff"}
          />
        </Animated.View>
        <Text
          style={[
            styles.syncText,
            { color: syncing ? colors.textSecondary : "#fff" },
          ]}
        >
          {syncing ? "Veriler cekiliyor..." : "Verileri Guncelle"}
        </Text>
      </Pressable>
      <Text style={[styles.syncInfo, { color: colors.textSecondary }]}>
        Son sync: {lastSync}
      </Text>

      {/* ========== GETİRİ ========== */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionHeader title="Getiri Performansi" icon="trending-up" colors={colors} />
        <View style={styles.returnsGrid}>
          {[
            { label: "Gunluk", value: stock.dailyChange },
            { label: "Haftalik", value: stock.weeklyReturn },
            { label: "Aylik", value: stock.monthlyReturn },
            { label: "Yillik", value: stock.annualReturn },
          ].map((r) => (
            <View key={r.label} style={[styles.returnBox, { backgroundColor: colors.muted }]}>
              <Text style={[styles.returnLabel, { color: colors.textSecondary }]}>
                {r.label}
              </Text>
              <ReturnText value={r.value} size="md" />
            </View>
          ))}
        </View>
      </View>

      {/* ========== FİYAT BİLGİLERİ ========== */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionHeader title="Fiyat Bilgileri" icon="stats-chart" colors={colors} />
        <MetricRow label="Acilis" value={stock.openPrice != null ? formatCurrency(stock.openPrice) : undefined} colors={colors} />
        <MetricRow label="Onceki Kapanis" value={stock.previousClose != null ? formatCurrency(stock.previousClose) : undefined} colors={colors} />
        <MetricRow label="Gun Ici En Yuksek" value={stock.dayHigh != null ? formatCurrency(stock.dayHigh) : undefined} colors={colors} />
        <MetricRow label="Gun Ici En Dusuk" value={stock.dayLow != null ? formatCurrency(stock.dayLow) : undefined} colors={colors} />
        <MetricRow label="52 Hafta En Yuksek" value={stock.high52w != null ? formatCurrency(stock.high52w) : undefined} colors={colors} />
        <MetricRow label="52 Hafta En Dusuk" value={stock.low52w != null ? formatCurrency(stock.low52w) : undefined} colors={colors} />
      </View>

      {/* ========== PİYASA VERİLERİ ========== */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionHeader title="Piyasa Verileri" icon="bar-chart" colors={colors} />
        <MetricRow label="Piyasa Degeri" value={formatLargeNumber(stock.marketCap)} colors={colors} />
        <MetricRow label="Islem Hacmi" value={formatLargeNumber(stock.volume)} colors={colors} />
        <MetricRow label="Ort. Hacim" value={stock.avgVolume != null ? formatLargeNumber(stock.avgVolume) : undefined} colors={colors} />
        <MetricRow label="F/K Orani" value={stock.peRatio.toFixed(2)} colors={colors} />
        <MetricRow label="PD/DD Orani" value={stock.pbRatio.toFixed(2)} colors={colors} />
        <MetricRow label="Beta" value={stock.beta?.toFixed(2)} colors={colors} />
      </View>

      {/* ========== FİNANSAL ORANLAR ========== */}
      {(stock.eps != null || stock.roe != null || stock.dividendYield != null) && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Finansal Oranlar" icon="calculator" colors={colors} />
          <MetricRow label="Hisse Basina Kar (EPS)" value={stock.eps?.toFixed(2)} colors={colors} />
          <MetricRow label="Temettu Verimi" value={stock.dividendYield != null ? `${stock.dividendYield.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Ozkaynak Karliligi (ROE)" value={stock.roe != null ? `${stock.roe.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Aktif Karliligi (ROA)" value={stock.roa != null ? `${stock.roa.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Net Kar Marji" value={stock.netMargin != null ? `${stock.netMargin.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Brut Kar Marji" value={stock.grossMargin != null ? `${stock.grossMargin.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Borc/Ozkaynak" value={stock.debtToEquity?.toFixed(2)} colors={colors} />
          <MetricRow label="Cari Oran" value={stock.currentRatio?.toFixed(2)} colors={colors} />
        </View>
      )}

      {/* ========== GELİR TABLOSU ========== */}
      {(stock.revenue != null || stock.netIncome != null) && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Gelir Tablosu (Son Donem)" icon="document-text" colors={colors} />
          <MetricRow label="Gelir" value={stock.revenue != null ? formatLargeNumber(stock.revenue) : undefined} colors={colors} />
          <MetricRow label="Net Kar" value={stock.netIncome != null ? formatLargeNumber(stock.netIncome) : undefined} colors={colors} />
          <MetricRow label="FAVOK (EBITDA)" value={stock.ebitda != null ? formatLargeNumber(stock.ebitda) : undefined} colors={colors} />
        </View>
      )}

      {/* ========== ŞİRKET BİLGİSİ ========== */}
      {(stock.description || stock.ceo) && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Sirket Bilgileri" icon="business" colors={colors} />
          {stock.description && (
            <Text style={[styles.description, { color: colors.text }]}>
              {stock.description}
            </Text>
          )}
          <MetricRow label="CEO" value={stock.ceo} colors={colors} />
          <MetricRow label="Merkez" value={stock.headquarters} colors={colors} />
          <MetricRow label="Calisan Sayisi" value={stock.employees != null ? formatNumber(stock.employees) : undefined} colors={colors} />
          <MetricRow label="Kurulus" value={stock.founded} colors={colors} />
          <MetricRow label="Website" value={stock.website} colors={colors} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, marginTop: 12 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  symbol: { fontSize: 24, fontWeight: "800", fontFamily: "monospace" },
  name: { fontSize: 16, fontWeight: "500", marginTop: 4 },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  priceBlock: { alignItems: "flex-end" },
  price: { fontSize: 24, fontWeight: "800", fontVariant: ["tabular-nums"] },
  changeAmount: { fontSize: 12, marginTop: 2 },

  // Sync
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 6,
  },
  syncText: { fontSize: 15, fontWeight: "700" },
  syncInfo: { fontSize: 11, textAlign: "center", marginBottom: 20 },

  // Card
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  // Returns grid
  returnsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  returnBox: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  returnLabel: { fontSize: 11, fontWeight: "500", marginBottom: 4 },

  // Metric row
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: { fontSize: 14 },
  metricValue: { fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] },

  // Description
  description: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
});
