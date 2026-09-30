import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import SplashScreen from "@/components/common/SplashScreen";

function AppContent() {
  const { isLoading } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);

  /*
   * Keep the custom splash visible until:
   *
   * 1. AuthContext has finished checking the session
   * 2. Splash animation has finished
   */
  if (isLoading || !splashFinished) {
    return (
      <SplashScreen
        onFinish={() => {
          setSplashFinished(true);
        }}
      />
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <AppContent />
      </OnboardingProvider>
    </AuthProvider>
  );
}
