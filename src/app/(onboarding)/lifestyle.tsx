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

const activityOptions = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
];

const yesNo = ["No", "Occasionally", "Frequently"];

const screenTimeOptions = [
  "Less than 2 hours",
  "2–4 hours",
  "4–6 hours",
  "More than 6 hours",
];

const waterOptions = [
  "Less than 1 litre",
  "1–2 litres",
  "2–3 litres",
  "More than 3 litres",
];

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

export default function LifestyleScreen() {
  const { data, updateSection } = useOnboarding();

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  /* =========================================================
     SELECT
  ========================================================= */

  const select = (
    key: "activityLevel" | "smoking" | "alcohol" | "screenTime" | "waterIntake",
    value: string,
  ) => {
    updateSection("lifestyle", {
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
      router.replace("/(onboarding)/wellbeing");
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateFields = () => {
    const missing: string[] = [];

    if (!data.lifestyle.activityLevel) {
      missing.push("Activity Level");
    }

    if (!data.lifestyle.smoking) {
      missing.push("Smoking");
    }

    if (!data.lifestyle.alcohol) {
      missing.push("Alcohol Consumption");
    }

    if (!data.lifestyle.screenTime) {
      missing.push("Daily Screen Time");
    }

    if (!data.lifestyle.waterIntake) {
      missing.push("Daily Water Intake");
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

    router.push("/(onboarding)/nutrition");
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

          <OnboardingProgress currentStep={4} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Your Lifestyle"
            description="Understanding your daily habits helps us create more relevant wellness recommendations."
          />

          {/* =================================================
              ACTIVITY LEVEL
          ================================================= */}

          <OnboardingDropdown
            label="Activity Level"
            value={data.lifestyle.activityLevel}
            placeholder="Select your activity level"
            options={activityOptions}
            onSelect={(value) => select("activityLevel", value)}
          />

          {/* =================================================
              SMOKING
          ================================================= */}

          <OnboardingDropdown
            label="Smoking"
            value={data.lifestyle.smoking}
            placeholder="Select smoking frequency"
            options={yesNo}
            onSelect={(value) => select("smoking", value)}
          />

          {/* =================================================
              ALCOHOL
          ================================================= */}

          <OnboardingDropdown
            label="Alcohol Consumption"
            value={data.lifestyle.alcohol}
            placeholder="Select alcohol frequency"
            options={yesNo}
            onSelect={(value) => select("alcohol", value)}
          />

          {/* =================================================
              DAILY SCREEN TIME
          ================================================= */}

          <OnboardingDropdown
            label="Daily Screen Time"
            value={data.lifestyle.screenTime}
            placeholder="Select your screen time"
            options={screenTimeOptions}
            onSelect={(value) => select("screenTime", value)}
          />

          {/* =================================================
              DAILY WATER INTAKE
          ================================================= */}

          <OnboardingDropdown
            label="Daily Water Intake"
            value={data.lifestyle.waterIntake}
            placeholder="Select your water intake"
            options={waterOptions}
            onSelect={(value) => select("waterIntake", value)}
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
