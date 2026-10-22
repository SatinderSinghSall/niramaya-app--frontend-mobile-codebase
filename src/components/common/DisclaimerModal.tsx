import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DisclaimerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({
  visible,
  onClose,
}: DisclaimerModalProps) {
  const router = useRouter();

  const handleMeetDevelopers = () => {
    onClose();
    router.push("/developers");
  };

  const gradientPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(gradientPosition, {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [gradientPosition]);

  const translateX = gradientPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 0],
  });

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

          {/* Actions */}
          <View className="mt-5 gap-3 border-t border-[#EDF0EE] px-6 py-[18px]">
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

            <Pressable
              onPress={handleMeetDevelopers}
              accessibilityRole="button"
              accessibilityLabel="Know the Developers"
              className="overflow-hidden rounded-[16px] active:opacity-80"
            >
              <View className="min-h-[54px] flex-row items-center justify-center overflow-hidden rounded-[16px] border border-white/30">
                {/* Continuously moving multicolor background */}
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: -220,
                    right: -220,
                    transform: [{ translateX }],
                  }}
                >
                  <LinearGradient
                    colors={[
                      "#00C9A7",
                      "#00B4D8",
                      "#4776E6",
                      "#9B51E0",
                      "#E84393",
                      "#FF6B6B",
                      "#FF9F43",
                      "#C6F34E",
                      "#00C9A7",
                    ]}
                    locations={[0, 0.13, 0.26, 0.39, 0.52, 0.65, 0.77, 0.9, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>

                {/* Slight translucent overlay for a polished finish */}
                <View
                  pointerEvents="none"
                  className="absolute inset-0 bg-white/5"
                />

                {/* Button content */}
                <View className="min-h-[54px] flex-row items-center justify-center px-5">
                  <Ionicons name="people-outline" size={20} color="#FFFFFF" />

                  <Text className="ml-2 text-sm font-bold text-white">
                    Know the Developers
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
