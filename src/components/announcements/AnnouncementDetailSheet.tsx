"use client";

import { useEffect, useMemo, useRef } from "react";

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Info,
  Link2,
  Megaphone,
  X,
} from "lucide-react-native";

import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { Announcement } from "@/types/announcement";

import AnnouncementTypeBadge from "./AnnouncementTypeBadge";

interface AnnouncementDetailSheetProps {
  announcement: Announcement | null;
  visible: boolean;
  onClose: () => void;
  onActionPress?: (route: string) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

function formatDate(value?: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value?: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const typeConfig = {
  info: {
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    accent: "#3B82F6",
  },

  success: {
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    accent: "#10B981",
  },

  warning: {
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    accent: "#F59E0B",
  },

  feature: {
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    accent: "#8B5CF6",
  },
};

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="min-w-0 flex-1">
      <View className="mb-1.5 flex-row items-center">
        {icon}

        <Text className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </Text>
      </View>

      <Text
        numberOfLines={3}
        className="text-sm font-semibold leading-5 text-slate-700"
      >
        {value}
      </Text>
    </View>
  );
}

export default function AnnouncementDetailSheet({
  announcement,
  visible,
  onClose,
  onActionPress,
}: AnnouncementDetailSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const currentTranslateY = useRef(SCREEN_HEIGHT);

  const config = typeConfig[announcement?.type ?? "info"] ?? typeConfig.info;

  useEffect(() => {
    const listener = translateY.addListener(({ value }) => {
      currentTranslateY.current = value;
    });

    return () => {
      translateY.removeListener(listener);
    };
  }, [translateY]);

  useEffect(() => {
    if (!visible || !announcement) {
      return;
    }

    translateY.setValue(SCREEN_HEIGHT);
    backdropOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 180,
        mass: 0.8,
      }),

      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, announcement, translateY, backdropOpacity]);

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),

      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx);
        },

        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            translateY.setValue(gesture.dy);
          }
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 120 || gesture.vy > 1.2) {
            closeSheet();
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 22,
            stiffness: 180,
            mass: 0.8,
          }).start();
        },

        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [translateY],
  );

  if (!announcement) {
    return null;
  }

  const actionEnabled =
    Boolean(announcement.action?.enabled) &&
    Boolean(announcement.action?.route);

  const createdDate = formatShortDate(announcement.createdAt);

  const updatedDate = formatShortDate(announcement.updatedAt);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSheet}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            inset: 0,
            opacity: backdropOpacity,
          }}
        >
          <Pressable className="flex-1 bg-slate-950/60" onPress={closeSheet} />
        </Animated.View>

        {/* Bottom sheet */}
        <Animated.View
          style={{
            maxHeight: SCREEN_HEIGHT * 0.92,
            transform: [
              {
                translateY,
              },
            ],
          }}
          className="
            overflow-hidden
            rounded-t-[30px]
            bg-slate-50
          "
        >
          {/* Drag area */}
          <View
            {...panResponder.panHandlers}
            className="
              items-center
              bg-white
              pb-3
              pt-3
            "
          >
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          {/* Header */}
          <View className="border-b border-slate-100 bg-white px-5 pb-4">
            <View className="flex-row items-start">
              {/* Icon */}
              <View
                style={{
                  backgroundColor: config.iconBg,
                }}
                className="
                  mr-3
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                "
              >
                <Megaphone size={21} color={config.iconColor} />
              </View>

              {/* Header content */}
              <View className="min-w-0 flex-1">
                <View className="flex-row flex-wrap items-center">
                  <AnnouncementTypeBadge type={announcement.type} compact />
                </View>

                <Text
                  numberOfLines={3}
                  className="
                    mt-2
                    pr-2
                    text-lg
                    font-bold
                    leading-6
                    text-slate-950
                  "
                >
                  {announcement.title}
                </Text>
              </View>

              {/* Close */}
              <Pressable
                onPress={closeSheet}
                accessibilityRole="button"
                accessibilityLabel="Close announcement"
                className="
                  ml-2
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                "
              >
                <X size={17} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 28,
            }}
            nestedScrollEnabled
          >
            {/* Official announcement */}
            <View
              className="
                flex-row
                items-center
                rounded-xl
                border
                border-emerald-100
                bg-emerald-50
                px-3.5
                py-3
              "
            >
              <CheckCircle2 size={16} color="#059669" />

              <Text className="ml-2 flex-1 text-xs font-semibold text-emerald-700">
                Official Niramaya announcement
              </Text>
            </View>

            {/* Message */}
            <View
              className="
                mt-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >
              <View className="mb-3 flex-row items-center">
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                  <Megaphone size={15} color="#64748B" />
                </View>

                <View className="ml-2.5">
                  <Text className="text-sm font-bold text-slate-800">
                    Announcement
                  </Text>

                  <Text className="text-[11px] text-slate-400">
                    Message from Niramaya
                  </Text>
                </View>
              </View>

              <Text className="text-sm leading-6 text-slate-600">
                {announcement.message}
              </Text>
            </View>

            {/* Details */}
            <View
              className="
                mt-3
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
              "
            >
              <View className="border-b border-slate-100 px-4 py-4">
                <View className="flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <Info size={15} color="#2563EB" />
                  </View>

                  <View className="ml-2.5">
                    <Text className="text-sm font-bold text-slate-800">
                      Announcement details
                    </Text>

                    <Text className="text-[11px] text-slate-400">
                      Availability and record information
                    </Text>
                  </View>
                </View>
              </View>

              <View className="p-4">
                <View className="flex-row gap-5">
                  <DetailItem
                    label="Start date"
                    value={formatDate(announcement.startDate)}
                    icon={<CalendarDays size={13} color="#94A3B8" />}
                  />

                  <DetailItem
                    label="End date"
                    value={formatDate(announcement.endDate)}
                    icon={<CalendarDays size={13} color="#94A3B8" />}
                  />
                </View>

                <View className="my-4 h-px bg-slate-100" />

                <View className="flex-row gap-5">
                  <DetailItem
                    label="Added"
                    value={createdDate}
                    icon={<Clock3 size={13} color="#94A3B8" />}
                  />

                  <DetailItem
                    label="Updated"
                    value={updatedDate}
                    icon={<Clock3 size={13} color="#94A3B8" />}
                  />
                </View>
              </View>
            </View>

            {/* Action */}
            {actionEnabled ? (
              <View
                className="
                  mt-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                "
              >
                <View className="flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                    <ExternalLink size={15} color="#7C3AED" />
                  </View>

                  <View className="ml-2.5 flex-1">
                    <Text className="text-sm font-bold text-slate-800">
                      Quick action
                    </Text>

                    <Text className="text-[11px] text-slate-400">
                      Continue to the related Niramaya feature
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    if (announcement.action?.route && onActionPress) {
                      onActionPress(announcement.action.route);
                    }
                  }}
                  className="
                    mt-4
                    flex-row
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-900
                    px-4
                    py-3.5
                  "
                >
                  <Link2 size={16} color="#FFFFFF" />

                  <Text className="ml-2 text-sm font-bold text-white">
                    {announcement.action?.label || "Open"}
                  </Text>

                  <ChevronRight
                    size={16}
                    color="#FFFFFF"
                    style={{
                      marginLeft: 6,
                    }}
                  />
                </Pressable>
              </View>
            ) : null}

            {/* Footer status */}
            <View className="mt-4 flex-row items-center justify-center">
              <CheckCircle2 size={13} color="#10B981" />

              <Text className="ml-1.5 text-[11px] font-medium text-slate-400">
                This announcement is currently active
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
