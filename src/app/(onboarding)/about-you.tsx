import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/context/OnboardingContext";

/* =========================================================
   OPTIONS
========================================================= */

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const occupationOptions = [
  "Student",
  "Working Professional",
  "Business Owner",
  "Homemaker",
  "Retired",
  "Other",
];

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  primary: "#4D6A50",
  primaryDark: "#263F31",
  background: "#EEF2E6",
  border: "#E2E7E1",
  text: "#263F31",
  muted: "#7B857C",
  placeholder: "#9AA39A",
  white: "#FFFFFF",

  danger: "#B65D54",
  dangerDark: "#9D514A",
  dangerLight: "#FBE8E5",
  dangerBorder: "#F0D2CE",
};

/* =========================================================
   TYPES
========================================================= */

interface DropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
}

/* =========================================================
   CUSTOM DROPDOWN
========================================================= */

function Dropdown({
  label,
  value,
  placeholder,
  options,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <>
      <View className="mb-5">
        <Text className="mb-2 text-sm font-semibold text-foreground">
          {label}
        </Text>

        <Pressable
          onPress={() => setOpen(true)}
          className={`h-14 flex-row items-center rounded-2xl border bg-white px-4 ${
            open ? "border-[#4D6A50]" : "border-slate-200"
          }`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.94 : 1,
          })}
        >
          <Text
            numberOfLines={1}
            className={`flex-1 text-[15px] ${
              value ? "text-[#263F31]" : "text-[#9AA39A]"
            }`}
          >
            {value || placeholder}
          </Text>

          <View className="ml-3 h-7 w-7 items-center justify-center">
            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={16}
              color={open ? COLORS.primary : COLORS.muted}
            />
          </View>
        </Pressable>
      </View>

      {/* DROPDOWN MODAL */}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            onPress={() => setOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          <View className="rounded-t-[28px] bg-white px-5 pb-8 pt-4">
            {/* HANDLE */}

            <View className="mb-5 items-center">
              <View className="h-1.5 w-10 rounded-full bg-slate-200" />
            </View>

            {/* HEADER */}

            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#263F31]">
                  Select {label.toLowerCase()}
                </Text>

                <Text className="mt-1 text-[12px] text-[#8A948B]">
                  Choose one option
                </Text>
              </View>

              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={10}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F2F5F0]"
              >
                <Ionicons name="close" size={19} color="#647067" />
              </Pressable>
            </View>

            {/* OPTIONS */}

            <View className="overflow-hidden rounded-2xl border border-[#E5EAE4]">
              {options.map((option, index) => {
                const selected = value === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSelect(option)}
                    className={`min-h-[52px] flex-row items-center px-4 ${
                      selected ? "bg-[#F1F7F1]" : "bg-white"
                    } ${
                      index !== options.length - 1
                        ? "border-b border-[#EDF0EC]"
                        : ""
                    }`}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.78 : 1,
                    })}
                  >
                    <View
                      className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${
                        selected ? "bg-[#DDEBDD]" : "bg-[#F5F7F4]"
                      }`}
                    >
                      {selected ? (
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color={COLORS.primary}
                        />
                      ) : (
                        <View className="h-2 w-2 rounded-full bg-[#CBD2CB]" />
                      )}
                    </View>

                    <Text
                      className={`flex-1 text-[14px] ${
                        selected
                          ? "font-semibold text-[#4D6A50]"
                          : "text-[#344238]"
                      }`}
                    >
                      {option}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color={COLORS.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function parseStoredDate(value: string) {
  if (!value) {
    const date = new Date();

    date.setFullYear(date.getFullYear() - 25);

    return date;
  }

  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year) {
    const date = new Date();

    date.setFullYear(date.getFullYear() - 25);

    return date;
  }

  return new Date(year, month - 1, day);
}

/* =========================================================
   DATE PICKER
========================================================= */

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

function DatePickerModal({
  visible,
  date,
  onChange,
  onClose,
}: DatePickerModalProps) {
  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    onChange(selectedDate);
  };

  /* =======================================================
     ANDROID
  ======================================================= */

  if (Platform.OS === "android") {
    return visible ? (
      <DateTimePicker
        value={date}
        mode="date"
        display="calendar"
        maximumDate={new Date()}
        onChange={handleChange}
      />
    ) : null;
  }

  /* =======================================================
     IOS
  ======================================================= */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* BACKDROP */}

        <Pressable onPress={onClose} className="absolute inset-0 bg-black/25" />

        {/* DATE SHEET */}

        <View className="rounded-t-[28px] bg-white px-5 pb-8 pt-4">
          {/* HANDLE */}

          <View className="mb-5 items-center">
            <View className="h-1.5 w-10 rounded-full bg-slate-200" />
          </View>

          {/* HEADER */}

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-[#263F31]">
                Date of Birth
              </Text>

              <Text className="mt-1 text-[12px] text-[#8A948B]">
                Select your date of birth
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full bg-[#F2F5F0]"
            >
              <Ionicons name="close" size={19} color="#647067" />
            </Pressable>
          </View>

          {/* DATE PICKER */}

          <View className="overflow-hidden rounded-2xl border border-[#E5EAE4] bg-[#FAFCF9]">
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={handleChange}
              themeVariant="light"
              textColor="#263F31"
              accentColor="#59635B"
              style={{
                width: "100%",
                height: 205,
              }}
            />
          </View>

          {/* DONE */}

          <View className="mt-4">
            <Pressable
              onPress={onClose}
              className="h-[52px] items-center justify-center rounded-[14px] bg-[#59635B]"
              style={({ pressed }) => ({
                opacity: pressed ? 0.84 : 1,
              })}
            >
              <Text className="text-[14px] font-bold text-white">Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* =========================================================
   VALIDATION MODAL
========================================================= */

interface ValidationModalProps {
  visible: boolean;
  missingFields: string[];
  onClose: () => void;
}

function ValidationModal({
  visible,
  missingFields,
  onClose,
}: ValidationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <View className="w-full max-w-[370px] rounded-[24px] bg-white px-6 pb-6 pt-7">
          {/* =================================================
              ERROR ICON
          ================================================= */}

          <View className="items-center">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FBE8E5]">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F5D7D3]">
                <Ionicons name="alert-circle" size={31} color="#B65D54" />
              </View>
            </View>
          </View>

          {/* =================================================
              HEADING
          ================================================= */}

          <Text className="mt-5 text-center text-[21px] font-bold text-[#263F31]">
            Almost there
          </Text>

          <Text className="mt-2 text-center text-[13px] leading-[20px] text-[#6D796F]">
            Please complete the following required field
            {missingFields.length > 1 ? "s" : ""} before continuing.
          </Text>

          {/* =================================================
              MISSING FIELDS
          ================================================= */}

          <View className="mt-5 overflow-hidden rounded-[16px] border border-[#F0D2CE] bg-[#FFF9F8]">
            {missingFields.map((field, index) => (
              <View
                key={field}
                className={`min-h-[52px] flex-row items-center px-4 ${
                  index !== missingFields.length - 1
                    ? "border-b border-[#F2DDDA]"
                    : ""
                }`}
              >
                <View className="h-7 w-7 items-center justify-center rounded-full bg-[#FBE8E5]">
                  <Ionicons name="alert-outline" size={16} color="#B65D54" />
                </View>

                <Text className="ml-3 flex-1 text-[14px] font-semibold text-[#9D514A]">
                  {field}
                </Text>
              </View>
            ))}
          </View>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <View className="mt-4 flex-row items-start rounded-[14px] bg-[#F5F7F4] px-3.5 py-3">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#718071"
            />

            <Text className="ml-2 flex-1 text-[11px] leading-[17px] text-[#718071]">
              Fill in all the required information above, then tap Continue
              again.
            </Text>
          </View>

          {/* =================================================
              CLOSE
          ================================================= */}

          <Pressable
            onPress={onClose}
            className="mt-5 h-[50px] items-center justify-center rounded-[14px] bg-[#59635B]"
            style={({ pressed }) => ({
              opacity: pressed ? 0.84 : 1,
            })}
          >
            <Text className="text-[14px] font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function AboutYouScreen() {
  const { data, updateSection } = useOnboarding();

  /* =======================================================
     STATE
  ======================================================= */

  const [dateOfBirth, setDateOfBirth] = useState(data.personal.dateOfBirth);

  const [date, setDate] = useState(parseStoredDate(data.personal.dateOfBirth));

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [height, setHeight] = useState(data.personal.height);

  const [weight, setWeight] = useState(data.personal.weight);

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  /* =======================================================
     DATE
  ======================================================= */

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);

    const formatted = formatDate(selectedDate);

    setDateOfBirth(formatted);

    updateSection("personal", {
      dateOfBirth: formatted,
    });
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateFields = () => {
    const missing: string[] = [];

    if (!dateOfBirth.trim()) {
      missing.push("Date of Birth");
    }

    if (!data.personal.gender) {
      missing.push("Gender");
    }

    if (!height.trim()) {
      missing.push("Height");
    }

    if (!weight.trim()) {
      missing.push("Weight");
    }

    if (!data.personal.occupation) {
      missing.push("Occupation");
    }

    return missing;
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const continueToNext = () => {
    const missing = validateFields();

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationModal(true);
      return;
    }

    updateSection("personal", {
      dateOfBirth,
      height,
      weight,
    });

    router.push("/(onboarding)/physical-health");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          {/* =================================================
              PROGRESS
          ================================================= */}

          <OnboardingProgress currentStep={1} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Let's Get to Know You"
            description="Tell us a little about yourself so we can personalize your Niramaya experience."
          />

          {/* =================================================
              DATE OF BIRTH
          ================================================= */}

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Date of Birth
            </Text>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4"
              style={({ pressed }) => ({
                opacity: pressed ? 0.94 : 1,
              })}
            >
              <View className="flex-1">
                <Text
                  className={
                    dateOfBirth
                      ? "text-[15px] text-[#263F31]"
                      : "text-[15px] text-[#9AA39A]"
                  }
                >
                  {dateOfBirth || "Select your date of birth"}
                </Text>
              </View>

              <View className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-[#F2F5F0]">
                <Ionicons name="calendar-outline" size={17} color="#4D6A50" />
              </View>
            </Pressable>
          </View>

          {/* DATE MODAL */}

          <DatePickerModal
            visible={showDatePicker}
            date={date}
            onChange={handleDateChange}
            onClose={() => setShowDatePicker(false)}
          />

          {/* =================================================
              GENDER
          ================================================= */}

          <Dropdown
            label="Gender"
            value={data.personal.gender}
            placeholder="Select your gender"
            options={genderOptions}
            onSelect={(value) =>
              updateSection("personal", {
                gender: value,
              })
            }
          />

          {/* =================================================
              HEIGHT
          ================================================= */}

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Height
            </Text>

            <View className="flex-row items-center">
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="170"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                returnKeyType="done"
                className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-foreground"
              />

              <Text className="ml-3 text-[14px] font-medium text-muted">
                cm
              </Text>
            </View>
          </View>

          {/* =================================================
              WEIGHT
          ================================================= */}

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Weight
            </Text>

            <View className="flex-row items-center">
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="65"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                returnKeyType="done"
                className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-foreground"
              />

              <Text className="ml-3 text-[14px] font-medium text-muted">
                kg
              </Text>
            </View>
          </View>

          {/* =================================================
              OCCUPATION
          ================================================= */}

          <Dropdown
            label="Occupation"
            value={data.personal.occupation}
            placeholder="Select your occupation"
            options={occupationOptions}
            onSelect={(value) =>
              updateSection("personal", {
                occupation: value,
              })
            }
          />

          {/* =================================================
              CONTINUE
          ================================================= */}

          <View className="mt-2">
            <Button title="Continue" onPress={continueToNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =====================================================
          VALIDATION ERROR MODAL
      ===================================================== */}

      <ValidationModal
        visible={showValidationModal}
        missingFields={missingFields}
        onClose={() => setShowValidationModal(false)}
      />
    </SafeAreaView>
  );
}
