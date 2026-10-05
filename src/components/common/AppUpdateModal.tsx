import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { AppUpdateCheckData } from "../../types/appUpdate";

interface AppUpdateModalProps {
  visible: boolean;
  update: AppUpdateCheckData | null;
  onLater: () => void;
}

export default function AppUpdateModal({
  visible,
  update,
  onLater,
}: AppUpdateModalProps) {
  const openingStore = useRef(false);

  const [isOpeningStore, setIsOpeningStore] = useState(false);

  useEffect(() => {
    if (!visible) {
      openingStore.current = false;
      setIsOpeningStore(false);
    }
  }, [visible]);

  if (!update?.config) {
    return null;
  }

  const { config, currentVersion, updateAvailable, belowMinimum, forceUpdate } =
    update;

  /*
   * Mandatory when:
   *
   * - below minimum version
   * - OR Force Update is enabled
   */
  const isMandatory = Boolean(forceUpdate || belowMinimum);

  if (!updateAvailable && !belowMinimum) {
    return null;
  }

  const isIOS = config.platform === "ios";

  async function handleUpdate() {
    if (openingStore.current || !config.storeUrl) {
      return;
    }

    openingStore.current = true;
    setIsOpeningStore(true);

    try {
      const supported = await Linking.canOpenURL(config.storeUrl);

      if (!supported) {
        openingStore.current = false;
        setIsOpeningStore(false);
        return;
      }

      await Linking.openURL(config.storeUrl);

      /*
       * Keep the mandatory modal state intact.
       *
       * If the user returns to the app without
       * updating, AppUpdateGate will check again
       * when the app becomes active.
       */
      if (!isMandatory) {
        openingStore.current = false;
        setIsOpeningStore(false);
      }
    } catch {
      openingStore.current = false;
      setIsOpeningStore(false);
    }
  }

  function handleRequestClose() {
    /*
     * Android back button / modal close request.
     *
     * Mandatory update:
     * NEVER close.
     *
     * Optional update:
     * close normally.
     */
    if (isMandatory) {
      return;
    }

    onLater();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <View className="flex-1 items-center justify-center bg-[#14221C]/70 px-5">
        <View className="w-full max-w-[430px] overflow-hidden rounded-[30px] bg-white">
          {/* ================================
              HEADER
          ================================= */}

          <View className="items-center bg-[#F3F8F5] px-6 pb-6 pt-8">
            {/* Optional close button */}

            {!isMandatory && (
              <Pressable
                onPress={onLater}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close update notification"
                className="absolute right-4 top-4 h-9 w-9 items-center justify-center rounded-full bg-white"
              >
                <Ionicons name="close" size={20} color="#64736B" />
              </Pressable>
            )}

            {/* Update icon */}

            <View className="h-[84px] w-[84px] items-center justify-center rounded-full bg-[#E1F0E7]">
              <View className="h-[64px] w-[64px] items-center justify-center rounded-full bg-white">
                <Ionicons
                  name="cloud-download-outline"
                  size={34}
                  color="#315C4A"
                />
              </View>
            </View>

            {/* Status badge */}

            <View
              className={`mt-4 flex-row items-center rounded-full border px-3.5 py-1.5 ${
                isMandatory
                  ? "border-[#F0D4C8] bg-[#FFF7F3]"
                  : "border-[#D7E6DD] bg-white"
              }`}
            >
              <View
                className={`mr-2 h-1.5 w-1.5 rounded-full ${
                  isMandatory ? "bg-[#C56B45]" : "bg-[#2F9B69]"
                }`}
              />

              <Text
                className={`text-[10px] font-extrabold tracking-[1px] ${
                  isMandatory ? "text-[#9A583C]" : "text-[#527263]"
                }`}
              >
                {isMandatory ? "REQUIRED UPDATE" : "UPDATE AVAILABLE"}
              </Text>
            </View>
          </View>

          {/* ================================
              CONTENT
          ================================= */}

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 2,
            }}
          >
            <View className="px-[22px] pb-3 pt-6">
              {/* Title */}

              <Text className="text-center text-[23px] font-bold leading-[30px] tracking-[-0.5px] text-[#17251F]">
                {isMandatory
                  ? "Update Niramaya to continue"
                  : "A new version is available"}
              </Text>

              {/* Message */}

              <Text className="mt-2.5 text-center text-[14px] leading-[21px] text-[#68776F]">
                {config.updateMessage ||
                  "A newer version of Niramaya is available with improvements and new features."}
              </Text>

              {/* ==========================
                  VERSION COMPARISON
              =========================== */}

              <View className="mt-5 flex-row items-center rounded-[18px] border border-[#E2EAE5] bg-[#F8FAF9] p-4">
                {/* Current */}

                <View className="min-w-0 flex-1">
                  <Text className="text-[10px] font-semibold tracking-[0.7px] text-[#829088]">
                    CURRENT
                  </Text>

                  <Text className="mt-1 text-[18px] font-bold text-[#34453D]">
                    {currentVersion}
                  </Text>
                </View>

                {/* Arrow */}

                <View className="mx-2 h-9 w-9 items-center justify-center rounded-full bg-[#EAF1ED]">
                  <Ionicons name="arrow-forward" size={17} color="#7B8B82" />
                </View>

                {/* Latest */}

                <View className="min-w-0 flex-1 items-end">
                  <Text className="text-[10px] font-semibold tracking-[0.7px] text-[#829088]">
                    LATEST
                  </Text>

                  <Text className="mt-1 text-[18px] font-bold text-[#315C4A]">
                    {config.latestVersion}
                  </Text>
                </View>
              </View>

              {/* ==========================
                  REQUIRED WARNING
              =========================== */}

              {isMandatory && (
                <View className="mt-3.5 flex-row rounded-[16px] border border-[#F2DFC0] bg-[#FFF8EC] p-3.5">
                  <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-[#FFF0D7]">
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color="#A56516"
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[13px] font-bold text-[#805117]">
                      Update required
                    </Text>

                    <Text className="mt-1 text-[11px] leading-[17px] text-[#98734A]">
                      {belowMinimum
                        ? "Your current version is no longer supported."
                        : "A new version is required to continue using Niramaya."}
                    </Text>
                  </View>
                </View>
              )}

              {/* ==========================
                  OPTIONAL INFORMATION
              =========================== */}

              {!isMandatory && (
                <View className="mt-4 rounded-[14px] border border-[#E7ECE9] bg-[#FAFBFA] px-3.5 py-3">
                  <View className="flex-row items-center">
                    <View className="h-7 w-7 items-center justify-center rounded-[8px] bg-[#E8F1EC]">
                      <Ionicons
                        name="information-outline"
                        size={15}
                        color="#315C4A"
                      />
                    </View>

                    <Text className="ml-2.5 text-[11px] font-semibold uppercase tracking-[0.6px] text-[#6F7E76]">
                      What's new
                    </Text>
                  </View>

                  <Text className="mt-2 text-[12px] leading-[18px] text-[#65736C]">
                    {config.updateMessage ||
                      "A newer version of Niramaya is available with improvements and new features."}
                  </Text>
                </View>
              )}

              {/* ==========================
                  STORE LINK
              =========================== */}

              {config.storeUrl && (
                <Pressable
                  onPress={handleUpdate}
                  disabled={isOpeningStore}
                  accessibilityRole="link"
                  accessibilityLabel={
                    isIOS ? "Open Apple App Store" : "Open Google Play Store"
                  }
                  className="mt-4 flex-row items-center rounded-[15px] border border-[#DCE7E1] bg-white px-3.5 py-3"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-[#EEF5F1]">
                    <Ionicons
                      name={isIOS ? "logo-apple" : "logo-google-playstore"}
                      size={19}
                      color="#315C4A"
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[12px] font-bold text-[#315C4A]">
                      {isIOS ? "Open App Store" : "Open Google Play"}
                    </Text>

                    <Text
                      numberOfLines={1}
                      className="mt-0.5 text-[10px] text-[#8A9790]"
                    >
                      Get the latest Niramaya update
                    </Text>
                  </View>

                  <Ionicons name="open-outline" size={17} color="#7B8B82" />
                </Pressable>
              )}
            </View>
          </ScrollView>

          {/* ================================
              FOOTER
          ================================= */}

          <View className="px-[22px] pb-[22px] pt-3">
            {/* Update button */}

            <Pressable
              onPress={handleUpdate}
              disabled={isOpeningStore}
              accessibilityRole="button"
              accessibilityLabel={
                isMandatory ? "Update Niramaya now" : "Update Niramaya"
              }
              className={`h-[53px] flex-row items-center justify-center rounded-[16px] ${
                isOpeningStore ? "bg-[#6D897C]" : "bg-[#315C4A]"
              }`}
            >
              {isOpeningStore ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={19} color="#FFFFFF" />

                  <Text className="ml-2 text-[14px] font-bold text-white">
                    {isMandatory ? "Update Now" : "Update Niramaya"}
                  </Text>
                </>
              )}
            </Pressable>

            {/* Optional dismissal */}

            {!isMandatory && (
              <Pressable
                onPress={onLater}
                accessibilityRole="button"
                accessibilityLabel="Maybe later"
                className="mt-1 h-11 items-center justify-center"
              >
                <Text className="text-[13px] font-semibold text-[#718078]">
                  Maybe later
                </Text>
              </Pressable>
            )}

            {/* Mandatory footer */}

            {isMandatory && (
              <View className="mt-3 flex-row items-center justify-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={12}
                  color="#9AA59F"
                />

                <Text className="ml-1.5 text-[10px] text-[#8A9790]">
                  Updating is required to continue
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
