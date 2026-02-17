import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Fund } from "@/lib/types";
import { api } from "@/lib/api";
import { FundCard } from "@/components/FundCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function FonlarScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchFunds = useCallback(async () => {
    try {
      const data = await api.getFunds();
      setFunds(data);
    } catch (e) {
      console.warn("Fonlar yuklenemedi:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFunds();
  }, [fetchFunds]);

  const filtered = useMemo(() => {
    if (!search.trim()) return funds;
    const q = search.toLowerCase();
    return funds.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q)
    );
  }, [funds, search]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Fon adi veya kodu ara..."
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FundCard
            fund={item}
            onPress={() => router.push(`/fund/${item.code}`)}
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
            icon="pie-chart-outline"
            title="Fon bulunamadi"
            message={
              search
                ? `"${search}" icin sonuc yok.`
                : "Henuz fon verisi yuklenmemis."
            }
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    paddingBottom: 24,
  },
});
