import React from "react";

import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface InternetRequiredModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InternetRequiredModal({
  visible,
  onClose,
}: InternetRequiredModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => {
        // Intentionally disabled.
        // The modal can only be closed using the X button.
      }}
    >
      <View className="flex-1 items-center justify-center bg-[#263F31]/60 px-5">
        {/* =====================================================
            MODAL CARD
        ===================================================== */}
        <View className="w-full max-w-[400px] overflow-hidden rounded-[32px] border border-[#DDE5DA] bg-[#FAFBF8] shadow-2xl">
          {/* ===================================================
              TOP / HERO AREA
          =================================================== */}
          <View className="relative overflow-hidden bg-[#EEF2E6] px-7 pb-8 pt-8">
            {/* Decorative background */}
            <View className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-white/55" />

            <View className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-[#DCE7D8]/75" />

            <View className="absolute right-16 top-16 h-3 w-3 rounded-full bg-white/60" />

            {/* Close */}
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close internet required message"
              hitSlop={10}
              className="absolute right-4 top-4 z-20 h-10 w-10 items-center justify-center rounded-full border border-[#E0E7DD] bg-white/95 shadow-sm"
            >
              <Ionicons name="close" size={19} color="#536158" />
            </Pressable>

            {/* =================================================
                ICON
            ================================================= */}
            <View className="items-center">
              <View className="h-[84px] w-[84px] items-center justify-center rounded-[27px] bg-white shadow-sm">
                <View className="h-[64px] w-[64px] items-center justify-center rounded-[21px] bg-[#E7EEE3]">
                  <Ionicons
                    name="cloud-offline-outline"
                    size={32}
                    color="#4D6A50"
                  />
                </View>
              </View>
            </View>

            {/* Eyebrow */}
            <Text className="mt-5 text-center text-[9px] font-bold uppercase tracking-[2.2px] text-[#718074]">
              CONNECTION REQUIRED
            </Text>

            {/* Title */}
            <Text className="mt-2 text-center text-[25px] font-bold leading-[31px] tracking-[-0.5px] text-[#263F31]">
              Internet connection needed
            </Text>

            {/* Description */}
            <Text className="mx-auto mt-3 max-w-[315px] text-center text-[13px] leading-[20px] text-[#637068]">
              Niramaya needs an active internet connection to load your wellness
              content, recommendations, account information, and other app
              features.
            </Text>
          </View>

          {/* ===================================================
              BOTTOM CONTENT
          =================================================== */}
          <View className="px-6 pb-6 pt-5">
            {/* =================================================
                CONNECTION STATUS
            ================================================= */}
            <View className="rounded-[20px] border border-[#E0E7DE] bg-white p-4 shadow-sm">
              <View className="flex-row items-center">
                {/* Status icon */}
                <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-[#EEF3EC]">
                  <ActivityIndicator size="small" color="#4D6A50" />
                </View>

                {/* Status text */}
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-[12px] font-bold text-[#35473A]">
                      Waiting for connection
                    </Text>

                    <View className="ml-2 h-1.5 w-1.5 rounded-full bg-[#D69A55]" />
                  </View>

                  <Text className="mt-1 text-[10px] leading-[15px] text-[#89938C]">
                    Check Wi-Fi or mobile data and try again.
                  </Text>
                </View>
              </View>

              {/* Small status line */}
              <View className="mt-3 h-[1px] bg-[#EEF1ED]" />

              <View className="mt-3 flex-row items-center">
                <Ionicons name="radio-outline" size={13} color="#8A958D" />

                <Text className="ml-2 text-[9px] font-medium tracking-[0.2px] text-[#8A958D]">
                  NIRAMAYA IS WAITING FOR NETWORK ACCESS
                </Text>
              </View>
            </View>

            {/* =================================================
                INFORMATION
            ================================================= */}
            <View className="mt-4 flex-row items-start rounded-[17px] bg-[#F4F7F2] px-4 py-3.5">
              <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-white">
                <Ionicons
                  name="information-outline"
                  size={13}
                  color="#718074"
                />
              </View>

              <Text className="ml-2.5 flex-1 text-[10px] leading-[16px] text-[#7F8A82]">
                You can close this message, but some Niramaya features may
                remain unavailable until you reconnect to the internet.
              </Text>
            </View>

            {/* Bottom brand detail */}
            <View className="mt-5 items-center">
              <View className="h-[1px] w-6 bg-[#C9D4C7]" />

              <Text className="mt-2.5 text-[8px] font-medium uppercase tracking-[1.5px] text-[#A0A9A1]">
                Wellness • Balance • You
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
