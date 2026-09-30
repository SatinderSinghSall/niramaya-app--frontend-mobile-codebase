import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { createConsultation } from "../../services/consultation.service";
import type {
  ConsultationType,
  CreateConsultationPayload,
} from "../../types/consultation";

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  primary: "#4D6A50",
  primaryDark: "#304B36",
  primarySoft: "#EAF1E7",
  text: "#263128",
  textSecondary: "#5F6A61",
  muted: "#858D85",
  border: "#E4E2DA",
  danger: "#A65C50",
  disabled: "#AAB5AB",
};

const TIME_OPTIONS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const GOAL_OPTIONS = [
  "Stress management",
  "Better sleep",
  "Digestion",
  "Weight management",
  "Fitness",
  "Yoga guidance",
  "Mental wellbeing",
  "Skin & hair wellness",
  "General wellbeing",
];

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTomorrow = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);

  return date;
};

const getErrorMessage = (error: any) => {
  const response = error?.response?.data;

  if (Array.isArray(response?.errors) && response.errors.length > 0) {
    return response.errors
      .map((item: { field?: string; message?: string }) => {
        if (item.field && item.message) {
          return `${item.field}: ${item.message}`;
        }

        return item.message || "Invalid consultation details";
      })
      .join("\n");
  }

  return (
    response?.message ||
    error?.message ||
    "Unable to create your consultation request. Please try again."
  );
};

export default function ConsultationBookScreen() {
  const [consultationType, setConsultationType] =
    useState<ConsultationType>("online");

  const [preferredDate, setPreferredDate] = useState(getTomorrow);
  const [preferredTime, setPreferredTime] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);

  const [concern, setConcern] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  const concernLength = concern.trim().length;
  const notesLength = notes.trim().length;

  const isValid = useMemo(() => {
    return (
      consultationType.length > 0 &&
      preferredDate instanceof Date &&
      !Number.isNaN(preferredDate.getTime()) &&
      preferredTime.trim().length > 0 &&
      concernLength >= 5 &&
      concernLength <= 2000 &&
      notesLength <= 1000
    );
  }, [
    consultationType,
    preferredDate,
    preferredTime,
    concernLength,
    notesLength,
  ]);

  const toggleGoal = (goal: string) => {
    if (saving) {
      return;
    }

    setSelectedGoals((current) => {
      if (current.includes(goal)) {
        return current.filter((item) => item !== goal);
      }

      return [...current, goal];
    });
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (!selectedDate || saving) {
      return;
    }

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    setPreferredDate(selected);
  };

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    if (concernLength < 5) {
      Alert.alert(
        "Tell us a little more",
        "Please describe your main concern in at least 5 characters.",
      );
      return;
    }

    if (concernLength > 2000) {
      Alert.alert(
        "Concern is too long",
        "Please keep your concern within 2000 characters.",
      );
      return;
    }

    if (!preferredTime) {
      Alert.alert(
        "Choose a preferred time",
        "Please select a preferred consultation time.",
      );
      return;
    }

    if (notesLength > 1000) {
      Alert.alert(
        "Notes are too long",
        "Please keep your notes within 1000 characters.",
      );
      return;
    }

    const payload: CreateConsultationPayload = {
      consultationType,
      preferredDate: formatDateForApi(preferredDate),
      preferredTime,
      concern: concern.trim(),
      goals: selectedGoals,
      notes: notes.trim() || undefined,
    };

    try {
      // Start loading
      setSaving(true);

      // 1. Submit to backend / MongoDB
      const createdConsultation = await createConsultation(payload);

      // 2. Make sure backend returned the created consultation
      if (!createdConsultation?._id) {
        throw new Error(
          "Consultation was submitted, but no consultation ID was returned.",
        );
      }

      const consultationId = createdConsultation._id;

      // 3. Clear the form ONLY after successful database submission
      setConsultationType("online");
      setPreferredDate(getTomorrow());
      setPreferredTime("");

      setShowDatePicker(false);
      setShowTimeOptions(false);

      setConcern("");
      setNotes("");
      setSelectedGoals([]);

      // 4. IMPORTANT:
      // Stop the loader BEFORE navigating.
      setSaving(false);

      // 5. Give React one moment to render the completed state
      // before changing screens.
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 6. Navigate to consultation dashboard
      router.replace({
        pathname: "/(main)/consultation" as any,
        params: {
          submittedId: consultationId,
        },
      });
    } catch (error: any) {
      console.log("Create consultation error:", error);

      Alert.alert("Unable to request consultation", getErrorMessage(error));

      // Only stop loader when request fails.
      // Keep all entered data so the user can retry.
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View
          className="flex-row items-center px-5 pb-4 pt-3"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <Pressable
            onPress={() => {
              if (!saving) {
                router.back();
              }
            }}
            disabled={saving}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.surface,
              opacity: saving ? 0.5 : 1,
            }}
          >
            <Ionicons name="arrow-back" size={21} color={COLORS.text} />
          </Pressable>

          <View className="ml-3 flex-1">
            <Text
              className="text-[20px] font-bold"
              style={{ color: COLORS.text }}
            >
              Book consultation
            </Text>

            <Text
              className="mt-0.5 text-[11px]"
              style={{ color: COLORS.muted }}
            >
              Tell us how we can support you
            </Text>
          </View>

          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <Ionicons name="leaf-outline" size={19} color={COLORS.primary} />
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 45,
          }}
        >
          {/* Intro */}
          <View
            className="mb-6 rounded-[22px] p-5"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <View className="flex-row items-start">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.surface }}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[15px] font-bold"
                  style={{ color: COLORS.primaryDark }}
                >
                  Personalised wellness guidance
                </Text>

                <Text
                  className="mt-1.5 text-[12px] leading-5"
                  style={{ color: COLORS.textSecondary }}
                >
                  Share what you would like help with and choose a convenient
                  time for your consultation.
                </Text>
              </View>
            </View>
          </View>

          {/* Consultation type */}
          <SectionTitle
            title="Consultation type"
            subtitle="Choose how you would like to connect."
          />

          <View className="mb-6 flex-row gap-3">
            <TypeCard
              icon="videocam-outline"
              title="Online"
              description="Connect remotely"
              selected={consultationType === "online"}
              onPress={() => {
                if (!saving) {
                  setConsultationType("online");
                }
              }}
              disabled={saving}
            />

            <TypeCard
              icon="location-outline"
              title="Offline"
              description="Visit in person"
              selected={consultationType === "offline"}
              onPress={() => {
                if (!saving) {
                  setConsultationType("offline");
                }
              }}
              disabled={saving}
            />
          </View>

          {/* Date */}
          <SectionTitle
            title="Preferred date"
            subtitle="Choose a day that works for you."
          />

          <Pressable
            disabled={saving}
            onPress={() => setShowDatePicker(true)}
            className="mb-6 flex-row items-center rounded-[18px] border p-4"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              opacity: saving ? 0.55 : 1,
            }}
          >
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primarySoft }}
            >
              <Ionicons
                name="calendar-outline"
                size={21}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[11px]" style={{ color: COLORS.muted }}>
                SELECTED DATE
              </Text>

              <Text
                className="mt-1 text-[15px] font-semibold"
                style={{ color: COLORS.text }}
              >
                {formatDisplayDate(preferredDate)}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color={COLORS.muted} />
          </Pressable>

          {showDatePicker && (
            <View className="mb-6">
              <DateTimePicker
                value={preferredDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={getTomorrow()}
                onChange={handleDateChange}
              />
            </View>
          )}

          {/* Time */}
          <SectionTitle
            title="Preferred time"
            subtitle="Choose an available-looking time preference."
          />

          <Pressable
            disabled={saving}
            onPress={() => setShowTimeOptions((current) => !current)}
            className="mb-3 flex-row items-center rounded-[18px] border p-4"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              opacity: saving ? 0.55 : 1,
            }}
          >
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primarySoft }}
            >
              <Ionicons name="time-outline" size={21} color={COLORS.primary} />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[11px]" style={{ color: COLORS.muted }}>
                PREFERRED TIME
              </Text>

              <Text
                className="mt-1 text-[15px] font-semibold"
                style={{
                  color: preferredTime ? COLORS.text : COLORS.muted,
                }}
              >
                {preferredTime || "Select a time"}
              </Text>
            </View>

            <Ionicons
              name={showTimeOptions ? "chevron-up" : "chevron-down"}
              size={19}
              color={COLORS.muted}
            />
          </Pressable>

          {showTimeOptions && (
            <View
              className="mb-6 rounded-[18px] border p-3"
              style={{
                backgroundColor: COLORS.surface,
                borderColor: COLORS.border,
              }}
            >
              <View className="flex-row flex-wrap">
                {TIME_OPTIONS.map((time) => {
                  const selected = preferredTime === time;

                  return (
                    <Pressable
                      key={time}
                      disabled={saving}
                      onPress={() => {
                        if (saving) {
                          return;
                        }

                        setPreferredTime(time);
                        setShowTimeOptions(false);
                      }}
                      className="mb-2 mr-2 rounded-full border px-4 py-2.5"
                      style={{
                        backgroundColor: selected
                          ? COLORS.primary
                          : COLORS.background,
                        borderColor: selected ? COLORS.primary : COLORS.border,
                      }}
                    >
                      <Text
                        className="text-[12px] font-semibold"
                        style={{
                          color: selected ? "#FFFFFF" : COLORS.textSecondary,
                        }}
                      >
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {!showTimeOptions && <View className="mb-3" />}

          {/* Main concern */}
          <SectionTitle
            title="Main concern"
            subtitle="Tell us what you would like guidance with."
            required
          />

          <View
            className="mb-6 rounded-[18px] border p-4"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
            }}
          >
            <TextInput
              value={concern}
              onChangeText={setConcern}
              editable={!saving}
              multiline
              maxLength={2000}
              placeholder="For example: I have been experiencing stress and difficulty sleeping..."
              placeholderTextColor="#A0A59F"
              textAlignVertical="top"
              className="min-h-[130px] text-[14px] leading-5"
              style={{
                color: COLORS.text,
              }}
            />

            <View className="mt-2 items-end">
              <Text
                className="text-[10px]"
                style={{
                  color: concernLength > 2000 ? COLORS.danger : COLORS.muted,
                }}
              >
                {concernLength}/2000
              </Text>
            </View>
          </View>

          {/* Goals */}
          <SectionTitle
            title="Wellness goals"
            subtitle="Select anything you would like to discuss."
          />

          <View className="mb-6 flex-row flex-wrap">
            {GOAL_OPTIONS.map((goal) => {
              const selected = selectedGoals.includes(goal);

              return (
                <Pressable
                  key={goal}
                  disabled={saving}
                  onPress={() => toggleGoal(goal)}
                  className="mb-2 mr-2 flex-row items-center rounded-full border px-3.5 py-2.5"
                  style={{
                    backgroundColor: selected
                      ? COLORS.primarySoft
                      : COLORS.surface,
                    borderColor: selected ? COLORS.primary : COLORS.border,
                    opacity: saving ? 0.55 : 1,
                  }}
                >
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={13}
                      color={COLORS.primary}
                    />
                  )}

                  <Text
                    className={`text-[11px] font-medium ${
                      selected ? "ml-1" : ""
                    }`}
                    style={{
                      color: selected
                        ? COLORS.primaryDark
                        : COLORS.textSecondary,
                    }}
                  >
                    {goal}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Notes */}
          <SectionTitle
            title="Additional notes"
            subtitle="Anything else you would like us to know? Optional."
          />

          <View
            className="mb-6 rounded-[18px] border p-4"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
            }}
          >
            <TextInput
              value={notes}
              onChangeText={setNotes}
              editable={!saving}
              multiline
              maxLength={1000}
              placeholder="Add any additional information..."
              placeholderTextColor="#A0A59F"
              textAlignVertical="top"
              className="min-h-[100px] text-[14px] leading-5"
              style={{
                color: COLORS.text,
              }}
            />

            <View className="mt-2 items-end">
              <Text className="text-[10px]" style={{ color: COLORS.muted }}>
                {notesLength}/1000
              </Text>
            </View>
          </View>

          {/* Request button */}
          <Pressable
            disabled={saving || !isValid}
            onPress={handleSubmit}
            className="mt-1 h-[56px] items-center justify-center rounded-[18px]"
            style={{
              backgroundColor:
                saving || !isValid ? COLORS.disabled : COLORS.primary,
            }}
          >
            {saving ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text className="ml-2 text-[14px] font-bold text-white">
                  Sending request...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-[14px] font-bold text-white">
                  Request consultation
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 8 }}
                />
              </View>
            )}
          </Pressable>

          <Text
            className="mt-3 px-4 text-center text-[10px] leading-4"
            style={{ color: COLORS.muted }}
          >
            Your request will be submitted with your preferred date and time.
            The consultation status can be viewed from your consultation
            history.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full-screen submission loader */}
      {saving && (
        <View
          className="absolute inset-0 items-center justify-center px-6"
          style={{
            backgroundColor: "rgba(38, 49, 40, 0.38)",
          }}
        >
          <View
            className="w-full max-w-[330px] items-center rounded-[28px] px-6 py-7"
            style={{
              backgroundColor: COLORS.surface,
            }}
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.primarySoft,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>

            <Text
              className="mt-5 text-center text-[18px] font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              Submitting request
            </Text>

            <Text
              className="mt-2 text-center text-[12px] leading-5"
              style={{
                color: COLORS.textSecondary,
              }}
            >
              Please wait while we submit your consultation request. Do not
              close this screen.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  subtitle,
  required = false,
}: {
  title: string;
  subtitle: string;
  required?: boolean;
}) {
  return (
    <View className="mb-3">
      <View className="flex-row items-center">
        <Text className="text-[16px] font-bold" style={{ color: COLORS.text }}>
          {title}
        </Text>

        {required && (
          <Text className="ml-1 text-[13px]" style={{ color: COLORS.danger }}>
            *
          </Text>
        )}
      </View>

      <Text
        className="mt-1 text-[11px] leading-4"
        style={{ color: COLORS.muted }}
      >
        {subtitle}
      </Text>
    </View>
  );
}

function TypeCard({
  icon,
  title,
  description,
  selected,
  onPress,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-1 rounded-[20px] border p-4"
      style={({ pressed }) => ({
        backgroundColor: selected ? COLORS.primarySoft : COLORS.surface,
        borderColor: selected ? COLORS.primary : COLORS.border,
        opacity: disabled ? 0.55 : pressed ? 0.82 : 1,
      })}
    >
      <View className="flex-row items-center justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: selected ? COLORS.surface : COLORS.primarySoft,
          }}
        >
          <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>

        <View
          className="h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: selected ? COLORS.primary : COLORS.border,
          }}
        >
          {selected && (
            <View
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: COLORS.primary,
              }}
            />
          )}
        </View>
      </View>

      <Text
        className="mt-4 text-[14px] font-bold"
        style={{ color: COLORS.text }}
      >
        {title}
      </Text>

      <Text className="mt-1 text-[10px]" style={{ color: COLORS.muted }}>
        {description}
      </Text>
    </Pressable>
  );
}
