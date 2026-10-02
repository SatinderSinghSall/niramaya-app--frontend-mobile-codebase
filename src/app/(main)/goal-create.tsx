import React, { useMemo, useState } from "react";

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
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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

type PickerKind = "start" | "target" | null;

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",
  softSurface: "#FBFAF7",

  text: "#2C352D",
  muted: "#777D75",
  softMuted: "#A1A49C",

  green: "#4D6A50",
  greenDark: "#38513C",
  greenSoft: "#EAF1E7",
  greenWash: "#F1F5EF",

  border: "#E2DDD3",
  inputBorder: "#D9D4CA",

  red: "#C65353",
  redBackground: "#FBEFEE",
  redBorder: "#E7CACA",
};

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

function getErrorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong while creating your goal. Please try again."
  );
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-4">
      <View className="mb-1.5 flex-row items-center">
        <View className="h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#E9EFE6] px-1.5">
          <Text className="text-[8px] font-bold text-[#5D735F]">{number}</Text>
        </View>

        <Text className="ml-2.5 font-serif text-[19px] font-bold text-[#2C352D]">
          {title}
        </Text>
      </View>

      <Text className="ml-[34px] text-[10px] leading-[15px] text-[#858980]">
        {subtitle}
      </Text>
    </View>
  );
}

/* ==========================================================================
   FORM FIELD
========================================================================== */

function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
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
          {required ? <Text className="text-[#C65353]"> *</Text> : null}
        </Text>

        {hint ? (
          <Text className="text-[8px] text-[#A0A39B]">{hint}</Text>
        ) : null}
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
        selectionColor={COLORS.green}
        className={`rounded-[7px] border bg-white px-3.5 text-[12px] text-[#2C352D] ${
          error ? "border-[#D88B8B]" : "border-[#D9D4CA]"
        } ${multiline ? "min-h-[92px] py-3.5" : "h-[48px]"} ${
          disabled ? "bg-[#F4F2ED] text-[#9B9E97]" : ""
        }`}
      />

      {error ? (
        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={12} color={COLORS.red} />
          <Text className="ml-1 text-[9px] font-medium text-[#C65353]">
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
  error,
  disabled,
  required,
  onPress,
}: {
  label: string;
  subtitle: string;
  date?: Date;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onPress: () => void;
}) {
  return (
    <View className="mb-4 flex-1">
      <Text className="mb-2 text-[10px] font-semibold text-[#4F554E]">
        {label}
        {required ? <Text className="text-[#C65353]"> *</Text> : null}
      </Text>

      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.8}
        onPress={onPress}
        className={`rounded-[7px] border bg-white px-3.5 py-3 ${
          error ? "border-[#D88B8B]" : "border-[#D9D4CA]"
        } ${disabled ? "bg-[#F4F2ED]" : ""}`}
      >
        <View className="flex-row items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EFF3EC]">
            <Ionicons name="calendar-outline" size={15} color={COLORS.green} />
          </View>

          <View className="ml-2.5 flex-1">
            <Text className="text-[8px] text-[#9A9D96]">{subtitle}</Text>

            <Text
              className={`mt-0.5 text-[11px] font-semibold ${
                date ? "text-[#2C352D]" : "text-[#AAA99F]"
              }`}
            >
              {date ? formatDate(date) : placeholder}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={14} color="#9A9D96" />
        </View>
      </TouchableOpacity>

      {error ? (
        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={12} color={COLORS.red} />
          <Text className="ml-1 text-[9px] text-[#C65353]">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   CATEGORY BUTTON
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
      className={`mb-2 mr-2 rounded-full border px-3.5 py-2.5 ${
        selected ? "border-[#4D6A50] bg-[#4D6A50]" : "border-[#DDD7CC] bg-white"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Text
        className={`text-[9px] font-semibold ${
          selected ? "text-white" : "text-[#596059]"
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   DATE PICKER SHEET
========================================================================== */

function DatePickerSheet({
  visible,
  title,
  value,
  minimumDate,
  onCancel,
  onDone,
  onChange,
}: {
  visible: boolean;
  title: string;
  value: Date;
  minimumDate?: Date;
  onCancel: () => void;
  onDone: () => void;
  onChange: (date: Date) => void;
}) {
  if (Platform.OS !== "ios") {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end bg-black/25">
        <View className="rounded-t-[22px] bg-white px-5 pb-8 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
              <Text className="text-[11px] font-semibold text-[#777D75]">
                Cancel
              </Text>
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-[9px] uppercase tracking-[1.2px] text-[#8C9189]">
                Choose date
              </Text>
              <Text className="mt-0.5 font-serif text-[18px] font-bold text-[#2C352D]">
                {title}
              </Text>
            </View>

            <TouchableOpacity onPress={onDone} activeOpacity={0.7}>
              <Text className="text-[11px] font-bold text-[#4D6A50]">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="overflow-hidden rounded-[12px] bg-[#F8F7F3]">
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              themeVariant="light"
              textColor={COLORS.text}
              minimumDate={minimumDate}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  onChange(selectedDate);
                }
              }}
              style={{
                width: "100%",
                height: 210,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
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

  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [mainError, setMainError] = useState("");

  const [saving, setSaving] = useState(false);

  const [pickerKind, setPickerKind] = useState<PickerKind>(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  const selectedPickerTitle = useMemo(
    () => (pickerKind === "start" ? "Start date" : "Target date"),
    [pickerKind],
  );

  const clearError = (field: keyof FieldErrors) => {
    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    if (mainError) {
      setMainError("");
    }
  };

  const validateForm = () => {
    const nextErrors: FieldErrors = { ...EMPTY_ERRORS };
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
      setMainError("Please review the highlighted fields.");
    }

    return valid;
  };

  const openDatePicker = (kind: Exclude<PickerKind, null>) => {
    if (saving) {
      return;
    }

    const initialDate =
      kind === "start"
        ? (startDate ?? new Date())
        : (targetDate ?? startDate ?? new Date());

    setPickerKind(kind);
    setPickerDate(initialDate);
  };

  const closeDatePicker = () => {
    setPickerKind(null);
  };

  const confirmDatePicker = () => {
    if (!pickerKind) {
      return;
    }

    if (pickerKind === "start") {
      setStartDate(pickerDate);
      clearError("startDate");

      if (targetDate && targetDate < pickerDate) {
        setTargetDate(null);
        setErrors((previous) => ({
          ...previous,
          targetDate: "",
        }));
      }
    } else {
      setTargetDate(pickerDate);
      clearError("targetDate");
    }

    setPickerKind(null);
  };

  const handleAndroidDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setPickerKind(null);
      return;
    }

    if (!selectedDate || !pickerKind) {
      setPickerKind(null);
      return;
    }

    if (pickerKind === "start") {
      setStartDate(selectedDate);
      clearError("startDate");

      if (targetDate && targetDate < selectedDate) {
        setTargetDate(null);
        setErrors((previous) => ({
          ...previous,
          targetDate: "",
        }));
      }
    } else {
      setTargetDate(selectedDate);
      clearError("targetDate");
    }

    setPickerKind(null);
  };

  const handleCreate = async () => {
    if (saving) {
      return;
    }

    Keyboard.dismiss();
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
        startDate: startDate ? startDate.toISOString() : "",
        targetDate: targetDate ? targetDate.toISOString() : undefined,
      });

      router.replace({
        pathname: "/(main)/goals/[id]",
        params: {
          id: goal._id,
        },
      });
    } catch (error: any) {
      console.error("Create goal error:", error);
      setMainError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F3EA]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          scrollEnabled={!saving}
          contentContainerStyle={{
            paddingBottom: 42,
          }}
        >
          {/* ================================================================
              HEADER
          ================================================================ */}

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
                <Text className="text-[9px] font-semibold uppercase tracking-[1.4px] text-[#718071]">
                  Wellness journey
                </Text>

                <Text className="mt-0.5 font-serif text-[27px] font-bold text-[#263128]">
                  Create a goal
                </Text>
              </View>
            </View>

            <Text className="mt-4 max-w-[330px] text-[10px] leading-[16px] text-[#777C74]">
              Start with one thing that matters to you. You can refine it later
              as your journey changes.
            </Text>
          </View>

          {/* ================================================================
              ERROR
          ================================================================ */}

          {mainError ? (
            <View className="mx-[18px] mb-5 rounded-[8px] border border-[#E8CACA] bg-[#FBEFEE] px-3.5 py-3">
              <View className="flex-row items-start">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.red}
                />

                <View className="ml-2.5 flex-1">
                  <Text className="text-[10px] font-bold text-[#8F3E3E]">
                    We couldn't create this goal
                  </Text>

                  <Text className="mt-0.5 text-[9px] leading-[14px] text-[#B34D4D]">
                    {mainError}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={saving}
                  onPress={() => setMainError("")}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={15} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* ================================================================
              FORM
          ================================================================ */}

          <View className="px-[18px]">
            {/* BASIC DETAILS */}

            <View className="mb-7">
              <SectionHeader
                number="01"
                title="The intention"
                subtitle="What would you like to improve?"
              />

              <FormInput
                label="Goal title"
                required
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
                hint="Optional"
                placeholder="Describe what this goal means to you"
                value={description}
                error={errors.description}
                disabled={saving}
                multiline
                onChangeText={(value) => {
                  setDescription(value);
                  clearError("description");
                }}
              />
            </View>

            {/* CATEGORY */}

            <View className="mb-7">
              <SectionHeader
                number="02"
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
                  <Text className="ml-1 text-[9px] text-[#C65353]">
                    {errors.category}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* TARGET */}

            <View className="mb-7">
              <SectionHeader
                number="03"
                title="Your target"
                subtitle="Add a simple measure when having one is useful."
              />

              <View className="flex-row">
                <View className="mr-2 flex-1">
                  <FormInput
                    label="Value"
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
                label="Target description"
                hint="Optional"
                placeholder="e.g. Sleep for at least 8 hours each night"
                value={targetDescription}
                error={errors.targetDescription}
                disabled={saving}
                multiline
                onChangeText={(value) => {
                  setTargetDescription(value);
                  clearError("targetDescription");
                }}
              />
            </View>

            {/* TIMELINE */}

            <View className="mb-7">
              <SectionHeader
                number="04"
                title="Your timeline"
                subtitle="Choose when you want to begin and, if useful, when to reach it."
              />

              <View className="flex-row">
                <DateField
                  label="Start date"
                  required
                  subtitle="Goal begins"
                  placeholder="Select date"
                  date={startDate ?? undefined}
                  error={errors.startDate}
                  disabled={saving}
                  onPress={() => openDatePicker("start")}
                />

                <View className="w-2.5" />

                <DateField
                  label="Target date"
                  subtitle="Optional"
                  placeholder="Choose date"
                  date={targetDate ?? undefined}
                  error={errors.targetDate}
                  disabled={saving}
                  onPress={() => openDatePicker("target")}
                />
              </View>

              {/* Android native picker */}

              {Platform.OS === "android" && pickerKind ? (
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  minimumDate={
                    pickerKind === "target"
                      ? (startDate ?? undefined)
                      : undefined
                  }
                  onChange={handleAndroidDateChange}
                />
              ) : null}
            </View>

            {/* SMALL SUMMARY */}

            <View className="mb-5 rounded-[8px] border border-[#E1DDD4] bg-[#FBFAF7] px-4 py-3.5">
              <Text className="text-[9px] font-semibold uppercase tracking-[1px] text-[#7C837A]">
                Before you begin
              </Text>

              <Text className="mt-1.5 text-[10px] leading-[15px] text-[#777D75]">
                Keep the goal specific enough to recognize progress, but
                flexible enough to fit real life.
              </Text>
            </View>

            {/* CREATE BUTTON */}

            <TouchableOpacity
              disabled={saving}
              activeOpacity={0.85}
              onPress={handleCreate}
              className={`mb-2 rounded-[7px] ${
                saving ? "bg-[#8FA08F]" : "bg-[#4D6A50]"
              }`}
            >
              <View className="h-[52px] flex-row items-center justify-center">
                {saving ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text className="ml-2.5 text-[11px] font-bold text-white">
                      Creating goal...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="add" size={18} color="#FFFFFF" />

                    <Text className="ml-1.5 text-[11px] font-bold text-white">
                      Create goal
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <Text className="mb-4 text-center text-[8px] leading-[13px] text-[#A0A29A]">
              You can edit the goal, dates and progress later.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================================================================
          SAVE LOADING OVERLAY
      ================================================================= */}

      {saving ? (
        <View
          pointerEvents="auto"
          className="absolute inset-0 items-center justify-center bg-[#263128]/20"
        >
          <View className="mx-10 w-full max-w-[290px] rounded-[14px] border border-[#E2DDD3] bg-white px-6 py-6">
            <View className="items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF1E7]">
                <ActivityIndicator size="small" color={COLORS.green} />
              </View>

              <Text className="mt-4 font-serif text-[18px] font-bold text-[#2C352D]">
                Creating your goal
              </Text>

              <Text className="mt-1.5 text-center text-[9px] leading-[15px] text-[#777D75]">
                Saving your details. Please wait a moment.
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* ================================================================
          iOS DATE PICKER
      ================================================================= */}

      <DatePickerSheet
        visible={Platform.OS === "ios" && pickerKind !== null}
        title={selectedPickerTitle}
        value={pickerDate}
        minimumDate={
          pickerKind === "target" ? (startDate ?? undefined) : undefined
        }
        onCancel={closeDatePicker}
        onDone={confirmDatePicker}
        onChange={setPickerDate}
      />
    </SafeAreaView>
  );
}
