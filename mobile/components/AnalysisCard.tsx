import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Analysis } from "@/lib/types";
import { Badge } from "./Badge";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

interface AnalysisCardProps {
  analysis: Analysis;
  onPress?: () => void;
  onDelete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnalysisCard({ analysis, onPress, onDelete }: AnalysisCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const date = new Date(analysis.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const actionCounts = {
    AL: analysis.recommendations.filter((r) => r.action === "AL").length,
    TUT: analysis.recommendations.filter((r) => r.action === "TUT").length,
    SAT: analysis.recommendations.filter((r) => r.action === "SAT").length,
    IZLE: analysis.recommendations.filter((r) => r.action === "IZLE").length,
  };

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
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {analysis.title}
          </Text>
          <View style={styles.meta}>
            <Badge
              label={analysis.type === "fund" ? "Fon" : "Hisse"}
              color={analysis.type === "fund" ? "#3b82f6" : "#8b5cf6"}
              bgColor={analysis.type === "fund" ? "#dbeafe" : "#ede9fe"}
            />
            <Text style={[styles.date, { color: colors.textSecondary }]}>{date}</Text>
          </View>
        </View>
        {onDelete && (
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onDelete();
            }}
            hitSlop={12}
          >
            <Ionicons name="trash-outline" size={18} color={colors.negative} />
          </Pressable>
        )}
      </View>

      {/* Summary */}
      <Text
        style={[styles.summary, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {analysis.summary}
      </Text>

      {/* Action counts */}
      {analysis.recommendations.length > 0 && (
        <View style={styles.actions}>
          {actionCounts.AL > 0 && (
            <Badge label={`AL ${actionCounts.AL}`} color="#16a34a" bgColor="#dcfce7" />
          )}
          {actionCounts.TUT > 0 && (
            <Badge label={`TUT ${actionCounts.TUT}`} color="#ca8a04" bgColor="#fef9c3" />
          )}
          {actionCounts.SAT > 0 && (
            <Badge label={`SAT ${actionCounts.SAT}`} color="#dc2626" bgColor="#fee2e2" />
          )}
          {actionCounts.IZLE > 0 && (
            <Badge label={`IZLE ${actionCounts.IZLE}`} color="#6b7280" bgColor="#f3f4f6" />
          )}
        </View>
      )}
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
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  date: {
    fontSize: 12,
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
});
