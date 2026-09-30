import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {
  deleteNotification,
  deleteReadNotifications,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notification.service";

import { Notification, NotificationType } from "../../types/notification";

const PAGE_SIZE = 10;

type ReadFilter = "all" | "unread";

type TypeFilter = "all" | NotificationType;

const TYPE_FILTERS: Array<{
  key: TypeFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    key: "all",
    label: "All",
    icon: "grid-outline",
  },
  {
    key: "goal",
    label: "Goals",
    icon: "flag-outline",
  },
  {
    key: "progress",
    label: "Progress",
    icon: "trending-up-outline",
  },
  {
    key: "consultation",
    label: "Consultation",
    icon: "chatbubble-ellipses-outline",
  },
  {
    key: "yoga",
    label: "Yoga",
    icon: "body-outline",
  },
  {
    key: "ayurveda",
    label: "Ayurveda",
    icon: "leaf-outline",
  },
  {
    key: "general",
    label: "General",
    icon: "notifications-outline",
  },
  {
    key: "system",
    label: "System",
    icon: "settings-outline",
  },
];

const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    iconBg: string;
    label: string;
  }
> = {
  goal: {
    icon: "flag-outline",
    color: "#4D6A50",
    iconBg: "bg-[#E7F0E5]",
    label: "Goal",
  },

  progress: {
    icon: "trending-up-outline",
    color: "#58748B",
    iconBg: "bg-[#EDF3F7]",
    label: "Progress",
  },

  consultation: {
    icon: "chatbubble-ellipses-outline",
    color: "#9A7A42",
    iconBg: "bg-[#F7F1E5]",
    label: "Consultation",
  },

  yoga: {
    icon: "body-outline",
    color: "#4D6A50",
    iconBg: "bg-[#E7F0E5]",
    label: "Yoga",
  },

  ayurveda: {
    icon: "leaf-outline",
    color: "#4D6A50",
    iconBg: "bg-[#E7F0E5]",
    label: "Ayurveda",
  },

  general: {
    icon: "notifications-outline",
    color: "#58748B",
    iconBg: "bg-[#EDF3F7]",
    label: "General",
  },

  system: {
    icon: "settings-outline",
    color: "#65706A",
    iconBg: "bg-[#EEF1EF]",
    label: "System",
  },
};

const formatCount = (count: number) => {
  return count > 99 ? "99+" : String(count);
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const resolveNotificationRoute = (
  notification: Notification,
): string | null => {
  const action = notification.action;

  if (!action) {
    return null;
  }

  if (action.route && action.route.startsWith("/")) {
    return action.route;
  }

  const referenceId = action.referenceId;

  switch (action.type) {
    case "goal":
      return referenceId ? `/(main)/goals/${referenceId}` : "/(main)/goals";

    case "progress":
      return referenceId
        ? `/(main)/progress/${referenceId}`
        : "/(main)/progress";

    case "consultation":
      return referenceId
        ? `/(main)/consultation/${referenceId}`
        : "/(main)/consultation";

    case "yoga":
      return referenceId ? `/(main)/yoga/${referenceId}` : "/(main)/yoga";

    case "ayurveda":
      return referenceId
        ? `/(main)/ayurveda/${referenceId}`
        : "/(main)/ayurveda";

    case "dashboard":
      return "/(main)/home";

    case "none":
    default:
      return null;
  }
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [readFilter, setReadFilter] = useState<ReadFilter>("all");

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const [managementLoading, setManagementLoading] = useState(false);

  const setProcessing = (id: string, processing: boolean) => {
    setProcessingIds((previous) => {
      const next = new Set(previous);

      if (processing) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const loadNotifications = useCallback(
    async (targetPage: number, showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError(null);

        const result = await getNotifications({
          page: targetPage,
          limit: PAGE_SIZE,

          ...(typeFilter !== "all"
            ? {
                type: typeFilter,
              }
            : {}),

          ...(readFilter !== "all"
            ? {
                read: false,
              }
            : {}),
        });

        setNotifications(result.notifications);

        setPage(result.pagination.page);

        setTotalPages(Math.max(result.pagination.totalPages, 1));

        setTotalNotifications(result.pagination.total);
      } catch (err) {
        console.error("Failed to load notifications:", err);

        setError("We couldn't load your notifications. Please try again.");
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [readFilter, typeFilter],
  );

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();

      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  }, []);

  useEffect(() => {
    setPage(1);

    loadNotifications(1, true);
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  const refresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([loadNotifications(page, false), loadUnreadCount()]);
    } finally {
      setRefreshing(false);
    }
  };

  const reloadAfterMutation = async (targetPage: number = page) => {
    const result = await getNotifications({
      page: targetPage,
      limit: PAGE_SIZE,

      ...(typeFilter !== "all"
        ? {
            type: typeFilter,
          }
        : {}),

      ...(readFilter !== "all"
        ? {
            read: false,
          }
        : {}),
    });

    if (result.notifications.length === 0 && targetPage > 1) {
      const previousPage = targetPage - 1;

      const previousResult = await getNotifications({
        page: previousPage,
        limit: PAGE_SIZE,

        ...(typeFilter !== "all"
          ? {
              type: typeFilter,
            }
          : {}),

        ...(readFilter !== "all"
          ? {
              read: false,
            }
          : {}),
      });

      setNotifications(previousResult.notifications);

      setPage(previousResult.pagination.page);

      setTotalPages(Math.max(previousResult.pagination.totalPages, 1));

      setTotalNotifications(previousResult.pagination.total);

      return;
    }

    setNotifications(result.notifications);

    setPage(result.pagination.page);

    setTotalPages(Math.max(result.pagination.totalPages, 1));

    setTotalNotifications(result.pagination.total);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (processingIds.has(notification._id)) {
      return;
    }

    const route = resolveNotificationRoute(notification);

    if (!notification.isRead) {
      try {
        setProcessing(notification._id, true);

        await markNotificationAsRead(notification._id);

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : item,
          ),
        );

        setUnreadCount((previous) => Math.max(previous - 1, 0));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      } finally {
        setProcessing(notification._id, false);
      }
    }

    if (route) {
      router.push(route as any);
    }
  };

  const handleDeleteNotification = (notification: Notification) => {
    Alert.alert(
      "Delete notification",
      "Are you sure you want to remove this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              setProcessing(notification._id, true);

              await deleteNotification(notification._id);

              await reloadAfterMutation(
                notifications.length === 1 && page > 1 ? page - 1 : page,
              );

              await loadUnreadCount();
            } catch (err) {
              console.error("Failed to delete notification:", err);

              Alert.alert("Couldn't delete", "Please try again.");
            } finally {
              setProcessing(notification._id, false);
            }
          },
        },
      ],
    );
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || managementLoading) {
      return;
    }

    try {
      setManagementLoading(true);

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? new Date().toISOString(),
        })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);

      Alert.alert("Couldn't update notifications", "Please try again.");
    } finally {
      setManagementLoading(false);
    }
  };

  const handleDeleteRead = async () => {
    try {
      setManagementLoading(true);

      await deleteReadNotifications();

      await reloadAfterMutation(page);
      await loadUnreadCount();
    } catch (err) {
      console.error("Failed to delete read notifications:", err);

      Alert.alert("Couldn't clear notifications", "Please try again.");
    } finally {
      setManagementLoading(false);
    }
  };

  const openManagementMenu = () => {
    const buttons: Array<{
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress?: () => void;
    }> = [];

    if (unreadCount > 0) {
      buttons.push({
        text: "Mark all as read",
        onPress: handleMarkAllRead,
      });
    }

    buttons.push({
      text: "Delete read notifications",
      style: "destructive",
      onPress: () => {
        Alert.alert(
          "Delete read notifications",
          "This will permanently remove all notifications you have already read.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: handleDeleteRead,
            },
          ],
        );
      },
    });

    buttons.push({
      text: "Cancel",
      style: "cancel",
    });

    Alert.alert("Manage notifications", "Choose an action", buttons);
  };

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || loading) {
      return;
    }

    await loadNotifications(nextPage, true);
  };

  const handleRetry = () => {
    loadNotifications(page, true);
    loadUnreadCount();
  };

  const currentFilterLabel = useMemo(() => {
    return readFilter === "unread" ? "Unread updates" : "All notifications";
  }, [readFilter]);

  const emptyTitle =
    readFilter === "unread" ? "You're all caught up" : "No notifications yet";

  const emptyMessage =
    readFilter === "unread"
      ? "There are no unread updates waiting for you."
      : "Your wellness updates, goals and reminders will appear here.";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F5F7F4]">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F4" />

      <View className="flex-1">
        {/* ───────────────── HEADER ───────────────── */}

        <View className="flex-row items-center px-5 pb-3 pt-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E4E8E3] bg-white"
          >
            <Ionicons name="chevron-back" size={21} color="#202722" />
          </Pressable>

          <View className="ml-4 flex-1">
            <Text className="text-[22px] font-extrabold tracking-[-0.4px] text-[#202722]">
              Notifications
            </Text>

            <Text className="mt-0.5 text-[12px] font-medium text-[#7A837C]">
              {unreadCount > 0
                ? `${formatCount(unreadCount)} unread update${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You're all caught up"}
            </Text>
          </View>

          <Pressable
            onPress={openManagementMenu}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E4E8E3] bg-white"
          >
            <Ionicons name="ellipsis-horizontal" size={21} color="#202722" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: Math.max(insets.bottom + 28, 36),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#4D6A50"
              colors={["#4D6A50"]}
            />
          }
        >
          {/* ───────────────── HERO ───────────────── */}

          <View className="relative mt-3 overflow-hidden rounded-[26px] bg-[#E7F0E5]">
            {/* Subtle background detail */}
            <View className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#D5E5D3]" />

            <View className="absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-[#DCE9DA]" />

            <View className="relative px-5 pb-5 pt-5">
              {/* Eyebrow */}
              <View className="flex-row items-center">
                <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#D4E4D2]">
                  <Ionicons
                    name="notifications-outline"
                    size={14}
                    color="#4D6A50"
                  />
                </View>

                <Text className="ml-2 text-[9px] font-extrabold uppercase tracking-[1.1px] text-[#5F7562]">
                  Wellness centre
                </Text>
              </View>

              {/* Main hero content */}
              <View className="mt-4 flex-row items-end">
                <View className="flex-1 pr-5">
                  <Text className="text-[23px] font-extrabold leading-[28px] tracking-[-0.5px] text-[#304A36]">
                    Stay on top of
                    {"\n"}
                    your wellness.
                  </Text>

                  <Text className="mt-2.5 text-[11px] leading-[17px] text-[#687B6B]">
                    Keep track of important updates, progress and moments from
                    your wellness journey.
                  </Text>
                </View>

                {/* Unread counter */}
                <View className="items-center">
                  <Text className="text-[36px] font-extrabold leading-[40px] tracking-[-1px] text-[#304A36]">
                    {formatCount(unreadCount)}
                  </Text>

                  <Text className="mt-1 text-[8px] font-extrabold uppercase tracking-[1px] text-[#708472]">
                    unread
                  </Text>
                </View>
              </View>

              {/* CTA */}
              {unreadCount > 0 && (
                <Pressable
                  onPress={handleMarkAllRead}
                  disabled={managementLoading}
                  className="mt-5 h-[46px] flex-row items-center justify-center rounded-[15px] bg-[#304A36]"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.88 : 1,
                  })}
                >
                  {managementLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-done-outline"
                        size={17}
                        color="#FFFFFF"
                      />

                      <Text className="ml-2 text-[12px] font-extrabold text-white">
                        Mark all as read
                      </Text>

                      <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-white/15">
                        <Ionicons
                          name="arrow-forward"
                          size={11}
                          color="#FFFFFF"
                        />
                      </View>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          </View>

          {/* ───────────────── READ FILTER ───────────────── */}

          <View className="mt-5 flex-row rounded-[18px] border border-[#E4E8E3] bg-[#EEF2ED] p-1">
            <Pressable
              onPress={() => setReadFilter("all")}
              className={`flex-1 flex-row items-center justify-center rounded-[14px] py-3 ${
                readFilter === "all" ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-[12px] font-extrabold ${
                  readFilter === "all" ? "text-[#304A36]" : "text-[#7A837C]"
                }`}
              >
                All
              </Text>

              {readFilter === "all" && (
                <View className="ml-2 rounded-full bg-[#E7F0E5] px-2 py-0.5">
                  <Text className="text-[9px] font-extrabold text-[#4D6A50]">
                    {totalNotifications}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setReadFilter("unread")}
              className={`flex-1 flex-row items-center justify-center rounded-[14px] py-3 ${
                readFilter === "unread" ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-[12px] font-extrabold ${
                  readFilter === "unread" ? "text-[#304A36]" : "text-[#7A837C]"
                }`}
              >
                Unread
              </Text>

              {unreadCount > 0 && (
                <View className="ml-2 min-w-[20px] items-center rounded-full bg-[#4D6A50] px-1.5 py-0.5">
                  <Text className="text-[9px] font-extrabold text-white">
                    {formatCount(unreadCount)}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* ───────────────── CATEGORY ───────────────── */}

          <View className="mt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[13px] font-extrabold text-[#202722]">
                Browse by category
              </Text>

              <Ionicons name="options-outline" size={17} color="#929A93" />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 18,
              }}
            >
              {TYPE_FILTERS.map((filter) => {
                const active = typeFilter === filter.key;

                return (
                  <Pressable
                    key={filter.key}
                    onPress={() => setTypeFilter(filter.key)}
                    className={`mr-2.5 flex-row items-center rounded-2xl border px-3.5 py-2.5 ${
                      active
                        ? "border-[#4D6A50] bg-[#4D6A50]"
                        : "border-[#E4E8E3] bg-white"
                    }`}
                  >
                    <Ionicons
                      name={filter.icon}
                      size={14}
                      color={active ? "#FFFFFF" : "#687169"}
                    />

                    <Text
                      className={`ml-1.5 text-[11px] font-bold ${
                        active ? "text-white" : "text-[#687169]"
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* ───────────────── SECTION TITLE ───────────────── */}

          <View className="mb-3 mt-6 flex-row items-end justify-between">
            <View>
              <Text className="text-[18px] font-extrabold tracking-[-0.2px] text-[#202722]">
                {currentFilterLabel}
              </Text>

              {!loading && (
                <Text className="mt-1 text-[11px] font-medium text-[#929A93]">
                  {totalNotifications === 1
                    ? "1 notification"
                    : `${totalNotifications} notifications`}
                </Text>
              )}
            </View>

            {managementLoading && (
              <ActivityIndicator size="small" color="#4D6A50" />
            )}
          </View>

          {/* ───────────────── LOADING ───────────────── */}

          {loading ? (
            <View className="mt-2 items-center rounded-[24px] border border-[#E4E8E3] bg-white px-6 py-16">
              <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-[#E7F0E5]">
                <ActivityIndicator size="small" color="#4D6A50" />
              </View>

              <Text className="mt-4 text-[15px] font-extrabold text-[#202722]">
                Loading your updates
              </Text>

              <Text className="mt-1 text-[11px] font-medium text-[#929A93]">
                Just a moment...
              </Text>
            </View>
          ) : error ? (
            /* ───────────────── ERROR ───────────────── */

            <View className="mt-2 items-center rounded-[24px] border border-[#E4E8E3] bg-white px-7 py-14">
              <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-[#F9ECEA]">
                <Ionicons
                  name="cloud-offline-outline"
                  size={28}
                  color="#A75F56"
                />
              </View>

              <Text className="mt-5 text-center text-[17px] font-extrabold text-[#202722]">
                Something went wrong
              </Text>

              <Text className="mt-2 text-center text-[12px] leading-[18px] text-[#687169]">
                {error}
              </Text>

              <Pressable
                onPress={handleRetry}
                className="mt-5 flex-row items-center rounded-2xl bg-[#4D6A50] px-5 py-3"
              >
                <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />

                <Text className="ml-2 text-[12px] font-extrabold text-white">
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : notifications.length === 0 ? (
            /* ───────────────── EMPTY ───────────────── */

            <View className="mt-2 items-center rounded-[24px] border border-[#E4E8E3] bg-white px-7 py-16">
              <View className="h-20 w-20 items-center justify-center rounded-[28px] bg-[#E7F0E5]">
                <Ionicons
                  name={
                    readFilter === "unread"
                      ? "checkmark-done-outline"
                      : "notifications-outline"
                  }
                  size={34}
                  color="#4D6A50"
                />
              </View>

              <Text className="mt-5 text-center text-[18px] font-extrabold text-[#202722]">
                {emptyTitle}
              </Text>

              <Text className="mt-2 max-w-[280px] text-center text-[12px] leading-[19px] text-[#687169]">
                {emptyMessage}
              </Text>
            </View>
          ) : (
            <>
              {/* ───────────────── NOTIFICATION CARDS ───────────────── */}

              <View>
                {notifications.map((notification, index) => {
                  const config = TYPE_CONFIG[notification.type];

                  const processing = processingIds.has(notification._id);

                  const route = resolveNotificationRoute(notification);

                  return (
                    <View
                      key={notification._id}
                      className={`mb-3 overflow-hidden rounded-[22px] border bg-white ${
                        notification.isRead
                          ? "border-[#E4E8E3]"
                          : "border-[#CFE0CC]"
                      }`}
                    >
                      {/* Unread top accent */}

                      {!notification.isRead && (
                        <View className="h-[3px] w-full bg-[#4D6A50]" />
                      )}

                      <Pressable
                        onPress={() => handleNotificationPress(notification)}
                        disabled={processing}
                        className="p-4"
                      >
                        <View className="flex-row">
                          {/* Icon */}

                          <View
                            className={`h-12 w-12 items-center justify-center rounded-[17px] ${config.iconBg}`}
                          >
                            <Ionicons
                              name={config.icon}
                              size={21}
                              color={config.color}
                            />
                          </View>

                          {/* Main */}

                          <View className="ml-3 flex-1">
                            <View className="flex-row items-start">
                              <View className="flex-1 pr-2">
                                <Text
                                  numberOfLines={2}
                                  className={`text-[14px] leading-[19px] ${
                                    notification.isRead
                                      ? "font-bold text-[#303832]"
                                      : "font-extrabold text-[#202722]"
                                  }`}
                                >
                                  {notification.title}
                                </Text>
                              </View>

                              <Text className="text-[10px] font-semibold text-[#A0A7A1]">
                                {formatRelativeTime(notification.createdAt)}
                              </Text>
                            </View>

                            <View className="mt-1.5 flex-row items-center">
                              <Text className="text-[9px] font-extrabold uppercase tracking-[0.7px] text-[#4D6A50]">
                                {config.label}
                              </Text>

                              {!notification.isRead && (
                                <View className="ml-2 h-1.5 w-1.5 rounded-full bg-[#4D6A50]" />
                              )}
                            </View>

                            <Text
                              numberOfLines={3}
                              className="mt-2 text-[12px] leading-[18px] text-[#687169]"
                            >
                              {notification.message}
                            </Text>
                          </View>

                          {/* Chevron */}

                          <View className="ml-1 justify-center">
                            {processing ? (
                              <ActivityIndicator size="small" color="#4D6A50" />
                            ) : (
                              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F5F7F4]">
                                <Ionicons
                                  name="chevron-forward"
                                  size={15}
                                  color="#929A93"
                                />
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Action */}

                        {route && (
                          <View className="mt-4 flex-row items-center rounded-[14px] bg-[#F8FAF7] px-3 py-2.5">
                            <Ionicons
                              name="arrow-forward-circle-outline"
                              size={16}
                              color="#4D6A50"
                            />

                            <Text className="ml-2 flex-1 text-[11px] font-bold text-[#4D6A50]">
                              View details
                            </Text>

                            <Ionicons
                              name="chevron-forward"
                              size={13}
                              color="#4D6A50"
                            />
                          </View>
                        )}
                      </Pressable>

                      {/* Footer */}

                      <View className="flex-row items-center justify-between border-t border-[#EEF1ED] px-4 py-2.5">
                        <View className="flex-row items-center">
                          <View
                            className={`mr-2 h-1.5 w-1.5 rounded-full ${
                              notification.isRead
                                ? "bg-[#A3AAA4]"
                                : "bg-[#4D6A50]"
                            }`}
                          />

                          <Text className="text-[10px] font-semibold text-[#929A93]">
                            {notification.isRead ? "Read" : "Unread"}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => handleDeleteNotification(notification)}
                          disabled={processing}
                          hitSlop={10}
                          className="h-8 w-8 items-center justify-center rounded-full"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={15}
                            color="#A0A7A1"
                          />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* ───────────────── PAGINATION ───────────────── */}

              {totalPages > 1 && (
                <View className="mt-2 flex-row items-center justify-center">
                  <Pressable
                    onPress={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loading}
                    className={`h-11 w-11 items-center justify-center rounded-2xl border border-[#E4E8E3] bg-white ${
                      page <= 1 ? "opacity-40" : ""
                    }`}
                  >
                    <Ionicons name="chevron-back" size={18} color="#202722" />
                  </Pressable>

                  <View className="mx-3 min-w-[112px] items-center rounded-2xl bg-[#E7F0E5] px-4 py-3">
                    <Text className="text-[11px] font-extrabold text-[#304A36]">
                      Page {page} of {totalPages}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || loading}
                    className={`h-11 w-11 items-center justify-center rounded-2xl border border-[#E4E8E3] bg-white ${
                      page >= totalPages ? "opacity-40" : ""
                    }`}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#202722"
                    />
                  </Pressable>
                </View>
              )}

              {/* ───────────────── FOOTER MESSAGE ───────────────── */}

              <View className="mt-6 flex-row items-center justify-center px-5">
                <Ionicons name="leaf-outline" size={15} color="#4D6A50" />

                <Text className="ml-2 flex-1 text-center text-[10px] leading-[16px] text-[#929A93]">
                  Small updates can make a big difference to your wellness
                  journey.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
