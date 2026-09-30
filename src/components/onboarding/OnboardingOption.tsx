import { Pressable, Text } from "react-native";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function OnboardingOption({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 rounded-2xl border px-4 py-4 ${
        selected
          ? "border-primary-600 bg-primary-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <Text
        className={`text-base font-medium ${
          selected ? "text-primary-700" : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
