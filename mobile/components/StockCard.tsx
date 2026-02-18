import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Stock } from "@/lib/types";
import { formatCurrency, formatPercentage, formatLargeNumber } from "@/lib/format";
import { Badge } from "./Badge";
import { ReturnText } from "./ReturnText";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

const sectorColorMap: Record<string, { color: string; bg: string }> = {
  Banka: { color: "#3b82f6", bg: "#dbeafe" },
  Teknoloji: { color: "#8b5cf6", bg: "#ede9fe" },
  Enerji: { color: "#f59e0b", bg: "#fef3c7" },
  Saglik: { color: "#ef4444", bg: "#fee2e2" },
  Insaat: { color: "#6b7280", bg: "#f3f4f6" },
  Gida: { color: "#059669", bg: "#d1fae5" },
  Ulasim: { color: "#0891b2", bg: "#cffafe" },
  Perakende: { color: "#d946ef", bg: "#fae8ff" },
  Holding: { color: "#6366f1", bg: "#e0e7ff" },
};

interface StockCardProps {
  stock: Stock;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StockCard({ stock, onPress }: StockCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sectorColor = sectorColorMap[stock.sector] ?? { color: "#6b7280", bg: "#f3f4f6" };

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, animatedStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.symbolRow}>
            <Text style={[styles.symbol, { color: colors.tint }]}>{stock.symbol}</Text>
            <Badge label={stock.sector} color={sectorColor.color} bgColor={sectorColor.bg} />
          </View>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(stock.price)}
          </Text>
          <ReturnText value={stock.dailyChange} size="sm" />
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Haftalik</Text>
          <ReturnText value={stock.weeklyReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Aylik</Text>
          <ReturnText value={stock.monthlyReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Yillik</Text>
          <ReturnText value={stock.annualReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Hacim</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {formatLargeNumber(stock.volume)}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>F/K</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {stock.peRatio.toFixed(1)}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  symbolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  symbol: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  metric: {
    minWidth: "18%",
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
});
