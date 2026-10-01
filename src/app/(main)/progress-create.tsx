import { Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useMemo, useState } from "react";

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

import {
  createProgress,
  getProgressById,
  updateProgress,
} from "@/services/progress.service";

const pad = (value: number) => String(value).padStart(2, "0");

const formatDateForApi = (date: Date) => {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`;
};

const formatDateLabel = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric",
  });
};

const NumberInput = ({
  value,

  onChangeText,

  placeholder,

  suffix,

  keyboardType = "numeric",

  disabled = false,
}: {
  value: string;

  onChangeText: (value: string) => void;

  placeholder: string;

  suffix?: string;

  keyboardType?: "numeric" | "decimal-pad";

  disabled?: boolean;
}) => {
  return (
    <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        editable={!disabled}
        className="h-14 flex-1 text-base text-foreground"
      />

      {suffix ? (
        <Text className="ml-2 text-sm font-medium text-slate-400">
          {suffix}
        </Text>
      ) : null}
    </View>
  );
};

const RatingSelector = ({
  label,

  value,

  onChange,

  description,

  disabled = false,
}: {
  label: string;

  value: number | undefined;

  onChange: (value: number) => void;

  description?: string;

  disabled?: boolean;
}) => {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-base font-bold text-foreground">{label}</Text>

        {description ? (
          <Text className="mt-1 text-xs text-slate-500">{description}</Text>
        ) : null}
      </View>

      <View className="flex-row justify-between">
        {[1, 2, 3, 4, 5].map((number) => {
          const selected = value === number;

          return (
            <Pressable
              key={number}
              disabled={disabled}
              onPress={() => onChange(number)}
              className={`h-12 w-[18%] items-center justify-center rounded-2xl border ${
                selected
                  ? "border-primary-600 bg-primary-600"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Text
                className={`text-base font-bold ${
                  selected ? "text-white" : "text-slate-600"
                }`}
              >
                {number}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const activityOptions = [
  {
    label: "Workout",

    value: "Workout",

    icon: "fitness-outline" as keyof typeof Ionicons.glyphMap,
  },

  {
    label: "Yoga",

    value: "Yoga",

    icon: "body-outline" as keyof typeof Ionicons.glyphMap,
  },

  {
    label: "Meditation",

    value: "Meditation",

    icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
  },

  {
    label: "Walking",

    value: "Walking",

    icon: "walk-outline" as keyof typeof Ionicons.glyphMap,
  },

  {
    label: "Breathing",

    value: "Breathing",

    icon: "cloud-outline" as keyof typeof Ionicons.glyphMap,
  },

  {
    label: "Stretching",

    value: "Stretching",

    icon: "accessibility-outline" as keyof typeof Ionicons.glyphMap,
  },
];

interface ValidationModalProps {
  visible: boolean;

  missingFields: string[];

  onClose: () => void;
}

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
  const fields = missingFields ?? [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full max-w-[380px] max-h-[88%] rounded-[24px] bg-white px-5 py-6">
          {/* Icon */}
          <View className="items-center">
            <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-[#FBE8E5]">
              <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-[#F5D7D3]">
                <Ionicons name="alert-circle" size={27} color="#B65D54" />
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className="mt-4 text-center text-[20px] font-bold text-[#263F31]">
            Almost there
          </Text>

          {/* Description */}
          <Text className="mt-2 px-3 text-center text-[12px] leading-[18px] text-[#6D796F]">
            Please complete all required fields before saving your progress.
          </Text>

          {/* Missing fields */}
          <View className="mt-4 overflow-hidden rounded-[16px] border border-[#F0D2CE] bg-[#FFF9F8]">
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              className="max-h-[310px]"
              contentContainerStyle={{
                paddingVertical: 2,
              }}
            >
              {fields.map((field, index) => (
                <View
                  key={`${field}-${index}`}
                  className={`min-h-[46px] flex-row items-center px-3.5 ${
                    index !== fields.length - 1
                      ? "border-b border-[#F2DDDA]"
                      : ""
                  }`}
                >
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-[#FBE8E5]">
                    <Ionicons name="alert-outline" size={14} color="#B65D54" />
                  </View>

                  <Text className="ml-3 flex-1 text-[12px] font-semibold text-[#9D514A]">
                    {field}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Information */}
          <View className="mt-3 flex-row items-start rounded-[13px] bg-[#F5F7F4] px-3 py-2.5">
            <Ionicons
              name="information-circle-outline"
              size={17}
              color="#718071"
            />

            <Text className="ml-2 flex-1 text-[10px] leading-[15px] text-[#718071]">
              Fill in every pending field above, then tap the save button again.
            </Text>
          </View>

          {/* Button */}
          <Pressable
            onPress={onClose}
            className="mt-4 h-[48px] items-center justify-center rounded-[14px] bg-[#59635B]"
            style={({ pressed }) => ({
              opacity: pressed ? 0.84 : 1,
            })}
          >
            <Text className="text-[13px] font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function ProgressCreateScreen() {
  const params = useLocalSearchParams<{
    id?: string;
  }>();

  const editingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const isEditing = Boolean(editingId);

  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [mood, setMood] = useState<number>();

  const [energyLevel, setEnergyLevel] = useState<number>();

  const [stressLevel, setStressLevel] = useState<number>();

  const [sleepHours, setSleepHours] = useState("");

  const [sleepQuality, setSleepQuality] = useState<number>();

  const [waterIntakeLiters, setWaterIntakeLiters] = useState("");

  const [steps, setSteps] = useState("");

  const [exerciseMinutes, setExerciseMinutes] = useState("");

  const [yogaMinutes, setYogaMinutes] = useState("");

  const [meditationMinutes, setMeditationMinutes] = useState("");

  const [weightKg, setWeightKg] = useState("");

  const [notes, setNotes] = useState("");

  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const [loading, setLoading] = useState(isEditing);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const controlsDisabled = loading || saving;

  const title = useMemo(
    () => (isEditing ? "Edit progress" : "Daily check-in"),

    [isEditing],
  );

  // ---------------------------------
  // Android keyboard handling
  // ---------------------------------

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Keep iOS behavior completely unchanged
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

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const loadEntry = async () => {
      try {
        setLoading(true);

        const entry = await getProgressById(editingId);

        const entryDate = new Date(entry.date);

        if (!Number.isNaN(entryDate.getTime())) {
          setDate(entryDate);
        }

        setMood(entry.mood);

        setEnergyLevel(entry.energyLevel);

        setStressLevel(entry.stressLevel);

        setSleepHours(
          entry.sleepHours !== undefined ? String(entry.sleepHours) : "",
        );

        setSleepQuality(entry.sleepQuality);

        setWaterIntakeLiters(
          entry.waterIntakeLiters !== undefined
            ? String(entry.waterIntakeLiters)
            : "",
        );

        setSteps(entry.steps !== undefined ? String(entry.steps) : "");

        setExerciseMinutes(
          entry.exerciseMinutes !== undefined
            ? String(entry.exerciseMinutes)
            : "",
        );

        setYogaMinutes(
          entry.yogaMinutes !== undefined ? String(entry.yogaMinutes) : "",
        );

        setMeditationMinutes(
          entry.meditationMinutes !== undefined
            ? String(entry.meditationMinutes)
            : "",
        );

        setWeightKg(entry.weightKg !== undefined ? String(entry.weightKg) : "");

        setNotes(entry.notes ?? "");

        setCompletedActivities(entry.completedActivities ?? []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Unable to load this progress entry.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [editingId]);

  const toggleActivity = (activity: string) => {
    setCompletedActivities((current) => {
      if (current.includes(activity)) {
        return current.filter((item) => item !== activity);
      }

      return [...current, activity];
    });
  };

  const buildPayload = () => {
    const payload: Record<string, any> = {
      date: formatDateForApi(date),
    };

    if (mood !== undefined) payload.mood = mood;

    if (energyLevel !== undefined) payload.energyLevel = energyLevel;

    if (stressLevel !== undefined) payload.stressLevel = stressLevel;

    if (sleepHours.trim()) {
      payload.sleepHours = Number(sleepHours);
    }

    if (sleepQuality !== undefined) {
      payload.sleepQuality = sleepQuality;
    }

    if (waterIntakeLiters.trim()) {
      payload.waterIntakeLiters = Number(waterIntakeLiters);
    }

    if (steps.trim()) {
      payload.steps = Number(steps);
    }

    if (exerciseMinutes.trim()) {
      payload.exerciseMinutes = Number(exerciseMinutes);
    }

    if (yogaMinutes.trim()) {
      payload.yogaMinutes = Number(yogaMinutes);
    }

    if (meditationMinutes.trim()) {
      payload.meditationMinutes = Number(meditationMinutes);
    }

    if (weightKg.trim()) {
      payload.weightKg = Number(weightKg);
    }

    if (notes.trim()) {
      payload.notes = notes.trim();
    }

    if (completedActivities.length > 0) {
      payload.completedActivities = completedActivities;
    }

    return payload;
  };

  const validate = () => {
    const missing: string[] = [];

    if (mood === undefined) missing.push("Mood");

    if (energyLevel === undefined) missing.push("Energy");

    if (stressLevel === undefined) missing.push("Stress");

    if (!sleepHours.trim()) missing.push("Sleep duration");

    if (sleepQuality === undefined) missing.push("Sleep quality");

    if (!waterIntakeLiters.trim()) missing.push("Water intake");

    if (!steps.trim()) missing.push("Steps");

    if (!exerciseMinutes.trim()) missing.push("Exercise minutes");

    if (!yogaMinutes.trim()) missing.push("Yoga minutes");

    if (!meditationMinutes.trim()) missing.push("Meditation minutes");

    if (!weightKg.trim()) missing.push("Weight");

    if (completedActivities.length === 0) missing.push("Completed activities");

    if (!notes.trim()) missing.push("Notes");

    if (missing.length > 0) {
      setMissingFields(missing);

      setShowValidationModal(true);

      return false;
    }

    const numericFields = [
      { name: "Sleep hours", value: sleepHours, min: 0, max: 24 },

      { name: "Water intake", value: waterIntakeLiters, min: 0, max: 20 },

      { name: "Steps", value: steps, min: 0, max: 200000 },

      { name: "Exercise minutes", value: exerciseMinutes, min: 0, max: 1440 },

      { name: "Yoga minutes", value: yogaMinutes, min: 0, max: 1440 },

      {
        name: "Meditation minutes",

        value: meditationMinutes,

        min: 0,

        max: 1440,
      },

      { name: "Weight", value: weightKg, min: 1, max: 500 },
    ];

    for (const field of numericFields) {
      const number = Number(field.value);

      if (Number.isNaN(number)) {
        setError(`${field.name} must be a valid number.`);

        return false;
      }

      if (number < field.min || number > field.max) {
        setError(
          `${field.name} must be between ${field.min} and ${field.max}.`,
        );

        return false;
      }
    }

    setError("");

    return true;
  };

  const clearFormData = () => {
    setDate(new Date());

    setShowDatePicker(false);

    setMood(undefined);

    setEnergyLevel(undefined);

    setStressLevel(undefined);

    setSleepHours("");

    setSleepQuality(undefined);

    setWaterIntakeLiters("");

    setSteps("");

    setExerciseMinutes("");

    setYogaMinutes("");

    setMeditationMinutes("");

    setWeightKg("");

    setNotes("");

    setCompletedActivities([]);

    setMissingFields([]);

    setShowValidationModal(false);

    setError("");
  };

  const handleSave = async () => {
    if (controlsDisabled) return;

    if (!validate()) return;

    try {
      setSaving(true);

      setError("");

      const payload = buildPayload();

      if (editingId) {
        await updateProgress(editingId, payload);
      } else {
        await createProgress(payload);
      }

      clearFormData();

      router.replace("/progress" as any);
    } catch (err: any) {
      console.error("Progress save error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to save your progress. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2F7D57" />

          <Text className="mt-3 text-sm text-slate-500">
            Loading progress...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/*  Header  */}

        <View className="flex-row items-center px-5 pb-3 pt-3">
          <Pressable
            onPress={() => router.back()}
            disabled={controlsDisabled}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          >
            <Ionicons name="arrow-back" size={22} color="#17211B" />
          </Pressable>

          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-foreground">{title}</Text>

            <Text className="mt-0.5 text-xs text-slate-500">
              Take a moment to check in with yourself.
            </Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === "android" ? keyboardHeight + 40 : 40,
          }}
        >
          {/*  Error  */}

          {error ? (
            <View className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color="#DC2626"
                />

                <Text className="ml-2 flex-1 text-sm text-red-700">
                  {error}
                </Text>
              </View>
            </View>
          ) : null}

          {/*  Date  */}

          <View className="mt-5">
            <Text className="mb-3 text-base font-bold text-foreground">
              Check-in date
            </Text>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              disabled={controlsDisabled}
              className="flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80"
            >
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-50">
                <Ionicons name="calendar-outline" size={21} color="#2F7D57" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-400">Date</Text>

                <Text className="mt-1 text-sm font-semibold text-foreground">
                  {formatDateLabel(date)}
                </Text>
              </View>

              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </Pressable>

            {showDatePicker && !controlsDisabled ? (
              <DateTimePicker
                value={date}
                mode="date"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);

                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            ) : null}
          </View>

          {/*  Feelings  */}

          <View className="mt-8">
            <Text className="mb-1 text-xl font-bold text-foreground">
              How are you feeling?
            </Text>

            <Text className="mb-5 text-sm text-slate-500">
              A simple daily check-in helps you notice patterns over time.
            </Text>

            <RatingSelector
              label="Mood"
              value={mood}
              onChange={setMood}
              description="How are you feeling emotionally?"
              disabled={controlsDisabled}
            />

            <RatingSelector
              label="Energy"
              value={energyLevel}
              onChange={setEnergyLevel}
              description="How energetic do you feel today?"
              disabled={controlsDisabled}
            />

            <RatingSelector
              label="Stress"
              value={stressLevel}
              onChange={setStressLevel}
              description="How stressed have you felt?"
              disabled={controlsDisabled}
            />
          </View>

          {/*  Sleep  */}

          <View className="mt-2">
            <Text className="mb-4 text-xl font-bold text-foreground">
              Sleep
            </Text>

            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Sleep duration
            </Text>

            <NumberInput
              value={sleepHours}
              onChangeText={setSleepHours}
              placeholder="e.g. 7.5"
              suffix="hours"
              keyboardType="decimal-pad"
              disabled={controlsDisabled}
            />

            <View className="mt-5">
              <RatingSelector
                label="Sleep quality"
                value={sleepQuality}
                onChange={setSleepQuality}
                description="How restful was your sleep?"
                disabled={controlsDisabled}
              />
            </View>
          </View>

          {/*  Daily habits  */}

          <View className="mt-2">
            <Text className="mb-4 text-xl font-bold text-foreground">
              Daily habits
            </Text>

            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Water intake
              </Text>

              <NumberInput
                value={waterIntakeLiters}
                onChangeText={setWaterIntakeLiters}
                placeholder="e.g. 2.5"
                suffix="litres"
                keyboardType="decimal-pad"
                disabled={controlsDisabled}
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Steps
              </Text>

              <NumberInput
                value={steps}
                onChangeText={setSteps}
                placeholder="e.g. 8000"
                suffix="steps"
                disabled={controlsDisabled}
              />
            </View>
          </View>

          {/*  Movement  */}

          <View className="mt-7">
            <Text className="mb-4 text-xl font-bold text-foreground">
              Movement & practice
            </Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Exercise
              </Text>

              <NumberInput
                value={exerciseMinutes}
                onChangeText={setExerciseMinutes}
                placeholder="e.g. 30"
                suffix="min"
                disabled={controlsDisabled}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Yoga
              </Text>

              <NumberInput
                value={yogaMinutes}
                onChangeText={setYogaMinutes}
                placeholder="e.g. 20"
                suffix="min"
                disabled={controlsDisabled}
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-slate-700">
                Meditation
              </Text>

              <NumberInput
                value={meditationMinutes}
                onChangeText={setMeditationMinutes}
                placeholder="e.g. 10"
                suffix="min"
                disabled={controlsDisabled}
              />
            </View>
          </View>

          {/*  Weight  */}

          <View className="mt-7">
            <Text className="mb-4 text-xl font-bold text-foreground">Body</Text>

            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Weight
            </Text>

            <NumberInput
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="e.g. 68.5"
              suffix="kg"
              keyboardType="decimal-pad"
              disabled={controlsDisabled}
            />
          </View>

          {/*  Activities  */}

          <View className="mt-7">
            <Text className="text-xl font-bold text-foreground">
              Completed activities
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              What did you complete today?
            </Text>

            <View className="mt-4 flex-row flex-wrap">
              {activityOptions.map((activity) => {
                const selected = completedActivities.includes(activity.value);

                return (
                  <Pressable
                    key={activity.value}
                    onPress={() => toggleActivity(activity.value)}
                    disabled={controlsDisabled}
                    className={`mb-3 mr-2 flex-row items-center rounded-full border px-4 py-3 ${
                      selected
                        ? "border-primary-600 bg-primary-600"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <Ionicons
                      name={activity.icon}
                      size={17}
                      color={selected ? "white" : "#64748B"}
                    />

                    <Text
                      className={`ml-2 text-sm font-semibold ${
                        selected ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {activity.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/*  Notes  */}

          <View className="mt-7">
            <Text className="mb-1 text-xl font-bold text-foreground">
              Notes
            </Text>

            <Text className="mb-3 text-sm text-slate-500">
              Anything you'd like to remember about today?
            </Text>

            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={1000}
              textAlignVertical="top"
              placeholder="Write a short note..."
              placeholderTextColor="#94A3B8"
              editable={!controlsDisabled}
              className="min-h-[130px] rounded-3xl border border-slate-200 bg-white p-4 text-base text-foreground"
            />

            <Text className="mt-2 text-right text-xs text-slate-400">
              {notes.length}/1000
            </Text>
          </View>

          {/*  Save  */}

          <Pressable
            disabled={controlsDisabled}
            onPress={handleSave}
            className={`mt-8 h-14 items-center justify-center rounded-2xl ${
              controlsDisabled ? "bg-primary-300" : "bg-primary-600"
            }`}
            style={({ pressed }) => ({
              opacity: controlsDisabled ? 0.7 : pressed ? 0.85 : 1,
            })}
          >
            {saving ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text className="ml-2 text-base font-bold text-white">
                  {isEditing ? "Saving changes..." : "Saving progress..."}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="white"
                />

                <Text className="ml-2 text-base font-bold text-white">
                  {isEditing ? "Save changes" : "Save today's progress"}
                </Text>
              </View>
            )}
          </Pressable>

          <Text className="mt-3 text-center text-xs leading-5 text-slate-400">
            Your progress is private to your account and can be updated later.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <ValidationModal
        visible={showValidationModal}
        missingFields={missingFields}
        onClose={() => setShowValidationModal(false)}
      />
    </SafeAreaView>
  );
}
