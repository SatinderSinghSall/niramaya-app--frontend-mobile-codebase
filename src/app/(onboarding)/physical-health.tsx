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

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/context/OnboardingContext";

const energyOptions = ["Very Low", "Low", "Moderate", "High", "Very High"];

const digestionOptions = ["Poor", "Sometimes uncomfortable", "Normal", "Good"];

const concernOptions = ["None", "Mild", "Moderate", "Significant"];

const COLORS = {
  primary: "#4D6A50",
  primaryDark: "#263F31",
};

/* =========================================================
   CUSTOM DROPDOWN
========================================================= */

interface DropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
}

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
      {/* FIELD */}
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
              name="chevron-down"
              size={16}
              color={open ? COLORS.primary : "#7B857C"}
            />
          </View>
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end">
          {/* BACKDROP */}
          <Pressable
            onPress={() => setOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          {/* BOTTOM SHEET */}
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
                    {/* OPTION ICON */}
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

                    {/* LABEL */}
                    <Text
                      className={`flex-1 text-[14px] ${
                        selected
                          ? "font-semibold text-[#4D6A50]"
                          : "text-[#344238]"
                      }`}
                    >
                      {option}
                    </Text>

                    {/* SELECTED CHECK */}
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
                <Ionicons name="alert-circle" size={31} color="#B65D54" />
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
                  <Ionicons name="alert-outline" size={16} color="#B65D54" />
                </View>

                <Text className="ml-3 flex-1 text-[14px] font-semibold text-[#9D514A]">
                  {field}
                </Text>
              </View>
            ))}
          </View>

          {/* INFO */}

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

export default function PhysicalHealthScreen() {
  const { data, updateSection } = useOnboarding();

  const [otherConcern, setOtherConcern] = useState(
    data.physicalHealth.otherConcern,
  );

  const [showValidationModal, setShowValidationModal] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]);

  /* =========================================================
     SELECT HELPER
  ========================================================= */

  const select = (
    key:
      | "energyLevel"
      | "digestion"
      | "skinConcern"
      | "hairConcern"
      | "bodyPain",
    value: string,
  ) => {
    updateSection("physicalHealth", {
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
      router.replace("/(onboarding)/about-you");
    }
  };

  /* =========================================================
   VALIDATION
  ========================================================= */

  const validateFields = () => {
    const missing: string[] = [];

    if (!data.physicalHealth.energyLevel) {
      missing.push("Energy Level");
    }

    if (!data.physicalHealth.digestion) {
      missing.push("Digestion");
    }

    if (!data.physicalHealth.skinConcern) {
      missing.push("Skin Concerns");
    }

    if (!data.physicalHealth.hairConcern) {
      missing.push("Hair Concerns");
    }

    if (!data.physicalHealth.bodyPain) {
      missing.push("Body Pain");
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

    updateSection("physicalHealth", {
      otherConcern,
    });

    router.push("/(onboarding)/wellbeing");
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

          <OnboardingProgress currentStep={2} />

          {/* =================================================
              HEADER
          ================================================= */}

          <OnboardingHeader
            title="Your Physical Health"
            description="Help us understand how your body is feeling currently."
          />

          {/* =================================================
              ENERGY
          ================================================= */}

          <Dropdown
            label="Energy Level"
            value={data.physicalHealth.energyLevel}
            placeholder="Select your energy level"
            options={energyOptions}
            onSelect={(value) => select("energyLevel", value)}
          />

          {/* =================================================
              DIGESTION
          ================================================= */}

          <Dropdown
            label="Digestion"
            value={data.physicalHealth.digestion}
            placeholder="Select your digestion level"
            options={digestionOptions}
            onSelect={(value) => select("digestion", value)}
          />

          {/* =================================================
              SKIN
          ================================================= */}

          <Dropdown
            label="Skin Concerns"
            value={data.physicalHealth.skinConcern}
            placeholder="Select skin concern"
            options={concernOptions}
            onSelect={(value) => select("skinConcern", value)}
          />

          {/* =================================================
              HAIR
          ================================================= */}

          <Dropdown
            label="Hair Concerns"
            value={data.physicalHealth.hairConcern}
            placeholder="Select hair concern"
            options={concernOptions}
            onSelect={(value) => select("hairConcern", value)}
          />

          {/* =================================================
              BODY PAIN
          ================================================= */}

          <Dropdown
            label="Body Pain"
            value={data.physicalHealth.bodyPain}
            placeholder="Select body pain level"
            options={concernOptions}
            onSelect={(value) => select("bodyPain", value)}
          />

          {/* =================================================
              OTHER CONCERNS
          ================================================= */}

          <View className="mt-1">
            <Text className="mb-2 text-sm font-semibold text-foreground">
              Other Health Concerns
            </Text>

            <TextInput
              value={otherConcern}
              onChangeText={setOtherConcern}
              placeholder="Tell us anything else..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-[15px] text-foreground"
            />

            <Text className="mt-2 text-[11px] leading-[16px] text-[#929B92]">
              You can mention anything about your physical health that you feel
              is important.
            </Text>
          </View>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <View className="mt-7 flex-row gap-3">
            {/* BACK */}
            <View className="flex-1">
              <Button title="Back" variant="outline" onPress={handleBack} />
            </View>

            {/* CONTINUE */}
            <View className="flex-1">
              <Button title="Continue" onPress={handleContinue} />
            </View>
          </View>
        </ScrollView>

        {/* =====================================================
          VALIDATION ERROR MODAL
        ===================================================== */}

        <ValidationModal
          visible={showValidationModal}
          missingFields={missingFields}
          onClose={() => setShowValidationModal(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
