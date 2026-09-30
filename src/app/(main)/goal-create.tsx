import React, { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { createGoal } from "@/services/goal.service";
import { GOAL_CATEGORIES } from "@/constants/goals";
import { GoalCategory } from "@/types/goal";

/* ==========================================================================
   TYPES
========================================================================== */

type FieldErrors = {
  title: string;
  description: string;
  category: string;
  targetValue: string;
  targetUnit: string;
  targetDescription: string;
  startDate: string;
  targetDate: string;
};

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#263128",
  muted: "#777C74",
  softMuted: "#A0A29A",

  green: "#4D6A50",
  darkGreen: "#304B36",

  lightGreen: "#E7EFE3",
  lighterGreen: "#F0F5ED",

  border: "#E3DDD2",
  inputBorder: "#DDD7CC",

  red: "#C64D4D",
  redBackground: "#FBEEEE",

  blue: "#52718B",
  blueBackground: "#EDF3F6",
};

/* ==========================================================================
   EMPTY ERRORS
========================================================================== */

const EMPTY_ERRORS: FieldErrors = {
  title: "",
  description: "",
  category: "",
  targetValue: "",
  targetUnit: "",
  targetDescription: "",
  startDate: "",
  targetDate: "",
};

/* ==========================================================================
   HELPERS
========================================================================== */

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatISODate(date: Date) {
  return date.toISOString();
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#718071]">
        {eyebrow}
      </Text>

      <Text className="mt-1 font-serif text-[19px] font-bold text-[#263128]">
        {title}
      </Text>

      <Text className="mt-1 text-[10px] leading-[15px] text-[#858980]">
        {subtitle}
      </Text>
    </View>
  );
}

/* ==========================================================================
   FORM INPUT
========================================================================== */

function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  error,
  disabled,
  keyboardType = "default",
  multiline = false,
  required = false,
  hint,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  disabled?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
  required?: boolean;
  hint?: string;
}) {
  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-[10px] font-semibold text-[#4F554E]">
          {label}

          {required ? <Text className="text-[#C64D4D]"> *</Text> : null}
        </Text>

        {hint ? (
          <Text className="text-[8px] text-[#A0A29A]">{hint}</Text>
        ) : null}
      </View>

      <View
        className={`overflow-hidden rounded-[5px] border bg-white ${
          error ? "border-[#D88B8B]" : "border-[#DDD7CC]"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <View className="flex-row items-start">
          <View className="w-10 items-center pt-[15px]">
            <Ionicons
              name={icon}
              size={16}
              color={error ? COLORS.red : COLORS.green}
            />
          </View>

          <TextInput
            editable={!disabled}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#AAA99F"
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            className={`flex-1 pr-4 text-[12px] text-[#263128] ${
              multiline ? "min-h-[92px] py-3.5" : "h-[47px]"
            }`}
          />
        </View>
      </View>

      {error ? (
        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={12} color={COLORS.red} />

          <Text className="ml-1 text-[9px] font-medium text-[#C64D4D]">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   DATE FIELD
========================================================================== */

function DateField({
  label,
  subtitle,
  date,
  placeholder,
  icon,
  error,
  disabled,
  required,
  onPress,
}: {
  label: string;
  subtitle: string;
  date?: Date;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onPress: () => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[10px] font-semibold text-[#4F554E]">
        {label}

        {required ? <Text className="text-[#C64D4D]"> *</Text> : null}
      </Text>

      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.8}
        onPress={onPress}
        className={`rounded-[5px] border bg-white px-3.5 py-3 ${
          error ? "border-[#D88B8B]" : "border-[#DDD7CC]"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <View className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-[4px] bg-[#F0F4ED]">
            <Ionicons name={icon} size={16} color={COLORS.green} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[8px] text-[#9A9C95]">{subtitle}</Text>

            <Text
              className={`mt-0.5 text-[12px] font-semibold ${
                date ? "text-[#263128]" : "text-[#AAA99F]"
              }`}
            >
              {date ? formatDate(date) : placeholder}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={15} color="#9A9C95" />
        </View>
      </TouchableOpacity>

      {error ? (
        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={12} color={COLORS.red} />

          <Text className="ml-1 text-[9px] font-medium text-[#C64D4D]">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   CATEGORY
========================================================================== */

function CategoryButton({
  item,
  selected,
  disabled,
  onPress,
}: {
  item: (typeof GOAL_CATEGORIES)[number];
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      className={`mb-2.5 mr-2 flex-row items-center rounded-full border px-3.5 py-2.5 ${
        selected ? "border-[#4D6A50] bg-[#4D6A50]" : "border-[#DDD7CC] bg-white"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Ionicons
        name={selected ? "checkmark" : "leaf-outline"}
        size={13}
        color={selected ? "#FFFFFF" : "#667066"}
      />

      <Text
        className={`ml-1.5 text-[9px] font-semibold ${
          selected ? "text-white" : "text-[#596059]"
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   MAIN SCREEN
========================================================================== */

export default function CreateGoalScreen() {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<GoalCategory>("general_wellbeing");

  const [targetValue, setTargetValue] = useState("");

  const [targetUnit, setTargetUnit] = useState("");

  const [targetDescription, setTargetDescription] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);

  const [targetDate, setTargetDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);

  const [showTargetPicker, setShowTargetPicker] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);

  const [mainError, setMainError] = useState("");

  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------------------------
     CLEAR ERROR
  ------------------------------------------------------------------------ */

  const clearError = (field: keyof FieldErrors) => {
    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    if (mainError) {
      setMainError("");
    }
  };

  /* ------------------------------------------------------------------------
     VALIDATION
  ------------------------------------------------------------------------ */

  const validateForm = () => {
    const nextErrors: FieldErrors = {
      ...EMPTY_ERRORS,
    };

    let valid = true;

    if (!title.trim()) {
      nextErrors.title = "Goal title is required.";
      valid = false;
    } else if (title.trim().length < 3) {
      nextErrors.title = "Goal title should be at least 3 characters.";
      valid = false;
    }

    if (description.trim() && description.trim().length < 10) {
      nextErrors.description = "Description should be at least 10 characters.";
      valid = false;
    }

    if (!category) {
      nextErrors.category = "Please select a category.";
      valid = false;
    }

    if (targetValue.trim()) {
      const numericValue = Number(targetValue);

      if (Number.isNaN(numericValue)) {
        nextErrors.targetValue = "Enter a valid target value.";
        valid = false;
      } else if (numericValue < 0) {
        nextErrors.targetValue = "Target cannot be negative.";
        valid = false;
      }
    }

    if (targetValue.trim() && !targetUnit.trim()) {
      nextErrors.targetUnit = "Please enter a unit.";
      valid = false;
    }

    if (targetUnit.trim() && !targetValue.trim()) {
      nextErrors.targetValue = "Please enter a target value.";
      valid = false;
    }

    if (!startDate) {
      nextErrors.startDate = "Please select a start date.";
      valid = false;
    }

    if (targetDate && startDate && targetDate < startDate) {
      nextErrors.targetDate = "Target date must be after the start date.";
      valid = false;
    }

    if (targetDescription.trim() && targetDescription.trim().length < 5) {
      nextErrors.targetDescription =
        "Target description should be at least 5 characters.";
      valid = false;
    }

    setErrors(nextErrors);

    if (!valid) {
      setMainError(
        "Please review the highlighted fields before creating your goal.",
      );
    }

    return valid;
  };

  /* ------------------------------------------------------------------------
     CREATE
  ------------------------------------------------------------------------ */

  const handleCreate = async () => {
    if (saving) {
      return;
    }

    setMainError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const numericTarget = targetValue.trim()
        ? Number(targetValue)
        : undefined;

      const goal = await createGoal({
        title: title.trim(),

        description: description.trim() || undefined,

        category,

        target:
          numericTarget !== undefined ||
          targetUnit.trim() ||
          targetDescription.trim()
            ? {
                value: numericTarget ?? null,

                unit: targetUnit.trim() || null,

                description: targetDescription.trim() || null,
              }
            : undefined,

        startDate: startDate ? formatISODate(startDate) : "",

        targetDate: targetDate ? formatISODate(targetDate) : undefined,
      });

      router.replace({
        pathname: "/(main)/goals/[id]",

        params: {
          id: goal._id,
        },
      });
    } catch (error: any) {
      console.error("Create goal error:", error);

      setMainError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while creating your goal.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------
     UI
  ------------------------------------------------------------------------ */

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F3EA]">
      {/* ================================================================
          SUBMIT OVERLAY
      ================================================================ */}

      {saving ? (
        <View className="absolute inset-0 z-50 items-center justify-center bg-[#263128]/25">
          <View className="w-[245px] rounded-[8px] border border-[#E3DDD2] bg-white px-6 py-7">
            <View className="items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EEF4EB]">
                <ActivityIndicator size="small" color={COLORS.green} />
              </View>

              <Text className="mt-4 font-serif text-[18px] font-bold text-[#263128]">
                Creating your goal
              </Text>

              <Text className="mt-1.5 text-center text-[9px] leading-[15px] text-[#777C74]">
                Saving your intention and preparing your journey.
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          contentContainerStyle={{
            paddingBottom: 45,
          }}
        >
          {/* ==============================================================
              HEADER
          ============================================================== */}

          <View className="px-[18px] pb-6 pt-3">
            <View className="flex-row items-center">
              <TouchableOpacity
                disabled={saving}
                activeOpacity={0.8}
                onPress={() => router.back()}
                className={`h-10 w-10 items-center justify-center rounded-full border border-[#DDD7CC] bg-white ${
                  saving ? "opacity-40" : ""
                }`}
              >
                <Ionicons name="arrow-back" size={17} color="#344038" />
              </TouchableOpacity>

              <View className="ml-3 flex-1">
                <Text className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#718071]">
                  Wellness journey
                </Text>

                <Text className="mt-0.5 font-serif text-[27px] font-bold text-[#263128]">
                  Create a goal
                </Text>
              </View>

              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E7EFE3]">
                <Ionicons name="leaf-outline" size={18} color={COLORS.green} />
              </View>
            </View>

            <Text className="mt-4 max-w-[320px] text-[10px] leading-[16px] text-[#777C74]">
              Choose something meaningful to you. Keep it simple, measurable and
              achievable.
            </Text>
          </View>

          {/* ==============================================================
              ERROR
          ============================================================== */}

          {mainError ? (
            <View className="mx-[18px] mb-5 rounded-[6px] border border-[#E8CACA] bg-[#FBEEEE] px-3.5 py-3">
              <View className="flex-row items-start">
                <Ionicons name="warning-outline" size={16} color={COLORS.red} />

                <View className="ml-2.5 flex-1">
                  <Text className="text-[10px] font-bold text-[#8F3E3E]">
                    Please check your goal
                  </Text>

                  <Text className="mt-0.5 text-[9px] leading-[14px] text-[#B34D4D]">
                    {mainError}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={saving}
                  onPress={() => setMainError("")}
                  className="ml-2"
                >
                  <Ionicons name="close" size={15} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* ==============================================================
              FORM
          ============================================================== */}

          <View className="px-[18px]">
            {/* ============================================================
                BASIC DETAILS
            ============================================================ */}

            <View className="mb-7">
              <SectionHeader
                eyebrow="01"
                title="The intention"
                subtitle="What would you like to improve?"
              />

              <FormInput
                label="Goal title"
                required
                icon="flag-outline"
                placeholder="e.g. Improve my sleep"
                value={title}
                error={errors.title}
                disabled={saving}
                onChangeText={(value) => {
                  setTitle(value);
                  clearError("title");
                }}
              />

              <FormInput
                label="Description"
                icon="document-text-outline"
                placeholder="Describe what this goal means to you"
                value={description}
                error={errors.description}
                disabled={saving}
                multiline
                hint="Optional"
                onChangeText={(value) => {
                  setDescription(value);
                  clearError("description");
                }}
              />
            </View>

            {/* ============================================================
                CATEGORY
            ============================================================ */}

            <View className="mb-7">
              <SectionHeader
                eyebrow="02"
                title="Area of wellness"
                subtitle="Choose the area this intention belongs to."
              />

              <View className="flex-row flex-wrap">
                {GOAL_CATEGORIES.map((item) => (
                  <CategoryButton
                    key={item.value}
                    item={item}
                    selected={category === item.value}
                    disabled={saving}
                    onPress={() => {
                      setCategory(item.value);

                      clearError("category");
                    }}
                  />
                ))}
              </View>

              {errors.category ? (
                <View className="mt-1 flex-row items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={12}
                    color={COLORS.red}
                  />

                  <Text className="ml-1 text-[9px] text-[#C64D4D]">
                    {errors.category}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ============================================================
                TARGET
            ============================================================ */}

            <View className="mb-7">
              <SectionHeader
                eyebrow="03"
                title="Your target"
                subtitle="Give your goal a simple measure when useful."
              />

              <View className="flex-row">
                <View className="mr-2 flex-1">
                  <FormInput
                    label="Value"
                    icon="analytics-outline"
                    placeholder="e.g. 8"
                    value={targetValue}
                    error={errors.targetValue}
                    disabled={saving}
                    keyboardType="decimal-pad"
                    onChangeText={(value) => {
                      setTargetValue(value);

                      clearError("targetValue");
                    }}
                  />
                </View>

                <View className="flex-1">
                  <FormInput
                    label="Unit"
                    icon="resize-outline"
                    placeholder="hours, kg..."
                    value={targetUnit}
                    error={errors.targetUnit}
                    disabled={saving}
                    onChangeText={(value) => {
                      setTargetUnit(value);

                      clearError("targetUnit");
                    }}
                  />
                </View>
              </View>

              <FormInput
                label="What does this target mean?"
                icon="information-circle-outline"
                placeholder="e.g. Sleep for at least 8 hours each night"
                value={targetDescription}
                error={errors.targetDescription}
                disabled={saving}
                multiline
                hint="Optional"
                onChangeText={(value) => {
                  setTargetDescription(value);

                  clearError("targetDescription");
                }}
              />
            </View>

            {/* ============================================================
                TIMELINE
            ============================================================ */}

            <View className="mb-7">
              <SectionHeader
                eyebrow="04"
                title="Your timeline"
                subtitle="Choose when you want to begin and, if useful, when to reach it."
              />

              <DateField
                label="Start date"
                required
                subtitle="Goal begins"
                placeholder="Select start date"
                date={startDate ?? undefined}
                icon="calendar-outline"
                error={errors.startDate}
                disabled={saving}
                onPress={() => setShowStartPicker(true)}
              />

              {showStartPicker && !saving ? (
                <DateTimePicker
                  value={startDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);

                    if (selectedDate) {
                      setStartDate(selectedDate);

                      clearError("startDate");

                      if (targetDate && targetDate < selectedDate) {
                        setTargetDate(null);

                        setErrors((previous) => ({
                          ...previous,
                          targetDate: "",
                        }));
                      }
                    }
                  }}
                />
              ) : null}

              <DateField
                label="Target date"
                subtitle="Optional deadline"
                placeholder="Choose a target date"
                date={targetDate ?? undefined}
                icon="flag-outline"
                error={errors.targetDate}
                disabled={saving}
                onPress={() => setShowTargetPicker(true)}
              />

              {showTargetPicker && !saving ? (
                <DateTimePicker
                  value={targetDate ?? startDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={startDate ?? undefined}
                  onChange={(event, selectedDate) => {
                    setShowTargetPicker(false);

                    if (selectedDate) {
                      setTargetDate(selectedDate);

                      clearError("targetDate");
                    }
                  }}
                />
              ) : null}
            </View>

            {/* ============================================================
                SUMMARY
            ============================================================ */}

            <View className="mb-5 rounded-[6px] border border-[#DCE6D8] bg-[#F0F5ED] px-4 py-3.5">
              <View className="flex-row items-start">
                <Ionicons name="leaf-outline" size={16} color={COLORS.green} />

                <View className="ml-2.5 flex-1">
                  <Text className="text-[10px] font-bold text-[#405743]">
                    A gentle reminder
                  </Text>

                  <Text className="mt-1 text-[9px] leading-[14px] text-[#718071]">
                    Your goal can evolve with you. You can update its progress,
                    milestones and status later.
                  </Text>
                </View>
              </View>
            </View>

            {/* ============================================================
                CREATE
            ============================================================ */}

            <TouchableOpacity
              disabled={saving}
              activeOpacity={0.85}
              onPress={handleCreate}
              className={`mb-2 overflow-hidden rounded-[5px] ${
                saving ? "bg-[#A5B5A7]" : "bg-[#4D6A50]"
              }`}
            >
              <View className="h-[52px] flex-row items-center justify-center">
                {saving ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text className="ml-2.5 text-[11px] font-bold text-white">
                      Creating...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 text-[11px] font-bold text-white">
                      Create Goal
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <Text className="mb-5 text-center text-[8px] leading-[13px] text-[#A0A29A]">
              You can update your goal and progress anytime.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
