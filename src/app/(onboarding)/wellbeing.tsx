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
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingDropdown from "@/components/onboarding/OnboardingDropdown";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/context/OnboardingContext";

const levels = ["Very Low", "Low", "Moderate", "High", "Very High"];

const moods = ["Very Poor", "Poor", "Okay", "Good", "Very Good"];

const COLORS = {
  primary: "#4D6A50",
  primaryDark: "#263F31",
  danger: "#B65D54",
  dangerDark: "#9D514A",
};

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
          {/* =================================================
              ERROR ICON
          ================================================= */}

          <View className="items-center">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FBE8E5]">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F5D7D3]">
                <Ionicons name="alert-circle" size={31} color={COLORS.danger} />
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

          {/* =================================================
              INFORMATION
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

export default function WellbeingScreen() {
  const { data, updateSection } = useOnboarding();

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  /* =========================================================
     SELECT
  ========================================================= */

  const select = (
    key: "stressLevel" | "mood" | "focusLevel" | "relaxation",
    value: string,
  ) => {
    updateSection("wellbeing", {
      [key]: value,
    });
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(onboarding)/physical-health");
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateFields = () => {
    const missing: string[] = [];

    if (!data.wellbeing.stressLevel) {
      missing.push("Stress Level");
    }

    if (!data.wellbeing.mood) {
      missing.push("Current Mood");
    }

    if (!data.wellbeing.focusLevel) {
      missing.push("Focus & Concentration");
    }

    if (!data.wellbeing.relaxation) {
      missing.push("Ability to Relax");
    }

    return missing;
  };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const handleContinue = () => {
    const missing = validateFields();

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationModal(true);
      return;
    }

    router.push("/(onboarding)/lifestyle");
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

          <OnboardingProgress currentStep={3} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Your Wellbeing"
            description="Your mental and emotional wellbeing is an important part of overall health."
          />

          {/* =================================================
              STRESS LEVEL
          ================================================= */}

          <OnboardingDropdown
            label="Stress Level"
            value={data.wellbeing.stressLevel}
            placeholder="Select your stress level"
            options={levels}
            onSelect={(value) => select("stressLevel", value)}
          />

          {/* =================================================
              CURRENT MOOD
          ================================================= */}

          <OnboardingDropdown
            label="Current Mood"
            value={data.wellbeing.mood}
            placeholder="Select your current mood"
            options={moods}
            onSelect={(value) => select("mood", value)}
          />

          {/* =================================================
              FOCUS & CONCENTRATION
          ================================================= */}

          <OnboardingDropdown
            label="Focus & Concentration"
            value={data.wellbeing.focusLevel}
            placeholder="Select your focus level"
            options={levels}
            onSelect={(value) => select("focusLevel", value)}
          />

          {/* =================================================
              ABILITY TO RELAX
          ================================================= */}

          <OnboardingDropdown
            label="Ability to Relax"
            value={data.wellbeing.relaxation}
            placeholder="Select your ability to relax"
            options={levels}
            onSelect={(value) => select("relaxation", value)}
          />

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <View className="mt-7 flex-row gap-3">
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
