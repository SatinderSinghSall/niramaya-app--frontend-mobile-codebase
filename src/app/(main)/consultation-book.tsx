import DateTimePicker from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import React, { useMemo, useState, useEffect } from "react";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [iosDateDraft, setIosDateDraft] = useState(getTomorrow);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const concernLength = concern.trim().length;

  const notesLength = notes.trim().length;

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

  const handleAndroidDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (!selectedDate || saving) {
      return;
    }

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    setPreferredDate(selected);
    setSubmitError("");
  };

  const openDatePicker = () => {
    if (saving) {
      return;
    }

    setIosDateDraft(new Date(preferredDate));
    setShowDatePicker(true);
  };

  const cancelIosDate = () => {
    if (saving) {
      return;
    }

    setShowDatePicker(false);
    setIosDateDraft(new Date(preferredDate));
  };

  const confirmIosDate = () => {
    if (saving) {
      return;
    }

    const selected = new Date(iosDateDraft);
    selected.setHours(0, 0, 0, 0);
    setPreferredDate(selected);
    setShowDatePicker(false);
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    setHasAttemptedSubmit(true);
    setSubmitError("");

    if (concernLength < 5) {
      setSubmitError(
        "Please describe your main concern in at least 5 characters.",
      );
      return;
    }

    if (concernLength > 2000) {
      setSubmitError("Please keep your main concern within 2000 characters.");
      return;
    }

    if (!preferredTime) {
      setSubmitError("Please select a preferred consultation time.");
      return;
    }

    if (notesLength > 1000) {
      setSubmitError("Please keep your notes within 1000 characters.");
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

    Keyboard.dismiss();

    try {
      setSaving(true);

      const createdConsultation = await createConsultation(payload);

      if (!createdConsultation?._id) {
        throw new Error(
          "Consultation was submitted, but no consultation ID was returned.",
        );
      }

      const consultationId = createdConsultation._id;

      setConsultationType("online");
      setPreferredDate(getTomorrow());
      setIosDateDraft(getTomorrow());
      setPreferredTime("");
      setShowDatePicker(false);
      setShowTimeOptions(false);
      setConcern("");
      setNotes("");
      setSelectedGoals([]);
      setHasAttemptedSubmit(false);
      setSubmitError("");
      setSaving(false);

      await new Promise((resolve) => setTimeout(resolve, 150));

      router.replace({
        pathname: "/(main)/consultation" as any,
        params: {
          submittedId: consultationId,
        },
      });
    } catch (error: any) {
      console.log("Create consultation error:", error);
      setSubmitError(getErrorMessage(error));
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          keyboardDismissMode="none"
          scrollEnabled={!saving}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom:
              Platform.OS === "android"
                ? Math.max(keyboardHeight + 40, 72)
                : 72,
          }}
        >
          {/* Intro */}

          <View
            className="mb-6 rounded-[20px] border p-4"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
            }}
          >
            <View className="flex-row items-start">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.primarySoft }}
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
            onPress={openDatePicker}
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

          {Platform.OS === "android" && showDatePicker ? (
            <DateTimePicker
              value={preferredDate}
              mode="date"
              display="default"
              minimumDate={getTomorrow()}
              onChange={handleAndroidDateChange}
            />
          ) : null}

          <Modal
            visible={Platform.OS === "ios" && showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={cancelIosDate}
          >
            <View
              className="flex-1 justify-end"
              style={{ backgroundColor: "rgba(38, 49, 40, 0.30)" }}
            >
              <View
                className="rounded-t-[28px] px-5 pb-8 pt-4"
                style={{ backgroundColor: COLORS.surface }}
              >
                <View className="mb-4 flex-row items-center justify-between">
                  <Pressable
                    disabled={saving}
                    onPress={cancelIosDate}
                    className="h-10 min-w-[64px] items-center justify-center"
                  >
                    <Text
                      className="text-[13px] font-semibold"
                      style={{ color: COLORS.muted }}
                    >
                      Cancel
                    </Text>
                  </Pressable>

                  <View className="items-center px-3">
                    <Text
                      className="text-[16px] font-bold"
                      style={{ color: COLORS.text }}
                    >
                      Choose date
                    </Text>
                    <Text
                      className="mt-1 text-[10px]"
                      style={{ color: COLORS.muted }}
                    >
                      Select your preferred consultation day
                    </Text>
                  </View>

                  <Pressable
                    disabled={saving}
                    onPress={confirmIosDate}
                    className="h-10 min-w-[64px] items-center justify-center"
                  >
                    <Text
                      className="text-[13px] font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      Done
                    </Text>
                  </Pressable>
                </View>

                <View
                  className="mb-2 rounded-[16px] border px-4 py-3"
                  style={{
                    backgroundColor: COLORS.primarySoft,
                    borderColor: "#D7E3D3",
                  }}
                >
                  <Text
                    className="text-[9px] font-semibold uppercase tracking-[1px]"
                    style={{ color: COLORS.muted }}
                  >
                    Selected date
                  </Text>
                  <Text
                    className="mt-1 text-[16px] font-bold"
                    style={{ color: COLORS.primaryDark }}
                  >
                    {formatDisplayDate(iosDateDraft)}
                  </Text>
                </View>

                <DateTimePicker
                  value={iosDateDraft}
                  mode="date"
                  display="spinner"
                  themeVariant="light"
                  minimumDate={getTomorrow()}
                  onChange={(_event, selectedDate) => {
                    if (selectedDate && !saving) {
                      const next = new Date(selectedDate);
                      next.setHours(0, 0, 0, 0);
                      setIosDateDraft(next);
                    }
                  }}
                  style={{ height: 190, width: "100%" }}
                />
              </View>
            </View>
          </Modal>

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
              onChangeText={(value) => {
                setConcern(value);
                if (submitError) setSubmitError("");
              }}
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

          {hasAttemptedSubmit && concernLength < 5 ? (
            <View
              className="mb-5 -mt-3 flex-row items-start rounded-[14px] border px-3.5 py-3"
              style={{
                backgroundColor: "#FBF0ED",
                borderColor: "#E8CEC8",
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={15}
                color={COLORS.danger}
              />
              <Text
                className="ml-2 flex-1 text-[10px] leading-4"
                style={{ color: COLORS.danger }}
              >
                Please add at least 5 characters describing your main concern.
              </Text>
            </View>
          ) : null}

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
              onChangeText={(value) => {
                setNotes(value);
                if (submitError) setSubmitError("");
              }}
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

          {submitError ? (
            <View
              className="mb-4 flex-row items-start rounded-[16px] border px-3.5 py-3"
              style={{
                backgroundColor: "#FBF0ED",
                borderColor: "#E8CEC8",
              }}
            >
              <View
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: "#F4DDD8" }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.danger}
                />
              </View>

              <View className="ml-2.5 flex-1">
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: COLORS.text }}
                >
                  We couldn't send the request
                </Text>
                <Text
                  className="mt-1 text-[10px] leading-4"
                  style={{ color: COLORS.danger }}
                >
                  {submitError}
                </Text>
              </View>

              {!saving ? (
                <Pressable onPress={() => setSubmitError("")} hitSlop={8}>
                  <Ionicons name="close" size={16} color={COLORS.danger} />
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {/* Request button */}

          <Pressable
            disabled={saving}
            onPress={handleSubmit}
            className="mt-1 h-[56px] items-center justify-center rounded-[18px]"
            style={{
              backgroundColor: saving ? COLORS.disabled : COLORS.primary,
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
