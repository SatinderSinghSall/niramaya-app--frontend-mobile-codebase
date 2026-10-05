import React from "react";

import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface MaintenanceModalProps {
  visible: boolean;
  restricted: boolean;

  title: string;
  message: string;

  countdownText: string | null;
  endDateText: string | null;

  checking: boolean;
  error: string;

  onContinue: () => void;
}

export default function MaintenanceModal({
  visible,
  restricted,
  title,
  message,
  countdownText,
  endDateText,
  checking,
  error,
  onContinue,
}: MaintenanceModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!restricted) {
          onContinue();
        }
      }}
    >
      <View className="flex-1 items-center justify-center bg-[#14221C]/60 px-5">
        <View className="max-h-[90%] w-full max-w-[430px] overflow-hidden rounded-[26px] border border-[#E6ECE8] bg-white shadow-2xl">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <View className="items-center px-6 pt-7">
            {/* Main icon */}

            <View className="h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-[#EDF5F0]">
              <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-[#F7FAF8]">
                <Ionicons
                  name={
                    restricted ? "lock-closed-outline" : "construct-outline"
                  }
                  size={30}
                  color="#315C4A"
                />
              </View>
            </View>

            {/* Status badge */}

            <View className="mt-3.5 flex-row items-center gap-1.5 rounded-full bg-[#F5F8F6] px-3 py-2">
              <View
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  restricted ? "bg-[#D92D20]" : "bg-[#20B36B]",
                ].join(" ")}
              />

              <Text className="text-[10px] font-bold tracking-[1.1px] text-[#61736A]">
                {restricted ? "ACCESS RESTRICTED" : "MAINTENANCE NOTICE"}
              </Text>
            </View>
          </View>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <View className="px-6 pt-[22px]">
            <Text className="text-center text-[24px] font-bold leading-[31px] tracking-[-0.45px] text-[#17231E]">
              {title}
            </Text>

            <Text className="mt-2.5 text-center text-sm leading-[21px] text-[#68776F]">
              {message}
            </Text>

            {/* =================================================
                ACCESS NOTICE
            ================================================= */}

            <View
              className={[
                "mt-5 flex-row items-start rounded-2xl border p-3.5",
                restricted
                  ? "border-[#F1D3D0] bg-[#FFF8F7]"
                  : "border-[#DCE9E1] bg-[#F6FAF7]",
              ].join(" ")}
            >
              <View
                className={[
                  "h-[38px] w-[38px] items-center justify-center rounded-xl",
                  restricted ? "bg-[#FDECEA]" : "bg-[#E8F4EC]",
                ].join(" ")}
              >
                <Ionicons
                  name={
                    restricted
                      ? "lock-closed-outline"
                      : "information-circle-outline"
                  }
                  size={19}
                  color={restricted ? "#B42318" : "#315C4A"}
                />
              </View>

              <View className="ml-[11px] flex-1">
                <Text
                  className={[
                    "text-[13px] font-bold leading-[18px]",
                    restricted ? "text-[#9F2D25]" : "text-[#315C4A]",
                  ].join(" ")}
                >
                  {restricted
                    ? "You can't access the app right now"
                    : "You can continue using Niramaya"}
                </Text>

                <Text className="mt-1 text-xs leading-[18px] text-[#6D7B74]">
                  {restricted
                    ? "We're working to restore normal service as soon as possible."
                    : "Some features may be temporarily unavailable or behave differently during maintenance."}
                </Text>
              </View>
            </View>

            {/* =================================================
                COUNTDOWN
            ================================================= */}

            {countdownText ? (
              <View className="mt-3 flex-row items-center rounded-2xl border border-[#E1E9E4] bg-[#FBFCFB] p-3.5">
                <View className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#EDF5F0]">
                  <Ionicons name="time-outline" size={19} color="#315C4A" />
                </View>

                <View className="ml-[11px] flex-1">
                  <Text className="text-[9px] font-bold tracking-[1.1px] text-[#8A9991]">
                    EXPECTED END
                  </Text>

                  <Text className="mt-0.5 text-[19px] font-bold tracking-[0.3px] text-[#17231E]">
                    {countdownText}
                  </Text>

                  {endDateText ? (
                    <Text className="mt-0.5 text-[11px] text-[#7B8982]">
                      Until {endDateText}
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* =================================================
                ERROR
            ================================================= */}

            {error ? (
              <View className="mt-3 flex-row items-start gap-2">
                <Ionicons
                  name="cloud-offline-outline"
                  size={16}
                  color="#A56516"
                />

                <Text className="flex-1 text-[11px] leading-4 text-[#8A641D]">
                  We couldn't refresh the maintenance status. We'll try again
                  automatically.
                </Text>
              </View>
            ) : null}
          </View>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <View className="mt-[22px] border-t border-[#EDF0EE] px-6 py-[18px]">
            {restricted ? (
              <View className="min-h-[42px] flex-row items-center justify-center gap-2">
                {checking ? (
                  <ActivityIndicator size="small" color="#315C4A" />
                ) : (
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={17}
                    color="#315C4A"
                  />
                )}

                <Text className="text-center text-[11px] leading-4 text-[#718078]">
                  Niramaya will automatically check again.
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={onContinue}
                className="min-h-[50px] flex-row items-center justify-center gap-2.5 rounded-[14px] bg-[#315C4A] px-[18px] active:opacity-80"
              >
                <Text className="text-sm font-bold text-white">
                  Continue to Niramaya
                </Text>

                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
