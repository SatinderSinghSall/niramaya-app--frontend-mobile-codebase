import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
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
import type {
  Consultation,
  ConsultationStatus,
} from "../../types/consultation";

/* ============================================================================
   COLORS
============================================================================ */

const COLORS = {
  background: "#F5F7F4",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAF7",

  primary: "#4D6A50",
  primaryDark: "#304A36",
  primarySoft: "#E7F0E5",

  text: "#202722",
  textSecondary: "#687169",
  muted: "#929A93",

  border: "#E4E8E3",

  blue: "#58748B",
  blueSoft: "#EDF3F7",

  warning: "#9A7A42",
  warningSoft: "#F7F1E5",

  danger: "#A75F56",
  dangerSoft: "#F9ECEA",

  completed: "#65706A",
  completedSoft: "#EEF1EF",
};

/* ============================================================================
   TYPES
============================================================================ */

type StatusFilter = "all" | ConsultationStatus;
type TypeFilter = "all" | "online" | "offline";
type SortOption = "newest" | "oldest";

/* ============================================================================
   FILTER DATA
============================================================================ */

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Rescheduled", value: "rescheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const TYPE_FILTERS: {
  label: string;
  value: TypeFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

/* ============================================================================
   HELPERS
============================================================================ */

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCreatedDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status: ConsultationStatus) => {
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
};

const getStatusColors = (status: ConsultationStatus) => {
  switch (status) {
    case "confirmed":
      return {
        background: COLORS.primarySoft,
        text: COLORS.primary,
        icon: "checkmark-circle-outline" as const,
      };

    case "rescheduled":
      return {
        background: COLORS.warningSoft,
        text: COLORS.warning,
        icon: "time-outline" as const,
      };

    case "completed":
      return {
        background: COLORS.completedSoft,
        text: COLORS.completed,
        icon: "checkmark-done-outline" as const,
      };

    case "cancelled":
      return {
        background: COLORS.dangerSoft,
        text: COLORS.danger,
        icon: "close-circle-outline" as const,
      };

    case "requested":
    default:
      return {
        background: COLORS.blueSoft,
        text: COLORS.blue,
        icon: "hourglass-outline" as const,
      };
  }
};

const getTypeInfo = (type: Consultation["consultationType"]) => {
  if (type === "online") {
    return {
      label: "Online",
      title: "Online consultation",
      icon: "videocam-outline" as const,
      color: COLORS.primary,
      background: COLORS.primarySoft,
    };
  }

  return {
    label: "Offline",
    title: "Offline consultation",
    icon: "location-outline" as const,
    color: COLORS.blue,
    background: COLORS.blueSoft,
  };
};

const getErrorMessage = (error: any) => {
  const status = error?.response?.status;

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You are not authorised to view your consultation history.";
  }

  if (status >= 500) {
    return "Something went wrong on the server.";
  }

  if (
    !error?.response &&
    typeof error?.message === "string" &&
    error.message.toLowerCase().includes("network")
  ) {
    return "Unable to connect to the server.";
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load your consultation history."
  );
};

/* ============================================================================
   STATUS BADGE
============================================================================ */

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const colors = getStatusColors(status);

  return (
    <View
      className="flex-row items-center rounded-full px-2.5 py-1.5"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Ionicons name={colors.icon} size={11} color={colors.text} />

      <Text
        className="ml-1 text-[9px] font-bold"
        style={{
          color: colors.text,
        }}
      >
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

/* ============================================================================
   CONSULTATION CARD
============================================================================ */

function ConsultationCard({ consultation }: { consultation: Consultation }) {
  const type = getTypeInfo(consultation.consultationType);
  const createdDate = formatCreatedDate(consultation.createdAt);

  return (
    <Pressable
      onPress={() =>
        router.push(`/(main)/consultation/${consultation._id}` as any)
      }
      className="mb-4 overflow-hidden rounded-[22px]"
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      {/* TOP ACCENT */}
      <View
        style={{
          height: 3,
          backgroundColor: type.color,
        }}
      />

      <View className="px-4 pt-4">
        {/* HEADER */}
        <View className="flex-row items-start">
          <View
            className="h-11 w-11 items-center justify-center rounded-[14px]"
            style={{
              backgroundColor: type.background,
            }}
          >
            <Ionicons name={type.icon} size={20} color={type.color} />
          </View>

          <View className="ml-3 flex-1">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <Text
                  className="text-[14px] font-bold"
                  style={{
                    color: COLORS.text,
                  }}
                  numberOfLines={1}
                >
                  {type.title}
                </Text>

                <View className="mt-1.5 flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={COLORS.muted}
                  />

                  <Text
                    className="ml-1 text-[10px]"
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    {formatDate(consultation.preferredDate)}
                  </Text>

                  <View
                    className="mx-2 h-1 w-1 rounded-full"
                    style={{
                      backgroundColor: COLORS.border,
                    }}
                  />

                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={COLORS.muted}
                  />

                  <Text
                    className="ml-1 text-[10px]"
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    {consultation.preferredTime || "Time not set"}
                  </Text>
                </View>
              </View>

              <StatusBadge status={consultation.status} />
            </View>
          </View>
        </View>

        {/* APPOINTMENT STRIP */}
        <View
          className="mt-4 flex-row items-center rounded-[15px] px-3 py-2.5"
          style={{
            backgroundColor: COLORS.surfaceSoft,
          }}
        >
          <View className="flex-1">
            <Text
              className="text-[8px] font-semibold uppercase tracking-[0.8px]"
              style={{
                color: COLORS.muted,
              }}
            >
              Appointment
            </Text>

            <Text
              className="mt-1 text-[10px] font-semibold"
              style={{
                color: COLORS.text,
              }}
            >
              {formatDate(consultation.preferredDate)}
            </Text>
          </View>

          <View
            className="h-8 w-[1px]"
            style={{
              backgroundColor: COLORS.border,
            }}
          />

          <View className="flex-1 items-end">
            <Text
              className="text-[8px] font-semibold uppercase tracking-[0.8px]"
              style={{
                color: COLORS.muted,
              }}
            >
              Preferred time
            </Text>

            <Text
              className="mt-1 text-[10px] font-semibold"
              style={{
                color: COLORS.text,
              }}
            >
              {consultation.preferredTime || "Not specified"}
            </Text>
          </View>
        </View>

        {/* CONCERN */}
        <View className="mt-4">
          <Text
            className="text-[8px] font-bold uppercase tracking-[1px]"
            style={{
              color: COLORS.muted,
            }}
          >
            Concern
          </Text>

          <Text
            className="mt-1.5 text-[11px] leading-[17px]"
            style={{
              color: COLORS.textSecondary,
            }}
            numberOfLines={2}
          >
            {consultation.concern || "No concern provided."}
          </Text>
        </View>

        {/* CONSULTANT */}
        {consultation.consultant?.name ? (
          <View
            className="mt-4 flex-row items-center rounded-[14px] px-3 py-2.5"
            style={{
              backgroundColor: COLORS.surfaceSoft,
            }}
          >
            <View
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.primarySoft,
              }}
            >
              <Ionicons
                name="person-outline"
                size={15}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-2.5 flex-1">
              <Text
                className="text-[8px] font-semibold"
                style={{
                  color: COLORS.muted,
                }}
              >
                CONSULTANT
              </Text>

              <Text
                className="mt-0.5 text-[10px] font-bold"
                style={{
                  color: COLORS.text,
                }}
                numberOfLines={1}
              >
                {consultation.consultant.name}
              </Text>

              {consultation.consultant.specialization ? (
                <Text
                  className="mt-0.5 text-[8px]"
                  style={{
                    color: COLORS.textSecondary,
                  }}
                  numberOfLines={1}
                >
                  {consultation.consultant.specialization}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* REQUESTED ON */}
        {createdDate ? (
          <View className="mt-3 flex-row items-center">
            <Ionicons name="time-outline" size={11} color={COLORS.muted} />

            <Text
              className="ml-1.5 text-[8px]"
              style={{
                color: COLORS.muted,
              }}
            >
              Requested on {createdDate}
            </Text>
          </View>
        ) : null}
      </View>

      {/* FOOTER */}
      <View
        className="mt-4 flex-row items-center justify-between border-t px-4 py-3.5"
        style={{
          borderColor: COLORS.border,
        }}
      >
        <View className="flex-row items-center">
          <View
            className="h-6 w-6 items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.primarySoft,
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={12}
              color={COLORS.primary}
            />
          </View>

          <Text
            className="ml-2 text-[9px] font-bold"
            style={{
              color: COLORS.textSecondary,
            }}
          >
            Consultation request
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className="mr-1 text-[9px] font-bold"
            style={{
              color: COLORS.primary,
            }}
          >
            View details
          </Text>

          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </View>
      </View>
    </Pressable>
  );
}

/* ============================================================================
   PAGE NUMBERS
============================================================================ */

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
}

/* ============================================================================
   PAGINATION
============================================================================ */

function Pagination({
  page,
  totalPages,
  totalResults,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(page, totalPages);

  return (
    <View
      className="mt-2 rounded-[20px] p-3.5"
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {/* SUMMARY */}
      <View className="mb-3 items-center">
        <Text
          className="text-[10px] font-bold"
          style={{
            color: COLORS.text,
          }}
        >
          Page {page} of {totalPages}
        </Text>

        <Text
          className="mt-1 text-[8px]"
          style={{
            color: COLORS.muted,
          }}
        >
          {totalResults} total consultations
        </Text>
      </View>

      {/* CONTROLS */}
      <View className="flex-row items-center justify-center">
        {/* PREVIOUS */}
        <Pressable
          onPress={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              page === 1 ? COLORS.surfaceSoft : COLORS.primarySoft,
            opacity: page === 1 ? 0.45 : 1,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={15}
            color={page === 1 ? COLORS.muted : COLORS.primary}
          />
        </Pressable>

        {/* PAGE NUMBERS */}
        <View className="mx-2 flex-row items-center">
          {pages.map((pageNumber) => {
            const active = pageNumber === page;

            return (
              <Pressable
                key={pageNumber}
                onPress={() => onPageChange(pageNumber)}
                className="mx-1 h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: active ? COLORS.primary : COLORS.surfaceSoft,
                }}
              >
                <Text
                  className="text-[9px] font-bold"
                  style={{
                    color: active ? "#FFFFFF" : COLORS.textSecondary,
                  }}
                >
                  {pageNumber}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* NEXT */}
        <Pressable
          onPress={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              page === totalPages ? COLORS.surfaceSoft : COLORS.primarySoft,
            opacity: page === totalPages ? 0.45 : 1,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={15}
            color={page === totalPages ? COLORS.muted : COLORS.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

/* ============================================================================
   SCREEN
============================================================================ */

export default function ConsultationHistoryScreen() {
  const insets = useSafeAreaInsets();

  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortOption>("newest");

  const [showSort, setShowSort] = useState(false);

  const LIMIT = 6;

  /* ==========================================================================
     LOAD
  ========================================================================== */

  const loadConsultations = useCallback(
    async (targetPage = 1, showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response = await getConsultations({
          page: targetPage,
          limit: LIMIT,
          ...(statusFilter !== "all"
            ? {
                status: statusFilter,
              }
            : {}),
        });

        const items = Array.isArray(response?.consultations)
          ? response.consultations
          : [];

        setConsultations(items);

        setPage(response?.pagination?.page ?? targetPage);

        setTotalPages(response?.pagination?.totalPages ?? 1);

        setTotalResults(response?.pagination?.total ?? items.length);
      } catch (err: any) {
        console.log("CONSULTATION HISTORY LOAD ERROR", {
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
    },
    [statusFilter],
  );

  /* ==========================================================================
     INITIAL / STATUS FILTER
  ========================================================================== */

  useEffect(() => {
    loadConsultations(1, true);
  }, [statusFilter]);

  /* ==========================================================================
     CLIENT-SIDE FILTERING
  ========================================================================== */

  const filteredConsultations = useMemo(() => {
    let result = [...consultations];

    if (typeFilter !== "all") {
      result = result.filter((item) => item.consultationType === typeFilter);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((item) => {
        const type =
          item.consultationType === "online"
            ? "online consultation"
            : "offline consultation";

        const status = getStatusLabel(item.status);

        const concern = item.concern ?? "";
        const consultant = item.consultant?.name ?? "";

        const specialization = item.consultant?.specialization ?? "";

        const searchable = [
          type,
          status,
          concern,
          consultant,
          specialization,
          formatDate(item.preferredDate),
          item.preferredTime,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    result.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.preferredDate).getTime();

      const bDate = new Date(b.createdAt || b.preferredDate).getTime();

      return sort === "newest" ? bDate - aDate : aDate - bDate;
    });

    return result;
  }, [consultations, typeFilter, search, sort]);

  /* ==========================================================================
     FILTER STATE
  ========================================================================== */

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "newest";

  /* ==========================================================================
     RESET
  ========================================================================== */

  const resetFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearch("");
    setSort("newest");
    setShowSort(false);
    setPage(1);
    Keyboard.dismiss();
  };

  /* ==========================================================================
     REFRESH
  ========================================================================== */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadConsultations(page, false);
    } finally {
      setRefreshing(false);
    }
  };

  /* ==========================================================================
     PAGINATION
  ========================================================================== */

  const goToPage = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    Keyboard.dismiss();

    await loadConsultations(nextPage, true);
  };

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={Platform.OS === "android"}
      />

      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1"
        style={{
          backgroundColor: COLORS.background,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <View className="flex-row items-center px-5 pb-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="arrow-back" size={19} color={COLORS.text} />
          </Pressable>

          <View className="ml-3 flex-1">
            <Text
              className="text-[20px] font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              Consultation history
            </Text>

            <Text
              className="mt-0.5 text-[9px]"
              style={{
                color: COLORS.muted,
              }}
            >
              Manage your consultation requests
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/(main)/consultation-book" as any)}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.primary,
            }}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom + 20, 30),
          }}
        >
          {/* ==============================================================
              SUMMARY CARD
          ============================================================== */}

          <View
            className="rounded-[22px] p-4"
            style={{
              backgroundColor: COLORS.primaryDark,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              >
                <Ionicons name="calendar-outline" size={19} color="#FFFFFF" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-bold text-white">
                  Your consultations
                </Text>

                <Text
                  className="mt-0.5 text-[9px]"
                  style={{
                    color: "rgba(255,255,255,0.68)",
                  }}
                >
                  View and manage your consultation requests
                </Text>
              </View>

              <View
                className="items-center rounded-[13px] px-3 py-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.10)",
                }}
              >
                <Text className="text-[15px] font-bold text-white">
                  {totalResults}
                </Text>

                <Text
                  className="text-[7px] font-semibold"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  REQUESTS
                </Text>
              </View>
            </View>
          </View>

          {/* ==============================================================
              SEARCH
          ============================================================== */}

          <View
            className="mt-4 flex-row items-center rounded-[16px] px-3.5"
            style={{
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: search ? COLORS.primary : COLORS.border,
            }}
          >
            <Ionicons name="search-outline" size={18} color={COLORS.muted} />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search your consultations..."
              placeholderTextColor={COLORS.muted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              className="ml-2 flex-1 py-3.5 text-[11px]"
              style={{
                color: COLORS.text,
              }}
            />

            {search.length > 0 ? (
              <Pressable onPress={() => setSearch("")} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={COLORS.muted} />
              </Pressable>
            ) : null}
          </View>

          {/* ==============================================================
              STATUS
          ============================================================== */}

          <View className="mt-5">
            <View className="mb-2 flex-row items-center justify-between">
              <Text
                className="text-[9px] font-bold uppercase tracking-[1px]"
                style={{
                  color: COLORS.muted,
                }}
              >
                Status
              </Text>

              {hasActiveFilters ? (
                <Pressable onPress={resetFilters} hitSlop={8}>
                  <Text
                    className="text-[9px] font-bold"
                    style={{
                      color: COLORS.danger,
                    }}
                  >
                    Clear all
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 18,
              }}
            >
              {STATUS_FILTERS.map((item) => {
                const selected = statusFilter === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => {
                      if (item.value !== statusFilter) {
                        setPage(1);
                        setStatusFilter(item.value);
                      }
                    }}
                    className="mr-2 rounded-full px-3.5 py-2.5"
                    style={{
                      backgroundColor: selected
                        ? COLORS.primary
                        : COLORS.surface,
                      borderWidth: 1,
                      borderColor: selected ? COLORS.primary : COLORS.border,
                    }}
                  >
                    <Text
                      className="text-[9px] font-bold"
                      style={{
                        color: selected ? "#FFFFFF" : COLORS.textSecondary,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* ==============================================================
              TYPE + SORT
          ============================================================== */}

          <View className="mt-3 flex-row items-center">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{
                paddingRight: 8,
              }}
            >
              {TYPE_FILTERS.map((item) => {
                const selected = typeFilter === item.value;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setTypeFilter(item.value)}
                    className="mr-2 flex-row items-center rounded-full px-3 py-2"
                    style={{
                      backgroundColor: selected
                        ? COLORS.primarySoft
                        : COLORS.surface,
                      borderWidth: 1,
                      borderColor: selected
                        ? COLORS.primarySoft
                        : COLORS.border,
                    }}
                  >
                    {item.value !== "all" ? (
                      <Ionicons
                        name={
                          item.value === "online"
                            ? "videocam-outline"
                            : "location-outline"
                        }
                        size={12}
                        color={selected ? COLORS.primary : COLORS.muted}
                      />
                    ) : null}

                    <Text
                      className={`text-[9px] font-bold ${
                        item.value !== "all" ? "ml-1" : ""
                      }`}
                      style={{
                        color: selected ? COLORS.primary : COLORS.textSecondary,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setShowSort((value) => !value)}
              className="ml-1 flex-row items-center rounded-full px-3 py-2"
              style={{
                backgroundColor:
                  showSort || sort !== "newest"
                    ? COLORS.primarySoft
                    : COLORS.surface,
                borderWidth: 1,
                borderColor:
                  showSort || sort !== "newest"
                    ? COLORS.primarySoft
                    : COLORS.border,
              }}
            >
              <Ionicons
                name="swap-vertical-outline"
                size={13}
                color={
                  showSort || sort !== "newest" ? COLORS.primary : COLORS.muted
                }
              />

              <Text
                className="ml-1 text-[9px] font-bold"
                style={{
                  color:
                    showSort || sort !== "newest"
                      ? COLORS.primary
                      : COLORS.textSecondary,
                }}
              >
                Sort
              </Text>
            </Pressable>
          </View>

          {/* ==============================================================
              SORT MENU
          ============================================================== */}

          {showSort ? (
            <View
              className="mt-2 overflow-hidden rounded-[16px]"
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Pressable
                onPress={() => {
                  setSort("newest");
                  setShowSort(false);
                }}
                className="flex-row items-center px-4 py-3.5"
                style={{
                  backgroundColor:
                    sort === "newest" ? COLORS.primarySoft : COLORS.surface,
                }}
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={15}
                  color={sort === "newest" ? COLORS.primary : COLORS.muted}
                />

                <Text
                  className="ml-2 flex-1 text-[10px] font-semibold"
                  style={{
                    color:
                      sort === "newest" ? COLORS.primary : COLORS.textSecondary,
                  }}
                >
                  Newest first
                </Text>

                {sort === "newest" ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                ) : null}
              </Pressable>

              <View
                className="h-[1px]"
                style={{
                  backgroundColor: COLORS.border,
                }}
              />

              <Pressable
                onPress={() => {
                  setSort("oldest");
                  setShowSort(false);
                }}
                className="flex-row items-center px-4 py-3.5"
                style={{
                  backgroundColor:
                    sort === "oldest" ? COLORS.primarySoft : COLORS.surface,
                }}
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={15}
                  color={sort === "oldest" ? COLORS.primary : COLORS.muted}
                />

                <Text
                  className="ml-2 flex-1 text-[10px] font-semibold"
                  style={{
                    color:
                      sort === "oldest" ? COLORS.primary : COLORS.textSecondary,
                  }}
                >
                  Oldest first
                </Text>

                {sort === "oldest" ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                ) : null}
              </Pressable>
            </View>
          ) : null}

          {/* ==============================================================
              ACTIVE FILTER INFO
          ============================================================== */}

          {hasActiveFilters ? (
            <View className="mt-3 flex-row flex-wrap items-center">
              {statusFilter !== "all" ? (
                <View
                  className="mr-1.5 mb-1.5 rounded-full px-2.5 py-1.5"
                  style={{
                    backgroundColor: COLORS.primarySoft,
                  }}
                >
                  <Text
                    className="text-[8px] font-bold"
                    style={{
                      color: COLORS.primary,
                    }}
                  >
                    {getStatusLabel(statusFilter)}
                  </Text>
                </View>
              ) : null}

              {typeFilter !== "all" ? (
                <View
                  className="mr-1.5 mb-1.5 rounded-full px-2.5 py-1.5"
                  style={{
                    backgroundColor: COLORS.blueSoft,
                  }}
                >
                  <Text
                    className="text-[8px] font-bold"
                    style={{
                      color: COLORS.blue,
                    }}
                  >
                    {typeFilter === "online" ? "Online" : "Offline"}
                  </Text>
                </View>
              ) : null}

              {search.trim() ? (
                <View
                  className="mr-1.5 mb-1.5 max-w-[180px] rounded-full px-2.5 py-1.5"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    className="text-[8px] font-semibold"
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    Search: {search.trim()}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* ==============================================================
              RESULTS HEADER
          ============================================================== */}

          {!loading && !error ? (
            <View className="mt-5 mb-3 flex-row items-end justify-between">
              <View>
                <Text
                  className="text-[16px] font-bold"
                  style={{
                    color: COLORS.text,
                  }}
                >
                  Your requests
                </Text>

                <Text
                  className="mt-0.5 text-[9px]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {search.trim() || typeFilter !== "all"
                    ? `${filteredConsultations.length} matching ${
                        filteredConsultations.length === 1
                          ? "request"
                          : "requests"
                      }`
                    : totalResults === 0
                      ? "No requests yet"
                      : `Showing page ${page} of ${totalPages}`}
                </Text>
              </View>

              {!search.trim() && typeFilter === "all" && totalResults > 0 ? (
                <View
                  className="rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text
                    className="text-[8px] font-bold"
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    {totalResults} total
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* ==============================================================
              LOADING
          ============================================================== */}

          {loading ? (
            <View className="py-16">
              <View className="items-center">
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: COLORS.primarySoft,
                  }}
                >
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>

                <Text
                  className="mt-4 text-[12px] font-semibold"
                  style={{
                    color: COLORS.text,
                  }}
                >
                  Loading your history
                </Text>

                <Text
                  className="mt-1 text-[9px]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  Please wait a moment
                </Text>
              </View>
            </View>
          ) : error ? (
            /* ============================================================
               ERROR
            ============================================================ */

            <View
              className="mt-5 items-center rounded-[22px] px-6 py-10"
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.dangerSoft,
                }}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={25}
                  color={COLORS.danger}
                />
              </View>

              <Text
                className="mt-4 text-[15px] font-bold"
                style={{
                  color: COLORS.text,
                }}
              >
                Unable to load history
              </Text>

              <Text
                className="mt-1.5 max-w-[270px] text-center text-[10px] leading-[15px]"
                style={{
                  color: COLORS.textSecondary,
                }}
              >
                {error}
              </Text>

              <Pressable
                onPress={() => loadConsultations(page, true)}
                className="mt-5 flex-row items-center rounded-full px-5 py-2.5"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                <Ionicons name="refresh-outline" size={13} color="#FFFFFF" />

                <Text className="ml-1.5 text-[10px] font-bold text-white">
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : filteredConsultations.length === 0 ? (
            /* ============================================================
               EMPTY
            ============================================================ */

            <View
              className="mt-5 items-center rounded-[22px] px-6 py-11"
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.primarySoft,
                }}
              >
                <Ionicons
                  name={
                    hasActiveFilters ? "search-outline" : "calendar-outline"
                  }
                  size={27}
                  color={COLORS.primary}
                />
              </View>

              <Text
                className="mt-4 text-[16px] font-bold"
                style={{
                  color: COLORS.text,
                }}
              >
                {hasActiveFilters
                  ? "No matching requests"
                  : "No consultations yet"}
              </Text>

              <Text
                className="mt-1.5 max-w-[280px] text-center text-[10px] leading-[16px]"
                style={{
                  color: COLORS.textSecondary,
                }}
              >
                {hasActiveFilters
                  ? "Try changing your search or filters to find another consultation."
                  : "Your consultation requests will appear here once you book one."}
              </Text>

              {hasActiveFilters ? (
                <Pressable
                  onPress={resetFilters}
                  className="mt-5 rounded-full px-5 py-2.5"
                  style={{
                    backgroundColor: COLORS.primarySoft,
                  }}
                >
                  <Text
                    className="text-[10px] font-bold"
                    style={{
                      color: COLORS.primary,
                    }}
                  >
                    Clear filters
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() =>
                    router.push("/(main)/consultation-book" as any)
                  }
                  className="mt-5 flex-row items-center rounded-full px-5 py-2.5"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                >
                  <Ionicons name="add" size={14} color="#FFFFFF" />

                  <Text className="ml-1 text-[10px] font-bold text-white">
                    Book consultation
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            /* ============================================================
               RESULTS
            ============================================================ */

            <>
              {filteredConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation._id}
                  consultation={consultation}
                />
              ))}

              {/* ========================================================
                  PAGINATION
              ======================================================== */}

              {!search.trim() && typeFilter === "all" ? (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  onPageChange={goToPage}
                />
              ) : (
                <View
                  className="mt-1 items-center rounded-[16px] px-4 py-3"
                  style={{
                    backgroundColor: COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text
                    className="text-center text-[8px]"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    Search and type filters apply to the current page of
                    results.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* ==============================================================
              FOOTER
          ============================================================== */}

          {!loading && !error ? (
            <View className="mt-6 items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={12}
                  color={COLORS.muted}
                />

                <Text
                  className="ml-1.5 text-[8px]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  Your consultation records are securely managed
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
