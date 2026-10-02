import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getProfile } from "../../../services/profile.service";
import { UserProfile } from "../../../types/profile";

import { useAuth } from "../../../context/AuthContext";

const COLORS = {
  background: "#F5F7F4",
  surface: "#FFFFFF",
  primary: "#4D6A50",
  primaryDark: "#304A36",
  primarySoft: "#E7F0E5",
  text: "#202722",
  secondary: "#687169",
  muted: "#929A93",
  border: "#E3E8E2",
  danger: "#A75F56",
  dangerSoft: "#F9ECEA",
};

const getInitials = (profile: UserProfile) => {
  const first = profile.firstName?.charAt(0) ?? "";
  const last = profile.lastName?.charAt(0) ?? "";

  return `${first}${last}`.toUpperCase() || "U";
};

const formatMemberSince = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const { logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * App information
   */
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const buildNumber =
    Platform.OS === "android"
      ? String(Constants.expoConfig?.android?.versionCode ?? 1)
      : String(Constants.expoConfig?.ios?.buildNumber ?? 1);

  const loadProfile = useCallback(async () => {
    try {
      setError(null);

      const result = await getProfile();

      setProfile(result);
    } catch (err) {
      console.error("Failed to load profile:", err);

      setError("We couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadProfile();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteAccount = () => {
    router.push("/(main)/settings");
  };

  /*
   * Logout
   */
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      setLogoutModalVisible(false);

      router.replace("/(public)/login");
    } catch (err) {
      console.error("Logout failed:", err);

      setLoggingOut(false);

      Alert.alert(
        "Couldn't log out",
        "Something went wrong while logging out. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
        <StatusBar style="dark" />

        <View className="flex-1 items-center justify-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0E5]">
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>

          <Text className="mt-4 text-[14px] font-semibold text-[#687169]">
            Loading your profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
        <StatusBar style="dark" />

        <View className="flex-1 items-center justify-center px-8">
          <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-[#F9ECEA]">
            <Ionicons name="person-outline" size={28} color={COLORS.danger} />
          </View>

          <Text className="mt-5 text-center text-[18px] font-bold text-[#202722]">
            Unable to load profile
          </Text>

          <Text className="mt-2 text-center text-[12px] leading-[18px] text-[#687169]">
            {error ?? "Something went wrong. Please try again."}
          </Text>

          <Pressable
            onPress={loadProfile}
            className="mt-5 rounded-[14px] bg-[#304A36] px-5 py-3"
          >
            <Text className="text-[12px] font-bold text-white">Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const initials = getInitials(profile);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 28, 36),
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pb-3 pt-3">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>

          <View className="ml-2 flex-1">
            <Text className="text-[22px] font-bold tracking-[-0.4px] text-[#202722]">
              Profile
            </Text>

            <Text className="mt-0.5 text-[11px] font-medium text-[#7A837C]">
              Your account and preferences
            </Text>
          </View>
        </View>

        <View className="mx-5 mt-3 h-px bg-[#E3E8E2]" />

        {/* Profile identity */}
        <View className="mx-5 mt-5 overflow-hidden rounded-[24px] bg-[#304A36]">
          <View className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#4D6A50] opacity-60" />

          <View className="relative px-5 py-5">
            <View className="flex-row items-center">
              <View className="h-[62px] w-[62px] items-center justify-center rounded-[21px] bg-[#E7F0E5]">
                <Text className="text-[21px] font-extrabold text-[#304A36]">
                  {initials}
                </Text>
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[19px] font-extrabold tracking-[-0.2px] text-white">
                  {profile.firstName} {profile.lastName}
                </Text>

                <Text className="mt-1 text-[11px] text-[#D9E4D9]">
                  {profile.email}
                </Text>

                <View className="mt-2 flex-row items-center">
                  <View
                    className={`h-[7px] w-[7px] rounded-full ${
                      profile.isActive ? "bg-[#A9C7AA]" : "bg-[#D7A29C]"
                    }`}
                  />

                  <Text className="ml-1.5 text-[10px] font-semibold text-[#D9E4D9]">
                    {profile.isActive ? "Active account" : "Inactive account"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-5 border-t border-white/10 pt-4">
              <Text className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#AFC1B0]">
                Member since
              </Text>

              <Text className="mt-1 text-[11px] font-medium text-[#E0E8E0]">
                {formatMemberSince(profile.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal information */}
        <View className="mx-5 mt-6">
          <Text className="text-[16px] font-bold text-[#202722]">
            Personal information
          </Text>

          <Text className="mt-1 text-[11px] text-[#858D87]">
            The information connected to your account.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[20px] border border-[#E3E8E2] bg-white">
            <ProfileRow
              icon="person-outline"
              label="Full name"
              value={`${profile.firstName} ${profile.lastName}`}
            />

            <ProfileDivider />

            <ProfileRow
              icon="mail-outline"
              label="Email"
              value={profile.email}
              badge={profile.isEmailVerified ? "Verified" : "Not verified"}
              badgePositive={profile.isEmailVerified}
            />

            <ProfileDivider />

            <ProfileRow
              icon="call-outline"
              label="Phone"
              value={profile.phone || "Not added"}
            />
          </View>
        </View>

        {/* Account */}
        <View className="mx-5 mt-7">
          <Text className="text-[16px] font-bold text-[#202722]">Account</Text>

          <View className="mt-3 overflow-hidden rounded-[20px] border border-[#E3E8E2] bg-white">
            <MenuRow
              icon="create-outline"
              title="Edit profile"
              subtitle="Update your personal information"
              onPress={() => router.push("/(main)/profile-edit")}
            />

            <MenuDivider />

            <MenuRow
              icon="lock-closed-outline"
              title="Password & security"
              subtitle="Change your account password"
              onPress={() => router.push("/(main)/change-password")}
            />

            <MenuDivider />

            <MenuRow
              icon="settings-outline"
              title="Settings"
              subtitle="Notifications, reminders and preferences"
              onPress={() => router.push("/(main)/settings")}
            />

            <MenuDivider />

            {/* Logout */}
            <Pressable
              onPress={() => setLogoutModalVisible(true)}
              disabled={loggingOut}
              className="flex-row items-center px-4 py-4"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F9ECEA]">
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={COLORS.danger}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-[#A75F56]">
                  Log out
                </Text>

                <Text className="mt-1 text-[10px] leading-[15px] text-[#858D87]">
                  Sign out of your Niramaya account
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={17} color="#B7A19D" />
            </Pressable>
          </View>
        </View>

        {/* Health profile */}
        <View className="mx-5 mt-7">
          <Text className="text-[16px] font-bold text-[#202722]">Wellness</Text>

          <View className="mt-3 overflow-hidden rounded-[20px] border border-[#E3E8E2] bg-white">
            <MenuRow
              icon="heart-outline"
              title="Health profile"
              subtitle="View and update your wellness information"
              onPress={() => router.push("/(main)/health-profile")}
            />

            <MenuDivider />

            <MenuRow
              icon="notifications-outline"
              title="Notifications"
              subtitle="View your wellness updates"
              onPress={() => router.push("/(main)/notifications")}
            />
          </View>
        </View>

        {/* Account status */}
        <View className="mx-5 mt-7 rounded-[18px] bg-[#EEF3ED] px-4 py-3.5">
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={COLORS.primary}
            />

            <Text className="ml-2 flex-1 text-[10px] font-medium leading-[15px] text-[#687169]">
              Your account information is protected and managed securely.
            </Text>
          </View>
        </View>

        {/* Logout CTA */}
        <View className="mx-5 mt-7">
          <Pressable
            onPress={() => setLogoutModalVisible(true)}
            disabled={loggingOut}
            className="h-[52px] flex-row items-center justify-center rounded-[16px] border border-[#E4C9C5] bg-[#FFF8F7]"
            style={({ pressed }) => ({
              opacity: pressed || loggingOut ? 0.78 : 1,
            })}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color={COLORS.danger} />
            ) : (
              <>
                <Ionicons
                  name="log-out-outline"
                  size={19}
                  color={COLORS.danger}
                />

                <Text className="ml-2 text-[13px] font-extrabold text-[#A75F56]">
                  Log out
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* App information */}
        <View className="items-center px-5 pb-2 pt-8">
          <Text className="text-[11px] font-bold text-[#929A93]">Niramaya</Text>

          <Text className="mt-1 text-[10px] font-medium text-[#A0A7A1]">
            Version {appVersion} • Build {buildNumber}
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!loggingOut) {
            setLogoutModalVisible(false);
          }
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full max-w-[380px] rounded-[24px] bg-white px-5 pb-5 pt-6">
            {/* Modal icon */}
            <View className="items-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F9ECEA]">
                <Ionicons
                  name="log-out-outline"
                  size={25}
                  color={COLORS.danger}
                />
              </View>
            </View>

            {/* Modal content */}
            <View className="mt-4 items-center">
              <Text className="text-[18px] font-bold text-[#202722]">
                Log out?
              </Text>

              <Text className="mt-2 px-4 text-center text-[12px] leading-[19px] text-[#687169]">
                Are you sure you want to log out of your Niramaya account?
              </Text>
            </View>

            {/* Modal buttons */}
            <View className="mt-6 flex-row gap-3">
              <Pressable
                onPress={() => setLogoutModalVisible(false)}
                disabled={loggingOut}
                className="h-[48px] flex-1 items-center justify-center rounded-[14px] border border-[#DDE3DC] bg-[#F7F9F6]"
              >
                <Text className="text-[12px] font-bold text-[#4D564F]">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                disabled={loggingOut}
                className="h-[48px] flex-1 items-center justify-center rounded-[14px] bg-[#304A36]"
                style={({ pressed }) => ({
                  opacity: pressed || loggingOut ? 0.82 : 1,
                })}
              >
                {loggingOut ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-[12px] font-extrabold text-white">
                    Log out
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  badge,
  badgePositive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  badge?: string;
  badgePositive?: boolean;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F0F4EF]">
        <Ionicons name={icon} size={17} color="#4D6A50" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[10px] font-semibold text-[#929A93]">
          {label}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1 text-[12px] font-semibold text-[#202722]"
        >
          {value}
        </Text>
      </View>

      {badge && (
        <View
          className={`rounded-full px-2 py-1 ${
            badgePositive ? "bg-[#E7F0E5]" : "bg-[#F4F1EA]"
          }`}
        >
          <Text
            className={`text-[8px] font-bold ${
              badgePositive ? "text-[#4D6A50]" : "text-[#9A7A42]"
            }`}
          >
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

function ProfileDivider() {
  return <View className="ml-[60px] h-px bg-[#EEF1ED]" />;
}

function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
        <Ionicons name={icon} size={18} color="#4D6A50" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[13px] font-bold text-[#202722]">{title}</Text>

        <Text className="mt-1 text-[10px] leading-[15px] text-[#858D87]">
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={17} color="#A0A7A1" />
    </Pressable>
  );
}

function MenuDivider() {
  return <View className="ml-[64px] h-px bg-[#EEF1ED]" />;
}
