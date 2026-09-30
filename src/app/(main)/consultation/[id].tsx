import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  cancelConsultation,
  completeConsultation,
  getConsultationById,
} from "../../../services/consultation.service";

import type {
  Consultation,
  ConsultationStatus,
} from "../../../types/consultation";

/* ============================================================
   COLORS
============================================================ */

const COLORS = {
  background: "#F6F7F5",
  surface: "#FFFFFF",
  surfaceSoft: "#F9FAF8",

  primary: "#47634D",
  primaryDark: "#2F4735",
  primarySoft: "#EAF1E9",

  text: "#1F2922",
  textSecondary: "#647067",
  muted: "#8B958D",

  border: "#E3E7E2",
  borderSoft: "#EDF0EC",

  danger: "#B45F55",
  dangerSoft: "#F9ECE9",

  warning: "#927641",
  warningSoft: "#F7F1E3",

  info: "#58728A",
  infoSoft: "#ECF2F6",

  white: "#FFFFFF",
  disabled: "#AAB4AC",
};

/* ============================================================
   HELPERS
============================================================ */

const formatDate = (value?: string | null) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatShortDate = (value?: string | null) => {
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

const formatDateTime = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

const getStatusConfig = (status: ConsultationStatus) => {
  switch (status) {
    case "confirmed":
      return {
        background: COLORS.primarySoft,
        text: COLORS.primary,
        icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
      };

    case "completed":
      return {
        background: "#EEF1EE",
        text: "#53635A",
        icon: "checkmark-done-circle-outline" as keyof typeof Ionicons.glyphMap,
      };

    case "cancelled":
      return {
        background: COLORS.dangerSoft,
        text: COLORS.danger,
        icon: "close-circle-outline" as keyof typeof Ionicons.glyphMap,
      };

    case "rescheduled":
      return {
        background: COLORS.warningSoft,
        text: COLORS.warning,
        icon: "time-outline" as keyof typeof Ionicons.glyphMap,
      };

    default:
      return {
        background: "#EEF2EE",
        text: COLORS.textSecondary,
        icon: "hourglass-outline" as keyof typeof Ionicons.glyphMap,
      };
  }
};

const getTypeConfig = (type: Consultation["consultationType"]) => {
  if (type === "online") {
    return {
      label: "Online",
      icon: "videocam-outline" as keyof typeof Ionicons.glyphMap,
      background: COLORS.infoSoft,
      color: COLORS.info,
    };
  }

  return {
    label: "Offline",
    icon: "location-outline" as keyof typeof Ionicons.glyphMap,
    background: COLORS.warningSoft,
    color: COLORS.warning,
  };
};

/* ============================================================
   SCREEN
============================================================ */

export default function ConsultationDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();

  const consultationId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [consultation, setConsultation] = useState<Consultation | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------------------------------
     LOAD
  ---------------------------------------------------------- */

  const loadConsultation = useCallback(async () => {
    if (!consultationId) {
      setError("Consultation ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getConsultationById(consultationId);

      setConsultation(data);
    } catch (err: any) {
      console.log("Consultation detail error:", err);

      setError(
        err?.response?.data?.message || "Unable to load this consultation.",
      );
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useFocusEffect(
    useCallback(() => {
      loadConsultation();
    }, [loadConsultation]),
  );

  /* ----------------------------------------------------------
     DERIVED DATA
  ---------------------------------------------------------- */

  const statusConfig = useMemo(() => {
    if (!consultation) return null;

    return getStatusConfig(consultation.status);
  }, [consultation]);

  const typeConfig = useMemo(() => {
    if (!consultation) return null;

    return getTypeConfig(consultation.consultationType);
  }, [consultation]);

  const canCancel =
    consultation?.status !== "cancelled" &&
    consultation?.status !== "completed";

  const canComplete =
    consultation?.status !== "cancelled" &&
    consultation?.status !== "completed";

  /* ----------------------------------------------------------
     CANCEL
  ---------------------------------------------------------- */

  const handleCancel = () => {
    if (!consultation || actionLoading) {
      return;
    }

    Alert.alert(
      "Cancel consultation?",
      "Are you sure you want to cancel this consultation request?",
      [
        {
          text: "Keep request",
          style: "cancel",
        },
        {
          text: "Cancel consultation",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);

              const updated = await cancelConsultation(consultation._id);

              setConsultation(updated);

              Alert.alert(
                "Consultation cancelled",
                "Your consultation request has been cancelled.",
              );
            } catch (err: any) {
              console.log("Cancel consultation error:", err);

              Alert.alert(
                "Unable to cancel",
                err?.response?.data?.message ||
                  "We couldn't cancel this consultation. Please try again.",
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  /* ----------------------------------------------------------
     COMPLETE
  ---------------------------------------------------------- */

  const handleComplete = () => {
    if (!consultation || actionLoading) {
      return;
    }

    Alert.alert(
      "Mark as completed?",
      "Use this after your consultation has taken place.",
      [
        {
          text: "Not yet",
          style: "cancel",
        },
        {
          text: "Mark completed",
          onPress: async () => {
            try {
              setActionLoading(true);

              const updated = await completeConsultation(consultation._id);

              setConsultation(updated);

              Alert.alert(
                "Consultation completed",
                "This consultation has been marked as completed.",
              );
            } catch (err: any) {
              console.log("Complete consultation error:", err);

              Alert.alert(
                "Unable to complete",
                err?.response?.data?.message ||
                  "We couldn't update this consultation. Please try again.",
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
      >
        <Header />

        <View className="flex-1 items-center justify-center px-6">
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>

          <Text
            className="mt-4 text-[14px] font-semibold"
            style={{ color: COLORS.text }}
          >
            Loading consultation
          </Text>

          <Text
            className="mt-1 text-center text-[11px]"
            style={{ color: COLORS.muted }}
          >
            Please wait while we retrieve your consultation details.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error || !consultation) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
      >
        <Header />

        <View className="flex-1 items-center justify-center px-7">
          <View
            className="h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: COLORS.dangerSoft }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={COLORS.danger}
            />
          </View>

          <Text
            className="mt-5 text-center text-[19px] font-bold"
            style={{ color: COLORS.text }}
          >
            Consultation unavailable
          </Text>

          <Text
            className="mt-2 max-w-[300px] text-center text-[12px] leading-5"
            style={{ color: COLORS.textSecondary }}
          >
            {error || "We couldn't find this consultation."}
          </Text>

          <Pressable
            onPress={loadConsultation}
            className="mt-6 h-11 flex-row items-center rounded-xl px-5"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Ionicons name="refresh-outline" size={16} color={COLORS.white} />

            <Text className="ml-2 text-[12px] font-bold text-white">
              Try again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 45,
        }}
      >
        {/* =====================================================
            TOP SUMMARY
        ===================================================== */}

        <View
          className="overflow-hidden rounded-[26px] mb-4"
          style={{
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View className="p-5">
            <View className="flex-row items-start">
              <View className="flex-1 pr-3">
                <Text
                  className="text-[10px] font-bold uppercase tracking-[1.4px]"
                  style={{ color: COLORS.muted }}
                >
                  Consultation request
                </Text>

                <Text
                  className="mt-2 text-[22px] font-bold"
                  style={{ color: COLORS.text }}
                >
                  {consultation.consultationType === "online"
                    ? "Online consultation"
                    : "Offline consultation"}
                </Text>

                <Text
                  className="mt-1 text-[12px]"
                  style={{ color: COLORS.textSecondary }}
                >
                  Submitted {formatShortDate(consultation.createdAt)}
                </Text>
              </View>

              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: typeConfig?.background || COLORS.primarySoft,
                }}
              >
                <Ionicons
                  name={typeConfig?.icon || "calendar-outline"}
                  size={22}
                  color={typeConfig?.color || COLORS.primary}
                />
              </View>
            </View>

            <View className="mt-5 flex-row items-center">
              <View
                className="flex-row items-center rounded-full px-3 py-2"
                style={{
                  backgroundColor:
                    statusConfig?.background || COLORS.primarySoft,
                }}
              >
                <Ionicons
                  name={statusConfig?.icon || "hourglass-outline"}
                  size={14}
                  color={statusConfig?.text || COLORS.primary}
                />

                <Text
                  className="ml-1.5 text-[11px] font-bold"
                  style={{
                    color: statusConfig?.text || COLORS.primary,
                  }}
                >
                  {getStatusLabel(consultation.status)}
                </Text>
              </View>

              <View className="ml-2 flex-row items-center rounded-full bg-[#F4F5F3] px-3 py-2">
                <Ionicons
                  name={typeConfig?.icon || "calendar-outline"}
                  size={13}
                  color={COLORS.textSecondary}
                />

                <Text
                  className="ml-1.5 text-[11px] font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  {typeConfig?.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Appointment highlight */}

          <View
            className="mx-4 mb-4 rounded-[20px] p-4"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <View className="flex-row items-center">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: COLORS.white }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color={COLORS.primary}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[10px] font-bold uppercase tracking-[0.8px]"
                  style={{ color: COLORS.primary }}
                >
                  Preferred appointment
                </Text>

                <Text
                  className="mt-1 text-[13px] font-bold"
                  style={{ color: COLORS.primaryDark }}
                >
                  {formatDate(consultation.preferredDate)}
                </Text>

                <Text
                  className="mt-0.5 text-[11px]"
                  style={{ color: COLORS.textSecondary }}
                >
                  {consultation.preferredTime}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* =====================================================
            APPOINTMENT
        ===================================================== */}

        <Section title="Appointment" icon="calendar-outline">
          <InfoRow
            icon="calendar-clear-outline"
            label="Preferred date"
            value={formatDate(consultation.preferredDate)}
          />

          <InfoRow
            icon="time-outline"
            label="Preferred time"
            value={consultation.preferredTime}
          />

          <InfoRow
            icon={
              consultation.consultationType === "online"
                ? "videocam-outline"
                : "location-outline"
            }
            label="Consultation type"
            value={
              consultation.consultationType === "online"
                ? "Online consultation"
                : "Offline consultation"
            }
          />

          <InfoRow
            icon="checkmark-circle-outline"
            label="Scheduled appointment"
            value={
              consultation.scheduledAt
                ? formatDateTime(consultation.scheduledAt) || "Not scheduled"
                : "Not scheduled yet"
            }
            last
          />
        </Section>

        {/* =====================================================
            CONCERN
        ===================================================== */}

        <Section title="Your concern" icon="chatbubble-ellipses-outline">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: COLORS.surfaceSoft }}
          >
            <Text
              className="text-[13px] leading-6"
              style={{ color: COLORS.textSecondary }}
            >
              {consultation.concern}
            </Text>
          </View>
        </Section>

        {/* =====================================================
            GOALS
        ===================================================== */}

        <Section title="Wellness goals" icon="leaf-outline">
          {consultation.goals?.length > 0 ? (
            <View className="flex-row flex-wrap">
              {consultation.goals.map((goal, index) => (
                <View
                  key={`${goal}-${index}`}
                  className="mb-2 mr-2 flex-row items-center rounded-full px-3.5 py-2.5"
                  style={{
                    backgroundColor: COLORS.primarySoft,
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={13}
                    color={COLORS.primary}
                  />

                  <Text
                    className="ml-1.5 text-[11px] font-semibold"
                    style={{ color: COLORS.primaryDark }}
                  >
                    {goal}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <EmptyInline text="No wellness goals were selected." />
          )}
        </Section>

        {/* =====================================================
            NOTES
        ===================================================== */}

        <Section title="Additional notes" icon="document-text-outline">
          {consultation.notes ? (
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: COLORS.surfaceSoft }}
            >
              <Text
                className="text-[13px] leading-6"
                style={{ color: COLORS.textSecondary }}
              >
                {consultation.notes}
              </Text>
            </View>
          ) : (
            <EmptyInline text="No additional notes were provided." />
          )}
        </Section>

        {/* =====================================================
            CONSULTANT
        ===================================================== */}

        <Section title="Consultant" icon="person-outline">
          {consultation.consultant?.name ||
          consultation.consultant?.specialization ||
          consultation.consultant?.contact ? (
            <>
              <View className="flex-row items-center">
                <View
                  className="h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: COLORS.primarySoft }}
                >
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    className="text-[15px] font-bold"
                    style={{ color: COLORS.text }}
                  >
                    {consultation.consultant.name || "Consultant assigned"}
                  </Text>

                  <Text
                    className="mt-1 text-[11px]"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {consultation.consultant.specialization ||
                      "Ayurvedic consultation"}
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                {consultation.consultant.specialization ? (
                  <InfoRow
                    icon="leaf-outline"
                    label="Specialization"
                    value={consultation.consultant.specialization}
                  />
                ) : null}

                {consultation.consultant.contact ? (
                  <InfoRow
                    icon="call-outline"
                    label="Contact"
                    value={consultation.consultant.contact}
                    last
                  />
                ) : null}
              </View>
            </>
          ) : (
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: COLORS.surfaceSoft }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={COLORS.muted}
                />

                <Text
                  className="ml-3 flex-1 text-[12px] leading-5"
                  style={{ color: COLORS.textSecondary }}
                >
                  A consultant has not been assigned to this consultation yet.
                </Text>
              </View>
            </View>
          )}
        </Section>

        {/* =====================================================
            REQUEST INFORMATION
        ===================================================== */}

        <Section title="Request information" icon="information-circle-outline">
          <InfoRow
            icon="finger-print-outline"
            label="Consultation ID"
            value={consultation._id}
          />

          <InfoRow
            icon="person-outline"
            label="User ID"
            value={consultation.user}
          />

          <InfoRow
            icon="calendar-outline"
            label="Created"
            value={formatDateTime(consultation.createdAt) || "—"}
          />

          <InfoRow
            icon="refresh-outline"
            label="Last updated"
            value={formatDateTime(consultation.updatedAt) || "—"}
            last
          />
        </Section>

        {/* =====================================================
            STATUS
        ===================================================== */}

        <Section title="Current status" icon="pulse-outline">
          <View className="flex-row items-center">
            <View
              className="h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: statusConfig?.background || COLORS.primarySoft,
              }}
            >
              <Ionicons
                name={statusConfig?.icon || "hourglass-outline"}
                size={21}
                color={statusConfig?.text || COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text
                className="text-[14px] font-bold"
                style={{ color: COLORS.text }}
              >
                {getStatusLabel(consultation.status)}
              </Text>

              <Text
                className="mt-1 text-[11px] leading-4"
                style={{ color: COLORS.textSecondary }}
              >
                {getStatusDescription(consultation.status)}
              </Text>
            </View>
          </View>
        </Section>

        {/* =====================================================
            CANCELLATION
        ===================================================== */}

        {consultation.status === "cancelled" && (
          <Section title="Cancellation" icon="close-circle-outline" danger>
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: COLORS.dangerSoft }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-[0.8px]"
                style={{ color: COLORS.danger }}
              >
                Cancellation reason
              </Text>

              <Text
                className="mt-2 text-[13px] leading-6"
                style={{ color: COLORS.textSecondary }}
              >
                {consultation.cancellationReason ||
                  "No cancellation reason was provided."}
              </Text>
            </View>
          </Section>
        )}

        {/* =====================================================
            COMPLETION
        ===================================================== */}

        {consultation.completedAt && (
          <Section title="Completion" icon="checkmark-done-circle-outline">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: COLORS.primarySoft }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.primary}
                />

                <Text
                  className="ml-2 text-[13px] font-bold"
                  style={{ color: COLORS.primaryDark }}
                >
                  Consultation completed
                </Text>
              </View>

              <Text
                className="mt-2 text-[11px]"
                style={{ color: COLORS.textSecondary }}
              >
                Completed on {formatDateTime(consultation.completedAt)}
              </Text>
            </View>
          </Section>
        )}

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        {(canComplete || canCancel) && (
          <View
            className="mt-1 rounded-[24px] p-5"
            style={{
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              className="text-[15px] font-bold"
              style={{ color: COLORS.text }}
            >
              Manage consultation
            </Text>

            <Text
              className="mt-1 text-[11px] leading-5"
              style={{ color: COLORS.muted }}
            >
              Update this request after your consultation when appropriate.
            </Text>

            {canComplete && (
              <Pressable
                disabled={actionLoading}
                onPress={handleComplete}
                className="mt-5 h-[52px] flex-row items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: actionLoading
                    ? COLORS.disabled
                    : COLORS.primary,
                }}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={19}
                      color={COLORS.white}
                    />

                    <Text className="ml-2 text-[13px] font-bold text-white">
                      Mark as completed
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {canCancel && (
              <Pressable
                disabled={actionLoading}
                onPress={handleCancel}
                className="mt-2 h-[50px] flex-row items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: COLORS.dangerSoft,
                  opacity: actionLoading ? 0.55 : 1,
                }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={COLORS.danger}
                />

                <Text
                  className="ml-2 text-[13px] font-bold"
                  style={{ color: COLORS.danger }}
                >
                  Cancel consultation
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* =====================================================
            FOOTER INFORMATION
        ===================================================== */}

        <View
          className="mt-5 rounded-[22px] p-5"
          style={{ backgroundColor: COLORS.primarySoft }}
        >
          <View className="flex-row items-start">
            <View
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: COLORS.white }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text
                className="text-[12px] font-bold"
                style={{ color: COLORS.primaryDark }}
              >
                Consultation request
              </Text>

              <Text
                className="mt-1 text-[11px] leading-5"
                style={{ color: COLORS.textSecondary }}
              >
                Your consultation details are associated with your Niramaya
                account. Confirmed appointment information will appear here when
                available.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================
          ACTION OVERLAY
      ======================================================== */}

      {actionLoading && (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{
            backgroundColor: "rgba(31, 41, 34, 0.16)",
          }}
          pointerEvents="none"
        >
          <View
            className="items-center rounded-2xl px-7 py-5"
            style={{
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <ActivityIndicator size="small" color={COLORS.primary} />

            <Text
              className="mt-3 text-[12px] font-bold"
              style={{ color: COLORS.text }}
            >
              Updating consultation...
            </Text>

            <Text className="mt-1 text-[10px]" style={{ color: COLORS.muted }}>
              Please wait
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ============================================================
   HEADER
============================================================ */

function Header() {
  return (
    <View
      className="flex-row items-center px-4 pb-3 pt-2"
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        className="h-11 w-11 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.text} />
      </Pressable>

      <View className="ml-3 flex-1">
        <Text className="text-[19px] font-bold" style={{ color: COLORS.text }}>
          Consultation details
        </Text>

        <Text className="mt-0.5 text-[11px]" style={{ color: COLORS.muted }}>
          View your consultation request
        </Text>
      </View>

      <View
        className="h-11 w-11 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: COLORS.primarySoft,
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={19}
          color={COLORS.primary}
        />
      </View>
    </View>
  );
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  title,
  icon,
  children,
  danger = false,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <View
      className="mb-4 rounded-[24px] p-5"
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: danger ? "#F0D9D5" : COLORS.border,
      }}
    >
      <View className="mb-4 flex-row items-center">
        <View
          className="h-9 w-9 items-center justify-center rounded-xl"
          style={{
            backgroundColor: danger ? COLORS.dangerSoft : COLORS.primarySoft,
          }}
        >
          <Ionicons
            name={icon}
            size={17}
            color={danger ? COLORS.danger : COLORS.primary}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text
            className="text-[14px] font-bold"
            style={{
              color: danger ? COLORS.danger : COLORS.text,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}

/* ============================================================
   INFO ROW
============================================================ */

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={`flex-row items-start ${last ? "" : "mb-4"}`}>
      <View
        className="h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: "#F3F5F2" }}
      >
        <Ionicons name={icon} size={15} color={COLORS.textSecondary} />
      </View>

      <View className="ml-3 flex-1">
        <Text
          className="text-[10px] font-semibold uppercase tracking-[0.6px]"
          style={{ color: COLORS.muted }}
        >
          {label}
        </Text>

        <Text
          className="mt-1 text-[13px] leading-5"
          style={{ color: COLORS.text }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ============================================================
   EMPTY INLINE
============================================================ */

function EmptyInline({ text }: { text: string }) {
  return (
    <View
      className="flex-row items-center rounded-2xl p-4"
      style={{ backgroundColor: COLORS.surfaceSoft }}
    >
      <Ionicons name="remove-circle-outline" size={18} color={COLORS.muted} />

      <Text className="ml-3 flex-1 text-[12px]" style={{ color: COLORS.muted }}>
        {text}
      </Text>
    </View>
  );
}

/* ============================================================
   STATUS DESCRIPTION
============================================================ */

function getStatusDescription(status: ConsultationStatus) {
  switch (status) {
    case "requested":
      return "Your consultation request has been submitted and is awaiting confirmation.";

    case "confirmed":
      return "Your consultation has been confirmed. Check the appointment information above.";

    case "rescheduled":
      return "Your consultation has been rescheduled. Review the latest appointment information.";

    case "completed":
      return "This consultation has been completed.";

    case "cancelled":
      return "This consultation request has been cancelled.";

    default:
      return "Current consultation status.";
  }
}
