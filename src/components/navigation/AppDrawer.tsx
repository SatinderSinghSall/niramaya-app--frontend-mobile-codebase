import React, { useState } from "react";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
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
  secondaryText: "#59645C",
  muted: "#8B958D",
  softMuted: "#A7AEA8",

  border: "#E7EBE6",

  activeBackground: "#EEF5EB",

  danger: "#C85C55",
  dangerText: "#B5524B",
  dangerBackground: "#FFF3F2",
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
    <Text className="px-5 pb-2 pt-4 text-[9px] font-bold tracking-[1.5px] text-[#9AA39B]">
      {children}
    </Text>
  );
}

/* ==========================================================================
   LOGOUT CONFIRMATION
   IMPORTANT:
   This is NOT a native Modal.
   It is a full-screen overlay inside the existing Drawer Modal.

   Because it is rendered at the ROOT of the Modal rather than inside
   the drawer width, the confirmation is centered on the ENTIRE SCREEN.
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
      className="absolute inset-0 items-center justify-center bg-black/50"
      style={{
        zIndex: 100,
      }}
    >
      {/* ==================================================================
          MODAL CARD
      ================================================================== */}

      <View
        className="mx-6 w-[calc(100%-48px)] max-w-[390px] overflow-hidden rounded-[22px] bg-white"
        style={{
          elevation: 30,

          shadowColor: "#000",

          shadowOffset: {
            width: 0,
            height: 10,
          },

          shadowOpacity: 0.22,

          shadowRadius: 25,
        }}
      >
        {/* ================================================================
            TOP AREA
        ================================================================ */}

        <View className="items-center px-7 pb-5 pt-8">
          {/* Logout icon */}
          <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-[#FFF0EF]">
            <Ionicons name="log-out-outline" size={32} color={COLORS.danger} />
          </View>

          {/* Title */}
          <Text className="mt-5 text-center font-serif text-[24px] font-bold text-[#263128]">
            Log out?
          </Text>

          {/* Description */}
          <Text className="mt-3 max-w-[310px] text-center text-[13px] leading-[20px] text-[#747C75]">
            Are you sure you want to log out of your Niramaya account?
          </Text>

          <Text className="mt-1 max-w-[310px] text-center text-[12px] leading-[18px] text-[#949B95]">
            You will need to sign in again to access your data.
          </Text>
        </View>

        {/* ================================================================
            BUTTONS
        ================================================================ */}

        <View className="px-6 pb-6">
          {/* Logout */}
          <Pressable
            disabled={loading}
            onPress={onConfirm}
            className="h-[52px] items-center justify-center rounded-[11px] bg-[#C85C55]"
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

          {/* Cancel */}
          <Pressable
            disabled={loading}
            onPress={onCancel}
            className="mt-3 h-[52px] items-center justify-center rounded-[11px] border border-[#D8DED8] bg-white"
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

  /* ==========================================================================
     USER
  ========================================================================== */

  const firstName = user?.firstName?.trim() || "User";

  const lastName = user?.lastName?.trim() || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  /* ==========================================================================
     NAVIGATION
  ========================================================================== */

  const navigate = (route: string) => {
    if (showLogoutConfirmation) {
      return;
    }

    closeDrawer();

    router.push(route as any);
  };

  /* ==========================================================================
     ACTIVE ROUTE
  ========================================================================== */

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  /* ==========================================================================
     LOGOUT
  ========================================================================== */

  const openLogoutConfirmation = () => {
    setShowLogoutConfirmation(true);
  };

  const cancelLogout = () => {
    if (logoutLoading) {
      return;
    }

    setShowLogoutConfirmation(false);
  };

  const confirmLogout = async () => {
    if (logoutLoading) {
      return;
    }

    setLogoutLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      /*
       * Close confirmation first.
       */
      setShowLogoutConfirmation(false);

      /*
       * Close drawer.
       */
      closeDrawer();

      setLogoutLoading(false);

      /*
       * Replace authenticated screen.
       *
       * This prevents going back to Home after logout.
       */
      router.replace("/(public)/landing");
    }
  };

  /* ==========================================================================
     RENDER
  ========================================================================== */

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
      {/* ====================================================================
          FULL SCREEN MODAL ROOT

          IMPORTANT:
          Everything is positioned relative to THIS view.
          Therefore the logout confirmation can cover the whole screen.
      ==================================================================== */}

      <View className="flex-1">
        {/* ==================================================================
            BACKDROP
        ================================================================== */}

        <Pressable
          className="absolute inset-0 bg-black/35"
          style={{
            zIndex: 1,
          }}
          onPress={() => {
            if (!showLogoutConfirmation) {
              closeDrawer();
            }
          }}
        />

        {/* ==================================================================
            DRAWER
        ================================================================== */}

        <View
          className="absolute bottom-0 left-0 top-0 w-[82%] max-w-[360px] bg-white"
          style={{
            zIndex: 2,

            elevation: 20,

            shadowColor: "#000",

            shadowOffset: {
              width: 4,
              height: 0,
            },

            shadowOpacity: 0.12,

            shadowRadius: 18,
          }}
        >
          <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
            {/* ==============================================================
                PROFILE HEADER
            ============================================================== */}

            <View className="px-5 pb-4 pt-3">
              <View className="flex-row items-center">
                {/* Avatar */}
                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={() => navigate("/(main)/profile")}
                  className="h-[46px] w-[46px] items-center justify-center rounded-full bg-[#E8F1E5]"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text className="text-[14px] font-bold text-[#4D6A50]">
                    {initials}
                  </Text>
                </Pressable>

                {/* User */}
                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={() => navigate("/(main)/profile")}
                  className="ml-3 flex-1"
                >
                  <Text
                    numberOfLines={1}
                    className="text-[14px] font-bold text-[#263128]"
                  >
                    {fullName}
                  </Text>

                  <Text className="mt-0.5 text-[10px] font-medium text-[#7C877F]">
                    View profile
                  </Text>
                </Pressable>

                {/* Close */}
                <Pressable
                  disabled={showLogoutConfirmation}
                  onPress={closeDrawer}
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center rounded-full bg-[#F3F5F2]"
                >
                  <Ionicons name="close-outline" size={19} color="#667168" />
                </Pressable>
              </View>
            </View>

            {/* Divider */}
            <View className="mx-5 h-px bg-[#E8ECE7]" />

            {/* ==============================================================
                NAVIGATION
            ============================================================== */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEnabled={!showLogoutConfirmation}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: 12,
              }}
            >
              {/* ============================================================
                  MAIN
              ============================================================ */}

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

              {/* ============================================================
                  WELLNESS
              ============================================================ */}

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

              {/* ============================================================
                  PERSONAL
              ============================================================ */}

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

              {/* Divider */}
              <View className="mx-5 my-3 h-px bg-[#E8ECE7]" />

              {/* ============================================================
                  SETTINGS
              ============================================================ */}

              <DrawerItem
                label="Settings"
                icon="settings-outline"
                active={isActive("/settings")}
                onPress={() => navigate("/(main)/settings")}
              />

              {/* ============================================================
                  LOGOUT
              ============================================================ */}

              <Pressable
                disabled={showLogoutConfirmation}
                onPress={openLogoutConfirmation}
                className="mx-3 mt-1 h-[46px] flex-row items-center rounded-[11px] bg-[#FFF5F4] px-3"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.65 : 1,
                })}
              >
                <View className="w-[32px] items-center justify-center">
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={COLORS.danger}
                  />
                </View>

                <Text className="ml-2 flex-1 text-[13px] font-bold text-[#B5524B]">
                  Log out
                </Text>

                <Ionicons name="chevron-forward" size={14} color="#D28B86" />
              </Pressable>
            </ScrollView>

            {/* ==============================================================
                FOOTER
            ============================================================== */}

            <View className="border-t border-[#E8ECE7] px-4 pb-2 pt-3">
              <View className="flex-row items-center justify-between rounded-[12px] bg-[#F7F9F6] px-3 py-2.5">
                {/* Branding */}
                <View className="flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-[#E8F1E5]">
                    <Ionicons name="leaf-outline" size={16} color="#4D6A50" />
                  </View>

                  <View className="ml-2.5">
                    <Text className="text-[11px] font-bold text-[#405044]">
                      Niramaya
                    </Text>

                    <Text className="mt-0.5 text-[8px] text-[#8A938B]">
                      A space for your wellbeing
                    </Text>
                  </View>
                </View>

                {/* Version */}
                <View className="items-end">
                  <Text className="text-[8px] font-semibold text-[#6E796F]">
                    {appVersion.label}
                  </Text>

                  <Text className="mt-0.5 text-[8px] text-[#9AA29B]">
                    {appVersion.platform}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* ==================================================================
            FULL-SCREEN LOGOUT CONFIRMATION

            THIS IS OUTSIDE THE DRAWER.

            Therefore:
              - Android: centered on whole screen
              - iOS: centered on whole screen
              - Drawer remains underneath
              - No nested native Modal
        ================================================================== */}

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
