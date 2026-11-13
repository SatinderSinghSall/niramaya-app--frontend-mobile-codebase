import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getSettings, updateSettings } from "../../services/profile.service";

import { ThemePreference, UserSettings } from "../../types/profile";

const PRIMARY = "#4D6A50";
const DARK = "#304A36";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<UserSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [themeModal, setThemeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const result = await getSettings();

      setSettings(result);
    } catch (error) {
      console.error("Failed to load settings:", error);

      Alert.alert("Couldn't load settings", "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const patchSettings = async (
    key: string,
    payload: Parameters<typeof updateSettings>[0],
  ) => {
    if (!settings) return;

    try {
      setSavingKey(key);

      const updated = await updateSettings(payload);

      setSettings(updated);
    } catch (error: any) {
      console.error("Settings update failed:", error);

      Alert.alert(
        "Couldn't update setting",
        error?.response?.data?.message ?? "Please try again.",
      );
    } finally {
      setSavingKey(null);
    }
  };

  const toggleNotification = (
    key:
      | "enabled"
      | "goalReminders"
      | "progressReminders"
      | "consultationUpdates"
      | "wellnessReminders",
  ) => {
    if (!settings) return;

    patchSettings(`notification-${key}`, {
      notifications: {
        [key]: !settings.notifications[key],
      },
    });
  };

  const toggleReminder = () => {
    if (!settings) return;

    patchSettings("reminders-enabled", {
      reminders: {
        enabled: !settings.reminders.enabled,
      },
    });
  };

  const setTheme = (theme: ThemePreference) => {
    setThemeModal(false);

    patchSettings("theme", {
      appearance: {
        theme,
      },
    });
  };

  if (loading || !settings) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F7F4]">
        <StatusBar style="dark" />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={PRIMARY} />

          <Text className="mt-3 text-[12px] text-[#687169]">
            Loading settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 32, 40),
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#202722" />
          </Pressable>

          <View className="ml-2 flex-1">
            <Text className="text-[22px] font-bold tracking-[-0.4px] text-[#202722]">
              Settings
            </Text>

            <Text className="mt-0.5 text-[11px] text-[#7A837C]">
              Personalize your Niramaya experience
            </Text>
          </View>
        </View>

        <View className="mx-5 h-px bg-[#E3E8E2]" />

        {/* Notifications */}
        <Section
          title="Notifications"
          subtitle="Choose which updates you'd like to receive"
        >
          <SettingSwitch
            icon="notifications-outline"
            title="Notifications"
            subtitle="Enable wellness notifications"
            value={settings.notifications.enabled}
            loading={savingKey === "notification-enabled"}
            onValueChange={() => toggleNotification("enabled")}
          />

          <Divider />

          <SettingSwitch
            icon="flag-outline"
            title="Goal reminders"
            subtitle="Updates and reminders for your goals"
            value={settings.notifications.goalReminders}
            disabled={!settings.notifications.enabled}
            loading={savingKey === "notification-goalReminders"}
            onValueChange={() => toggleNotification("goalReminders")}
          />

          <Divider />

          <SettingSwitch
            icon="trending-up-outline"
            title="Progress reminders"
            subtitle="Keep track of your wellness progress"
            value={settings.notifications.progressReminders}
            disabled={!settings.notifications.enabled}
            loading={savingKey === "notification-progressReminders"}
            onValueChange={() => toggleNotification("progressReminders")}
          />

          <Divider />

          <SettingSwitch
            icon="calendar-outline"
            title="Consultation updates"
            subtitle="Updates about your consultations"
            value={settings.notifications.consultationUpdates}
            disabled={!settings.notifications.enabled}
            loading={savingKey === "notification-consultationUpdates"}
            onValueChange={() => toggleNotification("consultationUpdates")}
          />

          <Divider />

          <SettingSwitch
            icon="leaf-outline"
            title="Wellness reminders"
            subtitle="Helpful wellness updates and reminders"
            value={settings.notifications.wellnessReminders}
            disabled={!settings.notifications.enabled}
            loading={savingKey === "notification-wellnessReminders"}
            onValueChange={() => toggleNotification("wellnessReminders")}
          />
        </Section>

        {/* Reminders */}
        <Section
          title="Reminders"
          subtitle="Choose when Niramaya should remind you"
        >
          <SettingSwitch
            icon="alarm-outline"
            title="Daily reminders"
            subtitle="Receive your scheduled wellness reminders"
            value={settings.reminders.enabled}
            loading={savingKey === "reminders-enabled"}
            onValueChange={toggleReminder}
          />

          <Divider />

          <View className="flex-row items-center px-4 py-4">
            <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
              <Ionicons name="time-outline" size={18} color={PRIMARY} />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-bold text-[#202722]">
                Preferred time
              </Text>

              <Text className="mt-1 text-[10px] text-[#858D87]">
                When you'd like to receive reminders
              </Text>
            </View>

            <Text className="text-[12px] font-bold text-[#4D6A50]">
              {settings.reminders.preferredTime}
            </Text>
          </View>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" subtitle="Choose how the app should look">
          <Pressable
            onPress={() => setThemeModal(true)}
            className="flex-row items-center px-4 py-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
              <Ionicons
                name="color-palette-outline"
                size={18}
                color={PRIMARY}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-bold text-[#202722]">
                Theme
              </Text>

              <Text className="mt-1 text-[10px] text-[#858D87]">
                System, light or dark appearance
              </Text>
            </View>

            <Text className="mr-2 text-[11px] font-bold capitalize text-[#4D6A50]">
              {settings.appearance.theme}
            </Text>

            <Ionicons name="chevron-forward" size={16} color="#A0A7A1" />
          </Pressable>
        </Section>

        {/* Privacy */}
        <Section title="Privacy" subtitle="Control how your app data is used">
          <SettingSwitch
            icon="analytics-outline"
            title="Analytics"
            subtitle="Help improve Niramaya through anonymous usage data"
            value={settings.privacy.analyticsEnabled}
            loading={savingKey === "analytics"}
            onValueChange={() =>
              patchSettings("analytics", {
                privacy: {
                  analyticsEnabled: !settings.privacy.analyticsEnabled,
                },
              })
            }
          />
        </Section>

        {/* Language */}
        <Section
          title="Preferences"
          subtitle="Your language and regional settings"
        >
          <SettingInfo
            icon="language-outline"
            title="Language"
            value={
              settings.preferences.language === "en"
                ? "English"
                : settings.preferences.language
            }
          />

          <Divider />

          <SettingInfo
            icon="globe-outline"
            title="Timezone"
            value={settings.preferences.timezone}
          />
        </Section>

        {/* Account */}
        <View className="mx-5 mt-8">
          <Text className="text-[16px] font-bold text-[#A75F56]">
            Danger zone
          </Text>

          <Text className="mt-1 text-[11px] text-[#858D87]">
            Actions here affect your account.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[20px] border border-[#F0DAD7] bg-white">
            <Pressable
              onPress={() => setDeleteModal(true)}
              className="flex-row items-center px-4 py-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F9ECEA]">
                <Ionicons name="trash-outline" size={18} color="#A75F56" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-[#A75F56]">
                  Delete account
                </Text>

                <Text className="mt-1 text-[10px] leading-[15px] text-[#858D87]">
                  Deactivate your Niramaya account
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={17} color="#C28A83" />
            </Pressable>
          </View>
        </View>

        {/* Version */}
        <View className="mt-8 items-center">
          <Text className="text-[10px] font-semibold text-[#A0A7A1]">
            Niramaya
          </Text>

          <Text className="mt-1 text-[9px] text-[#B0B6B1]">
            Your space for wellbeing
          </Text>
        </View>
      </ScrollView>

      {/* Theme modal */}
      <Modal
        visible={themeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModal(false)}
      >
        <View className="flex-1 justify-end bg-black/25">
          <Pressable className="flex-1" onPress={() => setThemeModal(false)} />

          <View className="rounded-t-[28px] bg-white px-5 pb-8 pt-5">
            <View className="mx-auto h-1 w-10 rounded-full bg-[#DDE2DD]" />

            <Text className="mt-5 text-[18px] font-bold text-[#202722]">
              Appearance
            </Text>

            <Text className="mt-1 text-[11px] text-[#858D87]">
              Choose your preferred theme.
            </Text>

            {(["system", "light", "dark"] as ThemePreference[]).map((theme) => {
              const selected = settings.appearance.theme === theme;

              return (
                <Pressable
                  key={theme}
                  onPress={() => setTheme(theme)}
                  className="mt-3 flex-row items-center rounded-[16px] border border-[#E3E8E2] px-4 py-3.5"
                >
                  <Ionicons
                    name={
                      theme === "system"
                        ? "phone-portrait-outline"
                        : theme === "light"
                          ? "sunny-outline"
                          : "moon-outline"
                    }
                    size={19}
                    color={selected ? PRIMARY : "#687169"}
                  />

                  <Text className="ml-3 flex-1 text-[13px] font-bold capitalize text-[#202722]">
                    {theme}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color={PRIMARY}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Delete account – Danger Zone Modal */}
<Modal
  visible={deleteModal}
  transparent
  animationType="fade"
  onRequestClose={() => setDeleteModal(false)}
>
  <View className="flex-1 items-center justify-center bg-[#171A17]/55 px-5">

    {/* MODAL CONTAINER */}
    <View
      className="w-full overflow-hidden rounded-[27px] border border-[#EBD5D2] bg-white"
      style={{
        shadowColor: "#702D27",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 25,
        elevation: 12,
      }}
    >

      {/* DANGER ACCENT */}
      <View className="h-[5px] flex-row">
        <View className="flex-1 bg-[#9D3F38]" />
        <View className="w-14 bg-[#C47A6F]" />
      </View>

      <View className="px-5 pb-5 pt-5">

        {/* DANGER ZONE LABEL */}
        <View className="mb-4 flex-row items-center justify-between">

          <View className="flex-row items-center rounded-full border border-[#F0D9D5] bg-[#FDF3F1] px-3 py-1.5">
            <Ionicons
              name="alert-circle"
              size={12}
              color="#A4473F"
            />

            <Text className="ml-1.5 text-[9px] font-extrabold tracking-[1.4px] text-[#A4473F]">
              DANGER ZONE
            </Text>
          </View>

          <Text className="text-[9px] font-semibold tracking-[0.5px] text-[#B58B85]">
            ACCOUNT ACTION
          </Text>
        </View>

        {/* WARNING ICON */}
        <View className="h-[53px] w-[53px] items-center justify-center rounded-[17px] border border-[#F0D8D4] bg-[#FCEFED]">
          <Ionicons
            name="trash-outline"
            size={25}
            color="#A4473F"
          />
        </View>

        {/* TITLE */}
        <Text className="mt-4 text-[20px] font-extrabold tracking-[-0.5px] text-[#292B29]">
          Delete your account?
        </Text>

        {/* DESCRIPTION */}
        <Text className="mt-2 text-[12px] leading-[20px] text-[#737873]">
          Your Niramaya account will be deactivated and you will be signed
          out. This action affects your account and requires confirmation.
        </Text>

        {/* WARNING INFORMATION */}
        <View className="mt-5 overflow-hidden rounded-[17px] border border-[#EBCBC6] bg-[#FDF4F2]">

          {/* WARNING HEADER */}
          <View className="flex-row items-center border-b border-[#F1DEDA] bg-[#FAECE9] px-4 py-3">
            <Ionicons
              name="warning"
              size={16}
              color="#A4473F"
            />

            <Text className="ml-2 text-[11px] font-extrabold tracking-[0.2px] text-[#963F38]">
              This is a sensitive account action
            </Text>
          </View>

          {/* WARNING BODY */}
          <View className="flex-row items-start px-4 py-3.5">

            <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-[#F6E3DF]">
              <Ionicons
                name="lock-closed-outline"
                size={13}
                color="#A4473F"
              />
            </View>

            <View className="ml-2.5 flex-1">
              <Text className="text-[10px] leading-[17px] text-[#91615B]">
                You will need to verify your password on the next screen
                before your account can be deactivated.
              </Text>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mt-5 flex-row">

          {/* CANCEL */}
          <Pressable
            onPress={() => setDeleteModal(false)}
            accessibilityRole="button"
            className="mr-1.5 h-[49px] flex-1 flex-row items-center justify-center rounded-[15px] border border-[#E6E9E5] bg-[#F4F5F3]"
            style={({ pressed }) => ({
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Ionicons
              name="close-circle-outline"
              size={15}
              color="#687169"
            />

            <Text className="ml-1.5 text-[12px] font-bold text-[#626B63]">
              Cancel
            </Text>
          </Pressable>

          {/* PROCEED */}
          <Pressable
            onPress={() => {
              setDeleteModal(false);
              router.push("/(main)/delete-account");
            }}
            accessibilityRole="button"
            accessibilityLabel="Proceed to account deactivation"
            className="ml-1.5 h-[49px] flex-1 flex-row items-center justify-center rounded-[15px] border border-[#963D36] bg-[#A4473F]"
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#84352F" : "#A4473F",
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: "#963D36",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 7,
              elevation: 3,
            })}
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color="#FFFFFF"
            />

            <Text className="ml-2 text-[12px] font-extrabold text-white">
              Proceed
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color="#FFFFFF"
              style={{ marginLeft: 7 }}
            />
          </Pressable>

        </View>

        {/* FOOTER NOTE */}
        <View className="mt-4 flex-row items-center justify-center">
          <Ionicons
            name="shield-checkmark-outline"
            size={12}
            color="#929B93"
          />

          <Text className="ml-1.5 text-[9px] font-medium text-[#929B93]">
            Your account requires password verification
          </Text>
        </View>

      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mx-5 mt-7">
      <Text className="text-[16px] font-bold text-[#202722]">{title}</Text>

      <Text className="mt-1 text-[11px] text-[#858D87]">{subtitle}</Text>

      <View className="mt-3 overflow-hidden rounded-[20px] border border-[#E3E8E2] bg-white">
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return <View className="ml-[64px] h-px bg-[#EEF1ED]" />;
}

function SettingSwitch({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  loading = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center px-4 py-4 ${
        disabled ? "opacity-45" : ""
      }`}
    >
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>

      <View className="ml-3 flex-1 pr-2">
        <Text className="text-[13px] font-bold text-[#202722]">{title}</Text>

        <Text className="mt-1 text-[10px] leading-[15px] text-[#858D87]">
          {subtitle}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={PRIMARY} />
      ) : (
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: "#DDE2DD",
            true: "#B9CCB8",
          }}
          thumbColor={value ? PRIMARY : "#FFFFFF"}
          ios_backgroundColor="#DDE2DD"
        />
      )}
    </View>
  );
}

function SettingInfo({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>

      <Text className="ml-3 flex-1 text-[13px] font-bold text-[#202722]">
        {title}
      </Text>

      <Text
        numberOfLines={1}
        className="max-w-[145px] text-[10px] font-semibold text-[#687169]"
      >
        {value}
      </Text>
    </View>
  );
}
