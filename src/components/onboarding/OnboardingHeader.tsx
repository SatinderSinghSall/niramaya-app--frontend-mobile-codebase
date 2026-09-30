import { Text, View } from "react-native";

interface Props {
  title: string;
  description: string;
}

export default function OnboardingHeader({ title, description }: Props) {
  return (
    <View className="mb-7">
      <Text className="text-3xl font-bold leading-10 text-foreground">
        {title}
      </Text>

      <Text className="mt-2 text-base leading-6 text-muted">{description}</Text>
    </View>
  );
}
