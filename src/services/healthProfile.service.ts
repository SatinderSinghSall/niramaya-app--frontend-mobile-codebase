import { api } from "@/services/api";

export interface HealthProfilePayload {
  personal?: {
    dateOfBirth?: string;
    gender?: "male" | "female" | "other" | "prefer_not_to_say";
    heightCm?: number | null;
    weightKg?: number | null;
    occupation?: string | null;
  };

  physicalHealth?: {
    energyLevel?: "very_low" | "low" | "moderate" | "high" | "very_high";

    digestion?: "poor" | "below_average" | "normal" | "good" | "very_good";

    skinConcerns?: string[];
    hairConcerns?: string[];
    bodyPainAreas?: string[];
    otherConcerns?: string | null;
  };

  wellbeing?: {
    stressLevel?: "very_low" | "low" | "moderate" | "high" | "very_high";

    mood?: "very_low" | "low" | "neutral" | "good" | "very_good";

    focusLevel?: "very_low" | "low" | "moderate" | "high" | "very_high";

    relaxationLevel?: "very_low" | "low" | "moderate" | "high" | "very_high";
  };

  lifestyle?: {
    activityLevel?:
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active";

    smoking?: "never" | "former" | "occasional" | "regular";

    alcoholConsumption?: "none" | "occasional" | "regular";

    waterIntakeLiters?: number | null;
    dailyScreenTimeHours?: number | null;
  };

  nutrition?: {
    dietType?:
      | "vegetarian"
      | "vegan"
      | "eggetarian"
      | "non_vegetarian"
      | "other";

    mealsPerDay?: number | null;
    dietaryPreferences?: string[];
    foodAllergies?: string[];

    waterConsumption?: "low" | "moderate" | "high";
  };

  sleep?: {
    averageHours?: number | null;

    sleepQuality?: "very_poor" | "poor" | "average" | "good" | "very_good";

    bedtime?: string | null;
    wakeTime?: string | null;
    sleepDifficulties?: string[];
  };

  fitness?: {
    exerciseFrequency?:
      | "never"
      | "rarely"
      | "1_2_days"
      | "3_4_days"
      | "5_plus_days";

    exerciseTypes?: string[];

    yogaExperience?: "none" | "beginner" | "intermediate" | "advanced";

    averageDailySteps?: number | null;
  };

  medicalHistory?: {
    existingConditions?: string[];
    allergies?: string[];
    currentMedications?: string[];
    previousSurgeries?: string[];
    familyHistory?: string[];
    additionalInformation?: string | null;
  };

  preferences?: {
    preferredYogaDuration?: number | null;

    preferredActivityTime?:
      | "morning"
      | "afternoon"
      | "evening"
      | "night"
      | "anytime";

    wellnessInterests?: string[];
  };

  onboarding?: {
    completed?: boolean;
    completedAt?: string | null;
    completionPercentage?: number;
  };
}

export async function createHealthProfile(payload: HealthProfilePayload) {
  const response = await api.post("/health-profile", payload);

  return response.data?.data?.profile ?? response.data?.profile;
}

export async function getHealthProfile() {
  const response = await api.get("/health-profile");

  return response.data?.data?.profile ?? response.data?.profile;
}

export async function updateHealthProfile(payload: HealthProfilePayload) {
  const response = await api.patch("/health-profile", payload);

  return response.data?.data?.profile ?? response.data?.profile;
}
