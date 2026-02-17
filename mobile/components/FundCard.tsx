import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Fund } from "@/lib/types";
import { formatPercentage, formatLargeNumber } from "@/lib/format";
import { Badge } from "./Badge";
import { ReturnText } from "./ReturnText";
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

interface FundCardProps {
  fund: Fund;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FundCard({ fund, onPress }: FundCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const typeColor = typeColorMap[fund.type] ?? { color: "#6b7280", bg: "#f3f4f6" };
  const riskColor = riskColorMap[fund.riskLevel] ?? { color: "#6b7280", bg: "#f3f4f6" };

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
          <Text style={[styles.code, { color: colors.tint }]}>{fund.code}</Text>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {fund.name}
          </Text>
        </View>
        <View style={styles.badges}>
          <Badge label={fund.type} color={typeColor.color} bgColor={typeColor.bg} />
          <Badge label={`${fund.riskLevel}/7`} color={riskColor.color} bgColor={riskColor.bg} />
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Gunluk</Text>
          <ReturnText value={fund.dailyReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Aylik</Text>
          <ReturnText value={fund.monthlyReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Yillik</Text>
          <ReturnText value={fund.annualReturn} size="sm" />
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Ucret</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {fund.managementFee.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Buyukluk</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {formatLargeNumber(fund.totalValue)}
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
    marginRight: 8,
  },
  code: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
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
