import { Text, StyleSheet } from "react-native";
import { formatPercentage } from "@/lib/format";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

interface ReturnTextProps {
  value: number;
  size?: "sm" | "md" | "lg";
}

export function ReturnText({ value, size = "md" }: ReturnTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const textColor =
    value > 0 ? colors.positive : value < 0 ? colors.negative : colors.textSecondary;

  const fontSize = size === "sm" ? 12 : size === "lg" ? 18 : 14;

  return (
    <Text style={[styles.text, { color: textColor, fontSize }]}>
      {formatPercentage(value)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
