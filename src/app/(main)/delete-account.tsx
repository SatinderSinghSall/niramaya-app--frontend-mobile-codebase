import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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

import { deleteAccount } from "../../services/profile.service";

/**
 * ===============================================================
 * COLORS
 * ===============================================================
 */

const PRIMARY = "#4D6A50";
const DARK = "#304A36";

const DANGER = "#A75F56";
const DANGER_DARK = "#8F5149";

const BACKGROUND = "#F5F7F4";

/**
 * ===============================================================
 * DELETE ACCOUNT SCREEN
 * ===============================================================
 */

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /**
   * Android keyboard height
   *
   * Allows the ScrollView to create enough space
   * so the focused input/button can be scrolled
   * above the keyboard while the keyboard stays open.
   */
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const keyboardDidShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowSubscription.remove();
      keyboardDidHideSubscription.remove();
    };
  }, []);

  /**
   * =============================================================
   * FORM VALIDATION
   * =============================================================
   */

  const canDelete =
    password.trim().length > 0 &&
    confirmation.trim().toUpperCase() === "DELETE" &&
    !deleting;

  /**
   * =============================================================
   * DELETE ACCOUNT
   * =============================================================
   */

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      Alert.alert("Password required", "Enter your password to continue.");

      return;
    }

    if (confirmation.trim().toUpperCase() !== "DELETE") {
      Alert.alert(
        "Confirmation required",
        'Type "DELETE" exactly to confirm that you want to deactivate your account.',
      );

      return;
    }

    try {
      setDeleting(true);

      await deleteAccount({
        password: password.trim(),
      });

      Alert.alert(
        "Account deactivated",
        "Your Niramaya account has been deactivated successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(public)/login");
            },
          },
        ],
      );
    } catch (error: any) {
      console.log("Delete account failed:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      Alert.alert(
        "Couldn't deactivate account",
        error?.response?.data?.message ??
          "The password may be incorrect. Please check your details and try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /**
   * =============================================================
   * SCREEN
   * =============================================================
   */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom:
              Platform.OS === "android"
                ? keyboardHeight + Math.max(insets.bottom + 36, 48)
                : Math.max(insets.bottom + 36, 48),
          }}
        >
          {/* =================================================== */}
          {/* HEADER */}
          {/* =================================================== */}

          <View className="flex-row items-center px-5 pb-4 pt-3">
            <Pressable
              onPress={() => {
                if (!deleting) {
                  router.back();
                }
              }}
              disabled={deleting}
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-full"
            >
              <Ionicons name="chevron-back" size={24} color="#202722" />
            </Pressable>

            <View className="ml-2 flex-1">
              <Text className="text-[22px] font-bold tracking-[-0.4px] text-[#202722]">
                Delete account
              </Text>

              <Text className="mt-0.5 text-[11px] text-[#7A837C]">
                Manage your account deactivation
              </Text>
            </View>
          </View>

          <View className="mx-5 h-px bg-[#E3E8E2]" />

          {/* =================================================== */}
          {/* WARNING CARD */}
          {/* =================================================== */}

          <View className="mx-5 mt-6 rounded-[22px] border border-[#F0DAD7] bg-[#FDF5F3] p-5">
            <View className="h-12 w-12 items-center justify-center rounded-[15px] bg-[#F9ECEA]">
              <Ionicons name="warning-outline" size={24} color={DANGER} />
            </View>

            <Text className="mt-4 text-[18px] font-bold text-[#202722]">
              Deactivate your Niramaya account
            </Text>

            <Text className="mt-2 text-[11px] leading-[18px] text-[#687169]">
              Deactivating your account will sign you out of Niramaya and
              prevent normal access to your account. Make sure you understand
              this before continuing.
            </Text>
          </View>

          {/* =================================================== */}
          {/* WHAT HAPPENS */}
          {/* =================================================== */}

          <View className="mx-5 mt-6">
            <Text className="text-[16px] font-bold text-[#202722]">
              Before you continue
            </Text>

            <Text className="mt-1 text-[11px] text-[#858D87]">
              Please review what this action means.
            </Text>

            <View className="mt-3 overflow-hidden rounded-[20px] border border-[#E3E8E2] bg-white">
              <DeleteInfoRow
                icon="log-out-outline"
                title="You will be signed out"
                description="Your current session will end after successful deactivation."
              />

              <View className="ml-[64px] h-px bg-[#EEF1ED]" />

              <DeleteInfoRow
                icon="person-remove-outline"
                title="Your account will be deactivated"
                description="You will no longer be able to use your account normally."
              />

              <View className="ml-[64px] h-px bg-[#EEF1ED]" />

              <DeleteInfoRow
                icon="shield-checkmark-outline"
                title="Password confirmation is required"
                description="Enter your current password to verify this request."
              />
            </View>
          </View>

          {/* =================================================== */}
          {/* ACCOUNT VERIFICATION */}
          {/* =================================================== */}

          <View className="mx-5 mt-7">
            <Text className="text-[16px] font-bold text-[#202722]">
              Confirm your account
            </Text>

            <Text className="mt-1 text-[11px] leading-[16px] text-[#858D87]">
              Enter your password and type DELETE to confirm this account
              action.
            </Text>

            {/* Password */}

            <View className="mt-4">
              <Text className="mb-2 text-[11px] font-bold text-[#4A544D]">
                Current password
              </Text>

              <View className="flex-row items-center rounded-[16px] border border-[#E3E8E2] bg-white px-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#8A938C"
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!deleting}
                  placeholder="Enter your password"
                  placeholderTextColor="#A1A8A2"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="h-[52px] flex-1 px-3 text-[13px] text-[#202722]"
                />

                <Pressable
                  onPress={() => setShowPassword((value) => !value)}
                  disabled={deleting}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={19}
                    color="#8A938C"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirmation */}

            <View className="mt-4">
              <Text className="mb-2 text-[11px] font-bold text-[#4A544D]">
                Type DELETE to confirm
              </Text>

              <View
                className={`flex-row items-center rounded-[16px] border bg-white px-4 ${
                  confirmation.trim().toUpperCase() === "DELETE"
                    ? "border-[#B9CCB8]"
                    : "border-[#E3E8E2]"
                }`}
              >
                <Ionicons
                  name="keypad-outline"
                  size={18}
                  color={
                    confirmation.trim().toUpperCase() === "DELETE"
                      ? PRIMARY
                      : "#8A938C"
                  }
                />

                <TextInput
                  value={confirmation}
                  onChangeText={setConfirmation}
                  editable={!deleting}
                  placeholder="DELETE"
                  placeholderTextColor="#A1A8A2"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  className="h-[52px] flex-1 px-3 text-[13px] font-bold tracking-[1px] text-[#202722]"
                />

                {confirmation.trim().toUpperCase() === "DELETE" && (
                  <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
                )}
              </View>
            </View>
          </View>

          {/* =================================================== */}
          {/* ACTIONS */}
          {/* =================================================== */}

          <View className="mx-5 mt-7">
            <Pressable
              onPress={handleDeleteAccount}
              disabled={!canDelete}
              className={`h-[52px] flex-row items-center justify-center rounded-[16px] ${
                canDelete ? "bg-[#A75F56]" : "bg-[#D8B7B2]"
              }`}
              style={({ pressed }) => ({
                opacity: pressed ? 0.82 : 1,
              })}
            >
              {deleting ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-2 text-[12px] font-extrabold text-white">
                    Deactivating account...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />

                  <Text className="ml-2 text-[12px] font-extrabold text-white">
                    Deactivate my account
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                if (!deleting) {
                  router.back();
                }
              }}
              disabled={deleting}
              className="mt-3 h-[50px] flex-row items-center justify-center rounded-[16px] border border-[#D9E1D8] bg-white"
              style={({ pressed }) => ({
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <View className="h-7 w-7 items-center justify-center rounded-full bg-[#F0F4EF]">
                <Ionicons name="close-outline" size={17} color="#4D6A50" />
              </View>

              <Text className="ml-2 text-[12px] font-bold text-[#4D6A50]">
                Cancel and go back
              </Text>
            </Pressable>
          </View>

          {/* =================================================== */}
          {/* FINAL WARNING */}
          {/* =================================================== */}

          <View className="mx-5 mt-5 flex-row items-start rounded-[15px] bg-[#F0F4EF] px-4 py-3">
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={PRIMARY}
            />

            <Text className="ml-2.5 flex-1 text-[10px] leading-[16px] text-[#687169]">
              If you are unsure about deactivating your account, choose Cancel
              and return to Settings.
            </Text>
          </View>

          {/* =================================================== */}
          {/* BRAND */}
          {/* =================================================== */}

          <View className="mt-9 items-center">
            <Text className="text-[10px] font-semibold text-[#A0A7A1]">
              Niramaya
            </Text>

            <Text className="mt-1 text-[9px] text-[#B0B6B1]">
              Your space for wellbeing
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * ===============================================================
 * DELETE INFORMATION ROW
 * ===============================================================
 */

function DeleteInfoRow({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#F0F4EF]">
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[12px] font-bold text-[#202722]">{title}</Text>

        <Text className="mt-1 text-[10px] leading-[15px] text-[#858D87]">
          {description}
        </Text>
      </View>
    </View>
  );
}
