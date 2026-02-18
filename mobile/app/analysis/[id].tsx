import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Analysis, AnalysisRecommendation } from "@/lib/types";
import { api } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

const actionColors: Record<string, { color: string; bg: string }> = {
  AL: { color: "#16a34a", bg: "#dcfce7" },
  TUT: { color: "#ca8a04", bg: "#fef9c3" },
  SAT: { color: "#dc2626", bg: "#fee2e2" },
  IZLE: { color: "#6b7280", bg: "#f3f4f6" },
};

function RecommendationCard({
  rec,
  colors,
}: {
  rec: AnalysisRecommendation;
  colors: (typeof Colors)["light"];
}) {
  const ac = actionColors[rec.action] ?? actionColors.IZLE;

  return (
    <View style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.recHeader}>
        <Text style={[styles.recName, { color: colors.text }]}>{rec.name}</Text>
        <Badge label={rec.action} color={ac.color} bgColor={ac.bg} />
      </View>
      <View style={styles.scoreRow}>
        <View style={[styles.scoreBar, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.scoreFill,
              {
                width: `${Math.min(rec.score, 100)}%`,
                backgroundColor: ac.color,
              },
            ]}
          />
        </View>
        <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
          {rec.score}/100
        </Text>
      </View>
      <Text style={[styles.reasoning, { color: colors.textSecondary }]}>
        {rec.reasoning}
      </Text>
    </View>
  );
}

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getAnalysis(id)
      .then(setAnalysis)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Analiz bulunamadi.</Text>
      </View>
    );
  }

  const date = new Date(analysis.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.title, { color: colors.text }]}>{analysis.title}</Text>
      <View style={styles.metaRow}>
        <Badge
          label={analysis.type === "fund" ? "Fon Analizi" : "Hisse Analizi"}
          color={analysis.type === "fund" ? "#3b82f6" : "#8b5cf6"}
          bgColor={analysis.type === "fund" ? "#dbeafe" : "#ede9fe"}
        />
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date}</Text>
      </View>

      {/* Summary */}
      <View style={[styles.summaryBox, { backgroundColor: colors.muted }]}>
        <Text style={[styles.summary, { color: colors.text }]}>{analysis.summary}</Text>
      </View>

      {/* Stats */}
      {analysis.recommendations.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Oneriler ({analysis.recommendations.length})
          </Text>
          <View style={styles.statsRow}>
            {(["AL", "TUT", "SAT", "IZLE"] as const).map((action) => {
              const count = analysis.recommendations.filter(
                (r) => r.action === action
              ).length;
              const ac = actionColors[action];
              return (
                <View
                  key={action}
                  style={[styles.statBox, { backgroundColor: ac.bg }]}
                >
                  <Text style={[styles.statCount, { color: ac.color }]}>
                    {count}
                  </Text>
                  <Text style={[styles.statLabel, { color: ac.color }]}>
                    {action}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* Recommendations */}
      {analysis.recommendations.map((rec, i) => (
        <RecommendationCard key={i} rec={rec} colors={colors} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
  },
  summaryBox: {
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  statCount: {
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  recCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  reasoning: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
});
