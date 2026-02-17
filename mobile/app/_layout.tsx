import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="stock/[symbol]"
          options={{
            headerShown: true,
            headerTitle: "Hisse Detay",
            headerTintColor: colors.tint,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="analysis/[id]"
          options={{
            headerShown: true,
            headerTitle: "Analiz Detay",
            headerTintColor: colors.tint,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            presentation: "card",
          }}
        />
      </Stack>
    </>
  );
}
