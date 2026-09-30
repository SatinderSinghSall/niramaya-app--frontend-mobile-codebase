import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import {
  completeGoal,
  deleteGoal,
  getGoal,
  pauseGoal,
  resumeGoal,
  updateGoal,
  updateGoalProgress,
} from "@/services/goal.service";

import {
  getGoalCategoryIcon,
  getGoalCategoryLabel,
  getGoalStatusLabel,
  GOAL_CATEGORIES,
} from "@/constants/goals";

import { Goal, GoalCategory } from "@/types/goal";

import { SafeAreaView } from "react-native-safe-area-context";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#29342C",
  muted: "#777C74",
  softMuted: "#A1A39B",

  green: "#4D6A50",
  darkGreen: "#304B36",

  lightGreen: "#E5EEDF",
  lighterGreen: "#F0F5ED",

  border: "#E2DDD2",

  red: "#C65353",
  redBg: "#FBEFEE",

  amber: "#A97825",
  amberBg: "#F8F1DF",

  blue: "#55758A",
  blueBg: "#EDF3F6",
};

/* ==========================================================================
   HELPERS
========================================================================== */

function formatDate(date?: string | null) {
  if (!date) {
    return "Not set";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatDateTime(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function getStatusTheme(status: Goal["status"]) {
  switch (status) {
    case "active":
      return {
        background: "#EAF2E7",
        text: "#456348",
        dot: "#5B795E",
      };

    case "paused":
      return {
        background: COLORS.amberBg,
        text: COLORS.amber,
        dot: "#C18A2B",
      };

    case "completed":
      return {
        background: COLORS.blueBg,
        text: COLORS.blue,
        dot: "#66869B",
      };

    case "cancelled":
      return {
        background: COLORS.redBg,
        text: COLORS.red,
        dot: "#C65353",
      };

    default:
      return {
        background: "#F0F0ED",
        text: "#6E726B",
        dot: "#8B8D87",
      };
  }
}

/* ==========================================================================
   SMALL COMPONENTS
========================================================================== */

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View className="mb-3">
      <Text className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#718071]">
        {eyebrow}
      </Text>

      <Text className="mt-1 font-serif text-[19px] font-bold text-[#29342C]">
        {title}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: Goal["status"] }) {
  const theme = getStatusTheme(status);

  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1.5"
      style={{
        backgroundColor: theme.background,
      }}
    >
      <View
        className="mr-2 h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: theme.dot,
        }}
      />

      <Text
        className="text-[9px] font-bold"
        style={{
          color: theme.text,
        }}
      >
        {getGoalStatusLabel(status)}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row border-b border-[#EEEAE1] py-3.5 last:border-b-0">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F0F4ED]">
        <Ionicons name={icon} size={14} color={COLORS.green} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[9px] text-[#999C94]">{label}</Text>

        <Text className="mt-0.5 text-[11px] font-semibold leading-[16px] text-[#344038]">
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ==========================================================================
   EDIT INPUT
========================================================================== */

function EditInput({
  label,
  value,
  placeholder,
  onChangeText,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad";
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[9px] font-semibold uppercase tracking-[0.7px] text-[#777C74]">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#AAA99F"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`rounded-[5px] border border-[#DDD7CC] bg-white px-3.5 text-[12px] text-[#29342C] ${
          multiline ? "min-h-[85px] py-3" : "h-[46px]"
        }`}
      />
    </View>
  );
}

/* ==========================================================================
   CATEGORY PICKER
========================================================================== */

function CategoryPicker({
  value,
  onChange,
}: {
  value: GoalCategory;
  onChange: (value: GoalCategory) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[9px] font-semibold uppercase tracking-[0.7px] text-[#777C74]">
        Wellness area
      </Text>

      <View className="flex-row flex-wrap">
        {GOAL_CATEGORIES.map((item) => {
          const selected = value === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              activeOpacity={0.8}
              onPress={() => onChange(item.value)}
              className="mb-2 mr-2 flex-row items-center rounded-full border px-3 py-2"
              style={{
                backgroundColor: selected ? COLORS.green : "#FFFFFF",

                borderColor: selected ? COLORS.green : COLORS.border,
              }}
            >
              <Text
                className="text-[9px] font-semibold"
                style={{
                  color: selected ? "#FFFFFF" : "#596059",
                }}
              >
                {item.label}
              </Text>

              {selected ? (
                <Ionicons
                  name="checkmark"
                  size={12}
                  color="#FFFFFF"
                  style={{
                    marginLeft: 5,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ==========================================================================
   DATE EDITOR
========================================================================== */

function DateEditor({
  label,
  date,
  onPress,
}: {
  label: string;
  date?: Date | null;
  onPress: () => void;
}) {
  return (
    <View className="mb-4 flex-1">
      <Text className="mb-2 text-[9px] font-semibold uppercase tracking-[0.7px] text-[#777C74]">
        {label}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="h-[46px] flex-row items-center rounded-[5px] border border-[#DDD7CC] bg-white px-3"
      >
        <Ionicons name="calendar-outline" size={15} color={COLORS.green} />

        <Text className="ml-2 flex-1 text-[10px] font-medium text-[#344038]">
          {date ? formatDate(date.toISOString()) : "Not set"}
        </Text>

        <Ionicons name="chevron-down" size={13} color="#969991" />
      </TouchableOpacity>
    </View>
  );
}

/* ==========================================================================
   ACTION BUTTON
========================================================================== */

function ActionButton({
  title,
  icon,
  onPress,
  variant = "primary",
  loading = false,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}) {
  const primary = variant === "primary";

  const danger = variant === "danger";

  return (
    <TouchableOpacity
      disabled={loading}
      activeOpacity={0.82}
      onPress={onPress}
      className="mb-2.5 h-[48px] flex-row items-center justify-center rounded-[5px] border"
      style={{
        backgroundColor: primary ? COLORS.green : "#FFFFFF",

        borderColor: primary
          ? COLORS.green
          : danger
            ? "#E7C9C9"
            : COLORS.border,

        opacity: loading ? 0.55 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={primary ? "#FFFFFF" : danger ? COLORS.red : COLORS.green}
        />
      ) : (
        <>
          <Ionicons
            name={icon}
            size={16}
            color={primary ? "#FFFFFF" : danger ? COLORS.red : COLORS.green}
          />

          <Text
            className="ml-2 text-[10px] font-bold"
            style={{
              color: primary ? "#FFFFFF" : danger ? COLORS.red : COLORS.text,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

/* ==========================================================================
   MILESTONE
========================================================================== */

function MilestoneRow({
  milestone,
  index,
}: {
  milestone: NonNullable<Goal["milestones"]>[number];
  index: number;
}) {
  return (
    <View className="flex-row py-3">
      <View
        className="h-7 w-7 items-center justify-center rounded-full"
        style={{
          backgroundColor: milestone.completed ? COLORS.lightGreen : "#F2F0EB",
        }}
      >
        <Ionicons
          name={milestone.completed ? "checkmark" : "ellipse-outline"}
          size={milestone.completed ? 14 : 11}
          color={milestone.completed ? COLORS.green : "#999C94"}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text
          className={`text-[11px] font-semibold ${
            milestone.completed ? "text-[#607064]" : "text-[#344038]"
          }`}
        >
          {milestone.title}
        </Text>

        {milestone.targetValue !== null &&
        milestone.targetValue !== undefined ? (
          <Text className="mt-1 text-[9px] text-[#999C94]">
            Target: {milestone.targetValue}
          </Text>
        ) : null}

        {milestone.completedAt ? (
          <Text className="mt-1 text-[8px] text-[#7A8A7B]">
            Completed {formatDate(milestone.completedAt)}
          </Text>
        ) : null}
      </View>

      <Text className="self-center text-[8px] text-[#A1A39B]">{index + 1}</Text>
    </View>
  );
}

/* ==========================================================================
   MAIN SCREEN
========================================================================== */

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [goal, setGoal] = useState<Goal | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  /* Progress */

  const [progressValue, setProgressValue] = useState("");

  const [progressError, setProgressError] = useState("");

  /* Edit fields */

  const [editTitle, setEditTitle] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [editCategory, setEditCategory] =
    useState<GoalCategory>("general_wellbeing");

  const [editTargetValue, setEditTargetValue] = useState("");

  const [editTargetUnit, setEditTargetUnit] = useState("");

  const [editTargetDescription, setEditTargetDescription] = useState("");

  const [editStartDate, setEditStartDate] = useState<Date | null>(null);

  const [editTargetDate, setEditTargetDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);

  const [showTargetPicker, setShowTargetPicker] = useState(false);

  /* ========================================================================
     LOAD
  ======================================================================== */

  const loadGoal = useCallback(
    async (showLoader = true) => {
      if (!id) {
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        const data = await getGoal(String(id));

        setGoal(data);

        setProgressValue(String(data.currentValue ?? 0));
      } catch (error: any) {
        Alert.alert(
          "Couldn't load goal",
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load this goal.",
          [
            {
              text: "Go back",
              onPress: () => router.back(),
            },
          ],
        );
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  /* ========================================================================
     START EDIT
  ======================================================================== */

  const startEditing = () => {
    if (!goal) {
      return;
    }

    setEditTitle(goal.title || "");

    setEditDescription(goal.description || "");

    setEditCategory(goal.category);

    setEditTargetValue(
      goal.target?.value !== null && goal.target?.value !== undefined
        ? String(goal.target.value)
        : "",
    );

    setEditTargetUnit(goal.target?.unit || "");

    setEditTargetDescription(goal.target?.description || "");

    setEditStartDate(goal.startDate ? new Date(goal.startDate) : null);

    setEditTargetDate(goal.targetDate ? new Date(goal.targetDate) : null);

    setEditing(true);
  };

  /* ========================================================================
     CANCEL EDIT
  ======================================================================== */

  const cancelEditing = () => {
    if (saving) {
      return;
    }

    setEditing(false);
    setShowStartPicker(false);
    setShowTargetPicker(false);
  };

  /* ========================================================================
     SAVE EDIT
  ======================================================================== */

  const handleSaveEdit = async () => {
    if (!goal || saving) {
      return;
    }

    if (!editTitle.trim()) {
      Alert.alert("Title required", "Please enter a title for your goal.");
      return;
    }

    if (!editStartDate) {
      Alert.alert("Start date required", "Please select a start date.");
      return;
    }

    if (editTargetDate && editTargetDate < editStartDate) {
      Alert.alert("Invalid dates", "Target date must be after the start date.");
      return;
    }

    let numericTarget: number | null = null;

    if (editTargetValue.trim()) {
      numericTarget = Number(editTargetValue);

      if (Number.isNaN(numericTarget) || numericTarget < 0) {
        Alert.alert("Invalid target", "Please enter a valid target value.");
        return;
      }
    }

    if (editTargetValue.trim() && !editTargetUnit.trim()) {
      Alert.alert(
        "Target unit required",
        "Please enter a unit for your target.",
      );
      return;
    }

    try {
      setSaving(true);

      const updated = await updateGoal(goal._id, {
        title: editTitle.trim(),

        description: editDescription.trim() || null,

        category: editCategory,

        target:
          numericTarget !== null ||
          editTargetUnit.trim() ||
          editTargetDescription.trim()
            ? {
                value: numericTarget,
                unit: editTargetUnit.trim() || null,
                description: editTargetDescription.trim() || null,
              }
            : null,

        startDate: editStartDate.toISOString(),

        targetDate: editTargetDate ? editTargetDate.toISOString() : null,
      });

      setGoal(updated);

      setProgressValue(String(updated.currentValue ?? 0));

      setEditing(false);
    } catch (error: any) {
      Alert.alert(
        "Couldn't save changes",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update this goal.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================================
     PROGRESS
  ======================================================================== */

  const handleProgress = async () => {
    if (!goal || saving) {
      return;
    }

    setProgressError("");

    if (progressValue.trim() === "") {
      setProgressError("Please enter your current progress.");
      return;
    }

    const currentValue = Number(progressValue);

    if (Number.isNaN(currentValue) || currentValue < 0) {
      setProgressError("Please enter a valid progress value.");
      return;
    }

    if (
      goal.target?.value !== undefined &&
      goal.target?.value !== null &&
      currentValue > Number(goal.target.value)
    ) {
      setProgressError(
        `Progress cannot be greater than your target of ${goal.target.value}.`,
      );
      return;
    }

    try {
      setSaving(true);

      const updated = await updateGoalProgress(goal._id, {
        currentValue,
      });

      setGoal(updated);

      setProgressValue(String(updated.currentValue ?? 0));
    } catch (error: any) {
      setProgressError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update progress.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================================
     COMPLETE
  ======================================================================== */

  const handleComplete = () => {
    if (!goal || saving) {
      return;
    }

    Alert.alert("Complete goal?", "Mark this goal as completed?", [
      {
        text: "Not yet",
        style: "cancel",
      },
      {
        text: "Complete",
        onPress: async () => {
          try {
            setSaving(true);

            const updated = await completeGoal(goal._id);

            setGoal(updated);
          } catch (error: any) {
            Alert.alert(
              "Couldn't complete goal",
              error?.response?.data?.message || "Unable to complete this goal.",
            );
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  /* ========================================================================
     PAUSE
  ======================================================================== */

  const handlePause = async () => {
    if (!goal || saving) {
      return;
    }

    try {
      setSaving(true);

      const updated = await pauseGoal(goal._id);

      setGoal(updated);
    } catch (error: any) {
      Alert.alert(
        "Couldn't pause goal",
        error?.response?.data?.message || "Unable to pause this goal.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================================
     RESUME
  ======================================================================== */

  const handleResume = async () => {
    if (!goal || saving) {
      return;
    }

    try {
      setSaving(true);

      const updated = await resumeGoal(goal._id);

      setGoal(updated);
    } catch (error: any) {
      Alert.alert(
        "Couldn't resume goal",
        error?.response?.data?.message || "Unable to resume this goal.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================================
     DELETE
  ======================================================================== */

  const handleDelete = () => {
    if (!goal || saving) {
      return;
    }

    Alert.alert(
      "Delete goal?",
      "This goal and its milestones will be permanently removed.",
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
              setSaving(true);

              await deleteGoal(goal._id);

              router.replace("/(main)/goals");
            } catch (error: any) {
              Alert.alert(
                "Couldn't delete goal",
                error?.response?.data?.message || "Unable to delete this goal.",
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  /* ========================================================================
     LOADING
  ======================================================================== */

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1 items-center justify-center bg-[#F7F3EA]"
      >
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#E8EFE4]">
          <ActivityIndicator size="small" color={COLORS.green} />
        </View>

        <Text className="mt-3 text-[10px] text-[#777C74]">
          Opening your goal...
        </Text>
      </SafeAreaView>
    );
  }

  if (!goal) {
    return null;
  }

  /* ========================================================================
     VALUES
  ======================================================================== */

  const progress = Math.min(Math.max(goal.progressPercentage || 0, 0), 100);

  const targetValue = goal.target?.value;

  const targetUnit = goal.target?.unit;

  const progressSummary =
    targetValue !== undefined && targetValue !== null
      ? `${goal.currentValue ?? 0} / ${targetValue}${targetUnit ? ` ${targetUnit}` : ""}`
      : `${goal.currentValue ?? 0}${targetUnit ? ` ${targetUnit}` : ""}`;

  const statusTheme = getStatusTheme(goal.status);

  const completedMilestones =
    goal.milestones?.filter((milestone) => milestone.completed).length || 0;

  const totalMilestones = goal.milestones?.length || 0;

  /* ========================================================================
     RENDER
  ======================================================================== */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);

              await loadGoal(false);

              setRefreshing(false);
            }}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 45,
        }}
      >
        {/* ================================================================
            TOP BAR
        ================================================================ */}

        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            disabled={saving}
            activeOpacity={0.8}
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-[#DDD7CC] bg-white"
          >
            <Ionicons name="arrow-back" size={17} color="#344038" />
          </TouchableOpacity>

          {!editing ? (
            <TouchableOpacity
              disabled={saving}
              activeOpacity={0.8}
              onPress={startEditing}
              className="flex-row items-center rounded-full border border-[#DDD7CC] bg-white px-3.5 py-2.5"
            >
              <Ionicons name="create-outline" size={14} color={COLORS.green} />

              <Text className="ml-1.5 text-[9px] font-bold text-[#4D6A50]">
                Edit goal
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row">
              <TouchableOpacity
                disabled={saving}
                onPress={cancelEditing}
                className="mr-2 rounded-full border border-[#DDD7CC] bg-white px-3.5 py-2.5"
              >
                <Text className="text-[9px] font-bold text-[#777C74]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={saving}
                onPress={handleSaveEdit}
                className="rounded-full bg-[#4D6A50] px-4 py-2.5"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-[9px] font-bold text-white">
                    Save changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ================================================================
            HERO
        ================================================================ */}

        <View className="mb-6">
          <View className="mb-3 flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#E5EEDF]">
              <Text className="text-[20px]">
                {getGoalCategoryIcon(goal.category)}
              </Text>
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[8px] font-semibold uppercase tracking-[1.5px] text-[#718071]">
                {getGoalCategoryLabel(goal.category)}
              </Text>

              <View className="mt-1 flex-row items-center">
                <View
                  className="mr-1.5 h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: statusTheme.dot,
                  }}
                />

                <Text
                  className="text-[9px] font-semibold"
                  style={{
                    color: statusTheme.text,
                  }}
                >
                  {getGoalStatusLabel(goal.status)}
                </Text>
              </View>
            </View>
          </View>

          {!editing ? (
            <>
              <Text className="font-serif text-[31px] font-bold leading-[38px] text-[#29342C]">
                {goal.title}
              </Text>

              {goal.description ? (
                <Text className="mt-3 text-[11px] leading-[18px] text-[#777C74]">
                  {goal.description}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <EditInput
                label="Goal title"
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Your goal"
              />

              <EditInput
                label="Description"
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Describe your goal"
                multiline
              />
            </>
          )}
        </View>

        {/* ================================================================
            EDIT MODE
        ================================================================ */}

        {editing ? (
          <View className="mb-6">
            <SectionLabel eyebrow="EDIT" title="Goal settings" />

            <CategoryPicker value={editCategory} onChange={setEditCategory} />

            <View className="flex-row">
              <View className="mr-2 flex-1">
                <EditInput
                  label="Target value"
                  value={editTargetValue}
                  onChangeText={setEditTargetValue}
                  placeholder="8"
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="flex-1">
                <EditInput
                  label="Unit"
                  value={editTargetUnit}
                  onChangeText={setEditTargetUnit}
                  placeholder="hours"
                />
              </View>
            </View>

            <EditInput
              label="Target description"
              value={editTargetDescription}
              onChangeText={setEditTargetDescription}
              placeholder="What does reaching this target mean?"
              multiline
            />

            <View className="flex-row">
              <DateEditor
                label="Start date"
                date={editStartDate}
                onPress={() => setShowStartPicker(true)}
              />

              <View className="w-2" />

              <DateEditor
                label="Target date"
                date={editTargetDate}
                onPress={() => setShowTargetPicker(true)}
              />
            </View>

            {showStartPicker ? (
              <DateTimePicker
                value={editStartDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);

                  if (selectedDate) {
                    setEditStartDate(selectedDate);
                  }
                }}
              />
            ) : null}

            {showTargetPicker ? (
              <DateTimePicker
                value={editTargetDate || editStartDate || new Date()}
                mode="date"
                minimumDate={editStartDate || undefined}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowTargetPicker(false);

                  if (selectedDate) {
                    setEditTargetDate(selectedDate);
                  }
                }}
              />
            ) : null}
          </View>
        ) : null}

        {/* ================================================================
            PROGRESS
        ================================================================ */}

        <View className="mb-6">
          <SectionLabel eyebrow="YOUR JOURNEY" title="Progress" />

          <View className="rounded-[7px] border border-[#E2DDD2] bg-white p-4">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-[9px] text-[#8B8F87]">
                  Current progress
                </Text>

                <Text className="mt-1 font-serif text-[38px] font-bold text-[#29342C]">
                  {progress}%
                </Text>
              </View>

              <View className="items-end pb-1">
                <Text className="text-[9px] text-[#8B8F87]">Current</Text>

                <Text className="mt-1 text-[12px] font-bold text-[#4D6A50]">
                  {progressSummary}
                </Text>
              </View>
            </View>

            <View className="mt-5 h-[6px] overflow-hidden rounded-full bg-[#ECEAE3]">
              <View
                className="h-full rounded-full bg-[#4D6A50]"
                style={{
                  width: `${progress}%`,
                }}
              />
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-[8px] text-[#A0A29A]">Started</Text>

              <Text className="text-[8px] text-[#A0A29A]">
                {progress >= 100 ? "Complete" : "Keep going"}
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================================
            TARGET
        ================================================================ */}

        {!editing && (targetValue !== undefined || goal.target?.description) ? (
          <View className="mb-6">
            <SectionLabel eyebrow="THE INTENTION" title="Target" />

            <View className="rounded-[7px] border border-[#E2DDD2] bg-white p-4">
              {targetValue !== undefined && targetValue !== null ? (
                <View className="flex-row items-center">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF1E7]">
                    <Ionicons
                      name="flag-outline"
                      size={18}
                      color={COLORS.green}
                    />
                  </View>

                  <View className="ml-3">
                    <Text className="text-[8px] uppercase tracking-[1px] text-[#9A9C95]">
                      Target value
                    </Text>

                    <Text className="mt-1 font-serif text-[24px] font-bold text-[#344038]">
                      {targetValue}

                      {targetUnit ? ` ${targetUnit}` : ""}
                    </Text>
                  </View>
                </View>
              ) : null}

              {goal.target?.description ? (
                <Text className="mt-4 border-t border-[#EEEAE1] pt-4 text-[10px] leading-[17px] text-[#777C74]">
                  {goal.target.description}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* ================================================================
            TIMELINE
        ================================================================ */}

        <View className="mb-6">
          <SectionLabel eyebrow="TIME" title="Timeline" />

          <View className="rounded-[7px] border border-[#E2DDD2] bg-white px-4">
            <InfoRow
              icon="play-outline"
              label="Started"
              value={formatDate(goal.startDate)}
            />

            <InfoRow
              icon="flag-outline"
              label="Target date"
              value={formatDate(goal.targetDate)}
            />

            {goal.completedAt ? (
              <InfoRow
                icon="checkmark-circle-outline"
                label="Completed"
                value={formatDate(goal.completedAt)}
              />
            ) : null}
          </View>
        </View>

        {/* ================================================================
            MILESTONES
        ================================================================ */}

        {totalMilestones > 0 ? (
          <View className="mb-6">
            <View className="mb-3 flex-row items-end justify-between">
              <SectionLabel eyebrow="SMALL STEPS" title="Milestones" />

              <Text className="mb-3 text-[9px] font-semibold text-[#718071]">
                {completedMilestones} / {totalMilestones}
              </Text>
            </View>

            <View className="rounded-[7px] border border-[#E2DDD2] bg-white px-4">
              {goal.milestones?.map((milestone, index) => (
                <MilestoneRow
                  key={`${milestone.title}-${index}`}
                  milestone={milestone}
                  index={index}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="mb-6">
            <SectionLabel eyebrow="SMALL STEPS" title="Milestones" />

            <View className="rounded-[7px] border border-dashed border-[#D9D4C9] bg-[#FBF9F4] px-4 py-5">
              <View className="flex-row items-center">
                <Ionicons name="list-outline" size={17} color="#899188" />

                <Text className="ml-2.5 flex-1 text-[10px] leading-[15px] text-[#898D85]">
                  No milestones have been added to this goal yet.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ================================================================
            GOAL INFORMATION
        ================================================================ */}

        <View className="mb-6">
          <SectionLabel eyebrow="RECORD" title="Goal information" />

          <View className="rounded-[7px] border border-[#E2DDD2] bg-white px-4">
            <InfoRow
              icon="leaf-outline"
              label="Category"
              value={getGoalCategoryLabel(goal.category)}
            />

            <InfoRow
              icon="pulse-outline"
              label="Status"
              value={getGoalStatusLabel(goal.status)}
            />

            <InfoRow
              icon="calendar-outline"
              label="Created"
              value={formatDateTime(goal.createdAt)}
            />

            <InfoRow
              icon="refresh-outline"
              label="Last updated"
              value={formatDateTime(goal.updatedAt)}
            />
          </View>
        </View>

        {/* ================================================================
            UPDATE PROGRESS
        ================================================================ */}

        {goal.status === "active" && !editing ? (
          <View className="mb-6">
            <SectionLabel eyebrow="KEEP MOVING" title="Update progress" />

            <View className="rounded-[7px] border border-[#E2DDD2] bg-white p-4">
              <Text className="text-[10px] leading-[16px] text-[#777C74]">
                Record where you are today. Your progress percentage will update
                automatically.
              </Text>

              <View className="mt-4 flex-row">
                <TextInput
                  value={progressValue}
                  onChangeText={(value) => {
                    setProgressValue(value);
                    setProgressError("");
                  }}
                  editable={!saving}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#AAA99F"
                  className={`h-[48px] flex-1 rounded-[5px] border bg-[#FBFAF7] px-3.5 text-[12px] text-[#29342C] ${
                    progressError ? "border-[#D88B8B]" : "border-[#DDD7CC]"
                  }`}
                />

                {targetUnit ? (
                  <View className="ml-2.5 h-[48px] min-w-[62px] items-center justify-center rounded-[5px] bg-[#EEF3EB] px-3">
                    <Text className="text-[9px] font-bold text-[#5E705F]">
                      {targetUnit}
                    </Text>
                  </View>
                ) : null}
              </View>

              {progressError ? (
                <View className="mt-2 flex-row items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={12}
                    color={COLORS.red}
                  />

                  <Text className="ml-1 text-[9px] text-[#C65353]">
                    {progressError}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                disabled={saving}
                activeOpacity={0.82}
                onPress={handleProgress}
                className="mt-3 h-[46px] flex-row items-center justify-center rounded-[5px] bg-[#4D6A50]"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="sync-outline" size={15} color="#FFFFFF" />

                    <Text className="ml-2 text-[10px] font-bold text-white">
                      Update progress
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ================================================================
            ACTIONS
        ================================================================ */}

        {!editing ? (
          <View className="mb-4">
            <SectionLabel eyebrow="MANAGE" title="Goal actions" />

            {goal.status === "active" ? (
              <>
                <ActionButton
                  title="Complete goal"
                  icon="checkmark-circle-outline"
                  onPress={handleComplete}
                  loading={saving}
                />

                <ActionButton
                  title="Pause goal"
                  icon="pause-circle-outline"
                  variant="secondary"
                  onPress={handlePause}
                  loading={saving}
                />
              </>
            ) : null}

            {goal.status === "paused" ? (
              <ActionButton
                title="Resume goal"
                icon="play-circle-outline"
                onPress={handleResume}
                loading={saving}
              />
            ) : null}

            <ActionButton
              title="Delete goal"
              icon="trash-outline"
              variant="danger"
              onPress={handleDelete}
              loading={saving}
            />
          </View>
        ) : null}

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <View className="mt-2 items-center">
          <Ionicons name="leaf-outline" size={15} color="#9BA499" />

          <Text className="mt-2 text-center text-[8px] leading-[13px] text-[#A0A29A]">
            Your goal is a journey, not a deadline.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
