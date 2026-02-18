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
  cancelAnimation,
} from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FundDetail } from "@/lib/types";
import { api } from "@/lib/api";
import { formatCurrency, formatPercentage, formatLargeNumber, formatNumber } from "@/lib/format";
import { Badge } from "@/components/Badge";
import { ReturnText } from "@/components/ReturnText";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

const typeColorMap: Record<string, { color: string; bg: string }> = {
  "Hisse Senedi": { color: "#3b82f6", bg: "#dbeafe" },
  "Tahvil/Bono": { color: "#8b5cf6", bg: "#ede9fe" },
  Karma: { color: "#14b8a6", bg: "#ccfbf1" },
  "Para Piyasasi": { color: "#6b7280", bg: "#f3f4f6" },
  Altin: { color: "#d97706", bg: "#fef3c7" },
  Degisken: { color: "#6366f1", bg: "#e0e7ff" },
  Katilim: { color: "#059669", bg: "#d1fae5" },
};

const riskColorMap: Record<number, { color: string; bg: string }> = {
  1: { color: "#16a34a", bg: "#dcfce7" },
  2: { color: "#16a34a", bg: "#dcfce7" },
  3: { color: "#ca8a04", bg: "#fef9c3" },
  4: { color: "#ca8a04", bg: "#fef9c3" },
  5: { color: "#ea580c", bg: "#ffedd5" },
  6: { color: "#dc2626", bg: "#fee2e2" },
  7: { color: "#dc2626", bg: "#fee2e2" },
};

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
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

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

export default function FundDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [fund, setFund] = useState<FundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const rotation = useSharedValue(0);
  const syncIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const fetchFund = useCallback(async () => {
    if (!code) return;
    try {
      const data = await api.getFund(code);
      setFund(data);
    } catch {
      // fon bulunamadı
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchFund();
  }, [fetchFund]);

  const handleSync = useCallback(async () => {
    if (!code || syncing) return;
    setSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    rotation.value = withRepeat(withTiming(360, { duration: 800 }), -1, false);

    try {
      const updated = await api.syncFund(code);
      setFund(updated);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert("Sync Hatasi", "Veriler cekilemedi. Backend endpoint'ini kontrol edin.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      cancelAnimation(rotation);
      rotation.value = 0;
      setSyncing(false);
    }
  }, [code, syncing, rotation]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!fund) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.notFound, { color: colors.textSecondary }]}>Fon bulunamadi</Text>
      </View>
    );
  }

  const typeColor = typeColorMap[fund.type] ?? { color: "#6b7280", bg: "#f3f4f6" };
  const riskColor = riskColorMap[fund.riskLevel] ?? { color: "#6b7280", bg: "#f3f4f6" };
  const lastSync = fund.syncedAt
    ? new Date(fund.syncedAt).toLocaleString("tr-TR")
    : "Henuz sync yapilmadi";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.code, { color: colors.tint }]}>{fund.code}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{fund.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={fund.type} color={typeColor.color} bgColor={typeColor.bg} />
            <Badge label={`Risk ${fund.riskLevel}/7`} color={riskColor.color} bgColor={riskColor.bg} />
          </View>
        </View>
      </View>

      {/* SYNC BUTONU */}
      <Pressable
        onPress={handleSync}
        disabled={syncing}
        style={[
          styles.syncBtn,
          { backgroundColor: syncing ? colors.muted : colors.tint, opacity: syncing ? 0.7 : 1 },
        ]}
      >
        <Animated.View style={syncIconStyle}>
          <Ionicons name="sync" size={20} color={syncing ? colors.textSecondary : "#fff"} />
        </Animated.View>
        <Text style={[styles.syncText, { color: syncing ? colors.textSecondary : "#fff" }]}>
          {syncing ? "Veriler cekiliyor..." : "Verileri Guncelle"}
        </Text>
      </Pressable>
      <Text style={[styles.syncInfo, { color: colors.textSecondary }]}>Son sync: {lastSync}</Text>

      {/* GETİRİ PERFORMANSI */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionHeader title="Getiri Performansi" icon="trending-up" colors={colors} />
        <View style={styles.returnsGrid}>
          {[
            { label: "Gunluk", value: fund.dailyReturn },
            { label: "Haftalik", value: fund.weeklyReturn },
            { label: "Aylik", value: fund.monthlyReturn },
            { label: "3 Aylik", value: fund.threeMonthReturn },
            { label: "6 Aylik", value: fund.sixMonthReturn },
            { label: "YBB", value: fund.ytdReturn },
            { label: "Yillik", value: fund.annualReturn },
            { label: "3 Yillik", value: fund.threeYearReturn },
            { label: "5 Yillik", value: fund.fiveYearReturn },
          ]
            .filter((r) => r.value != null)
            .map((r) => (
              <View key={r.label} style={[styles.returnBox, { backgroundColor: colors.muted }]}>
                <Text style={[styles.returnLabel, { color: colors.textSecondary }]}>{r.label}</Text>
                <ReturnText value={r.value!} size="md" />
              </View>
            ))}
        </View>
      </View>

      {/* FON BİLGİLERİ */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionHeader title="Fon Bilgileri" icon="information-circle" colors={colors} />
        <MetricRow label="Fon Buyuklugu" value={formatLargeNumber(fund.fundSize)} colors={colors} />
        <MetricRow label="Toplam Deger" value={formatLargeNumber(fund.totalValue)} colors={colors} />
        <MetricRow label="Yatirimci Sayisi" value={formatNumber(fund.investorCount)} colors={colors} />
        <MetricRow label="Yonetim Ucreti" value={`${fund.managementFee.toFixed(2)}%`} colors={colors} />
        <MetricRow label="Giris Komisyonu" value={fund.entryFee != null ? `${fund.entryFee.toFixed(2)}%` : undefined} colors={colors} />
        <MetricRow label="Cikis Komisyonu" value={fund.exitFee != null ? `${fund.exitFee.toFixed(2)}%` : undefined} colors={colors} />
        <MetricRow label="Min. Yatirim" value={fund.minInvestment != null ? formatCurrency(fund.minInvestment) : undefined} colors={colors} />
        <MetricRow label="Kurulus Tarihi" value={fund.launchDate} colors={colors} />
        <MetricRow label="Benchmark" value={fund.benchmark} colors={colors} />
        <MetricRow label="Fon Yoneticisi" value={fund.manager} colors={colors} />
        <MetricRow label="Saklayici" value={fund.custodian} colors={colors} />
      </View>

      {/* RİSK METRİKLERİ */}
      {(fund.sharpeRatio != null || fund.standardDeviation != null || fund.maxDrawdown != null) && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Risk Metrikleri" icon="shield-checkmark" colors={colors} />
          <MetricRow label="Sharpe Orani" value={fund.sharpeRatio?.toFixed(2)} colors={colors} />
          <MetricRow label="Std. Sapma (Volatilite)" value={fund.standardDeviation != null ? `${fund.standardDeviation.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Maks. Dusus" value={fund.maxDrawdown != null ? `${fund.maxDrawdown.toFixed(2)}%` : undefined} colors={colors} />
          <MetricRow label="Beta" value={fund.beta?.toFixed(2)} colors={colors} />
          <MetricRow label="Alpha" value={fund.alpha?.toFixed(2)} colors={colors} />
          <MetricRow label="Tracking Error" value={fund.trackingError?.toFixed(2)} colors={colors} />
        </View>
      )}

      {/* VARLIK DAĞILIMI */}
      {(fund.totalStockWeight != null || fund.totalBondWeight != null) && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Varlik Dagilimi" icon="pie-chart" colors={colors} />
          <MetricRow label="Hisse" value={fund.totalStockWeight != null ? `${fund.totalStockWeight.toFixed(1)}%` : undefined} colors={colors} />
          <MetricRow label="Tahvil/Bono" value={fund.totalBondWeight != null ? `${fund.totalBondWeight.toFixed(1)}%` : undefined} colors={colors} />
          <MetricRow label="Nakit" value={fund.totalCashWeight != null ? `${fund.totalCashWeight.toFixed(1)}%` : undefined} colors={colors} />
          <MetricRow label="Diger" value={fund.totalOtherWeight != null ? `${fund.totalOtherWeight.toFixed(1)}%` : undefined} colors={colors} />
        </View>
      )}

      {/* PORTFÖY DETAY */}
      {fund.portfolio && fund.portfolio.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionHeader title="Portfoy Dagilimi (Detay)" icon="list" colors={colors} />
          {fund.portfolio.map((p, i) => (
            <MetricRow key={i} label={p.asset} value={`${p.weight.toFixed(1)}%`} colors={colors} />
          ))}
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

  header: { marginBottom: 16 },
  headerLeft: { flex: 1 },
  code: { fontSize: 24, fontWeight: "800", fontFamily: "monospace" },
  name: { fontSize: 15, fontWeight: "500", marginTop: 4 },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 8 },

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

  card: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  returnsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  returnBox: { flex: 1, minWidth: "28%", borderRadius: 10, padding: 12, alignItems: "center" },
  returnLabel: { fontSize: 11, fontWeight: "500", marginBottom: 4 },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: { fontSize: 14 },
  metricValue: { fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
