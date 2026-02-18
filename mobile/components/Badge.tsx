import { View, Text, StyleSheet } from "react-native";

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
}

export function Badge({ label, color = "#3b82f6", bgColor }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor ?? color + "20" }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
