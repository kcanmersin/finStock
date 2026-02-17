import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Stock } from "@/lib/types";
import { api } from "@/lib/api";
import { StockCard } from "@/components/StockCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function HisselerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchStocks = useCallback(async () => {
    try {
      const data = await api.getStocks();
      setStocks(data);
    } catch (e) {
      console.warn("Hisseler yuklenemedi:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStocks();
  }, [fetchStocks]);

  const filtered = useMemo(() => {
    if (!search.trim()) return stocks;
    const q = search.toLowerCase();
    return stocks.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.symbol.toLowerCase().includes(q)
    );
  }, [stocks, search]);

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
          placeholder="Hisse adi veya sembol ara..."
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockCard
            stock={item}
            onPress={() => router.push(`/stock/${item.symbol}`)}
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
            icon="trending-up-outline"
            title="Hisse bulunamadi"
            message={
              search
                ? `"${search}" icin sonuc yok.`
                : "Henuz hisse verisi yuklenmemis."
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
