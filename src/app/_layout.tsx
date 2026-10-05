import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import SplashScreen from "@/components/common/SplashScreen";
import InternetRequiredModal from "@/components/common/InternetRequiredModal";
import AppUpdateGate from "../components/common/AppUpdateGate";
import MaintenanceGate from "../components/common/MaintenanceGate";
import FloatingDisclaimerCTA from "../components/common/FloatingDisclaimerCTA";

interface AppContentProps {
  networkChecked: boolean;
  isOffline: boolean;
  offlineModalVisible: boolean;
  onCloseOfflineModal: () => void;
}

function AppContent({
  networkChecked,
  isOffline,
  offlineModalVisible,
  onCloseOfflineModal,
}: AppContentProps) {
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

      {/* ---------------------------------
          Internet required modal
          Appears only after splash finishes
      --------------------------------- */}

      <InternetRequiredModal
        visible={networkChecked && isOffline && offlineModalVisible}
        onClose={onCloseOfflineModal}
      />

      <AppUpdateGate />
      <FloatingDisclaimerCTA />
    </>
  );
}

export default function RootLayout() {
  const [isOffline, setIsOffline] = useState(false);
  const [networkChecked, setNetworkChecked] = useState(false);
  const [offlineModalVisible, setOfflineModalVisible] = useState(false);

  /*
   * Monitor internet connectivity globally.
   *
   * This runs once at the root of the application so
   * every screen uses the same connection state.
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;

      setNetworkChecked(true);
      setIsOffline(offline);

      if (offline) {
        /*
         * Show the modal whenever the device becomes offline.
         */
        setOfflineModalVisible(true);
      } else {
        /*
         * Automatically hide the modal when connection
         * is restored.
         */
        setOfflineModalVisible(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <OnboardingProvider>
        <MaintenanceGate>
          <AppContent
            networkChecked={networkChecked}
            isOffline={isOffline}
            offlineModalVisible={offlineModalVisible}
            onCloseOfflineModal={() => {
              setOfflineModalVisible(false);
            }}
          />
        </MaintenanceGate>
      </OnboardingProvider>
    </AuthProvider>
  );
}
