import { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useColorScheme } from "@/lib/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prompt sablonlari (front/lib/ai-prompt-template.ts ile ayni)
const FUND_PROMPT = `Sen bir profesyonel Turk yatirim fonu analistisin. Sana ekli Excel dosyasindaki Turkiye yatirim fonu verilerini analiz etmeni istiyorum.

Gorev:
Ekli Excel dosyasindaki tum fonlari detayli sekilde analiz et ve sonuclari asagidaki formatta yeni bir Excel tablosu olarak olustur.

Cikti Tablosu Sutunlari:
- Isim: Fonun tam adi
- Kod: Fonun kisa kodu
- Oneri: AL, TUT, SAT veya IZLE
- Puan: 1 ile 100 arasinda bir tam sayi
- Gerekce: Onerinin kisa ve net aciklamasi (en fazla 2 cumle)

Analiz Kriterleri:
1. Yillik Getiri performansi
2. Aylik Getiri Trendi
3. Risk/Getiri Dengesi
4. Yonetim Ucreti (dusuk tercih edilmeli)
5. Fon Buyuklugu
6. Yatirimci Sayisi

Ciktiyi Excel uyumlu tablo formatinda olustur.`;

const STOCK_PROMPT = `Sen bir profesyonel Borsa Istanbul (BIST) hisse senedi analistisin. Sana ekli Excel dosyasindaki BIST hisse senedi verilerini analiz etmeni istiyorum.

Gorev:
Ekli Excel dosyasindaki tum hisse senetlerini detayli sekilde analiz et ve sonuclari asagidaki formatta yeni bir Excel tablosu olarak olustur.

Cikti Tablosu Sutunlari:
- Isim: Sirketin tam adi
- Kod: Hisse senedinin BIST kodu
- Oneri: AL, TUT, SAT veya IZLE
- Puan: 1 ile 100 arasinda bir tam sayi
- Gerekce: Onerinin kisa ve net aciklamasi (en fazla 2 cumle)

Analiz Kriterleri:
1. F/K Orani (sektorel karsilastirma)
2. PD/DD Orani
3. Gunluk ve Haftalik Momentum
4. Aylik ve Yillik Getiri
5. Islem Hacmi
6. Piyasa Degeri
7. Sektor Analizi

Ciktiyi Excel uyumlu tablo formatinda olustur.`;

const steps = [
  { icon: "download-outline" as const, title: "Verileri Export Edin" },
  { icon: "copy-outline" as const, title: "Prompt'u Kopyalayin" },
  { icon: "send-outline" as const, title: "AI'a Gonderin" },
  { icon: "save-outline" as const, title: "Sonucu Kaydedin" },
  { icon: "cloud-upload-outline" as const, title: "Sisteme Yukleyin" },
];

export default function AIPromptScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<"fund" | "stock">("fund");
  const [copied, setCopied] = useState(false);

  const currentPrompt = activeTab === "fund" ? FUND_PROMPT : STOCK_PROMPT;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(currentPrompt);
      setCopied(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={24} color={colors.tint} />
        <Text style={[styles.title, { color: colors.text }]}>
          AI Yatirim Analiz Sablonu
        </Text>
      </View>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        Verilerinizi yapay zeka ile analiz etmek icin asagidaki adimlari takip edin.
      </Text>

      {/* Steps */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsRow}
      >
        {steps.map((step, idx) => (
          <View
            key={idx}
            style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.stepIconCircle, { backgroundColor: colors.tint + "15" }]}>
              <Ionicons name={step.icon} size={18} color={colors.tint} />
            </View>
            <Text style={[styles.stepNumber, { color: colors.tint }]}>
              Adim {idx + 1}
            </Text>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {step.title}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Tab Selector */}
      <View style={[styles.tabRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Pressable
          style={[
            styles.tab,
            activeTab === "fund" && { backgroundColor: colors.card },
            activeTab === "fund" && styles.tabActive,
          ]}
          onPress={() => {
            setActiveTab("fund");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "fund" ? colors.tint : colors.textSecondary },
            ]}
          >
            Fon Analizi
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "stock" && { backgroundColor: colors.card },
            activeTab === "stock" && styles.tabActive,
          ]}
          onPress={() => {
            setActiveTab("stock");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "stock" ? colors.tint : colors.textSecondary },
            ]}
          >
            Hisse Analizi
          </Text>
        </Pressable>
      </View>

      {/* Prompt Card */}
      <View style={[styles.promptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.promptHeader}>
          <Text style={[styles.promptTitle, { color: colors.text }]}>
            {activeTab === "fund" ? "Fon" : "Hisse"} Analizi Prompt
          </Text>
          <Pressable
            onPress={handleCopy}
            style={[styles.copyBtn, { backgroundColor: colors.muted }]}
          >
            <Ionicons
              name={copied ? "checkmark" : "copy-outline"}
              size={16}
              color={copied ? colors.positive : colors.tint}
            />
            <Text
              style={[
                styles.copyText,
                { color: copied ? colors.positive : colors.tint },
              ]}
            >
              {copied ? "Kopyalandi!" : "Kopyala"}
            </Text>
          </Pressable>
        </View>
        <View style={[styles.promptBox, { backgroundColor: colors.muted }]}>
          <Text style={[styles.promptText, { color: colors.text }]}>
            {currentPrompt}
          </Text>
        </View>
      </View>

      {/* Tip */}
      <View style={[styles.tipBox, { backgroundColor: colors.tint + "10", borderColor: colors.tint + "30" }]}>
        <Ionicons name="information-circle" size={20} color={colors.tint} />
        <Text style={[styles.tipText, { color: colors.text }]}>
          Prompt'u kopyaladiktan sonra ChatGPT, Claude veya baska bir AI aracina
          Excel dosyanizla birlikte yapisirin.
        </Text>
      </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  stepsRow: {
    gap: 10,
    paddingBottom: 4,
    marginBottom: 20,
  },
  stepCard: {
    width: 120,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
  },
  stepIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  promptCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  promptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  promptBox: {
    borderRadius: 10,
    padding: 12,
  },
  promptText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
