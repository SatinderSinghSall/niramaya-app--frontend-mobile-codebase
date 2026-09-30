import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

function Input({ label, error, className, multiline, ...props }: InputProps) {
  const inputClassName = [
    multiline
      ? "min-h-32 rounded-2xl border bg-white px-4 py-4 text-base text-foreground"
      : "h-14 rounded-2xl border bg-white px-4 text-base text-foreground",
    error ? "border-red-500" : "border-slate-200",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-foreground">
        {label}
      </Text>

      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={inputClassName}
        placeholderTextColor="#94A3B8"
      />

      {error ? (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}

export { Input };
export default Input;
