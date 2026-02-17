"use client";

/**
 * Capacitor native bridge utilities.
 * Web ortaminda calistiginda fallback olarak bos fonksiyonlar kullanir,
 * native ortamda gercek plugin'leri kullanir.
 */

// Capacitor yuklu mu kontrol et
function isNative(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).Capacitor?.isNativePlatform?.();
}

function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (window as any).Capacitor;
  if (!cap) return "web";
  return cap.getPlatform?.() ?? "web";
}

// ---------------------------------------------------------------------------
// Haptic feedback — dokunma titresimi
// ---------------------------------------------------------------------------
export async function hapticImpact(style: "light" | "medium" | "heavy" = "medium") {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[style] });
  } catch {
    // Plugin yuklu degil, sessizce devam
  }
}

export async function hapticNotification(type: "success" | "warning" | "error" = "success") {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    const typeMap = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };
    await Haptics.notification({ type: typeMap[type] });
  } catch {}
}

export async function hapticSelection() {
  if (!isNative()) return;
  try {
    const { Haptics } = await import("@capacitor/haptics");
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch {}
}

// ---------------------------------------------------------------------------
// Status Bar
// ---------------------------------------------------------------------------
export async function setStatusBarColor(color: string, darkIcons = false) {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setBackgroundColor({ color });
    await StatusBar.setStyle({ style: darkIcons ? Style.Light : Style.Dark });
  } catch {}
}

export async function hideStatusBar() {
  if (!isNative()) return;
  try {
    const { StatusBar } = await import("@capacitor/status-bar");
    await StatusBar.hide();
  } catch {}
}

// ---------------------------------------------------------------------------
// Splash Screen
// ---------------------------------------------------------------------------
export async function hideSplash() {
  if (!isNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {}
}

// ---------------------------------------------------------------------------
// Back button (Android)
// ---------------------------------------------------------------------------
export function onBackButton(handler: () => void): () => void {
  if (!isNative() || getPlatform() !== "android") return () => {};
  let cleanup = () => {};
  import("@capacitor/app").then(({ App }) => {
    const listener = App.addListener("backButton", handler);
    cleanup = () => listener.then((l) => l.remove());
  }).catch(() => {});
  return () => cleanup();
}

export { isNative, getPlatform };
