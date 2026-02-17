import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Analysis } from "@/lib/types";
import { api } from "@/lib/api";
import { AnalysisCard } from "@/components/AnalysisCard";
import { EmptyState } from "@/components/EmptyState";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function AnalizlerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyses = useCallback(async () => {
    try {
      const data = await api.getAnalyses();
      setAnalyses(data);
    } catch (e) {
      console.warn("Analizler yuklenemedi:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handleDelete = useCallback(
    (analysis: Analysis) => {
      Alert.alert(
        "Analizi Sil",
        `"${analysis.title}" silinecek. Emin misiniz?`,
        [
          { text: "Vazgec", style: "cancel" },
          {
            text: "Sil",
            style: "destructive",
            onPress: async () => {
              try {
                await api.deleteAnalysis(analysis.id);
                setAnalyses((prev) => prev.filter((a) => a.id !== analysis.id));
              } catch (e) {
                Alert.alert("Hata", "Analiz silinemedi.");
              }
            },
          },
        ]
      );
    },
    []
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={analyses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnalysisCard
            analysis={item}
            onPress={() => router.push(`/analysis/${item.id}`)}
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="bar-chart-outline"
            title="Henuz analiz yok"
            message="Web uygulamasi uzerinden Excel/CSV dosyasi yukleyerek analiz olusturabilirsiniz."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingTop: 12,
    paddingBottom: 24,
  },
});
