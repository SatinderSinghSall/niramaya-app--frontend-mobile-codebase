import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { getHealthProfile } from "@/services/healthProfile.service";
import { HealthProfile } from "@/types/healthProfile";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  surfaceSoft: "#FAFBF8",

  text: "#263128",
  textSecondary: "#59635A",
  muted: "#858B83",
  softMuted: "#A4AAA2",

  green: "#4D6A50",
  darkGreen: "#304B36",

  lightGreen: "#EAF1E7",
  lighterGreen: "#F3F7F1",

  border: "#E5E2DA",
  borderSoft: "#EFEEE9",

  danger: "#A65C50",
  dangerBackground: "#F8EEEB",

  neutralBackground: "#F1F2EE",
};

/* ==========================================================================
   HELPERS
========================================================================== */

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatNumber(value: number | null | undefined, unit?: string): string {
  if (value === null || value === undefined) {
    return "Not provided";
  }

  return `${value}${unit ? ` ${unit}` : ""}`;
}

function formatId(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
}

/* ==========================================================================
   HEADER
========================================================================== */

function HealthProfileHeader({
  percentage,
  completed,
}: {
  percentage: number;
  completed: boolean;
}) {
  const progress = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <View className="mb-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-5">
          <View className="flex-row items-center">
            <View className="mr-2 h-2 w-2 rounded-full bg-[#4D6A50]" />

            <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#718071]">
              Your information
            </Text>
          </View>

          <Text className="mt-2 font-serif text-[30px] font-bold leading-[35px] text-[#263128]">
            Health Profile
          </Text>

          <Text className="mt-2 text-[11px] leading-[17px] text-[#777C74]">
            A complete view of your personal health, lifestyle, wellbeing and
            wellness preferences.
          </Text>
        </View>

        <View className="items-center">
          <View className="h-[62px] w-[62px] items-center justify-center rounded-full border border-[#D8E3D4] bg-[#EDF4EA]">
            <Text className="text-[16px] font-bold text-[#4D6A50]">
              {progress}%
            </Text>

            <Text className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.5px] text-[#718071]">
              complete
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5 h-[6px] overflow-hidden rounded-full bg-[#E6E4DC]">
        <View
          className="h-full rounded-full bg-[#4D6A50]"
          style={{
            width: `${progress}%`,
          }}
        />
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-[8px] text-[#999D95]">Profile completeness</Text>

        <Text className="text-[8px] font-semibold text-[#4D6A50]">
          {completed ? "Complete" : "Incomplete"}
        </Text>
      </View>
    </View>
  );
}

/* ==========================================================================
   SECTION
========================================================================== */

function ProfileSection({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-4 overflow-hidden rounded-[16px] border border-[#E5E2DA] bg-white">
      <View className="flex-row items-center border-b border-[#EFEEE9] px-4 py-4">
        <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-[#EDF4EA]">
          <Ionicons name={icon} size={17} color={COLORS.green} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="font-serif text-[15px] font-bold text-[#263128]">
            {title}
          </Text>

          {subtitle ? (
            <Text className="mt-0.5 text-[8px] leading-[13px] text-[#92978F]">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="px-4">{children}</View>
    </View>
  );
}

/* ==========================================================================
   ROW
========================================================================== */

function ProfileRow({
  label,
  value,
  last = false,
  mono = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  mono?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start justify-between py-3.5 ${
        last ? "" : "border-b border-[#F0EEE8]"
      }`}
    >
      <Text className="flex-1 pr-5 text-[9px] font-medium uppercase tracking-[0.45px] text-[#999D95]">
        {label}
      </Text>

      <Text
        className={`max-w-[61%] text-right text-[10px] font-semibold leading-[15px] ${
          mono ? "font-mono text-[9px] text-[#59635A]" : "text-[#344038]"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

/* ==========================================================================
   TAG LIST
========================================================================== */

function TagList({
  values,
  emptyLabel = "None",
}: {
  values?: string[];
  emptyLabel?: string;
}) {
  if (!values || values.length === 0) {
    return (
      <View className="py-3.5">
        <View className="self-start rounded-full bg-[#F2F3EF] px-2.5 py-1.5">
          <Text className="text-[8px] font-semibold text-[#8B9088]">
            {emptyLabel}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap py-3">
      {values.map((value, index) => (
        <View
          key={`${value}-${index}`}
          className="mb-1.5 mr-1.5 rounded-full border border-[#DCE7D8] bg-[#F1F6EF] px-2.5 py-1.5"
        >
          <Text className="text-[8px] font-semibold text-[#4D6A50]">
            {formatValue(value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* ==========================================================================
   ARRAY FIELD
========================================================================== */

function ArrayField({
  label,
  values,
  emptyLabel = "None",
  last = false,
}: {
  label: string;
  values?: string[];
  emptyLabel?: string;
  last?: boolean;
}) {
  return (
    <View className={last ? "" : "border-b border-[#F0EEE8]"}>
      <Text className="pt-3.5 text-[9px] font-medium uppercase tracking-[0.45px] text-[#999D95]">
        {label}
      </Text>

      <TagList values={values} emptyLabel={emptyLabel} />
    </View>
  );
}

/* ==========================================================================
   EMPTY
========================================================================== */

function ProfileEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-[#F7F5EF] px-[18px]"
    >
      <View className="w-full rounded-[18px] border border-[#E5E2DA] bg-white px-6 py-8">
        <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-[#EDF4EA]">
          <Ionicons name="person-outline" size={24} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-center font-serif text-[20px] font-bold text-[#263128]">
          Health profile not found
        </Text>

        <Text className="mt-2 text-center text-[10px] leading-[16px] text-[#777C74]">
          We couldn't find your health profile right now. Please try again.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRetry}
          className="mt-5 items-center rounded-[10px] bg-[#4D6A50] py-3.5"
        >
          <Text className="text-[10px] font-bold text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   ERROR
========================================================================== */

function ProfileError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-[#F7F5EF] px-[18px]"
    >
      <View className="w-full rounded-[18px] border border-[#E5E2DA] bg-white px-6 py-8">
        <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-[#F8EEEB]">
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={COLORS.danger}
          />
        </View>

        <Text className="mt-4 text-center font-serif text-[20px] font-bold text-[#263128]">
          Couldn't load your profile
        </Text>

        <Text className="mt-2 text-center text-[10px] leading-[16px] text-[#777C74]">
          {message}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRetry}
          className="mt-5 items-center rounded-[10px] bg-[#4D6A50] py-3.5"
        >
          <Text className="text-[10px] font-bold text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   LOADING
========================================================================== */

function ProfileLoading() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F5EF]">
      <View className="px-[18px] pt-5">
        <View className="h-2.5 w-24 rounded-full bg-[#E6E3DB]" />

        <View className="mt-3 h-9 w-48 rounded-[8px] bg-[#E6E3DB]" />

        <View className="mt-2 h-3 w-72 rounded-full bg-[#E6E3DB]" />

        <View className="mt-5 h-[6px] rounded-full bg-[#E6E3DB]" />

        {Array.from({ length: 7 }).map((_, index) => (
          <View
            key={index}
            className="mt-4 h-[145px] rounded-[16px] border border-[#E9E6DE] bg-white"
          />
        ))}
      </View>

      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={COLORS.green} />

        <Text className="mt-3 text-[10px] text-[#777C74]">
          Loading your health profile...
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   MAIN SCREEN
========================================================================== */

export default function HealthProfileScreen() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setError("");

      const data = await getHealthProfile();

      setProfile(data ?? null);
    } catch (err: any) {
      console.error("Health profile loading error:", err);

      if (err?.response?.status === 404) {
        setProfile(null);
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load your health profile.",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();

      return undefined;
    }, [loadProfile]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (error) {
    return (
      <ProfileError
        message={error}
        onRetry={() => {
          setLoading(true);
          loadProfile();
        }}
      />
    );
  }

  if (!profile) {
    return <ProfileEmpty onRetry={loadProfile} />;
  }

  const completionPercentage = profile.onboarding?.completionPercentage ?? 0;

  const onboardingCompleted = profile.onboarding?.completed === true;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F5EF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: 50,
        }}
      >
        {/* ================================================================== */}
        {/* HEADER                                                            */}
        {/* ================================================================== */}

        <HealthProfileHeader
          percentage={completionPercentage}
          completed={onboardingCompleted}
        />

        {/* ================================================================== */}
        {/* EDIT BUTTON                                                       */}
        {/* ================================================================== */}

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => router.push("/(main)/health-profile-edit" as any)}
          className="mb-5 flex-row items-center justify-center rounded-[12px] bg-[#4D6A50] py-3.5"
        >
          <Ionicons name="create-outline" size={15} color="#FFFFFF" />

          <Text className="ml-2 text-[10px] font-bold text-white">
            Edit health profile
          </Text>

          <Ionicons
            name="arrow-forward"
            size={13}
            color="#DCE8DD"
            style={{ marginLeft: 7 }}
          />
        </TouchableOpacity>

        {/* ================================================================== */}
        {/* PERSONAL INFORMATION                                              */}
        {/* ================================================================== */}

        <ProfileSection
          title="Personal Information"
          subtitle="Basic details about you"
          icon="person-outline"
        >
          <ProfileRow
            label="Date of birth"
            value={formatDate(profile.personal?.dateOfBirth)}
          />

          <ProfileRow
            label="Gender"
            value={formatValue(profile.personal?.gender)}
          />

          <ProfileRow
            label="Height"
            value={formatNumber(profile.personal?.heightCm, "cm")}
          />

          <ProfileRow
            label="Weight"
            value={formatNumber(profile.personal?.weightKg, "kg")}
          />

          <ProfileRow
            label="Occupation"
            value={formatValue(profile.personal?.occupation)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* PHYSICAL HEALTH                                                    */}
        {/* ================================================================== */}

        <ProfileSection
          title="Physical Health"
          subtitle="Your current physical wellbeing"
          icon="body-outline"
        >
          <ProfileRow
            label="Energy level"
            value={formatValue(profile.physicalHealth?.energyLevel)}
          />

          <ProfileRow
            label="Digestion"
            value={formatValue(profile.physicalHealth?.digestion)}
          />

          <ArrayField
            label="Skin concerns"
            values={profile.physicalHealth?.skinConcerns}
          />

          <ArrayField
            label="Hair concerns"
            values={profile.physicalHealth?.hairConcerns}
          />

          <ArrayField
            label="Body pain areas"
            values={profile.physicalHealth?.bodyPainAreas}
          />

          <ProfileRow
            label="Other concerns"
            value={formatValue(profile.physicalHealth?.otherConcerns)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* WELLBEING                                                         */}
        {/* ================================================================== */}

        <ProfileSection
          title="Mental & Emotional Wellbeing"
          subtitle="How you currently feel and function"
          icon="leaf-outline"
        >
          <ProfileRow
            label="Stress level"
            value={formatValue(profile.wellbeing?.stressLevel)}
          />

          <ProfileRow
            label="Mood"
            value={formatValue(profile.wellbeing?.mood)}
          />

          <ProfileRow
            label="Focus level"
            value={formatValue(profile.wellbeing?.focusLevel)}
          />

          <ProfileRow
            label="Relaxation level"
            value={formatValue(profile.wellbeing?.relaxationLevel)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* LIFESTYLE                                                         */}
        {/* ================================================================== */}

        <ProfileSection
          title="Lifestyle"
          subtitle="Daily habits and routines"
          icon="walk-outline"
        >
          <ProfileRow
            label="Activity level"
            value={formatValue(profile.lifestyle?.activityLevel)}
          />

          <ProfileRow
            label="Smoking"
            value={formatValue(profile.lifestyle?.smoking)}
          />

          <ProfileRow
            label="Alcohol"
            value={formatValue(profile.lifestyle?.alcoholConsumption)}
          />

          <ProfileRow
            label="Water intake"
            value={formatNumber(profile.lifestyle?.waterIntakeLiters, "L")}
          />

          <ProfileRow
            label="Daily screen time"
            value={formatNumber(profile.lifestyle?.dailyScreenTimeHours, "hrs")}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* NUTRITION                                                         */}
        {/* ================================================================== */}

        <ProfileSection
          title="Nutrition"
          subtitle="Your food and hydration preferences"
          icon="nutrition-outline"
        >
          <ProfileRow
            label="Diet type"
            value={formatValue(profile.nutrition?.dietType)}
          />

          <ProfileRow
            label="Meals per day"
            value={formatNumber(profile.nutrition?.mealsPerDay)}
          />

          <ArrayField
            label="Dietary preferences"
            values={profile.nutrition?.dietaryPreferences}
          />

          <ArrayField
            label="Food allergies"
            values={profile.nutrition?.foodAllergies}
          />

          <ProfileRow
            label="Water consumption"
            value={formatValue(profile.nutrition?.waterConsumption)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* SLEEP                                                             */}
        {/* ================================================================== */}

        <ProfileSection
          title="Sleep"
          subtitle="Your sleep pattern and quality"
          icon="moon-outline"
        >
          <ProfileRow
            label="Average sleep"
            value={formatNumber(profile.sleep?.averageHours, "hrs")}
          />

          <ProfileRow
            label="Sleep quality"
            value={formatValue(profile.sleep?.sleepQuality)}
          />

          <ProfileRow
            label="Bedtime"
            value={formatValue(profile.sleep?.bedtime)}
          />

          <ProfileRow
            label="Wake time"
            value={formatValue(profile.sleep?.wakeTime)}
          />

          <ArrayField
            label="Sleep difficulties"
            values={profile.sleep?.sleepDifficulties}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* FITNESS & YOGA                                                    */}
        {/* ================================================================== */}

        <ProfileSection
          title="Fitness & Yoga"
          subtitle="Movement, exercise and yoga experience"
          icon="fitness-outline"
        >
          <ProfileRow
            label="Exercise frequency"
            value={formatValue(profile.fitness?.exerciseFrequency)}
          />

          <ArrayField
            label="Exercise types"
            values={profile.fitness?.exerciseTypes}
          />

          <ProfileRow
            label="Yoga experience"
            value={formatValue(profile.fitness?.yogaExperience)}
          />

          <ProfileRow
            label="Average daily steps"
            value={formatNumber(profile.fitness?.averageDailySteps, "steps")}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* MEDICAL HISTORY                                                   */}
        {/* ================================================================== */}

        <ProfileSection
          title="Medical History"
          subtitle="Health history and medical information"
          icon="medkit-outline"
        >
          <ArrayField
            label="Existing conditions"
            values={profile.medicalHistory?.existingConditions}
          />

          <ArrayField
            label="Allergies"
            values={profile.medicalHistory?.allergies}
          />

          <ArrayField
            label="Current medications"
            values={profile.medicalHistory?.currentMedications}
          />

          <ArrayField
            label="Previous surgeries"
            values={profile.medicalHistory?.previousSurgeries}
          />

          <ArrayField
            label="Family history"
            values={profile.medicalHistory?.familyHistory}
          />

          <ProfileRow
            label="Additional information"
            value={formatValue(profile.medicalHistory?.additionalInformation)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* PREFERENCES                                                       */}
        {/* ================================================================== */}

        <ProfileSection
          title="Preferences"
          subtitle="Your wellness preferences"
          icon="options-outline"
        >
          <ProfileRow
            label="Preferred yoga duration"
            value={formatNumber(
              profile.preferences?.preferredYogaDuration,
              "min",
            )}
          />

          <ProfileRow
            label="Preferred activity time"
            value={formatValue(profile.preferences?.preferredActivityTime)}
          />

          <ArrayField
            label="Wellness interests"
            values={profile.preferences?.wellnessInterests}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* ONBOARDING                                                        */}
        {/* ================================================================== */}

        <ProfileSection
          title="Onboarding"
          subtitle="Profile completion information"
          icon="checkmark-circle-outline"
        >
          <ProfileRow
            label="Status"
            value={profile.onboarding?.completed ? "Completed" : "Incomplete"}
          />

          <ProfileRow
            label="Completed at"
            value={formatDateTime(profile.onboarding?.completedAt)}
          />

          <ProfileRow
            label="Completion percentage"
            value={`${profile.onboarding?.completionPercentage ?? 0}%`}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* PROFILE & SYSTEM INFORMATION                                      */}
        {/* ================================================================== */}

        <ProfileSection
          title="Profile Information"
          subtitle="Account and record information"
          icon="information-circle-outline"
        >
          <ProfileRow label="Profile ID" value={formatId(profile._id)} mono />

          <ProfileRow label="User ID" value={formatId(profile.user)} mono />

          <ProfileRow
            label="Created at"
            value={formatDateTime(profile.createdAt)}
          />

          <ProfileRow
            label="Last updated"
            value={formatDateTime(profile.updatedAt)}
            last
          />
        </ProfileSection>

        {/* ================================================================== */}
        {/* FOOTER                                                            */}
        {/* ================================================================== */}

        <View className="items-center px-8 pb-3 pt-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EDF4EA]">
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={COLORS.green}
            />
          </View>

          <Text className="mt-3 text-center text-[9px] font-semibold text-[#697269]">
            Your health information stays linked to your account.
          </Text>

          <Text className="mt-1 text-center text-[8px] leading-[13px] text-[#9A9D95]">
            You can update your information whenever your health, lifestyle or
            preferences change.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
