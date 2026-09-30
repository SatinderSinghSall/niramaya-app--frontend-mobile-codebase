import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import {
  getHealthProfile,
  updateHealthProfile,
} from "@/services/healthProfile.service";

import type { HealthProfile } from "@/types/healthProfile";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  surfaceSoft: "#FBFCF9",

  primary: "#4D6A50",
  primaryDark: "#304B36",
  primarySoft: "#EAF1E7",

  text: "#263128",
  textSecondary: "#5F6A61",
  muted: "#858D85",
  softMuted: "#A6ACA5",

  border: "#E4E2DA",
  borderSoft: "#EFEEE9",

  danger: "#A65C50",
  dangerSoft: "#F8EEEB",

  disabled: "#AAB5AB",
  disabledBackground: "#E9ECE7",

  white: "#FFFFFF",
};

/* ==========================================================================
   TYPES
========================================================================== */

type SectionKey =
  | "personal"
  | "physicalHealth"
  | "wellbeing"
  | "lifestyle"
  | "nutrition"
  | "sleep"
  | "fitness"
  | "medicalHistory"
  | "preferences";

type Option = {
  label: string;
  value: string;
};

type SectionMeta = {
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/* ==========================================================================
   SECTION DATA
========================================================================== */

const SECTION_ORDER: SectionKey[] = [
  "personal",
  "physicalHealth",
  "wellbeing",
  "lifestyle",
  "nutrition",
  "sleep",
  "fitness",
  "medicalHistory",
  "preferences",
];

const SECTION_META: Record<SectionKey, SectionMeta> = {
  personal: {
    title: "Personal Information",
    shortTitle: "Personal",
    subtitle: "Basic details about you",
    icon: "person-outline",
  },

  physicalHealth: {
    title: "Physical Health",
    shortTitle: "Physical",
    subtitle: "How your body is feeling",
    icon: "body-outline",
  },

  wellbeing: {
    title: "Wellbeing",
    shortTitle: "Wellbeing",
    subtitle: "Mood, stress and emotional wellbeing",
    icon: "leaf-outline",
  },

  lifestyle: {
    title: "Lifestyle",
    shortTitle: "Lifestyle",
    subtitle: "Your daily habits and routines",
    icon: "walk-outline",
  },

  nutrition: {
    title: "Nutrition",
    shortTitle: "Nutrition",
    subtitle: "Food and hydration preferences",
    icon: "restaurant-outline",
  },

  sleep: {
    title: "Sleep",
    shortTitle: "Sleep",
    subtitle: "Your sleep routine and quality",
    icon: "moon-outline",
  },

  fitness: {
    title: "Fitness & Yoga",
    shortTitle: "Fitness",
    subtitle: "Movement, exercise and yoga",
    icon: "fitness-outline",
  },

  medicalHistory: {
    title: "Medical History",
    shortTitle: "Medical",
    subtitle: "Health history and medications",
    icon: "medkit-outline",
  },

  preferences: {
    title: "Preferences",
    shortTitle: "Preferences",
    subtitle: "Your wellness preferences",
    icon: "options-outline",
  },
};

/* ==========================================================================
   OPTIONS
========================================================================== */

const GENDER_OPTIONS: Option[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  {
    label: "Prefer not to say",
    value: "prefer_not_to_say",
  },
];

const ENERGY_OPTIONS: Option[] = [
  { label: "Very low", value: "very_low" },
  { label: "Low", value: "low" },
  { label: "Moderate", value: "moderate" },
  { label: "High", value: "high" },
  { label: "Very high", value: "very_high" },
];

const DIGESTION_OPTIONS: Option[] = [
  { label: "Poor", value: "poor" },
  { label: "Below average", value: "below_average" },
  { label: "Normal", value: "normal" },
  { label: "Good", value: "good" },
  { label: "Very good", value: "very_good" },
];

const STRESS_OPTIONS: Option[] = [
  { label: "Very low", value: "very_low" },
  { label: "Low", value: "low" },
  { label: "Moderate", value: "moderate" },
  { label: "High", value: "high" },
  { label: "Very high", value: "very_high" },
];

const MOOD_OPTIONS: Option[] = [
  { label: "Very low", value: "very_low" },
  { label: "Low", value: "low" },
  { label: "Neutral", value: "neutral" },
  { label: "Good", value: "good" },
  { label: "Very good", value: "very_good" },
];

const ACTIVITY_OPTIONS: Option[] = [
  { label: "Sedentary", value: "sedentary" },
  { label: "Light", value: "light" },
  { label: "Moderate", value: "moderate" },
  { label: "Active", value: "active" },
  { label: "Very active", value: "very_active" },
];

const SMOKING_OPTIONS: Option[] = [
  { label: "Never", value: "never" },
  { label: "Former", value: "former" },
  { label: "Occasional", value: "occasional" },
  { label: "Regular", value: "regular" },
];

const ALCOHOL_OPTIONS: Option[] = [
  { label: "None", value: "none" },
  { label: "Occasional", value: "occasional" },
  { label: "Regular", value: "regular" },
];

const DIET_OPTIONS: Option[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Eggetarian", value: "eggetarian" },
  { label: "Non-vegetarian", value: "non_vegetarian" },
  { label: "Other", value: "other" },
];

const WATER_OPTIONS: Option[] = [
  { label: "Low", value: "low" },
  { label: "Moderate", value: "moderate" },
  { label: "High", value: "high" },
];

const SLEEP_QUALITY_OPTIONS: Option[] = [
  { label: "Very poor", value: "very_poor" },
  { label: "Poor", value: "poor" },
  { label: "Average", value: "average" },
  { label: "Good", value: "good" },
  { label: "Very good", value: "very_good" },
];

const EXERCISE_FREQUENCY_OPTIONS: Option[] = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "1–2 days", value: "1_2_days" },
  { label: "3–4 days", value: "3_4_days" },
  { label: "5+ days", value: "5_plus_days" },
];

const YOGA_OPTIONS: Option[] = [
  { label: "No experience", value: "none" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const TIME_OPTIONS: Option[] = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
  { label: "Night", value: "night" },
  { label: "Anytime", value: "anytime" },
];

/* ==========================================================================
   HELPERS
========================================================================== */

function toNumberOrNull(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const number = Number(trimmed);

  return Number.isFinite(number) ? number : null;
}

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  // Date-only values such as YYYY-MM-DD should be interpreted in local time
  // so the displayed DOB never shifts by a day because of timezone conversion.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnlyMatch) {
    const date = new Date(
      Number(dateOnlyMatch[1]),
      Number(dateOnlyMatch[2]) - 1,
      Number(dateOnlyMatch[3]),
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDateForDisplay(value?: string | null) {
  const date = parseDate(value);

  if (!date) {
    return "Select your date of birth";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateForApi(date: Date | null) {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ==========================================================================
   FIELD LABEL
========================================================================== */

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <View className="mb-2 flex-row items-center">
      <Text className="text-[11px] font-bold text-[#526058]">{label}</Text>

      {required ? (
        <Text className="ml-1 text-[11px] font-bold text-[#A65C50]">*</Text>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   TEXT FIELD
========================================================================== */

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
  maxLength,
  disabled = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
}) {
  return (
    <View className="mb-5">
      <FieldLabel label={label} />

      <View
        className={`overflow-hidden rounded-[14px] border ${
          disabled
            ? "border-[#E7E9E4] bg-[#F1F3EF]"
            : "border-[#E2E2DA] bg-white"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A5ACA5"
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          textAlignVertical={multiline ? "top" : "center"}
          className={`px-4 text-[13px] ${
            multiline ? "min-h-[115px] py-3.5" : "h-[51px]"
          } ${disabled ? "text-[#9DA59E]" : "text-[#263128]"}`}
        />

        {maxLength && value.length > 0 ? (
          <View className="border-t border-[#F0F0EB] px-4 py-1.5">
            <Text className="text-right text-[8px] text-[#9EA59E]">
              {value.length}/{maxLength}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ==========================================================================
   DATE PICKER FIELD
========================================================================== */

function DateField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value?: string | null;
  onChange: (value: Date) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selectedDate = parseDate(value);

  const maximumDate = new Date();
  const minimumDate = new Date();
  minimumDate.setFullYear(maximumDate.getFullYear() - 120);

  const handleChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
    }

    if (event?.type === "dismissed" || !date) {
      return;
    }

    onChange(date);

    if (Platform.OS === "ios") {
      setOpen(false);
    }
  };

  return (
    <View className="mb-5">
      <FieldLabel label={label} />

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`flex-row items-center rounded-[14px] border px-4 ${
          disabled
            ? "border-[#E7E9E4] bg-[#F1F3EF]"
            : "border-[#E2E2DA] bg-white"
        }`}
        style={{ height: 58 }}
      >
        <View
          className={`h-9 w-9 items-center justify-center rounded-[11px] ${
            disabled ? "bg-[#E5E8E3]" : "bg-[#EDF4EA]"
          }`}
        >
          <Ionicons
            name="calendar-outline"
            size={17}
            color={disabled ? "#A0A8A0" : COLORS.primary}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text
            className={`text-[8px] font-semibold uppercase tracking-[0.5px] ${
              disabled ? "text-[#A0A8A0]" : "text-[#969D96]"
            }`}
          >
            Date of birth
          </Text>

          <Text
            className={`mt-0.5 text-[12px] font-semibold ${
              selectedDate && !disabled ? "text-[#344038]" : "text-[#9CA49D]"
            }`}
          >
            {selectedDate
              ? new Intl.DateTimeFormat("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(selectedDate)
              : "Select your date of birth"}
          </Text>
        </View>

        <Ionicons
          name="chevron-down"
          size={16}
          color={disabled ? "#A0A8A0" : "#8A938B"}
        />
      </Pressable>

      {open && !disabled ? (
        <View className="mt-2 overflow-hidden rounded-[14px] border border-[#E2E2DA] bg-white">
          <DateTimePicker
            value={selectedDate ?? new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={handleChange}
            themeVariant="light"
          />

          {Platform.OS === "ios" ? (
            <Pressable
              onPress={() => setOpen(false)}
              className="border-t border-[#ECEDE8] bg-[#F8FAF7] py-3"
            >
              <Text className="text-center text-[11px] font-bold text-[#4D6A50]">
                Done
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   CHOICE GROUP
========================================================================== */

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
  columns = 2,
  disabled = false,
}: {
  label: string;
  value?: string | null;
  options: Option[];
  onChange: (value: string) => void;
  columns?: 1 | 2;
  disabled?: boolean;
}) {
  return (
    <View className="mb-5">
      <FieldLabel label={label} />

      <View className="-mx-1 flex-row flex-wrap">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <View
              key={option.value}
              className={columns === 2 ? "w-1/2 px-1" : "w-full px-1"}
            >
              <Pressable
                disabled={disabled}
                onPress={() => onChange(option.value)}
                className={`mb-2 min-h-[49px] justify-center rounded-[13px] border px-3 ${
                  disabled
                    ? "border-[#E8EAE5] bg-[#F2F3F0]"
                    : selected
                      ? "border-[#AFC0AE] bg-[#EDF4EA]"
                      : "border-[#E3E3DC] bg-white"
                }`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`mr-2 h-[18px] w-[18px] items-center justify-center rounded-full border ${
                      disabled
                        ? "border-[#CDD2CC]"
                        : selected
                          ? "border-[#4D6A50] bg-[#4D6A50]"
                          : "border-[#C9CEC9]"
                    }`}
                  >
                    {selected ? (
                      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                    ) : null}
                  </View>

                  <Text
                    className={`flex-1 text-[10px] leading-[14px] ${
                      disabled
                        ? "text-[#9AA29B]"
                        : selected
                          ? "font-bold text-[#3D5740]"
                          : "text-[#526058]"
                    }`}
                  >
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ==========================================================================
   CHIP INPUT
========================================================================== */

function ChipInput({
  label,
  values,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");

  const addValue = () => {
    if (disabled) {
      return;
    }

    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    if (values.some((value) => value.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      return;
    }

    onChange([...values, trimmed]);
    setInput("");
  };

  const removeValue = (index: number) => {
    if (disabled) {
      return;
    }

    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <View className="mb-5">
      <FieldLabel label={label} />

      {values.length > 0 ? (
        <View className="mb-2 flex-row flex-wrap">
          {values.map((value, index) => (
            <View
              key={`${value}-${index}`}
              className={`mb-2 mr-2 flex-row items-center rounded-full border px-3 py-2 ${
                disabled
                  ? "border-[#E1E4DE] bg-[#F1F3EF]"
                  : "border-[#D9E5D6] bg-[#F0F6EE]"
              }`}
            >
              <Text
                className={`mr-2 max-w-[220px] text-[10px] font-semibold ${
                  disabled ? "text-[#929A93]" : "text-[#3D5740]"
                }`}
              >
                {value}
              </Text>

              <Pressable
                disabled={disabled}
                onPress={() => removeValue(index)}
                hitSlop={8}
              >
                <Ionicons
                  name="close-circle"
                  size={15}
                  color={disabled ? "#AAB1AA" : COLORS.primary}
                />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <View
        className={`flex-row overflow-hidden rounded-[13px] border ${
          disabled
            ? "border-[#E7E9E4] bg-[#F1F3EF]"
            : "border-[#E2E2DA] bg-white"
        }`}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor="#A5ACA5"
          onSubmitEditing={addValue}
          returnKeyType="done"
          editable={!disabled}
          className={`h-[49px] flex-1 px-4 text-[12px] ${
            disabled ? "text-[#9DA59E]" : "text-[#263128]"
          }`}
        />

        <Pressable
          disabled={disabled}
          onPress={addValue}
          className={`h-[49px] w-[50px] items-center justify-center ${
            disabled ? "bg-[#DCE1DB]" : "bg-[#4D6A50]"
          }`}
        >
          <Ionicons
            name="add"
            size={19}
            color={disabled ? "#9BA49B" : "#FFFFFF"}
          />
        </Pressable>
      </View>
    </View>
  );
}

/* ==========================================================================
   INFO BOX
========================================================================== */

function InfoBox({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View className="mb-5 flex-row rounded-[15px] border border-[#DCE7D8] bg-[#F0F6EE] p-4">
      <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-[#E1EDDE]">
        <Ionicons name={icon} size={18} color="#4D6A50" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[11px] font-bold text-[#3D5740]">{title}</Text>

        <Text className="mt-1 text-[9px] leading-[15px] text-[#64736A]">
          {description}
        </Text>
      </View>
    </View>
  );
}

/* ==========================================================================
   SECTION SELECTOR
========================================================================== */

function SectionSelector({
  activeSection,
  onSelect,
  disabled = false,
}: {
  activeSection: SectionKey;
  onSelect: (section: SectionKey) => void;
  disabled?: boolean;
}) {
  const activeIndex = SECTION_ORDER.indexOf(activeSection);

  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 20,
        }}
      >
        {SECTION_ORDER.map((section, index) => {
          const meta = SECTION_META[section];

          const active = section === activeSection;

          const completed = index < activeIndex;

          return (
            <Pressable
              key={section}
              disabled={disabled}
              onPress={() => onSelect(section)}
              className={`mr-2 min-w-[91px] rounded-[14px] border px-3 py-3 ${
                disabled
                  ? "border-[#E8EAE5] bg-[#F1F3EF]"
                  : active
                    ? "border-[#AFC0AE] bg-[#EAF1E7]"
                    : "border-[#E4E2DA] bg-white"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View
                  className={`h-7 w-7 items-center justify-center rounded-[9px] ${
                    disabled
                      ? "bg-[#E5E8E3]"
                      : active
                        ? "bg-[#4D6A50]"
                        : completed
                          ? "bg-[#EDF3EB]"
                          : "bg-[#F1F0EB]"
                  }`}
                >
                  <Ionicons
                    name={completed ? "checkmark" : meta.icon}
                    size={14}
                    color={
                      disabled
                        ? "#A1AAA1"
                        : active
                          ? "#FFFFFF"
                          : completed
                            ? "#4D6A50"
                            : "#737D75"
                    }
                  />
                </View>

                <Text
                  className={`text-[7px] font-bold ${
                    disabled
                      ? "text-[#A0A7A0]"
                      : active
                        ? "text-[#4D6A50]"
                        : "#9AA09A"
                  }`}
                >
                  {index + 1}/{SECTION_ORDER.length}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                className={`mt-2 text-[9px] font-bold ${
                  disabled
                    ? "text-[#A0A7A0]"
                    : active
                      ? "text-[#3D5740]"
                      : "text-[#59635A]"
                }`}
              >
                {meta.shortTitle}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ==========================================================================
   SAVE BUTTON
========================================================================== */

function SaveButton({
  saving,
  onPress,
}: {
  saving: boolean;
  onPress: () => Promise<void>;
}) {
  return (
    <Pressable
      disabled={saving}
      onPress={onPress}
      className={`mt-1 flex-row items-center justify-center rounded-[14px] py-3.5 ${
        saving ? "bg-[#93A393]" : "bg-[#4D6A50]"
      }`}
    >
      {saving ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Ionicons name="checkmark-circle-outline" size={17} color="#FFFFFF" />
      )}

      <Text className="ml-2 text-[11px] font-bold text-white">
        {saving ? "Saving changes…" : "Save changes"}
      </Text>
    </Pressable>
  );
}

/* ==========================================================================
   SAVING OVERLAY
========================================================================== */

function SavingOverlay() {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-[#263128]/25">
      <View className="mx-8 w-[240px] items-center rounded-[20px] border border-[#E3E6E0] bg-white px-6 py-6">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA]">
          <ActivityIndicator size="small" color="#4D6A50" />
        </View>

        <Text className="mt-4 font-serif text-[17px] font-bold text-[#263128]">
          Saving your changes
        </Text>

        <Text className="mt-1.5 text-center text-[9px] leading-[14px] text-[#7C857D]">
          Please wait while your health profile is being updated.
        </Text>
      </View>
    </View>
  );
}

/* ==========================================================================
   EDIT COMPLETE MODAL
========================================================================== */

function EditCompleteModal({
  visible,
  onViewProfile,
  onContinueEditing,
}: {
  visible: boolean;
  onViewProfile: () => void;
  onContinueEditing: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onContinueEditing}
    >
      <View className="flex-1 items-center justify-center bg-[#17211B]/45 px-6">
        <View className="w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[#E0E6DD] bg-white">
          {/* Decorative top area */}
          <View className="items-center bg-[#F4F8F1] px-6 pb-7 pt-8">
            <View className="h-[78px] w-[78px] items-center justify-center rounded-full bg-[#E4F0E0]">
              <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-[#4D6A50]">
                <Ionicons name="checkmark" size={31} color="#FFFFFF" />
              </View>
            </View>

            <View className="mt-4 flex-row items-center rounded-full border border-[#D7E4D3] bg-white px-3 py-1.5">
              <Ionicons
                name="shield-checkmark-outline"
                size={12}
                color="#4D6A50"
              />
              <Text className="ml-1.5 text-[8px] font-bold uppercase tracking-[0.8px] text-[#4D6A50]">
                Profile saved
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-6 pt-6">
            <Text className="text-center font-serif text-[23px] font-bold text-[#263128]">
              Profile updated
            </Text>

            <Text className="mt-2 text-center text-[11px] leading-[18px] text-[#6F7B72]">
              Your health information has been saved successfully and your
              Niramaya profile is now up to date.
            </Text>

            <View className="mt-5 flex-row items-center rounded-[16px] border border-[#E1E9DE] bg-[#F7FAF5] p-3.5">
              <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-[#EAF1E7]">
                <Ionicons name="leaf-outline" size={17} color="#4D6A50" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[10px] font-bold text-[#3D5740]">
                  Wellness profile refreshed
                </Text>
                <Text className="mt-0.5 text-[8px] leading-[13px] text-[#7A857D]">
                  Your updated details can now personalize your wellness
                  experience.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onViewProfile}
              className="mt-5 flex-row items-center justify-center rounded-[15px] bg-[#4D6A50] py-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
            >
              <Ionicons
                name="person-circle-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text className="ml-2 text-[11px] font-bold text-white">
                View health profile
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color="#FFFFFF"
                style={{ marginLeft: 7 }}
              />
            </Pressable>

            <Pressable
              onPress={onContinueEditing}
              className="mt-2 items-center rounded-[13px] py-3.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
            >
              <Text className="text-[10px] font-semibold text-[#6F7B72]">
                Continue editing
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ==========================================================================
   LOADING SCREEN
========================================================================== */

function LoadingScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F5EF]">
      <View className="border-b border-[#E7E5DE] px-5 pb-4 pt-3">
        <View className="flex-row items-center">
          <View className="h-10 w-10 rounded-full bg-[#E8EBE6]" />

          <View className="ml-3 flex-1">
            <View className="h-4 w-40 rounded-full bg-[#E5E7E2]" />

            <View className="mt-2 h-2.5 w-28 rounded-full bg-[#EBECE8]" />
          </View>

          <View className="h-7 w-10 rounded-full bg-[#E8EBE6]" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <View className="h-3 w-28 rounded-full bg-[#E4E6E0]" />

        <View className="mt-3 h-7 w-64 rounded-lg bg-[#E1E4DE]" />

        <View className="mt-2 h-3 w-80 rounded-full bg-[#E8EAE5]" />

        <View className="mt-6 flex-row">
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              className="mr-2 h-[70px] w-[90px] rounded-[14px] bg-white"
            />
          ))}
        </View>

        <View className="mt-5 rounded-[20px] border border-[#E8E6DE] bg-white p-5">
          <View className="flex-row items-center">
            <View className="h-11 w-11 rounded-[13px] bg-[#E7EAE4]" />

            <View className="ml-3 flex-1">
              <View className="h-4 w-40 rounded-full bg-[#E4E6E0]" />

              <View className="mt-2 h-2.5 w-28 rounded-full bg-[#EBECE8]" />
            </View>
          </View>

          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              className="mt-5 h-[52px] rounded-[13px] bg-[#F3F4F1]"
            />
          ))}
        </View>
      </ScrollView>

      <View className="absolute inset-0 items-center justify-center">
        <View className="items-center rounded-[20px] bg-white px-7 py-6 shadow-sm">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA]">
            <ActivityIndicator size="small" color="#4D6A50" />
          </View>

          <Text className="mt-4 text-[11px] font-bold text-[#526058]">
            Loading your profile…
          </Text>

          <Text className="mt-1 text-[8px] text-[#929A92]">
            Preparing your information
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   MAIN SCREEN
========================================================================== */

export default function HealthProfileEditScreen() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  const [activeSection, setActiveSection] = useState<SectionKey>("personal");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showEditComplete, setShowEditComplete] = useState(false);

  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHealthProfile();

      setProfile(data ?? null);
    } catch (err: any) {
      console.error("Health profile edit load error:", err);

      setError(
        err?.response?.data?.message || "Unable to load your health profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();

      return undefined;
    }, [loadProfile]),
  );

  const activeMeta = useMemo(
    () => SECTION_META[activeSection],
    [activeSection],
  );

  const activeIndex = SECTION_ORDER.indexOf(activeSection);

  const saveSection = useCallback(
    async (payload: Record<string, unknown>) => {
      if (saving) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const updated = await updateHealthProfile(payload as any);

        if (updated) {
          setProfile(updated);
        } else {
          await loadProfile();
        }

        Alert.alert(
          "Changes saved",
          `${activeMeta.title} has been updated successfully.`,
        );
      } catch (err: any) {
        console.error("Health profile update error:", err);

        const message =
          err?.response?.data?.message ||
          "Unable to save your changes. Please try again.";

        setError(message);

        Alert.alert("Unable to save", message);
      } finally {
        setSaving(false);
      }
    },
    [activeMeta.title, loadProfile, saving],
  );

  const goPrevious = () => {
    if (saving || activeIndex <= 0) {
      return;
    }

    setActiveSection(SECTION_ORDER[activeIndex - 1]);
  };

  const goNext = () => {
    if (saving || activeIndex >= SECTION_ORDER.length - 1) {
      return;
    }

    setActiveSection(SECTION_ORDER[activeIndex + 1]);
  };

  const handleDoneEditing = () => {
    if (saving) {
      return;
    }

    setShowEditComplete(true);
  };

  const handleViewProfile = () => {
    setShowEditComplete(false);
    router.replace("/(main)/health-profile" as any);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F5EF]">
        <View className="flex-row items-center border-b border-[#E7E5DE] px-5 pb-4 pt-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="arrow-back" size={19} color={COLORS.text} />
          </Pressable>

          <Text className="ml-3 text-[17px] font-bold text-[#263128]">
            Edit Health Profile
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-7">
          <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#EDF4EA]">
            <Ionicons name="person-outline" size={30} color="#4D6A50" />
          </View>

          <Text className="mt-5 text-center font-serif text-[20px] font-bold text-[#263128]">
            No health profile found
          </Text>

          <Text className="mt-2 text-center text-[11px] leading-[17px] text-[#718077]">
            Complete your health profile first to start editing your
            information.
          </Text>

          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-[12px] bg-[#4D6A50] px-7 py-3.5"
          >
            <Text className="text-[10px] font-bold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F5EF]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ================================================================
            HEADER
        ================================================================= */}

        <View className="border-b border-[#E7E5DE] bg-[#F7F5EF] px-5 pb-4 pt-3">
          <View className="flex-row items-center">
            <Pressable
              disabled={saving}
              onPress={() => router.back()}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                saving ? "bg-[#E7E9E4]" : "bg-white"
              }`}
            >
              <Ionicons
                name="arrow-back"
                size={19}
                color={saving ? "#A0A8A0" : COLORS.text}
              />
            </Pressable>

            <View className="ml-3 flex-1">
              <Text className="text-[17px] font-bold text-[#263128]">
                Edit Health Profile
              </Text>

              <Text className="mt-0.5 text-[9px] text-[#7D877F]">
                Keep your information current
              </Text>
            </View>

            <View className="rounded-full border border-[#DCE5D9] bg-[#EDF4EA] px-3 py-1.5">
              <Text className="text-[9px] font-bold text-[#4D6A50]">
                {activeIndex + 1} / {SECTION_ORDER.length}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View className="mt-4 h-[4px] overflow-hidden rounded-full bg-[#E3E5DF]">
            <View
              className="h-full rounded-full bg-[#4D6A50]"
              style={{
                width: `${((activeIndex + 1) / SECTION_ORDER.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================= */}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 45,
          }}
        >
          {/* Intro */}
          <View className="mb-5">
            <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#9A8E7B]">
              Your health information
            </Text>

            <Text className="mt-1.5 font-serif text-[23px] font-bold text-[#263128]">
              Update your details
            </Text>

            <Text className="mt-1.5 text-[10px] leading-[16px] text-[#7A847C]">
              Choose a section and update only the information that has changed.
            </Text>
          </View>

          {/* Section navigation */}
          <SectionSelector
            activeSection={activeSection}
            onSelect={setActiveSection}
            disabled={saving}
          />

          {/* Active section */}
          <View className="overflow-hidden rounded-[20px] border border-[#E3E2DB] bg-white">
            <View className="border-b border-[#EEEEEA] bg-[#FBFCF9] px-5 py-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-[13px] bg-[#EAF1E7]">
                  <Ionicons name={activeMeta.icon} size={20} color="#4D6A50" />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-serif text-[16px] font-bold text-[#263128]">
                    {activeMeta.title}
                  </Text>

                  <Text className="mt-0.5 text-[9px] leading-[14px] text-[#7D877F]">
                    {activeMeta.subtitle}
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-5">
              {error ? (
                <View className="mb-5 flex-row rounded-[13px] border border-[#E8CFCB] bg-[#F9EFEC] p-3.5">
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#A65C50"
                  />

                  <Text className="ml-2 flex-1 text-[9px] leading-[15px] text-[#8E5048]">
                    {error}
                  </Text>
                </View>
              ) : null}

              {activeSection === "personal" ? (
                <PersonalSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "physicalHealth" ? (
                <PhysicalHealthSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "wellbeing" ? (
                <WellbeingSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "lifestyle" ? (
                <LifestyleSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "nutrition" ? (
                <NutritionSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "sleep" ? (
                <SleepSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "fitness" ? (
                <FitnessSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "medicalHistory" ? (
                <MedicalHistorySection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}

              {activeSection === "preferences" ? (
                <PreferencesSection
                  profile={profile}
                  saving={saving}
                  onSave={saveSection}
                />
              ) : null}
            </View>
          </View>

          {/* ================================================================
              NAVIGATION
          ================================================================= */}

          <View className="mt-5 flex-row">
            <Pressable
              disabled={saving || activeIndex === 0}
              onPress={goPrevious}
              className={`mr-1.5 flex-1 flex-row items-center justify-center rounded-[13px] border py-3.5 ${
                saving || activeIndex === 0
                  ? "border-[#E7E9E4] bg-[#ECEEEA]"
                  : "border-[#D9DED7] bg-white"
              }`}
            >
              <Ionicons
                name="arrow-back"
                size={15}
                color={saving || activeIndex === 0 ? "#AAB1AA" : "#4D6A50"}
              />

              <Text
                className={`ml-2 text-[10px] font-bold ${
                  saving || activeIndex === 0
                    ? "text-[#AAB1AA]"
                    : "text-[#4D6A50]"
                }`}
              >
                Previous
              </Text>
            </Pressable>

            <Pressable
              disabled={saving || activeIndex === SECTION_ORDER.length - 1}
              onPress={goNext}
              className={`ml-1.5 flex-1 flex-row items-center justify-center rounded-[13px] py-3.5 ${
                saving || activeIndex === SECTION_ORDER.length - 1
                  ? "bg-[#DDE3DD]"
                  : "bg-[#4D6A50]"
              }`}
            >
              <Text
                className={`mr-2 text-[10px] font-bold ${
                  saving || activeIndex === SECTION_ORDER.length - 1
                    ? "text-[#99A39A]"
                    : "text-white"
                }`}
              >
                Next section
              </Text>

              <Ionicons
                name="arrow-forward"
                size={15}
                color={
                  saving || activeIndex === SECTION_ORDER.length - 1
                    ? "#99A39A"
                    : "#FFFFFF"
                }
              />
            </Pressable>
          </View>

          <Pressable
            disabled={saving}
            onPress={handleDoneEditing}
            className={`mt-5 overflow-hidden rounded-[17px] border ${
              saving
                ? "border-[#DDE3DD] bg-[#E7EBE6]"
                : "border-[#405B45] bg-[#4D6A50]"
            }`}
            style={({ pressed }) => ({
              opacity: pressed && !saving ? 0.9 : 1,
            })}
          >
            <View className="flex-row items-center px-5 py-4">
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  saving ? "bg-[#DCE2DC]" : "bg-[#607B63]"
                }`}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={18}
                  color={saving ? "#9AA49B" : "#FFFFFF"}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className={`text-[11px] font-bold ${
                    saving ? "text-[#98A199]" : "text-white"
                  }`}
                >
                  Done editing
                </Text>
                <Text
                  className={`mt-0.5 text-[8px] ${
                    saving ? "text-[#A8B0A9]" : "text-[#DCE7DA]"
                  }`}
                >
                  Finish and review your updated profile
                </Text>
              </View>

              <Ionicons
                name="arrow-forward-circle-outline"
                size={22}
                color={saving ? "#9AA49B" : "#FFFFFF"}
              />
            </View>
          </Pressable>

          <Text className="mt-2 text-center text-[8px] leading-[13px] text-[#9AA29B]">
            Make sure you have saved any changes in the current section before
            finishing.
          </Text>
        </ScrollView>

        {/* ================================================================
            SAVING OVERLAY
        ================================================================= */}

        {saving ? <SavingOverlay /> : null}

        <EditCompleteModal
          visible={showEditComplete}
          onViewProfile={handleViewProfile}
          onContinueEditing={() => setShowEditComplete(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ==========================================================================
   PERSONAL
========================================================================== */

function PersonalSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    parseDate(profile.personal?.dateOfBirth),
  );

  const [gender, setGender] = useState(profile.personal?.gender ?? null);

  const [heightCm, setHeightCm] = useState(
    profile.personal?.heightCm?.toString() ?? "",
  );

  const [weightKg, setWeightKg] = useState(
    profile.personal?.weightKg?.toString() ?? "",
  );

  const [occupation, setOccupation] = useState(
    profile.personal?.occupation ?? "",
  );

  useEffect(() => {
    setDateOfBirth(parseDate(profile.personal?.dateOfBirth));

    setGender(profile.personal?.gender ?? null);

    setHeightCm(profile.personal?.heightCm?.toString() ?? "");

    setWeightKg(profile.personal?.weightKg?.toString() ?? "");

    setOccupation(profile.personal?.occupation ?? "");
  }, [profile]);

  return (
    <View>
      <InfoBox
        icon="shield-checkmark-outline"
        title="Keep your information current"
        description="These details help personalize your wellness experience and health dashboard."
      />

      <DateField
        label="Date of birth"
        value={dateOfBirth ? dateOfBirth.toISOString() : null}
        onChange={setDateOfBirth}
        disabled={saving}
      />

      <ChoiceGroup
        label="Gender"
        value={gender}
        options={GENDER_OPTIONS}
        onChange={setGender}
        disabled={saving}
      />

      <View className="flex-row">
        <View className="mr-2 flex-1">
          <TextField
            label="Height (cm)"
            value={heightCm}
            onChangeText={setHeightCm}
            placeholder="e.g. 175"
            keyboardType="decimal-pad"
            disabled={saving}
          />
        </View>

        <View className="ml-2 flex-1">
          <TextField
            label="Weight (kg)"
            value={weightKg}
            onChangeText={setWeightKg}
            placeholder="e.g. 72"
            keyboardType="decimal-pad"
            disabled={saving}
          />
        </View>
      </View>

      <TextField
        label="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        placeholder="e.g. Student, Designer"
        maxLength={100}
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            personal: {
              dateOfBirth: formatDateForApi(dateOfBirth),
              gender: gender || null,
              heightCm: toNumberOrNull(heightCm),
              weightKg: toNumberOrNull(weightKg),
              occupation: occupation.trim() || null,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   PHYSICAL HEALTH
========================================================================== */

function PhysicalHealthSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [energyLevel, setEnergyLevel] = useState(
    profile.physicalHealth?.energyLevel ?? null,
  );

  const [digestion, setDigestion] = useState(
    profile.physicalHealth?.digestion ?? null,
  );

  const [skinConcerns, setSkinConcerns] = useState<string[]>(
    profile.physicalHealth?.skinConcerns ?? [],
  );

  const [hairConcerns, setHairConcerns] = useState<string[]>(
    profile.physicalHealth?.hairConcerns ?? [],
  );

  const [bodyPainAreas, setBodyPainAreas] = useState<string[]>(
    profile.physicalHealth?.bodyPainAreas ?? [],
  );

  const [otherConcerns, setOtherConcerns] = useState(
    profile.physicalHealth?.otherConcerns ?? "",
  );

  useEffect(() => {
    setEnergyLevel(profile.physicalHealth?.energyLevel ?? null);

    setDigestion(profile.physicalHealth?.digestion ?? null);

    setSkinConcerns(profile.physicalHealth?.skinConcerns ?? []);

    setHairConcerns(profile.physicalHealth?.hairConcerns ?? []);

    setBodyPainAreas(profile.physicalHealth?.bodyPainAreas ?? []);

    setOtherConcerns(profile.physicalHealth?.otherConcerns ?? "");
  }, [profile]);

  return (
    <View>
      <ChoiceGroup
        label="Energy level"
        value={energyLevel}
        options={ENERGY_OPTIONS}
        onChange={setEnergyLevel}
        disabled={saving}
      />

      <ChoiceGroup
        label="Digestion"
        value={digestion}
        options={DIGESTION_OPTIONS}
        onChange={setDigestion}
        disabled={saving}
      />

      <ChipInput
        label="Skin concerns"
        values={skinConcerns}
        onChange={setSkinConcerns}
        placeholder="Add a concern"
        disabled={saving}
      />

      <ChipInput
        label="Hair concerns"
        values={hairConcerns}
        onChange={setHairConcerns}
        placeholder="Add a concern"
        disabled={saving}
      />

      <ChipInput
        label="Body pain areas"
        values={bodyPainAreas}
        onChange={setBodyPainAreas}
        placeholder="e.g. Lower back"
        disabled={saving}
      />

      <TextField
        label="Other concerns"
        value={otherConcerns}
        onChangeText={setOtherConcerns}
        placeholder="Anything else you would like to mention..."
        multiline
        maxLength={1000}
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            physicalHealth: {
              energyLevel: energyLevel || null,
              digestion: digestion || null,
              skinConcerns,
              hairConcerns,
              bodyPainAreas,
              otherConcerns: otherConcerns.trim() || null,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   WELLBEING
========================================================================== */

function WellbeingSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [stressLevel, setStressLevel] = useState(
    profile.wellbeing?.stressLevel ?? null,
  );

  const [mood, setMood] = useState(profile.wellbeing?.mood ?? null);

  const [focusLevel, setFocusLevel] = useState(
    profile.wellbeing?.focusLevel ?? null,
  );

  const [relaxationLevel, setRelaxationLevel] = useState(
    profile.wellbeing?.relaxationLevel ?? null,
  );

  useEffect(() => {
    setStressLevel(profile.wellbeing?.stressLevel ?? null);

    setMood(profile.wellbeing?.mood ?? null);

    setFocusLevel(profile.wellbeing?.focusLevel ?? null);

    setRelaxationLevel(profile.wellbeing?.relaxationLevel ?? null);
  }, [profile]);

  return (
    <View>
      <InfoBox
        icon="heart-outline"
        title="Your wellbeing matters"
        description="Keep these details current so your wellness experience reflects how you are feeling now."
      />

      <ChoiceGroup
        label="Stress level"
        value={stressLevel}
        options={STRESS_OPTIONS}
        onChange={setStressLevel}
        disabled={saving}
      />

      <ChoiceGroup
        label="Mood"
        value={mood}
        options={MOOD_OPTIONS}
        onChange={setMood}
        disabled={saving}
      />

      <ChoiceGroup
        label="Focus level"
        value={focusLevel}
        options={ENERGY_OPTIONS}
        onChange={setFocusLevel}
        disabled={saving}
      />

      <ChoiceGroup
        label="Relaxation level"
        value={relaxationLevel}
        options={ENERGY_OPTIONS}
        onChange={setRelaxationLevel}
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            wellbeing: {
              stressLevel: stressLevel || null,
              mood: mood || null,
              focusLevel: focusLevel || null,
              relaxationLevel: relaxationLevel || null,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   LIFESTYLE
========================================================================== */

function LifestyleSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [activityLevel, setActivityLevel] = useState(
    profile.lifestyle?.activityLevel ?? null,
  );

  const [smoking, setSmoking] = useState(profile.lifestyle?.smoking ?? null);

  const [alcoholConsumption, setAlcoholConsumption] = useState(
    profile.lifestyle?.alcoholConsumption ?? null,
  );

  const [waterIntakeLiters, setWaterIntakeLiters] = useState(
    profile.lifestyle?.waterIntakeLiters?.toString() ?? "",
  );

  const [dailyScreenTimeHours, setDailyScreenTimeHours] = useState(
    profile.lifestyle?.dailyScreenTimeHours?.toString() ?? "",
  );

  useEffect(() => {
    setActivityLevel(profile.lifestyle?.activityLevel ?? null);

    setSmoking(profile.lifestyle?.smoking ?? null);

    setAlcoholConsumption(profile.lifestyle?.alcoholConsumption ?? null);

    setWaterIntakeLiters(
      profile.lifestyle?.waterIntakeLiters?.toString() ?? "",
    );

    setDailyScreenTimeHours(
      profile.lifestyle?.dailyScreenTimeHours?.toString() ?? "",
    );
  }, [profile]);

  return (
    <View>
      <ChoiceGroup
        label="Activity level"
        value={activityLevel}
        options={ACTIVITY_OPTIONS}
        onChange={setActivityLevel}
        disabled={saving}
      />

      <ChoiceGroup
        label="Smoking"
        value={smoking}
        options={SMOKING_OPTIONS}
        onChange={setSmoking}
        disabled={saving}
      />

      <ChoiceGroup
        label="Alcohol consumption"
        value={alcoholConsumption}
        options={ALCOHOL_OPTIONS}
        onChange={setAlcoholConsumption}
        disabled={saving}
      />

      <TextField
        label="Daily water intake (litres)"
        value={waterIntakeLiters}
        onChangeText={setWaterIntakeLiters}
        placeholder="e.g. 2.5"
        keyboardType="decimal-pad"
        disabled={saving}
      />

      <TextField
        label="Daily screen time (hours)"
        value={dailyScreenTimeHours}
        onChangeText={setDailyScreenTimeHours}
        placeholder="e.g. 6"
        keyboardType="decimal-pad"
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            lifestyle: {
              activityLevel: activityLevel || null,
              smoking: smoking || null,
              alcoholConsumption: alcoholConsumption || null,
              waterIntakeLiters: toNumberOrNull(waterIntakeLiters),
              dailyScreenTimeHours: toNumberOrNull(dailyScreenTimeHours),
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   NUTRITION
========================================================================== */

function NutritionSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [dietType, setDietType] = useState(profile.nutrition?.dietType ?? null);

  const [mealsPerDay, setMealsPerDay] = useState(
    profile.nutrition?.mealsPerDay?.toString() ?? "",
  );

  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    profile.nutrition?.dietaryPreferences ?? [],
  );

  const [foodAllergies, setFoodAllergies] = useState<string[]>(
    profile.nutrition?.foodAllergies ?? [],
  );

  const [waterConsumption, setWaterConsumption] = useState(
    profile.nutrition?.waterConsumption ?? null,
  );

  useEffect(() => {
    setDietType(profile.nutrition?.dietType ?? null);

    setMealsPerDay(profile.nutrition?.mealsPerDay?.toString() ?? "");

    setDietaryPreferences(profile.nutrition?.dietaryPreferences ?? []);

    setFoodAllergies(profile.nutrition?.foodAllergies ?? []);

    setWaterConsumption(profile.nutrition?.waterConsumption ?? null);
  }, [profile]);

  return (
    <View>
      <ChoiceGroup
        label="Diet type"
        value={dietType}
        options={DIET_OPTIONS}
        onChange={setDietType}
        disabled={saving}
      />

      <TextField
        label="Meals per day"
        value={mealsPerDay}
        onChangeText={setMealsPerDay}
        placeholder="e.g. 3"
        keyboardType="numeric"
        disabled={saving}
      />

      <ChipInput
        label="Dietary preferences"
        values={dietaryPreferences}
        onChange={setDietaryPreferences}
        placeholder="e.g. High protein"
        disabled={saving}
      />

      <ChipInput
        label="Food allergies"
        values={foodAllergies}
        onChange={setFoodAllergies}
        placeholder="e.g. Peanuts"
        disabled={saving}
      />

      <ChoiceGroup
        label="Water consumption"
        value={waterConsumption}
        options={WATER_OPTIONS}
        onChange={setWaterConsumption}
        columns={1}
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            nutrition: {
              dietType: dietType || null,
              mealsPerDay: toNumberOrNull(mealsPerDay),
              dietaryPreferences,
              foodAllergies,
              waterConsumption: waterConsumption || null,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   SLEEP
========================================================================== */

function SleepSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [averageHours, setAverageHours] = useState(
    profile.sleep?.averageHours?.toString() ?? "",
  );

  const [sleepQuality, setSleepQuality] = useState(
    profile.sleep?.sleepQuality ?? null,
  );

  const [bedtime, setBedtime] = useState(profile.sleep?.bedtime ?? "");

  const [wakeTime, setWakeTime] = useState(profile.sleep?.wakeTime ?? "");

  const [sleepDifficulties, setSleepDifficulties] = useState<string[]>(
    profile.sleep?.sleepDifficulties ?? [],
  );

  useEffect(() => {
    setAverageHours(profile.sleep?.averageHours?.toString() ?? "");

    setSleepQuality(profile.sleep?.sleepQuality ?? null);

    setBedtime(profile.sleep?.bedtime ?? "");

    setWakeTime(profile.sleep?.wakeTime ?? "");

    setSleepDifficulties(profile.sleep?.sleepDifficulties ?? []);
  }, [profile]);

  return (
    <View>
      <InfoBox
        icon="moon-outline"
        title="Build a healthier sleep routine"
        description="Keeping your sleep information updated makes your wellness profile more useful."
      />

      <TextField
        label="Average sleep hours"
        value={averageHours}
        onChangeText={setAverageHours}
        placeholder="e.g. 7.5"
        keyboardType="decimal-pad"
        disabled={saving}
      />

      <ChoiceGroup
        label="Sleep quality"
        value={sleepQuality}
        options={SLEEP_QUALITY_OPTIONS}
        onChange={setSleepQuality}
        disabled={saving}
      />

      <TextField
        label="Typical bedtime"
        value={bedtime}
        onChangeText={setBedtime}
        placeholder="e.g. 11:00 PM"
        disabled={saving}
      />

      <TextField
        label="Typical wake time"
        value={wakeTime}
        onChangeText={setWakeTime}
        placeholder="e.g. 7:00 AM"
        disabled={saving}
      />

      <ChipInput
        label="Sleep difficulties"
        values={sleepDifficulties}
        onChange={setSleepDifficulties}
        placeholder="e.g. Trouble falling asleep"
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            sleep: {
              averageHours: toNumberOrNull(averageHours),
              sleepQuality: sleepQuality || null,
              bedtime: bedtime.trim() || null,
              wakeTime: wakeTime.trim() || null,
              sleepDifficulties,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   FITNESS
========================================================================== */

function FitnessSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [exerciseFrequency, setExerciseFrequency] = useState(
    profile.fitness?.exerciseFrequency ?? null,
  );

  const [exerciseTypes, setExerciseTypes] = useState<string[]>(
    profile.fitness?.exerciseTypes ?? [],
  );

  const [yogaExperience, setYogaExperience] = useState(
    profile.fitness?.yogaExperience ?? null,
  );

  const [averageDailySteps, setAverageDailySteps] = useState(
    profile.fitness?.averageDailySteps?.toString() ?? "",
  );

  useEffect(() => {
    setExerciseFrequency(profile.fitness?.exerciseFrequency ?? null);

    setExerciseTypes(profile.fitness?.exerciseTypes ?? []);

    setYogaExperience(profile.fitness?.yogaExperience ?? null);

    setAverageDailySteps(profile.fitness?.averageDailySteps?.toString() ?? "");
  }, [profile]);

  return (
    <View>
      <ChoiceGroup
        label="Exercise frequency"
        value={exerciseFrequency}
        options={EXERCISE_FREQUENCY_OPTIONS}
        onChange={setExerciseFrequency}
        columns={1}
        disabled={saving}
      />

      <ChipInput
        label="Exercise types"
        values={exerciseTypes}
        onChange={setExerciseTypes}
        placeholder="e.g. Walking"
        disabled={saving}
      />

      <ChoiceGroup
        label="Yoga experience"
        value={yogaExperience}
        options={YOGA_OPTIONS}
        onChange={setYogaExperience}
        disabled={saving}
      />

      <TextField
        label="Average daily steps"
        value={averageDailySteps}
        onChangeText={setAverageDailySteps}
        placeholder="e.g. 7000"
        keyboardType="numeric"
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            fitness: {
              exerciseFrequency: exerciseFrequency || null,
              exerciseTypes,
              yogaExperience: yogaExperience || null,
              averageDailySteps: toNumberOrNull(averageDailySteps),
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   MEDICAL HISTORY
========================================================================== */

function MedicalHistorySection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [existingConditions, setExistingConditions] = useState<string[]>(
    profile.medicalHistory?.existingConditions ?? [],
  );

  const [allergies, setAllergies] = useState<string[]>(
    profile.medicalHistory?.allergies ?? [],
  );

  const [currentMedications, setCurrentMedications] = useState<string[]>(
    profile.medicalHistory?.currentMedications ?? [],
  );

  const [previousSurgeries, setPreviousSurgeries] = useState<string[]>(
    profile.medicalHistory?.previousSurgeries ?? [],
  );

  const [familyHistory, setFamilyHistory] = useState<string[]>(
    profile.medicalHistory?.familyHistory ?? [],
  );

  const [additionalInformation, setAdditionalInformation] = useState(
    profile.medicalHistory?.additionalInformation ?? "",
  );

  useEffect(() => {
    setExistingConditions(profile.medicalHistory?.existingConditions ?? []);

    setAllergies(profile.medicalHistory?.allergies ?? []);

    setCurrentMedications(profile.medicalHistory?.currentMedications ?? []);

    setPreviousSurgeries(profile.medicalHistory?.previousSurgeries ?? []);

    setFamilyHistory(profile.medicalHistory?.familyHistory ?? []);

    setAdditionalInformation(
      profile.medicalHistory?.additionalInformation ?? "",
    );
  }, [profile]);

  return (
    <View>
      <InfoBox
        icon="medkit-outline"
        title="Keep medical information accurate"
        description="Review these details whenever something changes so your profile stays current."
      />

      <ChipInput
        label="Existing conditions"
        values={existingConditions}
        onChange={setExistingConditions}
        placeholder="e.g. Migraine"
        disabled={saving}
      />

      <ChipInput
        label="Allergies"
        values={allergies}
        onChange={setAllergies}
        placeholder="e.g. Dust"
        disabled={saving}
      />

      <ChipInput
        label="Current medications"
        values={currentMedications}
        onChange={setCurrentMedications}
        placeholder="Add medication"
        disabled={saving}
      />

      <ChipInput
        label="Previous surgeries"
        values={previousSurgeries}
        onChange={setPreviousSurgeries}
        placeholder="Add surgery"
        disabled={saving}
      />

      <ChipInput
        label="Family history"
        values={familyHistory}
        onChange={setFamilyHistory}
        placeholder="e.g. Diabetes"
        disabled={saving}
      />

      <TextField
        label="Additional information"
        value={additionalInformation}
        onChangeText={setAdditionalInformation}
        placeholder="Anything else you would like us to know..."
        multiline
        maxLength={2000}
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            medicalHistory: {
              existingConditions,
              allergies,
              currentMedications,
              previousSurgeries,
              familyHistory,
              additionalInformation: additionalInformation.trim() || null,
            },
          })
        }
      />
    </View>
  );
}

/* ==========================================================================
   PREFERENCES
========================================================================== */

function PreferencesSection({
  profile,
  saving,
  onSave,
}: {
  profile: HealthProfile;
  saving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [preferredYogaDuration, setPreferredYogaDuration] = useState(
    profile.preferences?.preferredYogaDuration?.toString() ?? "",
  );

  const [preferredActivityTime, setPreferredActivityTime] = useState(
    profile.preferences?.preferredActivityTime ?? null,
  );

  const [wellnessInterests, setWellnessInterests] = useState<string[]>(
    profile.preferences?.wellnessInterests ?? [],
  );

  useEffect(() => {
    setPreferredYogaDuration(
      profile.preferences?.preferredYogaDuration?.toString() ?? "",
    );

    setPreferredActivityTime(
      profile.preferences?.preferredActivityTime ?? null,
    );

    setWellnessInterests(profile.preferences?.wellnessInterests ?? []);
  }, [profile]);

  return (
    <View>
      <ChoiceGroup
        label="Preferred activity time"
        value={preferredActivityTime}
        options={TIME_OPTIONS}
        onChange={setPreferredActivityTime}
        disabled={saving}
      />

      <TextField
        label="Preferred yoga duration (minutes)"
        value={preferredYogaDuration}
        onChangeText={setPreferredYogaDuration}
        placeholder="e.g. 20"
        keyboardType="numeric"
        disabled={saving}
      />

      <ChipInput
        label="Wellness interests"
        values={wellnessInterests}
        onChange={setWellnessInterests}
        placeholder="e.g. Meditation"
        disabled={saving}
      />

      <SaveButton
        saving={saving}
        onPress={() =>
          onSave({
            preferences: {
              preferredYogaDuration: toNumberOrNull(preferredYogaDuration),
              preferredActivityTime: preferredActivityTime || null,
              wellnessInterests,
            },
          })
        }
      />
    </View>
  );
}
