import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
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

import { changePassword } from "../../services/profile.service";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword) {
      Alert.alert(
        "Current password required",
        "Please enter your current password.",
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Password too short",
        "Your new password must contain at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords don't match",
        "Please make sure both new password fields match.",
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Choose a different password",
        "Your new password must be different from your current password.",
      );
      return;
    }

    try {
      setSaving(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert(
        "Password changed",
        "Your password has been changed successfully. Please log in again.",
        [
          {
            text: "Continue",
            onPress: () => {
              /*
               * Your existing AuthContext/token-storage logout
               * should be called here as well.
               *
               * We will wire this to your exact AuthContext
               * once its API is available.
               */
              router.replace("/(public)/login");
            },
          },
        ],
      );
    } catch (error: any) {
      console.error("Password change failed:", error);

      Alert.alert(
        "Couldn't change password",
        error?.response?.data?.message ??
          "Please check your current password and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom + 28, 36),
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
              <Text className="text-[21px] font-bold text-[#202722]">
                Password & security
              </Text>

              <Text className="mt-0.5 text-[11px] text-[#7A837C]">
                Keep your account secure
              </Text>
            </View>
          </View>

          <View className="mx-5 h-px bg-[#E3E8E2]" />

          {/* Security intro */}
          <View className="mx-5 mt-5 rounded-[20px] bg-[#E7F0E5] px-4 py-4">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#D5E5D3]">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#4D6A50"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-[#304A36]">
                  Choose a strong password
                </Text>

                <Text className="mt-1 text-[10px] leading-[15px] text-[#687B6B]">
                  Use at least 8 characters and avoid passwords you use
                  elsewhere.
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className="mx-5 mt-6">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              visible={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
            />

            <PasswordField
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              visible={showNew}
              onToggle={() => setShowNew((value) => !value)}
            />

            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
            />

            <Pressable
              onPress={handleSubmit}
              disabled={saving}
              className="mt-3 h-[50px] flex-row items-center justify-center rounded-[16px] bg-[#304A36]"
              style={({ pressed }) => ({
                opacity: pressed || saving ? 0.86 : 1,
              })}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="lock-closed-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-[12px] font-extrabold text-white">
                    Change password
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[10px] font-bold uppercase tracking-[0.5px] text-[#7A837C]">
        {label}
      </Text>

      <View className="min-h-[50px] flex-row items-center rounded-[15px] border border-[#E1E7E0] bg-white px-3.5">
        <Ionicons name="lock-closed-outline" size={18} color="#4D6A50" />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder="Enter password"
          placeholderTextColor="#A1A8A2"
          className="ml-3 flex-1 text-[13px] font-medium text-[#202722]"
          autoCapitalize="none"
        />

        <Pressable onPress={onToggle} hitSlop={8}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={19}
            color="#929A93"
          />
        </Pressable>
      </View>
    </View>
  );
}
