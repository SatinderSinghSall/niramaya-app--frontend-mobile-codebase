import React, { useState } from "react";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "./DrawerContext";
import DrawerItem from "./DrawerItem";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  green: "#4D6A50",
  darkGreen: "#304B36",
  text: "#263128",
  danger: "#C85C55",
};

/* ==========================================================================
   APP VERSION
========================================================================== */

function getAppVersion() {
  const version = Constants.expoConfig?.version || "1.0.0";

  if (Platform.OS === "ios") {
    const build = Constants.expoConfig?.ios?.buildNumber || "1";
    return {
      platform: "iOS",
      label: `v${version} (${build})`,
    };
  }

  const build = Constants.expoConfig?.android?.versionCode?.toString() || "1";
  return {
    platform: "Android",
    label: `v${version} (${build})`,
  };
}

/* ==========================================================================
   SECTION TITLE
========================================================================== */

function DrawerSectionTitle({ children }: { children: string }) {
  return (
    <Text className="px-5 pb-2 pt-4 text-[10px] font-bold tracking-[1.8px] text-[#869288]">
      {children}
    </Text>
  );
}

/* ==========================================================================
   LOGOUT CONFIRMATION MODAL
========================================================================== */

function LogoutConfirmation({
  visible,
  loading,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <View
      className="absolute inset-0 items-center justify-center bg-black/55"
      style={{ zIndex: 100 }}
    >
      <View
        className="mx-6 w-[calc(100%-48px)] max-w-[390px] overflow-hidden rounded-[24px] bg-white border border-[#F0F3EF]"
        style={{
          elevation: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 28,
        }}
      >
        <View className="items-center px-7 pb-6 pt-9">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FFF0EF] border border-[#FDE8E7]">
            <Ionicons name="log-out-outline" size={32} color={COLORS.danger} />
          </View>

          <Text className="mt-5 text-center font-serif text-[24px] font-bold text-[#263128]">
            Log out?
          </Text>

          <Text className="mt-2.5 max-w-[310px] text-center text-[13px] leading-[20px] text-[#6A736C]">
            Are you sure you want to log out of your Niramaya account?
          </Text>

          <Text className="mt-1 max-w-[310px] text-center text-[12px] leading-[18px] text-[#919994]">
            You will need to sign in again to access your data.
          </Text>
        </View>

        <View className="px-6 pb-7">
          <Pressable
            disabled={loading}
            onPress={onConfirm}
            className="h-[52px] items-center justify-center rounded-[12px] bg-[#C85C55]"
            style={({ pressed }) => ({
              opacity: pressed || loading ? 0.78 : 1,
            })}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="ml-2 text-[14px] font-bold text-white">
                  Logging out...
                </Text>
              </View>
            ) : (
              <Text className="text-[14px] font-bold text-white">Log out</Text>
            )}
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={onCancel}
            className="mt-3 h-[52px] items-center justify-center rounded-[12px] border border-[#DCDEDA] bg-white"
            style={({ pressed }) => ({
              opacity: pressed ? 0.65 : 1,
            })}
          >
            <Text className="text-[14px] font-bold text-[#3D4740]">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ==========================================================================
   APP DRAWER
========================================================================== */

export default function AppDrawer() {
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const appVersion = getAppVersion();

  const firstName = user?.firstName?.trim() || "User";
  const lastName = user?.lastName?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const navigate = (route: string) => {
    if (showLogoutConfirmation) return;
    closeDrawer();
    router.push(route as any);
  };

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const openLogoutConfirmation = () => setShowLogoutConfirmation(true);
  const cancelLogout = () => {
    if (logoutLoading) return;
    setShowLogoutConfirmation(false);
  };

  const confirmLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowLogoutConfirmation(false);
      closeDrawer();
      setLogoutLoading(false);
      router.replace("/(public)/landing");
    }
  };

  return (
    <Modal
      visible={isDrawerOpen}
      transparent
      animationType="none"
      onRequestClose={() => {
        if (showLogoutConfirmation) {
          cancelLogout();
        } else {
          closeDrawer();
        }
      }}
    >
      <View className="flex-1">
        {/* BACKDROP */}
        <Pressable
          className="absolute inset-0 bg-black/40"
          style={{ zIndex: 1 }}
          pressRetentionOffset={20}
          onPress={() => {
            if (!showLogoutConfirmation) closeDrawer();
          }}
        />

        {/* DRAWER CONTAINER */}
        <View
          className="absolute bottom-0 left-0 top-0 w-[84%] max-w-[360px] bg-white"
          style={{
            zIndex: 2,
            elevation: 24,
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
          }}
        >
          <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            {/* PROFILE HEADER WITH SUBTLE ACCENT BG */}
            <View className="px-5 pb-4 pt-3.5 bg-[#F9FBFA] border-b border-[#EBEFEA]">
              <View className="flex-row items-center">
                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={() => navigate("/(main)/profile")}
                  className="h-[48px] w-[48px] items-center justify-center rounded-full bg-[#E2ECE0] border border-[#CFDEC9]"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-[15px] font-bold text-[#3E5641]">
                    {initials}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={() => navigate("/(main)/profile")}
                  className="ml-3 flex-1"
                >
                  <Text
                    numberOfLines={1}
                    className="text-[14.5px] font-bold text-[#202923]"
                  >
                    {fullName}
                  </Text>
                  <Text className="mt-0.5 text-[11px] font-medium text-[#6B786E]">
                    View profile
                  </Text>
                </Pressable>

                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={closeDrawer}
                  hitSlop={12}
                  className="h-8 w-8 items-center justify-center rounded-full bg-[#EDF2EC]"
                >
                  <Ionicons name="close-outline" size={18} color="#58645C" />
                </Pressable>
              </View>
            </View>

            {/* SCROLLABLE NAVIGATION LIST */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEnabled={!showLogoutConfirmation}
              contentContainerStyle={{
                paddingTop: 6,
                paddingBottom: 16,
              }}
            >
              <DrawerSectionTitle>MAIN</DrawerSectionTitle>
              <DrawerItem
                label="Home"
                icon="home-outline"
                active={isActive("/home")}
                onPress={() => navigate("/(main)/home")}
              />
              <DrawerItem
                label="Goals"
                icon="flag-outline"
                active={isActive("/goals")}
                onPress={() => navigate("/(main)/goals")}
              />
              <DrawerItem
                label="Progress"
                icon="stats-chart-outline"
                active={isActive("/progress")}
                onPress={() => navigate("/(main)/progress")}
              />

              <DrawerSectionTitle>WELLNESS</DrawerSectionTitle>
              <DrawerItem
                label="Explore"
                icon="compass-outline"
                active={isActive("/explore")}
                onPress={() => navigate("/(main)/explore")}
              />
              <DrawerItem
                label="Ayurveda"
                icon="leaf-outline"
                active={isActive("/ayurveda")}
                onPress={() => navigate("/(main)/ayurveda")}
              />
              <DrawerItem
                label="Yoga"
                icon="body-outline"
                active={isActive("/yoga")}
                onPress={() => navigate("/(main)/yoga")}
              />
              <DrawerItem
                label="Favorites"
                icon="heart-outline"
                active={isActive("/favorites")}
                onPress={() => navigate("/(main)/favorites")}
              />

              <DrawerSectionTitle>ANNOUNCEMENTS</DrawerSectionTitle>
              <DrawerItem
                label="Announcements"
                icon="megaphone-outline"
                active={isActive("/announcements")}
                onPress={() => navigate("/(main)/announcements")}
              />

              <DrawerSectionTitle>HEALTH & WELLNESS</DrawerSectionTitle>
              <DrawerItem
                label="Health & Wellness Tips"
                icon="heart-outline"
                active={isActive("/health-wellness-tips")}
                onPress={() => navigate("/(main)/health-wellness-tips")}
              />

              <DrawerSectionTitle>PERSONAL</DrawerSectionTitle>
              <DrawerItem
                label="Health Profile"
                icon="person-circle-outline"
                active={isActive("/health-profile")}
                onPress={() => navigate("/(main)/health-profile")}
              />
              <DrawerItem
                label="Consultation"
                icon="medkit-outline"
                active={isActive("/consultation")}
                onPress={() => navigate("/(main)/consultation")}
              />
              <DrawerItem
                label="Notifications"
                icon="notifications-outline"
                active={isActive("/notifications")}
                onPress={() => navigate("/(main)/notifications")}
              />

              <View className="mx-5 my-3 h-px bg-[#EBEFEA]" />

              <DrawerSectionTitle>SETTINGS</DrawerSectionTitle>
              <DrawerItem
                label="Settings"
                icon="settings-outline"
                active={isActive("/settings")}
                onPress={() => navigate("/(main)/settings")}
              />

              {/* LOGOUT BUTTON */}
              <Pressable
                disabled={showLogoutConfirmation}
                onPress={openLogoutConfirmation}
                className="mx-3 mt-2 h-[46px] flex-row items-center rounded-[12px] bg-[#FFF2F1] border border-[#FCDAD8] px-3"
                style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
              >
                <View className="h-[32px] w-[32px] items-center justify-center rounded-lg bg-[#FEE4E2]">
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={COLORS.danger}
                  />
                </View>
                <Text className="ml-2.5 flex-1 text-[13.5px] font-bold text-[#B5524B]">
                  Log out
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#D28B86" />
              </Pressable>
            </ScrollView>

            {/* FOOTER */}
            <View className="border-t border-[#EBEFEA] px-4 pb-2.5 pt-3 bg-[#F9FBFA]">
              <View className="flex-row items-center justify-between rounded-[14px] bg-[#F3F6F2] border border-[#E5EAE3] px-3.5 py-3">
                <View className="flex-row items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-[#E2ECE0] border border-[#CFDEC9]">
                    <Ionicons name="leaf-outline" size={17} color="#4D6A50" />
                  </View>
                  <View className="ml-2.5">
                    <Text className="text-[11.5px] font-bold text-[#354338]">
                      Niramaya
                    </Text>
                    <Text className="mt-0.5 text-[8.5px] text-[#7E8A80]">
                      A space for your wellbeing
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-[9px] font-semibold text-[#5E6A60]">
                    {appVersion.label}
                  </Text>
                  <Text className="mt-0.5 text-[8px] text-[#8B948D]">
                    {appVersion.platform}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* LOGOUT OVERLAY MODAL */}
        <LogoutConfirmation
          visible={showLogoutConfirmation}
          loading={logoutLoading}
          onCancel={cancelLogout}
          onConfirm={confirmLogout}
        />
      </View>
    </Modal>
  );
}
