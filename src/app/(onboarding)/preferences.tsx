import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingOption from "@/components/onboarding/OnboardingOption";
import OnboardingDropdown from "@/components/onboarding/OnboardingDropdown";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";

import {
  createHealthProfile,
  HealthProfilePayload,
} from "@/services/healthProfile.service";

/* =========================================================
   OPTIONS
========================================================= */

const wellnessOptions = [
  "Better Sleep",
  "Stress Management",
  "Weight Management",
  "Fitness",
  "Yoga",
  "Nutrition",
  "Digestive Health",
  "Skin & Hair",
  "Mental Wellbeing",
  "Ayurveda",
];

const yogaDurationOptions = [
  "10–15 minutes",
  "15–30 minutes",
  "30–45 minutes",
  "45–60 minutes",
  "More than 60 minutes",
];

const activityTimeOptions = [
  "Early Morning",
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
];

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: string) {
  if (!value) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function splitCommaSeparated(value: string) {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function convertDateToISO(value: string) {
  if (!value) {
    return undefined;
  }

  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

/* =========================================================
   MAPPERS
========================================================= */

function mapGender(value: string) {
  const map: Record<string, string> = {
    Male: "male",
    Female: "female",
    Other: "other",
    "Prefer not to say": "prefer_not_to_say",
  };

  return map[value];
}

function mapEnergyLevel(value: string) {
  const map: Record<string, string> = {
    "Very Low": "very_low",
    Low: "low",
    Moderate: "moderate",
    High: "high",
    "Very High": "very_high",
  };

  return map[value];
}

function mapDigestion(value: string) {
  const map: Record<string, string> = {
    Poor: "poor",
    "Sometimes uncomfortable": "below_average",
    Normal: "normal",
    Good: "good",
  };

  return map[value];
}

function mapWellbeingLevel(value: string) {
  const map: Record<string, string> = {
    "Very Low": "very_low",
    Low: "low",
    Moderate: "moderate",
    High: "high",
    "Very High": "very_high",
  };

  return map[value];
}

function mapMood(value: string) {
  const map: Record<string, string> = {
    "Very Poor": "very_low",
    Poor: "low",
    Okay: "neutral",
    Good: "good",
    "Very Good": "very_good",
  };

  return map[value];
}

function mapActivityLevel(value: string) {
  const map: Record<string, string> = {
    Sedentary: "sedentary",
    "Lightly Active": "light",
    "Moderately Active": "moderate",
    "Very Active": "very_active",
  };

  return map[value];
}

function mapSmoking(value: string) {
  const map: Record<string, string> = {
    No: "never",
    Occasionally: "occasional",
    Frequently: "regular",
  };

  return map[value];
}

function mapAlcohol(value: string) {
  const map: Record<string, string> = {
    No: "none",
    Occasionally: "occasional",
    Frequently: "regular",
  };

  return map[value];
}

function mapDietType(value: string) {
  const map: Record<string, string> = {
    Vegetarian: "vegetarian",
    Vegan: "vegan",
    Eggetarian: "eggetarian",
    "Non-Vegetarian": "non_vegetarian",
    Other: "other",
  };

  return map[value];
}

function mapSleepQuality(value: string) {
  const map: Record<string, string> = {
    "Very Poor": "very_poor",
    Poor: "poor",
    Average: "average",
    Good: "good",
    Excellent: "very_good",
  };

  return map[value];
}

function mapExerciseFrequency(value: string) {
  const map: Record<string, string> = {
    Never: "never",
    "1–2 days/week": "1_2_days",
    "3–4 days/week": "3_4_days",
    "5–6 days/week": "5_plus_days",
    Daily: "5_plus_days",
  };

  return map[value];
}

function mapYogaExperience(value: string) {
  const map: Record<string, string> = {
    Never: "none",
    Beginner: "beginner",
    Intermediate: "intermediate",
    Advanced: "advanced",
  };

  return map[value];
}

function mapPreferredActivityTime(value: string) {
  const map: Record<string, string> = {
    "Early Morning": "morning",
    Morning: "morning",
    Afternoon: "afternoon",
    Evening: "evening",
    Night: "night",
  };

  return map[value];
}

function mapYogaDuration(value: string) {
  const map: Record<string, number> = {
    "10–15 minutes": 10,
    "15–30 minutes": 15,
    "30–45 minutes": 30,
    "45–60 minutes": 45,
    "More than 60 minutes": 60,
  };

  return map[value] ?? null;
}

function mapWaterIntake(value: string) {
  if (value === "Less than 1 litre") {
    return 0.75;
  }

  if (value === "1–2 litres") {
    return 1.5;
  }

  if (value === "2–3 litres") {
    return 2.5;
  }

  if (value === "More than 3 litres") {
    return 3.5;
  }

  return null;
}

function mapScreenTime(value: string) {
  if (value === "Less than 2 hours") {
    return 1.5;
  }

  if (value === "2–4 hours") {
    return 3;
  }

  if (value === "4–6 hours") {
    return 5;
  }

  if (value === "More than 6 hours") {
    return 7;
  }

  return null;
}

function mapConcern(value: string) {
  if (!value || value === "None") {
    return [];
  }

  return [value.toLowerCase()];
}

/* =========================================================
   BUILD HEALTH PROFILE PAYLOAD
========================================================= */

function buildHealthProfilePayload(
  data: ReturnType<typeof useOnboarding>["data"],
): HealthProfilePayload {
  return {
    personal: {
      dateOfBirth: convertDateToISO(data.personal.dateOfBirth),

      gender: mapGender(data.personal.gender) as
        | "male"
        | "female"
        | "other"
        | "prefer_not_to_say"
        | undefined,

      heightCm: toNumber(data.personal.height),

      weightKg: toNumber(data.personal.weight),

      occupation: data.personal.occupation || null,
    },

    physicalHealth: {
      energyLevel: mapEnergyLevel(data.physicalHealth.energyLevel),

      digestion: mapDigestion(data.physicalHealth.digestion),

      skinConcerns: mapConcern(data.physicalHealth.skinConcern),

      hairConcerns: mapConcern(data.physicalHealth.hairConcern),

      bodyPainAreas: mapConcern(data.physicalHealth.bodyPain),

      otherConcerns: data.physicalHealth.otherConcern || null,
    },

    wellbeing: {
      stressLevel: mapWellbeingLevel(data.wellbeing.stressLevel),

      mood: mapMood(data.wellbeing.mood),

      focusLevel: mapWellbeingLevel(data.wellbeing.focusLevel),

      relaxationLevel: mapWellbeingLevel(data.wellbeing.relaxation),
    },

    lifestyle: {
      activityLevel: mapActivityLevel(data.lifestyle.activityLevel),

      smoking: mapSmoking(data.lifestyle.smoking),

      alcoholConsumption: mapAlcohol(data.lifestyle.alcohol),

      waterIntakeLiters: mapWaterIntake(data.lifestyle.waterIntake),

      dailyScreenTimeHours: mapScreenTime(data.lifestyle.screenTime),
    },

    nutrition: {
      dietType: mapDietType(data.nutrition.dietType),

      mealsPerDay:
        data.nutrition.mealsPerDay === "1–2 meals"
          ? 2
          : data.nutrition.mealsPerDay === "3 meals"
            ? 3
            : data.nutrition.mealsPerDay === "4 meals"
              ? 4
              : data.nutrition.mealsPerDay === "5+ meals"
                ? 5
                : null,

      dietaryPreferences: splitCommaSeparated(data.nutrition.foodPreferences),

      foodAllergies: splitCommaSeparated(data.nutrition.allergies),
    },

    sleep: {
      averageHours: toNumber(data.sleep.hours),

      sleepQuality: mapSleepQuality(data.sleep.quality),

      bedtime: data.sleep.bedtime || null,

      wakeTime: data.sleep.wakeTime || null,

      sleepDifficulties:
        data.sleep.difficulties && data.sleep.difficulties !== "None"
          ? [data.sleep.difficulties]
          : [],
    },

    fitness: {
      exerciseFrequency: mapExerciseFrequency(data.fitness.exerciseFrequency),

      exerciseTypes:
        data.fitness.exerciseTypes && data.fitness.exerciseTypes !== "Other"
          ? [data.fitness.exerciseTypes]
          : data.fitness.exerciseTypes
            ? [data.fitness.exerciseTypes]
            : [],

      yogaExperience: mapYogaExperience(data.fitness.yogaExperience),

      averageDailySteps: toNumber(data.fitness.dailySteps),
    },

    preferences: {
      preferredYogaDuration: mapYogaDuration(
        data.preferences.preferredYogaDuration,
      ),

      preferredActivityTime: mapPreferredActivityTime(
        data.preferences.preferredActivityTime,
      ),

      wellnessInterests: data.preferences.wellnessInterests,
    },

    onboarding: {
      completed: true,
      completionPercentage: 100,
    },
  };
}

/* =========================================================
   SCREEN
========================================================= */

export default function PreferencesScreen() {
  const { data, updateSection } = useOnboarding();

  const { user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* =========================================================
     WELLNESS INTERESTS
  ========================================================= */

  const handleToggleWellnessInterest = (option: string) => {
    const current = data.preferences.wellnessInterests;

    if (current.includes(option)) {
      updateSection("preferences", {
        wellnessInterests: current.filter((item) => item !== option),
      });
    } else {
      updateSection("preferences", {
        wellnessInterests: [...current, option],
      });
    }
  };

  /* =========================================================
     COMPLETE ONBOARDING
  ========================================================= */

  const finishOnboarding = async () => {
    if (isSaving) {
      return;
    }

    /* -------------------------------------------------------
       AUTH CHECK
    ------------------------------------------------------- */

    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please log in again before completing onboarding.",
      );

      return;
    }

    /* -------------------------------------------------------
       HEIGHT VALIDATION
    ------------------------------------------------------- */

    const heightCm = Number(data.personal.height);

    if (
      !data.personal.height ||
      !Number.isFinite(heightCm) ||
      heightCm < 30 ||
      heightCm > 250
    ) {
      Alert.alert(
        "Check your height",
        "Please enter a valid height between 30 cm and 250 cm.",
      );

      return;
    }

    /* -------------------------------------------------------
       WELLNESS INTERESTS
    ------------------------------------------------------- */

    if (data.preferences.wellnessInterests.length === 0) {
      Alert.alert(
        "Select your interests",
        "Please select at least one wellness interest.",
      );

      return;
    }

    /* -------------------------------------------------------
       YOGA DURATION
    ------------------------------------------------------- */

    if (!data.preferences.preferredYogaDuration) {
      Alert.alert(
        "Select yoga duration",
        "Please select your preferred yoga duration.",
      );

      return;
    }

    /* -------------------------------------------------------
       ACTIVITY TIME
    ------------------------------------------------------- */

    if (!data.preferences.preferredActivityTime) {
      Alert.alert(
        "Select activity time",
        "Please select your preferred activity time.",
      );

      return;
    }

    try {
      setIsSaving(true);

      const payload = buildHealthProfilePayload(data);

      console.log("========== HEALTH PROFILE PAYLOAD ==========");

      console.log(JSON.stringify(payload, null, 2));

      const profile = await createHealthProfile(payload);

      console.log("========== HEALTH PROFILE CREATED ==========");

      console.log(profile);

      /*
       * Profile saved successfully.
       * Show the custom success modal.
       */
      setShowSuccessModal(true);
    } catch (error) {
      console.log("========== HEALTH PROFILE ERROR ==========");

      console.log(error);

      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);

        console.log("Response:", error.response?.data);
      }

      Alert.alert(
        "Unable to Save Profile",
        "We couldn't save your wellness profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     SUCCESS CONTINUE
  ========================================================= */

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);

    router.replace("/(main)/home");
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (isSaving) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(onboarding)/fitness-yoga");
    }
  };

  /* =========================================================
     UI
  ========================================================= */

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

          <OnboardingProgress currentStep={8} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Your Preferences"
            description="Choose the areas you are interested in so Niramaya can personalize your wellness journey."
          />

          {/* =================================================
              WELLNESS INTERESTS
          ================================================= */}

          <Text className="mb-3 text-sm font-semibold text-foreground">
            What are you interested in?
          </Text>

          <Text className="mb-4 text-sm leading-5 text-muted">
            Select all the areas that interest you.
          </Text>

          {wellnessOptions.map((option) => (
            <OnboardingOption
              key={option}
              label={option}
              selected={data.preferences.wellnessInterests.includes(option)}
              onPress={() => handleToggleWellnessInterest(option)}
            />
          ))}

          {/* =================================================
              YOGA DURATION
          ================================================= */}

          <View className="mt-5">
            <OnboardingDropdown
              label="Preferred Yoga Duration"
              value={data.preferences.preferredYogaDuration}
              placeholder="Select yoga duration"
              options={yogaDurationOptions}
              onSelect={(value) =>
                updateSection("preferences", {
                  preferredYogaDuration: value,
                })
              }
            />
          </View>

          {/* =================================================
              ACTIVITY TIME
          ================================================= */}

          <OnboardingDropdown
            label="Preferred Activity Time"
            value={data.preferences.preferredActivityTime}
            placeholder="Select activity time"
            options={activityTimeOptions}
            onSelect={(value) =>
              updateSection("preferences", {
                preferredActivityTime: value,
              })
            }
          />

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <View className="mt-3 flex-row gap-3">
            <View className="flex-1">
              <Button
                title="Back"
                variant="outline"
                onPress={handleBack}
                disabled={isSaving}
              />
            </View>

            <View className="flex-1">
              <Button
                title={isSaving ? "Saving..." : "Complete"}
                onPress={finishOnboarding}
                disabled={isSaving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View className="flex-1 items-center justify-center bg-black/30 px-6">
          <View className="w-full max-w-[360px] rounded-[24px] bg-white px-6 pb-6 pt-7">
            {/* SUCCESS ICON */}

            <View className="items-center">
              <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-[#E5F1E5]">
                <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#D5E8D5]">
                  <Ionicons name="checkmark" size={30} color="#4D6A50" />
                </View>
              </View>
            </View>

            {/* TITLE */}

            <Text className="mt-5 text-center text-[21px] font-bold text-[#263F31]">
              History Saved Successfully
            </Text>

            {/* MESSAGE */}

            <Text className="mt-3 text-center text-[13px] leading-[20px] text-[#6D796F]">
              Your wellness information has been saved successfully. Niramaya
              can now use your profile to personalize your wellness journey.
            </Text>

            {/* BUTTON */}

            <Pressable
              onPress={handleSuccessContinue}
              className="mt-6 h-[52px] flex-row items-center justify-center rounded-[14px] bg-[#4D6A50]"
              style={({ pressed }) => ({
                opacity: pressed ? 0.86 : 1,
              })}
            >
              <Text className="text-[14px] font-bold text-white">
                Go to Dashboard
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
                style={{
                  marginLeft: 8,
                }}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
