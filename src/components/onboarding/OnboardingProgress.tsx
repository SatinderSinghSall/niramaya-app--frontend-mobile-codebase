import { Text, View } from "react-native";

interface Props {
  currentStep: number;
  totalSteps?: number;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps = 8,
}: Props) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted">
          Step {currentStep} of {totalSteps}
        </Text>

        <Text className="text-sm font-semibold text-primary-600">
          {Math.round(percentage)}%
        </Text>
      </View>

      <View className="h-2 overflow-hidden rounded-full bg-primary-100">
        <View
          className="h-full rounded-full bg-primary-600"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
