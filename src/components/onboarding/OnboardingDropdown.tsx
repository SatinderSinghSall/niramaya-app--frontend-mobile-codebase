import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
}

export default function OnboardingDropdown({
  label,
  value,
  placeholder,
  options,
  onSelect,
}: OnboardingDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DROPDOWN FIELD
      ===================================================== */}

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
              name={open ? "chevron-up" : "chevron-down"}
              size={17}
              color={open ? "#4D6A50" : "#7B857C"}
            />
          </View>
        </Pressable>
      </View>

      {/* =====================================================
          OPTIONS BOTTOM SHEET
      ===================================================== */}

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

          {/* SHEET */}

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
                        <Ionicons name="checkmark" size={17} color="#4D6A50" />
                      ) : (
                        <View className="h-2 w-2 rounded-full bg-[#CBD2CB]" />
                      )}
                    </View>

                    {/* OPTION TEXT */}

                    <Text
                      className={`flex-1 text-[14px] ${
                        selected
                          ? "font-semibold text-[#4D6A50]"
                          : "text-[#344238]"
                      }`}
                    >
                      {option}
                    </Text>

                    {/* SELECTED INDICATOR */}

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color="#4D6A50"
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
