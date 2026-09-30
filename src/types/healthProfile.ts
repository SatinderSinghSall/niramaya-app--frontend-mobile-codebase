export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type EnergyLevel =
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export type Digestion =
  | "poor"
  | "below_average"
  | "normal"
  | "good"
  | "very_good";

export type StressLevel =
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export type Mood = "very_low" | "low" | "neutral" | "good" | "very_good";

export type FocusLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type RelaxationLevel =
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type Smoking = "never" | "former" | "occasional" | "regular";

export type AlcoholConsumption = "none" | "occasional" | "regular";

export type DietType =
  | "vegetarian"
  | "vegan"
  | "eggetarian"
  | "non_vegetarian"
  | "other";

export type WaterConsumption = "low" | "moderate" | "high";

export type SleepQuality =
  | "very_poor"
  | "poor"
  | "average"
  | "good"
  | "very_good";

export type ExerciseFrequency =
  | "never"
  | "rarely"
  | "1_2_days"
  | "3_4_days"
  | "5_plus_days";

export type YogaExperience = "none" | "beginner" | "intermediate" | "advanced";

export type PreferredActivityTime =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "anytime";

export interface HealthProfilePersonal {
  dateOfBirth: string | null;
  gender: Gender | null;
  heightCm: number | null;
  weightKg: number | null;
  occupation: string | null;
}

export interface HealthProfilePhysicalHealth {
  energyLevel: EnergyLevel | null;
  digestion: Digestion | null;
  skinConcerns: string[];
  hairConcerns: string[];
  bodyPainAreas: string[];
  otherConcerns: string | null;
}

export interface HealthProfileWellbeing {
  stressLevel: StressLevel | null;
  mood: Mood | null;
  focusLevel: FocusLevel | null;
  relaxationLevel: RelaxationLevel | null;
}

export interface HealthProfileLifestyle {
  activityLevel: ActivityLevel | null;
  smoking: Smoking | null;
  alcoholConsumption: AlcoholConsumption | null;
  waterIntakeLiters: number | null;
  dailyScreenTimeHours: number | null;
}

export interface HealthProfileNutrition {
  dietType: DietType | null;
  mealsPerDay: number | null;
  dietaryPreferences: string[];
  foodAllergies: string[];
  waterConsumption: WaterConsumption | null;
}

export interface HealthProfileSleep {
  averageHours: number | null;
  sleepQuality: SleepQuality | null;
  bedtime: string | null;
  wakeTime: string | null;
  sleepDifficulties: string[];
}

export interface HealthProfileFitness {
  exerciseFrequency: ExerciseFrequency | null;
  exerciseTypes: string[];
  yogaExperience: YogaExperience | null;
  averageDailySteps: number | null;
}

export interface HealthProfileMedicalHistory {
  existingConditions: string[];
  allergies: string[];
  currentMedications: string[];
  previousSurgeries: string[];
  familyHistory: string[];
  additionalInformation: string | null;
}

export interface HealthProfilePreferences {
  preferredYogaDuration: number | null;
  preferredActivityTime: PreferredActivityTime | null;
  wellnessInterests: string[];
}

export interface HealthProfileOnboarding {
  completed: boolean;
  completedAt: string | null;
  completionPercentage: number;
}

export interface HealthProfile {
  _id: string;
  user: string;

  personal: HealthProfilePersonal;
  physicalHealth: HealthProfilePhysicalHealth;
  wellbeing: HealthProfileWellbeing;
  lifestyle: HealthProfileLifestyle;
  nutrition: HealthProfileNutrition;
  sleep: HealthProfileSleep;
  fitness: HealthProfileFitness;
  medicalHistory: HealthProfileMedicalHistory;
  preferences: HealthProfilePreferences;
  onboarding: HealthProfileOnboarding;

  createdAt: string;
  updatedAt: string;
}

export interface HealthProfileResponse {
  profile: HealthProfile;
}

/**
 * PATCH payload.
 *
 * Every section is optional because the backend supports
 * updating only the section/fields that changed.
 */
export type UpdateHealthProfilePayload = Partial<{
  personal: Partial<HealthProfilePersonal>;
  physicalHealth: Partial<HealthProfilePhysicalHealth>;
  wellbeing: Partial<HealthProfileWellbeing>;
  lifestyle: Partial<HealthProfileLifestyle>;
  nutrition: Partial<HealthProfileNutrition>;
  sleep: Partial<HealthProfileSleep>;
  fitness: Partial<HealthProfileFitness>;
  medicalHistory: Partial<HealthProfileMedicalHistory>;
  preferences: Partial<HealthProfilePreferences>;
  onboarding: Partial<HealthProfileOnboarding>;
}>;
