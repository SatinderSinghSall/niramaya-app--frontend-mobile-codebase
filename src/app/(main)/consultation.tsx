import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getConsultations } from "../../services/consultation.service";
import type { Consultation } from "../../types/consultation";

/* ============================================================================
   TYPES
============================================================================ */

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type StatusTheme = {
  badge: string;
  badgeText: string;
};

type ConsultationStats = {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
};

type ConsultationFilter = "all" | "active" | "completed" | "cancelled";

/* ============================================================================
   CONSTANTS
============================================================================ */

const ACTIVE_STATUSES: Consultation["status"][] = [
  "requested",
  "confirmed",
  "rescheduled",
];

const STATUS_THEMES: Record<Consultation["status"], StatusTheme> = {
  requested: {
    badge: "bg-[#EEF3F7]",
    badgeText: "text-[#55738D]",
  },
  confirmed: {
    badge: "bg-[#E8F0E7]",
    badgeText: "text-[#4D6A50]",
  },
  rescheduled: {
    badge: "bg-[#F5F0E4]",
    badgeText: "text-[#8B7443]",
  },
  completed: {
    badge: "bg-[#EEF1EF]",
    badgeText: "text-[#68736B]",
  },
  cancelled: {
    badge: "bg-[#F8ECEA]",
    badgeText: "text-[#A85E55]",
  },
};

/* ============================================================================
   HELPERS
============================================================================ */

function getStatusLabel(status: Consultation["status"]) {
  switch (status) {
    case "requested":
      return "Requested";
    case "confirmed":
      return "Confirmed";
    case "rescheduled":
      return "Rescheduled";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusTheme(status: Consultation["status"]) {
  return STATUS_THEMES[status] ?? STATUS_THEMES.requested;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function getErrorMessage(error: any) {
  const status = error?.response?.status;

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You are not authorised to view your consultations.";
  }

  if (status === 404) {
    return "The consultation service could not be found.";
  }

  if (status >= 500) {
    return "Something went wrong on the server.";
  }

  if (
    !error?.response &&
    typeof error?.message === "string" &&
    error.message.toLowerCase().includes("network")
  ) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to load consultations."
  );
}

function parseTimeToMinutes(value: string) {
  const time = String(value || "")
    .trim()
    .toUpperCase();
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);

  if (!match) {
    return 0;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const period = match[3];

  if (period === "PM" && hour < 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

function getAppointmentTimestamp(item: Consultation) {
  const date = new Date(item.preferredDate);

  if (Number.isNaN(date.getTime())) {
    return Number.MAX_SAFE_INTEGER;
  }

  const minutes = parseTimeToMinutes(item.preferredTime);

  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return date.getTime();
}

function getConsultationTitle(consultation: Consultation) {
  return consultation.consultationType === "online"
    ? "Online consultation"
    : "Offline consultation";
}

/* ============================================================================
   REUSABLE UI
============================================================================ */

function StatusBadge({
  status,
  compact = false,
}: {
  status: Consultation["status"];
  compact?: boolean;
}) {
  const theme = getStatusTheme(status);

  return (
    <View
      className={[
        "self-start rounded-full",
        compact ? "px-2 py-1" : "px-2.5 py-1.5",
        theme.badge,
      ].join(" ")}
    >
      <Text
        className={[
          compact ? "text-[8px]" : "text-[9px]",
          "font-bold",
          theme.badgeText,
        ].join(" ")}
        numberOfLines={1}
      >
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

function ConsultationTypeIcon({
  type,
  size = 18,
}: {
  type: Consultation["consultationType"];
  size?: number;
}) {
  const online = type === "online";

  return (
    <View
      className={[
        "h-11 w-11 items-center justify-center rounded-2xl",
        online ? "bg-[#E8F0E7]" : "bg-[#EDF2F6]",
      ].join(" ")}
    >
      <Ionicons
        name={online ? "videocam-outline" : "location-outline"}
        size={size}
        color={online ? "#4D6A50" : "#55738D"}
      />
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="min-w-0 flex-1 pr-3">
        <Text className="text-[17px] font-extrabold text-[#222A25]">
          {title}
        </Text>

        {subtitle ? (
          <Text className="mt-1 text-[10px] leading-4 text-[#8E978F]">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={10}
          className="mb-0.5 rounded-full px-1 py-1"
        >
          <Text className="text-[10px] font-bold text-[#4D6A50]">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StatCard({
  icon,
  iconBackground,
  iconColor,
  value,
  label,
  helper,
}: {
  icon: IconName;
  iconBackground: string;
  iconColor: string;
  value: number;
  label: string;
  helper: string;
}) {
  return (
    <View className="min-h-[126px] flex-1 rounded-[20px] border border-[#DEE4DE] bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBackground }}
        >
          <Ionicons name={icon} size={17} color={iconColor} />
        </View>

        <Text className="text-[23px] font-extrabold text-[#222A25]">
          {value}
        </Text>
      </View>

      <Text className="mt-4 text-[10px] font-bold text-[#68736B]">{label}</Text>

      <Text className="mt-1 text-[8px] leading-3 text-[#8E978F]">{helper}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  variant,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  variant: "primary" | "light";
  onPress: () => void;
}) {
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      className={[
        "min-h-[142px] flex-1 rounded-[20px] border p-4",
        primary ? "border-[#304A36] bg-[#4D6A50]" : "border-[#DEE4DE] bg-white",
      ].join(" ")}
      style={({ pressed }) => ({
        opacity: pressed ? 0.84 : 1,
      })}
    >
      <View className="flex-row items-center justify-between">
        <View
          className={[
            "h-10 w-10 items-center justify-center rounded-full",
            primary ? "bg-white/15" : "bg-[#E8F0E7]",
          ].join(" ")}
        >
          <Ionicons
            name={icon}
            size={19}
            color={primary ? "#FFFFFF" : "#4D6A50"}
          />
        </View>

        <Ionicons
          name="arrow-forward"
          size={15}
          color={primary ? "#DCE8DD" : "#8E978F"}
        />
      </View>

      <Text
        className={[
          "mt-5 text-[11px] font-extrabold",
          primary ? "text-white" : "text-[#222A25]",
        ].join(" ")}
      >
        {title}
      </Text>

      <Text
        className={[
          "mt-1 text-[9px] leading-3.5",
          primary ? "text-[#E5EEE6]" : "text-[#68736B]",
        ].join(" ")}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function RecentConsultationRow({
  consultation,
  isLast,
  onPress,
}: {
  consultation: Consultation;
  isLast: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "min-h-[82px] flex-row items-center px-4 py-3",
        !isLast ? "border-b border-[#E5E9E5]" : "",
      ].join(" ")}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#F8FAF7" : "#FFFFFF",
      })}
    >
      <ConsultationTypeIcon type={consultation.consultationType} size={16} />

      <View className="ml-3 min-w-0 flex-1">
        <View className="flex-row items-center">
          <Text
            className="mr-2 min-w-0 flex-1 text-[11px] font-bold text-[#222A25]"
            numberOfLines={1}
          >
            {getConsultationTitle(consultation)}
          </Text>

          <StatusBadge status={consultation.status} compact />
        </View>

        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="calendar-outline" size={10} color="#8E978F" />

          <Text className="ml-1 text-[8px] text-[#68736B]">
            {formatShortDate(consultation.preferredDate)}
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-[#CDD6CE]" />

          <Ionicons name="time-outline" size={10} color="#8E978F" />

          <Text className="ml-1 text-[8px] text-[#68736B]">
            {consultation.preferredTime}
          </Text>
        </View>

        {consultation.concern ? (
          <Text className="mt-1 text-[8px] text-[#8E978F]" numberOfLines={1}>
            {consultation.concern}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={15}
        color="#8E978F"
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );
}

/* ============================================================================
   SEARCH + FILTERS
============================================================================ */

function SearchBar({
  value,
  onChangeText,
  disabled,
}: {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View className="mt-5 h-[48px] flex-row items-center rounded-[14px] border border-[#DEE4DE] bg-white px-3.5">
      <Ionicons name="search-outline" size={17} color="#7F8981" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        placeholder="Search consultations"
        placeholderTextColor="#A1A8A1"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor="#4D6A50"
        className="ml-2.5 flex-1 text-[11px] text-[#222A25]"
      />

      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          className="h-7 w-7 items-center justify-center rounded-full bg-[#F0F3EF]"
        >
          <Ionicons name="close" size={13} color="#68736B" />
        </Pressable>
      ) : null}
    </View>
  );
}

function FilterChip({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "mr-2 h-[34px] flex-row items-center rounded-full border px-3",
        selected
          ? "border-[#4D6A50] bg-[#4D6A50]"
          : "border-[#DEE4DE] bg-white",
      ].join(" ")}
      style={({ pressed }) => ({
        opacity: pressed ? 0.78 : 1,
      })}
    >
      <Text
        className={[
          "text-[9px] font-extrabold",
          selected ? "text-white" : "text-[#68736B]",
        ].join(" ")}
      >
        {label}
      </Text>

      <View
        className={[
          "ml-1.5 min-w-[18px] items-center rounded-full px-1.5 py-0.5",
          selected ? "bg-white/20" : "bg-[#F0F3EF]",
        ].join(" ")}
      >
        <Text
          className={[
            "text-[8px] font-bold",
            selected ? "text-white" : "text-[#7F8981]",
          ].join(" ")}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function ConsultationSkeleton() {
  return (
    <View className="mt-6">
      <View className="h-4 w-40 rounded-full bg-[#E3E8E3]" />
      <View className="mt-2 h-3 w-56 rounded-full bg-[#E9EDE9]" />

      <View className="mt-4 rounded-[22px] border border-[#E2E7E2] bg-white p-4">
        <View className="flex-row items-center">
          <View className="h-11 w-11 rounded-2xl bg-[#E6EBE6]" />
          <View className="ml-3 flex-1">
            <View className="h-3 w-36 rounded-full bg-[#E3E8E3]" />
            <View className="mt-2 h-2.5 w-24 rounded-full bg-[#EAEDE9]" />
          </View>
          <View className="h-6 w-20 rounded-full bg-[#E9EDE9]" />
        </View>

        <View className="mt-4 h-16 rounded-2xl bg-[#F1F4F0]" />
      </View>

      <View className="mt-7 h-4 w-32 rounded-full bg-[#E3E8E3]" />
      <View className="mt-3 flex-row">
        <View className="h-[126px] flex-1 rounded-[20px] bg-[#E3E8E3]" />
        <View className="ml-2.5 h-[126px] flex-1 rounded-[20px] bg-[#E3E8E3]" />
      </View>

      <View className="mt-2.5 h-16 rounded-[18px] bg-[#E3E8E3]" />
    </View>
  );
}

/* ============================================================================
   MAIN DASHBOARD
============================================================================ */

export default function ConsultationScreen() {
  const insets = useSafeAreaInsets();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<ConsultationFilter>("all");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const params = useLocalSearchParams<{
    submittedId?: string | string[];
  }>();

  const submittedId = Array.isArray(params.submittedId)
    ? params.submittedId[0]
    : params.submittedId;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedConsultationId, setSubmittedConsultationId] = useState<
    string | null
  >(null);

  const loadConsultations = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await getConsultations({
        page: 1,
        limit: 20,
      });

      setConsultations(
        Array.isArray(response?.consultations) ? response.consultations : [],
      );
    } catch (err: any) {
      console.log("CONSULTATION DASHBOARD ERROR", {
        status: err?.response?.status,
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        message: err?.message,
        response: err?.response?.data,
      });

      setError(getErrorMessage(err));
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConsultations(true);
    }, [loadConsultations]),
  );

  useEffect(() => {
    if (!submittedId) {
      return;
    }

    // Wait until consultation data has finished loading.
    if (loading) {
      return;
    }

    setSubmittedConsultationId(submittedId);
    setShowSuccessModal(true);
  }, [submittedId, loading]);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSubmittedConsultationId(null);

    router.setParams({
      submittedId: undefined,
    });
  };

  const reviewSubmittedConsultation = () => {
    if (!submittedConsultationId) {
      return;
    }

    const id = submittedConsultationId;

    setShowSuccessModal(false);
    setSubmittedConsultationId(null);

    router.setParams({
      submittedId: undefined,
    });

    router.push(`/(main)/consultation/${id}` as any);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadConsultations(false);
    } finally {
      setRefreshing(false);
    }
  };

  const openBooking = () => {
    router.push("/(main)/consultation-book" as any);
  };

  const openHistory = () => {
    router.push("/(main)/consultation-history" as any);
  };

  const openConsultation = (id: string) => {
    router.push(`/(main)/consultation/${id}` as any);
  };

  const stats = useMemo<ConsultationStats>(() => {
    return {
      total: consultations.length,
      active: consultations.filter((item) =>
        ACTIVE_STATUSES.includes(item.status),
      ).length,
      completed: consultations.filter((item) => item.status === "completed")
        .length,
      cancelled: consultations.filter((item) => item.status === "cancelled")
        .length,
    };
  }, [consultations]);

  const filteredConsultations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return consultations.filter((item) => {
      const matchesStatus =
        selectedFilter === "all" ||
        (selectedFilter === "active" &&
          ACTIVE_STATUSES.includes(item.status)) ||
        (selectedFilter === "completed" && item.status === "completed") ||
        (selectedFilter === "cancelled" && item.status === "cancelled");

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        getConsultationTitle(item),
        getStatusLabel(item.status),
        item.consultationType,
        item.preferredDate,
        item.preferredTime,
        item.concern ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [consultations, searchQuery, selectedFilter]);

  const upcomingConsultation = useMemo(() => {
    return (
      consultations
        .filter((item) => ACTIVE_STATUSES.includes(item.status))
        .sort(
          (a, b) => getAppointmentTimestamp(a) - getAppointmentTimestamp(b),
        )[0] ?? null
    );
  }, [consultations]);

  return (
    <View className="flex-1 bg-[#F5F7F4]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7F4"
        translucent={Platform.OS === "android"}
      />

      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1 bg-[#F5F7F4]"
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#4D6A50"
                colors={["#4D6A50"]}
              />
            }
            contentContainerStyle={{
              paddingHorizontal: 18,
              paddingTop: 8,
              paddingBottom:
                Platform.OS === "android"
                  ? Math.max(insets.bottom + keyboardHeight + 32, 48)
                  : Math.max(insets.bottom + 36, 48),
            }}
          >
            {/* ================================================================
              HEADER
          ================================================================ */}

            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={8}
                className="h-10 w-10 items-center justify-center rounded-full border border-[#DEE4DE] bg-white"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.72 : 1,
                })}
              >
                <Ionicons name="arrow-back" size={17} color="#344038" />
              </Pressable>

              <View className="ml-3 min-w-0 flex-1 pr-3">
                <Text className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#4D6A50]">
                  NIRAMAYA CARE
                </Text>

                <Text className="mt-1 text-[27px] font-extrabold leading-[32px] text-[#222A25]">
                  Consultations
                </Text>

                <Text className="mt-1 text-[10px] leading-[15px] text-[#68736B]">
                  Manage your appointments and consultation journey.
                </Text>
              </View>

              <Pressable
                onPress={openBooking}
                accessibilityRole="button"
                accessibilityLabel="Book consultation"
                className="h-11 w-11 items-center justify-center rounded-full border border-[#304A36] bg-[#4D6A50]"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.82 : 1,
                })}
              >
                <Ionicons name="add" size={23} color="#FFFFFF" />
              </Pressable>
            </View>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              disabled={loading}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingTop: 10,
                paddingBottom: 2,
              }}
            >
              <FilterChip
                label="All"
                count={stats.total}
                selected={selectedFilter === "all"}
                onPress={() => setSelectedFilter("all")}
              />
              <FilterChip
                label="Active"
                count={stats.active}
                selected={selectedFilter === "active"}
                onPress={() => setSelectedFilter("active")}
              />
              <FilterChip
                label="Completed"
                count={stats.completed}
                selected={selectedFilter === "completed"}
                onPress={() => setSelectedFilter("completed")}
              />
              <FilterChip
                label="Cancelled"
                count={stats.cancelled}
                selected={selectedFilter === "cancelled"}
                onPress={() => setSelectedFilter("cancelled")}
              />
            </ScrollView>

            {(searchQuery.trim() || selectedFilter !== "all") && !loading ? (
              <Text className="mt-2 text-[8.5px] text-[#8E978F]">
                Showing {filteredConsultations.length} of {consultations.length}{" "}
                consultations
              </Text>
            ) : null}

            {/* ================================================================
              ERROR
          ================================================================ */}

            {error ? (
              <View className="mt-4 flex-row items-center rounded-2xl border border-[#EBD9D5] bg-[#F8ECEA] p-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#A85E55"
                  />
                </View>

                <View className="ml-2.5 min-w-0 flex-1 pr-2">
                  <Text className="text-[10px] font-extrabold text-[#A85E55]">
                    Unable to load consultations
                  </Text>

                  <Text
                    className="mt-0.5 text-[9px] leading-[13px] text-[#A85E55]"
                    numberOfLines={2}
                  >
                    {error}
                  </Text>
                </View>

                <Pressable
                  onPress={() => loadConsultations(true)}
                  hitSlop={10}
                  className="rounded-full bg-white px-2 py-1.5"
                >
                  <Text className="text-[9px] font-extrabold text-[#A85E55]">
                    Retry
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* ================================================================
              LOADING
          ================================================================ */}

            {loading ? (
              <ConsultationSkeleton />
            ) : (
              <>
                {/* ============================================================
                  NEXT APPOINTMENT
              ============================================================ */}

                <View className="mt-7">
                  <SectionHeader
                    title="Your next appointment"
                    subtitle="Stay on top of your consultation"
                  />

                  {upcomingConsultation ? (
                    <Pressable
                      onPress={() => openConsultation(upcomingConsultation._id)}
                      className="overflow-hidden rounded-[22px] border border-[#DEE4DE] bg-white"
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.9 : 1,
                      })}
                    >
                      <View className="p-4">
                        <View className="flex-row items-center">
                          <ConsultationTypeIcon
                            type={upcomingConsultation.consultationType}
                            size={18}
                          />

                          <View className="ml-3 min-w-0 flex-1 pr-2">
                            <Text
                              className="text-[13px] font-extrabold text-[#222A25]"
                              numberOfLines={1}
                            >
                              {getConsultationTitle(upcomingConsultation)}
                            </Text>

                            <Text
                              className="mt-0.5 text-[9px] text-[#68736B]"
                              numberOfLines={1}
                            >
                              Ayurvedic consultation
                            </Text>
                          </View>

                          <StatusBadge status={upcomingConsultation.status} />
                        </View>

                        <View className="mt-4 flex-row rounded-2xl border border-[#EDF1EC] bg-[#F8FAF7] p-3">
                          <View className="min-w-0 flex-1">
                            <View className="flex-row items-center">
                              <Ionicons
                                name="calendar-outline"
                                size={13}
                                color="#4D6A50"
                              />

                              <Text className="ml-1.5 text-[7.5px] font-extrabold tracking-[0.8px] text-[#8E978F]">
                                DATE
                              </Text>
                            </View>

                            <Text
                              className="mt-1 text-[10.5px] font-extrabold text-[#222A25]"
                              numberOfLines={1}
                            >
                              {formatDate(upcomingConsultation.preferredDate)}
                            </Text>
                          </View>

                          <View className="mx-3 w-px bg-[#DEE4DE]" />

                          <View className="min-w-0 flex-1">
                            <View className="flex-row items-center">
                              <Ionicons
                                name="time-outline"
                                size={13}
                                color="#4D6A50"
                              />

                              <Text className="ml-1.5 text-[7.5px] font-extrabold tracking-[0.8px] text-[#8E978F]">
                                TIME
                              </Text>
                            </View>

                            <Text
                              className="mt-1 text-[10.5px] font-extrabold text-[#222A25]"
                              numberOfLines={1}
                            >
                              {upcomingConsultation.preferredTime}
                            </Text>
                          </View>
                        </View>

                        {upcomingConsultation.concern ? (
                          <View className="mt-3">
                            <Text className="text-[7.5px] font-extrabold tracking-[0.8px] text-[#8E978F]">
                              CONCERN
                            </Text>

                            <Text
                              className="mt-1 text-[9.5px] leading-[15px] text-[#68736B]"
                              numberOfLines={2}
                            >
                              {upcomingConsultation.concern}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View className="flex-row items-center justify-between border-t border-[#E5E9E5] px-4 py-3">
                        <Text className="text-[9.5px] font-extrabold text-[#4D6A50]">
                          View appointment details
                        </Text>

                        <Ionicons
                          name="arrow-forward"
                          size={15}
                          color="#4D6A50"
                        />
                      </View>
                    </Pressable>
                  ) : (
                    <View className="rounded-[22px] border border-[#DEE4DE] bg-white p-5">
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-[#E8F0E7]">
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="#4D6A50"
                        />
                      </View>

                      <Text className="mt-3 text-[13px] font-extrabold text-[#222A25]">
                        No upcoming appointment
                      </Text>

                      <Text className="mt-1 text-[9px] leading-[14px] text-[#68736B]">
                        You currently have no active consultation requests.
                      </Text>

                      <Pressable
                        onPress={openBooking}
                        className="mt-4 min-h-[38px] flex-row items-center self-start rounded-xl border border-[#304A36] bg-[#4D6A50] px-3.5"
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.82 : 1,
                        })}
                      >
                        <Ionicons name="add" size={15} color="#FFFFFF" />

                        <Text className="ml-1.5 text-[9px] font-extrabold text-white">
                          Book consultation
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                {/* ============================================================
                  OVERVIEW
              ============================================================ */}

                <View className="mt-7">
                  <SectionHeader
                    title="Your overview"
                    subtitle="A quick look at your consultation activity"
                  />

                  <View className="flex-row">
                    <StatCard
                      icon="documents-outline"
                      iconBackground="#E8F0E7"
                      iconColor="#4D6A50"
                      value={stats.total}
                      label="Total requests"
                      helper="All consultations"
                    />

                    <View className="ml-2.5 flex-1">
                      <StatCard
                        icon="calendar-outline"
                        iconBackground="#EDF2F6"
                        iconColor="#55738D"
                        value={stats.active}
                        label="Active"
                        helper="Pending or confirmed"
                      />
                    </View>
                  </View>

                  <View className="mt-2.5 min-h-[64px] flex-row items-center rounded-[18px] border border-[#DEE4DE] bg-white px-4 py-3">
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF1EF]">
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color="#68736B"
                      />
                    </View>

                    <View className="ml-3 min-w-0 flex-1">
                      <Text className="text-[10px] font-extrabold text-[#222A25]">
                        Completed consultations
                      </Text>

                      <Text className="mt-0.5 text-[8px] text-[#8E978F]">
                        Consultations you've completed
                      </Text>
                    </View>

                    <Text className="ml-2 text-[20px] font-extrabold text-[#222A25]">
                      {stats.completed}
                    </Text>
                  </View>
                </View>

                {/* ============================================================
                  QUICK ACTIONS
              ============================================================ */}

                <View className="mt-7">
                  <SectionHeader
                    title="What would you like to do?"
                    subtitle="Quick access to your consultation tools"
                  />

                  <View className="flex-row">
                    <QuickAction
                      icon="add"
                      title="New consultation"
                      subtitle="Book an appointment"
                      variant="primary"
                      onPress={openBooking}
                    />

                    <View className="ml-2.5 flex-1">
                      <QuickAction
                        icon="time-outline"
                        title="View history"
                        subtitle="See all your requests"
                        variant="light"
                        onPress={openHistory}
                      />
                    </View>
                  </View>
                </View>

                {/* ============================================================
                  RECENT CONSULTATIONS
              ============================================================ */}

                {filteredConsultations.length > 0 ? (
                  <View className="mt-7">
                    <SectionHeader
                      title={
                        searchQuery.trim() || selectedFilter !== "all"
                          ? "Matching consultations"
                          : "Recent consultations"
                      }
                      subtitle={
                        searchQuery.trim() || selectedFilter !== "all"
                          ? `Showing ${Math.min(filteredConsultations.length, 5)} of ${filteredConsultations.length}`
                          : "Your latest consultation activity"
                      }
                      action="View all"
                      onAction={openHistory}
                    />

                    <View className="overflow-hidden rounded-[22px] border border-[#DEE4DE] bg-white">
                      {filteredConsultations
                        .slice(0, 5)
                        .map((consultation, index, array) => (
                          <RecentConsultationRow
                            key={consultation._id}
                            consultation={consultation}
                            isLast={index === array.length - 1}
                            onPress={() => openConsultation(consultation._id)}
                          />
                        ))}
                    </View>

                    {filteredConsultations.length > 5 ? (
                      <Pressable
                        onPress={openHistory}
                        className="mt-3 h-10 items-center justify-center rounded-xl border border-[#DEE4DE] bg-white"
                      >
                        <Text className="text-[9.5px] font-extrabold text-[#4D6A50]">
                          View all {filteredConsultations.length} matching
                          consultations
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                ) : (
                  <View className="mt-7 items-center rounded-[22px] border border-[#DEE4DE] bg-white p-6">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F0F3EF]">
                      <Ionicons
                        name={
                          searchQuery.trim() || selectedFilter !== "all"
                            ? "search-outline"
                            : "chatbubble-ellipses-outline"
                        }
                        size={21}
                        color="#68736B"
                      />
                    </View>

                    <Text className="mt-4 text-[14px] font-extrabold text-[#222A25]">
                      {searchQuery.trim() || selectedFilter !== "all"
                        ? "No matching consultations"
                        : "No consultation activity"}
                    </Text>

                    <Text className="mt-1 max-w-[270px] text-center text-[9px] leading-[14px] text-[#68736B]">
                      {searchQuery.trim() || selectedFilter !== "all"
                        ? "Try another search or choose a different status."
                        : "Your consultation requests and appointments will appear here."}
                    </Text>

                    {searchQuery.trim() || selectedFilter !== "all" ? (
                      <Pressable
                        onPress={() => {
                          setSearchQuery("");
                          setSelectedFilter("all");
                        }}
                        className="mt-4 min-h-[38px] items-center justify-center rounded-xl border border-[#DEE4DE] bg-[#F8FAF7] px-4"
                      >
                        <Text className="text-[9.5px] font-extrabold text-[#4D6A50]">
                          Clear search & filters
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={openBooking}
                        className="mt-4 min-h-[40px] flex-row items-center rounded-xl border border-[#304A36] bg-[#4D6A50] px-4"
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.82 : 1,
                        })}
                      >
                        <Ionicons name="add" size={16} color="#FFFFFF" />
                        <Text className="ml-1.5 text-[9.5px] font-extrabold text-white">
                          Book your first consultation
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}

                {consultations.length > 0 ? (
                  <View className="mt-5 items-center">
                    <Text className="text-[8px] text-[#9AA29B]">
                      Showing {Math.min(filteredConsultations.length, 5)} of{" "}
                      {filteredConsultations.length} matching consultations
                    </Text>
                  </View>
                ) : null}

                {/* ============================================================
                  FOOTER
              ============================================================ */}

                <View className="mt-7 flex-row items-center justify-center">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={13}
                    color="#8E978F"
                  />

                  <Text className="ml-1.5 text-[8px] text-[#8E978F]">
                    Niramaya · Consultation management
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {showSuccessModal && (
          <View
            className="absolute inset-0 items-center justify-center px-5"
            style={{
              backgroundColor: "rgba(34, 42, 37, 0.48)",
            }}
          >
            <View
              className="w-full rounded-[30px] p-6"
              style={{
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Success icon */}
              <View className="items-center">
                <View
                  className="h-[82px] w-[82px] items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#E8F0E7",
                  }}
                >
                  <View
                    className="h-[58px] w-[58px] items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#4D6A50",
                    }}
                  >
                    <Ionicons name="checkmark" size={31} color="#FFFFFF" />
                  </View>
                </View>

                {/* Title */}
                <Text
                  className="mt-5 text-center text-[22px] font-extrabold"
                  style={{
                    color: "#222A25",
                  }}
                >
                  Request submitted
                </Text>

                {/* Message */}
                <Text
                  className="mt-3 text-center text-[13px] leading-[21px]"
                  style={{
                    color: "#68736B",
                  }}
                >
                  Your consultation request has been submitted successfully.
                </Text>

                <Text
                  className="mt-1 text-center text-[13px] leading-[21px]"
                  style={{
                    color: "#68736B",
                  }}
                >
                  Our consultation team will reach out to you as soon as
                  possible.
                </Text>
              </View>

              {/* Submitted status */}
              <View
                className="mt-6 rounded-[18px] border p-4"
                style={{
                  backgroundColor: "#F8FAF7",
                  borderColor: "#DEE4DE",
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#E8F0E7",
                    }}
                  >
                    <Ionicons name="time-outline" size={17} color="#4D6A50" />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text
                      className="text-[12px] font-extrabold"
                      style={{
                        color: "#222A25",
                      }}
                    >
                      Request status
                    </Text>

                    <Text
                      className="mt-0.5 text-[10px]"
                      style={{
                        color: "#68736B",
                      }}
                    >
                      Your request is currently being reviewed.
                    </Text>
                  </View>

                  <View
                    className="rounded-full px-2.5 py-1.5"
                    style={{
                      backgroundColor: "#EEF3F7",
                    }}
                  >
                    <Text
                      className="text-[9px] font-bold"
                      style={{
                        color: "#55738D",
                      }}
                    >
                      Requested
                    </Text>
                  </View>
                </View>
              </View>

              {/* Review button */}
              <Pressable
                onPress={reviewSubmittedConsultation}
                className="mt-5 h-[52px] w-full items-center justify-center rounded-[17px]"
                style={({ pressed }) => ({
                  backgroundColor: "#4D6A50",
                  opacity: pressed ? 0.84 : 1,
                })}
              >
                <View className="flex-row items-center">
                  <Ionicons name="create-outline" size={17} color="#FFFFFF" />

                  <Text className="ml-2 text-[13px] font-extrabold text-white">
                    Review & edit request
                  </Text>
                </View>
              </Pressable>

              {/* Done */}
              <Pressable
                onPress={closeSuccessModal}
                className="mt-2 h-[46px] w-full items-center justify-center"
              >
                <Text
                  className="text-[12px] font-bold"
                  style={{
                    color: "#68736B",
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
