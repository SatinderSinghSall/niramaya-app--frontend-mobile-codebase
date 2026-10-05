import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DisclaimerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({
  visible,
  onClose,
}: DisclaimerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-[#14221C]/60 px-5">
        <View className="w-full max-w-[430px] overflow-hidden rounded-[26px] border border-[#E4EBE6] bg-white shadow-2xl">
          {/* Header */}
          <View className="items-center px-6 pt-7">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-[#EDF5F0]">
              <View className="h-[52px] w-[52px] items-center justify-center rounded-[17px] bg-[#F8FBF9]">
                <Ionicons
                  name="information-circle-outline"
                  size={30}
                  color="#315C4A"
                />
              </View>
            </View>

            <Text className="mt-4 text-[23px] font-bold tracking-[-0.4px] text-[#17231E]">
              Niramaya
            </Text>

            <Text className="mt-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#7A8981]">
              Wellness Information
            </Text>
          </View>

          {/* Disclaimer */}
          <View className="px-6 pb-2 pt-6">
            <View className="rounded-2xl border border-[#DCE9E1] bg-[#F7FAF8] p-4">
              <View className="mb-3 flex-row items-center">
                <View className="h-8 w-8 items-center justify-center rounded-[10px] bg-[#E8F3EC]">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={17}
                    color="#315C4A"
                  />
                </View>

                <Text className="ml-2.5 text-[13px] font-bold text-[#315C4A]">
                  Important information
                </Text>
              </View>

              <Text className="text-[14px] leading-[22px] text-[#56665E]">
                Niramaya is intended as a wellness application. Its
                informational content and recommendations are not a replacement
                for diagnosis, treatment or professional medical care.
              </Text>
            </View>
          </View>

          {/* Action */}
          <View className="mt-5 border-t border-[#EDF0EE] px-6 py-[18px]">
            <Pressable
              onPress={onClose}
              className="min-h-[50px] flex-row items-center justify-center rounded-[14px] bg-[#315C4A] px-5 active:opacity-80"
            >
              <Text className="text-sm font-bold text-white">Okay</Text>

              <Ionicons
                name="checkmark"
                size={18}
                color="#FFFFFF"
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
