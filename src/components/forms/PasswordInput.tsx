import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  error,
  placeholder = "Enter your password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-foreground">
        {label}
      </Text>

      <View
        className={`h-14 flex-row items-center rounded-2xl border bg-white ${
          error ? "border-error" : "border-slate-200"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 px-4 text-base text-foreground"
          autoCapitalize="none"
        />

        <Pressable
          onPress={() => setVisible((current) => !current)}
          className="px-4"
        >
          <Text className="font-semibold text-primary-700">
            {visible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      </View>

      {error ? <Text className="mt-1 text-sm text-error">{error}</Text> : null}
    </View>
  );
}
