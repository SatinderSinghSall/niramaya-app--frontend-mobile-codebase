import React, { createContext, useContext, useMemo, useState } from "react";

export interface OnboardingData {
  personal: {
    dateOfBirth: string;
    gender: string;
    height: string;
    weight: string;
    occupation: string;
  };

  physicalHealth: {
    energyLevel: string;
    digestion: string;
    skinConcern: string;
    hairConcern: string;
    bodyPain: string;
    otherConcern: string;
  };

  wellbeing: {
    stressLevel: string;
    mood: string;
    focusLevel: string;
    relaxation: string;
  };

  lifestyle: {
    activityLevel: string;
    smoking: string;
    alcohol: string;
    screenTime: string;
    waterIntake: string;
  };

  nutrition: {
    dietType: string;
    mealsPerDay: string;
    foodPreferences: string;
    allergies: string;
  };

  sleep: {
    hours: string;
    quality: string;
    bedtime: string;
    wakeTime: string;
    difficulties: string;
  };

  fitness: {
    exerciseFrequency: string;
    exerciseTypes: string;
    yogaExperience: string;
    dailySteps: string;
  };

  preferences: {
    wellnessInterests: string[];
    preferredYogaDuration: string;
    preferredActivityTime: string;
  };
}

const initialData: OnboardingData = {
  personal: {
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    occupation: "",
  },

  physicalHealth: {
    energyLevel: "",
    digestion: "",
    skinConcern: "",
    hairConcern: "",
    bodyPain: "",
    otherConcern: "",
  },

  wellbeing: {
    stressLevel: "",
    mood: "",
    focusLevel: "",
    relaxation: "",
  },

  lifestyle: {
    activityLevel: "",
    smoking: "",
    alcohol: "",
    screenTime: "",
    waterIntake: "",
  },

  nutrition: {
    dietType: "",
    mealsPerDay: "",
    foodPreferences: "",
    allergies: "",
  },

  sleep: {
    hours: "",
    quality: "",
    bedtime: "",
    wakeTime: "",
    difficulties: "",
  },

  fitness: {
    exerciseFrequency: "",
    exerciseTypes: "",
    yogaExperience: "",
    dailySteps: "",
  },

  preferences: {
    wellnessInterests: [],
    preferredYogaDuration: "",
    preferredActivityTime: "",
  },
};

interface OnboardingContextType {
  data: OnboardingData;
  updateSection: <K extends keyof OnboardingData>(
    section: K,
    values: Partial<OnboardingData[K]>,
  ) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateSection = <K extends keyof OnboardingData>(
    section: K,
    values: Partial<OnboardingData[K]>,
  ) => {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...values,
      },
    }));
  };

  const resetOnboarding = () => {
    setData(initialData);
  };

  const value = useMemo(
    () => ({
      data,
      updateSection,
      resetOnboarding,
    }),
    [data],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }

  return context;
}
