import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingDropdown from "@/components/onboarding/OnboardingDropdown";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/context/OnboardingContext";

const qualityOptions = ["Very Poor", "Poor", "Average", "Good", "Excellent"];

const difficultyOptions = [
  "None",
  "Difficulty falling asleep",
  "Waking during night",
  "Waking too early",
  "Other",
];

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  primary: "#4D6A50",
  primaryDark: "#263F31",
  muted: "#7B857C",
  danger: "#B65D54",
  dangerDark: "#9D514A",
};

/* =========================================================
   TIME HELPERS
========================================================= */

function formatTime(date: Date) {
  let hours = date.getHours();

  const minutes = String(date.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}

function parseTime(value: string, fallbackHour: number) {
  if (!value) {
    const date = new Date();

    date.setHours(fallbackHour, 0, 0, 0);

    return date;
  }

  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    const date = new Date();

    date.setHours(fallbackHour, 0, 0, 0);

    return date;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date;
}

/* =========================================================
   TIME PICKER MODAL
========================================================= */

interface TimePickerModalProps {
  visible: boolean;
  title: string;
  description: string;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

function TimePickerModal({
  visible,
  title,
  description,
  date,
  onChange,
  onClose,
}: TimePickerModalProps) {
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
        mode="time"
        display="clock"
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

        {/* SHEET */}

        <View className="rounded-t-[28px] bg-white px-5 pb-8 pt-4">
          {/* HANDLE */}

          <View className="mb-5 items-center">
            <View className="h-1.5 w-10 rounded-full bg-slate-200" />
          </View>

          {/* HEADER */}

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-[#263F31]">
                {title}
              </Text>

              <Text className="mt-1 text-[12px] text-[#8A948B]">
                {description}
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

          {/* TIME PICKER */}

          <View className="overflow-hidden rounded-2xl border border-[#E5EAE4] bg-[#FAFCF9]">
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={handleChange}
              themeVariant="light"
              textColor="#263F31"
              accentColor="#59635B"
              style={{
                width: "100%",
                height: 190,
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
   VALIDATION ERROR MODAL
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
          {/* ERROR ICON */}

          <View className="items-center">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FBE8E5]">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F5D7D3]">
                <Ionicons name="alert-circle" size={31} color={COLORS.danger} />
              </View>
            </View>
          </View>

          {/* HEADING */}

          <Text className="mt-5 text-center text-[21px] font-bold text-[#263F31]">
            Almost there
          </Text>

          <Text className="mt-2 text-center text-[13px] leading-[20px] text-[#6D796F]">
            Please complete the following required field
            {missingFields.length > 1 ? "s" : ""} before continuing.
          </Text>

          {/* MISSING FIELDS */}

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
                  <Ionicons
                    name="alert-outline"
                    size={16}
                    color={COLORS.danger}
                  />
                </View>

                <Text className="ml-3 flex-1 text-[14px] font-semibold text-[#9D514A]">
                  {field}
                </Text>
              </View>
            ))}
          </View>

          {/* INFORMATION */}

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

          {/* CLOSE */}

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

export default function SleepScreen() {
  const { data, updateSection } = useOnboarding();

  /* =======================================================
     STATE
  ======================================================= */

  const [hours, setHours] = useState(data.sleep.hours);

  const [bedtime, setBedtime] = useState(data.sleep.bedtime);

  const [wakeTime, setWakeTime] = useState(data.sleep.wakeTime);

  const [showBedtimePicker, setShowBedtimePicker] = useState(false);

  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);

  const [bedtimeDate, setBedtimeDate] = useState(
    parseTime(data.sleep.bedtime, 23),
  );

  const [wakeTimeDate, setWakeTimeDate] = useState(
    parseTime(data.sleep.wakeTime, 7),
  );

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  /* =======================================================
     BEDTIME
  ======================================================= */

  const handleBedtimeChange = (selectedDate: Date) => {
    setBedtimeDate(selectedDate);

    const formatted = formatTime(selectedDate);

    setBedtime(formatted);

    updateSection("sleep", {
      bedtime: formatted,
    });
  };

  /* =======================================================
     WAKE TIME
  ======================================================= */

  const handleWakeTimeChange = (selectedDate: Date) => {
    setWakeTimeDate(selectedDate);

    const formatted = formatTime(selectedDate);

    setWakeTime(formatted);

    updateSection("sleep", {
      wakeTime: formatted,
    });
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(onboarding)/nutrition");
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateFields = () => {
    const missing: string[] = [];

    if (!hours.trim()) {
      missing.push("Average Sleep Hours");
    }

    if (!data.sleep.quality) {
      missing.push("Sleep Quality");
    }

    if (!bedtime.trim()) {
      missing.push("Usual Bedtime");
    }

    if (!wakeTime.trim()) {
      missing.push("Usual Wake-up Time");
    }

    if (!data.sleep.difficulties) {
      missing.push("Sleep Difficulties");
    }

    return missing;
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleContinue = () => {
    const missing = validateFields();

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationModal(true);
      return;
    }

    router.push("/(onboarding)/fitness-yoga");
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

          <OnboardingProgress currentStep={6} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Your Sleep"
            description="Good sleep plays a major role in your physical and mental wellbeing."
          />

          {/* =================================================
              SLEEP HOURS
          ================================================= */}

          <Input
            label="Average Sleep Hours"
            value={hours}
            onChangeText={(value) => {
              setHours(value);

              updateSection("sleep", {
                hours: value,
              });
            }}
            placeholder="e.g. 7"
            keyboardType="numeric"
          />

          {/* =================================================
              SLEEP QUALITY
          ================================================= */}

          <OnboardingDropdown
            label="Sleep Quality"
            value={data.sleep.quality}
            placeholder="Select your sleep quality"
            options={qualityOptions}
            onSelect={(value) =>
              updateSection("sleep", {
                quality: value,
              })
            }
          />

          {/* =================================================
              BEDTIME
          ================================================= */}

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Usual Bedtime
            </Text>

            <Pressable
              onPress={() => setShowBedtimePicker(true)}
              className="h-14 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4"
              style={({ pressed }) => ({
                opacity: pressed ? 0.94 : 1,
              })}
            >
              <Text
                className={
                  bedtime
                    ? "text-[15px] text-[#263F31]"
                    : "text-[15px] text-[#9AA39A]"
                }
              >
                {bedtime || "Select your bedtime"}
              </Text>

              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F5F0]">
                <Ionicons name="time-outline" size={17} color="#4D6A50" />
              </View>
            </Pressable>
          </View>

          {/* =================================================
              BEDTIME MODAL
          ================================================= */}

          <TimePickerModal
            visible={showBedtimePicker}
            title="Usual Bedtime"
            description="Select the time you usually go to bed"
            date={bedtimeDate}
            onChange={handleBedtimeChange}
            onClose={() => setShowBedtimePicker(false)}
          />

          {/* =================================================
              WAKE TIME
          ================================================= */}

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Usual Wake-up Time
            </Text>

            <Pressable
              onPress={() => setShowWakeTimePicker(true)}
              className="h-14 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4"
              style={({ pressed }) => ({
                opacity: pressed ? 0.94 : 1,
              })}
            >
              <Text
                className={
                  wakeTime
                    ? "text-[15px] text-[#263F31]"
                    : "text-[15px] text-[#9AA39A]"
                }
              >
                {wakeTime || "Select your wake-up time"}
              </Text>

              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F5F0]">
                <Ionicons name="time-outline" size={17} color="#4D6A50" />
              </View>
            </Pressable>
          </View>

          {/* =================================================
              WAKE TIME MODAL
          ================================================= */}

          <TimePickerModal
            visible={showWakeTimePicker}
            title="Usual Wake-up Time"
            description="Select the time you usually wake up"
            date={wakeTimeDate}
            onChange={handleWakeTimeChange}
            onClose={() => setShowWakeTimePicker(false)}
          />

          {/* =================================================
              SLEEP DIFFICULTIES
          ================================================= */}

          <OnboardingDropdown
            label="Sleep Difficulties"
            value={data.sleep.difficulties}
            placeholder="Select any sleep difficulties"
            options={difficultyOptions}
            onSelect={(value) =>
              updateSection("sleep", {
                difficulties: value,
              })
            }
          />

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <View className="mt-3 flex-row gap-3">
            <View className="flex-1">
              <Button title="Back" variant="outline" onPress={handleBack} />
            </View>

            <View className="flex-1">
              <Button title="Continue" onPress={handleContinue} />
            </View>
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
