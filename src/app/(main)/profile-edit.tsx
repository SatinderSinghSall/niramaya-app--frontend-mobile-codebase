import React, { useEffect, useState } from "react";

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

import { getProfile, updateProfile } from "../../services/profile.service";

import { UserProfile } from "../../types/profile";

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getProfile();

        setProfile(result);

        setFirstName(result.firstName ?? "");
        setLastName(result.lastName ?? "");
        setPhone(result.phone ?? "");
      } catch (error) {
        console.error(error);

        Alert.alert("Couldn't load profile", "Please try again.", [
          {
            text: "Go back",
            onPress: () => router.back(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirstName) {
      Alert.alert("First name required", "Please enter your first name.");
      return;
    }

    if (!cleanLastName) {
      Alert.alert("Last name required", "Please enter your last name.");
      return;
    }

    try {
      setSaving(true);

      const updated = await updateProfile({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        phone: cleanPhone || null,
      });

      setProfile(updated);

      Alert.alert(
        "Profile updated",
        "Your personal information has been updated successfully.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.error("Profile update failed:", error);

      Alert.alert(
        "Couldn't update profile",
        error?.response?.data?.message ??
          "Please check your information and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F7F4]">
        <StatusBar style="dark" />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#4D6A50" />

          <Text className="mt-3 text-[12px] text-[#687169]">
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
                Edit profile
              </Text>

              <Text className="mt-0.5 text-[11px] text-[#7A837C]">
                Keep your personal information up to date
              </Text>
            </View>
          </View>

          <View className="mx-5 h-px bg-[#E3E8E2]" />

          {/* Form */}
          <View className="mx-5 mt-6">
            <Text className="text-[16px] font-bold text-[#202722]">
              Personal information
            </Text>

            <View className="mt-4">
              <Field
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                icon="person-outline"
              />

              <Field
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                icon="person-outline"
              />

              <Field
                label="Email"
                value={profile?.email ?? ""}
                onChangeText={() => {}}
                placeholder="Email"
                icon="mail-outline"
                editable={false}
              />

              <Field
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                icon="call-outline"
                keyboardType="phone-pad"
              />
            </View>

            <View className="mt-2 rounded-[16px] bg-[#EEF3ED] px-4 py-3">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#4D6A50"
                />

                <Text className="ml-2 flex-1 text-[10px] leading-[16px] text-[#687169]">
                  Your email address is linked to your account and cannot be
                  changed from this screen.
                </Text>
              </View>
            </View>

            {/* Save */}
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="mt-6 h-[50px] flex-row items-center justify-center rounded-[16px] bg-[#304A36]"
              style={({ pressed }) => ({
                opacity: pressed || saving ? 0.86 : 1,
              })}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-[12px] font-extrabold text-white">
                    Save changes
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

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  editable = true,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  editable?: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address";
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[10px] font-bold uppercase tracking-[0.5px] text-[#7A837C]">
        {label}
      </Text>

      <View
        className={`min-h-[50px] flex-row items-center rounded-[15px] border bg-white px-3.5 ${
          editable ? "border-[#E1E7E0]" : "border-[#E7EBE6] bg-[#F3F5F2]"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={editable ? "#4D6A50" : "#9AA19B"}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A1A8A2"
          editable={editable}
          keyboardType={keyboardType}
          className="ml-3 flex-1 text-[13px] font-medium text-[#202722]"
        />
      </View>
    </View>
  );
}
