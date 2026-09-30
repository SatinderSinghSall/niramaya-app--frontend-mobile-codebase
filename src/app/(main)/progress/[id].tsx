import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { deleteProgress, getProgressById } from "@/services/progress.service";
import { ProgressEntry } from "@/types/progress";

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  text: "#263128",
  muted: "#7C827A",
  softMuted: "#A4A89F",
  green: "#4D6A50",
  darkGreen: "#304B36",
  lightGreen: "#EAF1E8",
  border: "#E5E3DB",
  red: "#B65D54",
  lightRed: "#FFF3F1",
};

const formatDate = (value?: string) => {
  if (!value) return "Not recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (value?: string) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatNumber = (value?: number, decimals = 1) => {
  if (value === undefined || value === null) return "Not recorded";

  return Number(value)
    .toFixed(decimals)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
};

const formatMinutes = (minutes?: number) => {
  if (minutes === undefined || minutes === null) return "Not recorded";
  if (minutes === 0) return "0 min";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
};

const ratingLabel = (value?: number) => {
  if (value === undefined || value === null) return "Not recorded";
  if (value === 5) return "Excellent";
  if (value === 4) return "Good";
  if (value === 3) return "Balanced";
  if (value === 2) return "Needs care";
  return "Low";
};

const ratingColor = (value?: number) => {
  if (value === undefined || value === null) return COLORS.softMuted;
  if (value >= 4) return COLORS.green;
  if (value === 3) return "#7C9580";
  return "#B77A54";
};

function HeaderButton({
  icon,
  onPress,
  danger = false,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-xl border"
      style={{
        backgroundColor: danger ? COLORS.lightRed : COLORS.surface,
        borderColor: danger ? "#F0D4D0" : COLORS.border,
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {disabled ? (
        <ActivityIndicator
          size="small"
          color={danger ? COLORS.red : COLORS.green}
        />
      ) : (
        <Ionicons
          name={icon}
          size={18}
          color={danger ? COLORS.red : COLORS.text}
        />
      )}
    </Pressable>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[18px] font-bold text-[#263128]">{title}</Text>
      {description ? (
        <Text className="mt-1 text-[11px] leading-[17px] text-[#858B83]">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

function RatingItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: number;
}) {
  const color = ratingColor(value);

  return (
    <View className="flex-1 items-center">
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            value !== undefined && value >= 4
              ? "#EAF1E8"
              : value === 3
                ? "#F0F4F0"
                : "#F3F3EF",
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text className="mt-2 text-[10px] font-medium text-[#747A72]">
        {label}
      </Text>

      <Text className="mt-1 text-[12px] font-bold" style={{ color }}>
        {value !== undefined ? `${value}/5` : "—"}
      </Text>

      <Text className="mt-0.5 text-[8px] text-[#9BA099]">
        {ratingLabel(value)}
      </Text>
    </View>
  );
}

function WellbeingSection({ progress }: { progress: ProgressEntry }) {
  return (
    <View className="mt-7">
      <SectionTitle
        title="Wellbeing"
        description="Your ratings for how you felt during the day."
      />

      <View className="rounded-[18px] border border-[#E5E3DB] bg-white px-3 py-5">
        <View className="flex-row">
          <RatingItem icon="happy-outline" label="Mood" value={progress.mood} />
          <RatingItem
            icon="flash-outline"
            label="Energy"
            value={progress.energyLevel}
          />
          <RatingItem
            icon="pulse-outline"
            label="Stress"
            value={progress.stressLevel}
          />
          <RatingItem
            icon="moon-outline"
            label="Sleep quality"
            value={progress.sleepQuality}
          />
        </View>
      </View>
    </View>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View className="w-[48.5%] rounded-[16px] border border-[#E5E3DB] bg-white px-4 py-3.5">
      <View className="flex-row items-center">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#F0F4EE]">
          <Ionicons name={icon} size={15} color={COLORS.green} />
        </View>

        <Text className="ml-2 flex-1 text-[10px] font-medium text-[#7C827A]">
          {label}
        </Text>
      </View>

      <View className="mt-3 flex-row items-baseline">
        <Text className="text-[17px] font-bold text-[#263128]">{value}</Text>
        {unit ? (
          <Text className="ml-1 text-[9px] text-[#9B9F97]">{unit}</Text>
        ) : null}
      </View>
    </View>
  );
}

function DailyMetrics({ progress }: { progress: ProgressEntry }) {
  return (
    <View className="mt-7">
      <SectionTitle
        title="Daily activity"
        description="Sleep, hydration, movement and other daily measures."
      />

      <View className="flex-row flex-wrap justify-between gap-y-2.5">
        <MetricCard
          icon="moon-outline"
          label="Sleep"
          value={
            progress.sleepHours !== undefined
              ? formatNumber(progress.sleepHours)
              : "—"
          }
          unit="hrs"
        />

        <MetricCard
          icon="water-outline"
          label="Water"
          value={
            progress.waterIntakeLiters !== undefined
              ? formatNumber(progress.waterIntakeLiters)
              : "—"
          }
          unit="L"
        />

        <MetricCard
          icon="walk-outline"
          label="Steps"
          value={
            progress.steps !== undefined ? progress.steps.toLocaleString() : "—"
          }
        />

        <MetricCard
          icon="fitness-outline"
          label="Exercise"
          value={formatMinutes(progress.exerciseMinutes)}
        />

        <MetricCard
          icon="body-outline"
          label="Yoga"
          value={formatMinutes(progress.yogaMinutes)}
        />

        <MetricCard
          icon="leaf-outline"
          label="Meditation"
          value={formatMinutes(progress.meditationMinutes)}
        />

        <MetricCard
          icon="scale-outline"
          label="Weight"
          value={
            progress.weightKg !== undefined
              ? formatNumber(progress.weightKg)
              : "—"
          }
          unit="kg"
        />
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  unit,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit?: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-3.5 ${
        !last ? "border-b border-[#F0F0EB]" : ""
      }`}
    >
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#F2F4EF]">
        <Ionicons name={icon} size={15} color={COLORS.green} />
      </View>

      <Text className="ml-3 flex-1 text-[10px] font-medium text-[#747A72]">
        {label}
      </Text>

      <View className="max-w-[52%] flex-row items-baseline justify-end">
        <Text
          numberOfLines={2}
          className="text-right text-[11px] font-semibold text-[#263128]"
        >
          {value}
        </Text>

        {unit ? (
          <Text className="ml-1 text-[8px] text-[#9B9F97]">{unit}</Text>
        ) : null}
      </View>
    </View>
  );
}

function CompleteRecord({ progress }: { progress: ProgressEntry }) {
  return (
    <View className="mt-7">
      <SectionTitle
        title="Complete record"
        description="All information saved with this check-in."
      />

      <View className="rounded-[18px] border border-[#E5E3DB] bg-white px-4">
        <InfoRow
          icon="calendar-outline"
          label="Progress date"
          value={formatDate(progress.date)}
        />

        <InfoRow
          icon="happy-outline"
          label="Mood"
          value={
            progress.mood !== undefined ? `${progress.mood}/5` : "Not recorded"
          }
        />

        <InfoRow
          icon="flash-outline"
          label="Energy level"
          value={
            progress.energyLevel !== undefined
              ? `${progress.energyLevel}/5`
              : "Not recorded"
          }
        />

        <InfoRow
          icon="pulse-outline"
          label="Stress level"
          value={
            progress.stressLevel !== undefined
              ? `${progress.stressLevel}/5`
              : "Not recorded"
          }
        />

        <InfoRow
          icon="moon-outline"
          label="Sleep hours"
          value={
            progress.sleepHours !== undefined
              ? formatNumber(progress.sleepHours)
              : "Not recorded"
          }
          unit="hrs"
        />

        <InfoRow
          icon="moon-outline"
          label="Sleep quality"
          value={
            progress.sleepQuality !== undefined
              ? `${progress.sleepQuality}/5`
              : "Not recorded"
          }
        />

        <InfoRow
          icon="water-outline"
          label="Water intake"
          value={
            progress.waterIntakeLiters !== undefined
              ? formatNumber(progress.waterIntakeLiters)
              : "Not recorded"
          }
          unit="L"
        />

        <InfoRow
          icon="walk-outline"
          label="Steps"
          value={
            progress.steps !== undefined
              ? progress.steps.toLocaleString()
              : "Not recorded"
          }
        />

        <InfoRow
          icon="fitness-outline"
          label="Exercise"
          value={formatMinutes(progress.exerciseMinutes)}
        />

        <InfoRow
          icon="body-outline"
          label="Yoga"
          value={formatMinutes(progress.yogaMinutes)}
        />

        <InfoRow
          icon="leaf-outline"
          label="Meditation"
          value={formatMinutes(progress.meditationMinutes)}
        />

        <InfoRow
          icon="scale-outline"
          label="Weight"
          value={
            progress.weightKg !== undefined
              ? formatNumber(progress.weightKg)
              : "Not recorded"
          }
          unit="kg"
        />

        <InfoRow
          icon="checkmark-circle-outline"
          label="Activities completed"
          value={
            progress.completedActivities?.length
              ? `${progress.completedActivities.length} recorded`
              : "None recorded"
          }
          last
        />
      </View>
    </View>
  );
}

function ActivitiesSection({ activities }: { activities?: string[] }) {
  return (
    <View className="mt-7">
      <SectionTitle
        title="Completed activities"
        description="Activities marked as completed for this day."
      />

      <View className="rounded-[18px] border border-[#E5E3DB] bg-white p-4">
        {activities?.length ? (
          <View className="flex-row flex-wrap">
            {activities.map((activity, index) => (
              <View
                key={`${activity}-${index}`}
                className="mb-2 mr-2 flex-row items-center rounded-lg bg-[#EAF1E8] px-3 py-2"
              >
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={COLORS.green}
                />
                <Text className="ml-1.5 text-[10px] font-semibold text-[#4D6A50]">
                  {activity}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-5">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F2F4EF]">
              <Ionicons name="checkmark-outline" size={18} color="#9AA197" />
            </View>
            <Text className="mt-2 text-[10px] text-[#8A9088]">
              No activities recorded
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function NotesSection({ notes }: { notes?: string }) {
  return (
    <View className="mt-7">
      <SectionTitle
        title="Notes"
        description="Your personal note for this day."
      />

      <View className="rounded-[18px] border border-[#E5E3DB] bg-white p-5">
        <View className="flex-row items-start">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#F1F4EF]">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color={COLORS.green}
            />
          </View>

          <Text className="ml-3 flex-1 text-[12px] leading-[20px] text-[#4D554B]">
            {notes || "No note was added for this day."}
          </Text>
        </View>
      </View>
    </View>
  );
}

function RecordInformation({ progress }: { progress: ProgressEntry }) {
  return (
    <View className="mt-7">
      <SectionTitle title="Entry information" />

      <View className="rounded-[18px] border border-[#E5E3DB] bg-white px-4">
        <InfoRow
          icon="person-outline"
          label="User"
          value={progress.user || "Current user"}
        />

        <InfoRow
          icon="calendar-outline"
          label="Created"
          value={formatDateTime(progress.createdAt)}
        />

        <InfoRow
          icon="refresh-outline"
          label="Last updated"
          value={formatDateTime(progress.updatedAt)}
          last
        />
      </View>
    </View>
  );
}

function DetailSkeleton() {
  const Block = ({ className }: { className: string }) => (
    <View className={`rounded-xl bg-[#E9E9E2] ${className}`} />
  );

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 50,
        }}
      >
        <View className="flex-row items-center justify-between pt-3">
          <Block className="h-10 w-10" />
          <View className="flex-row">
            <Block className="h-10 w-10" />
            <View className="ml-2">
              <Block className="h-10 w-10" />
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-[20px] bg-white p-5">
          <Block className="h-3 w-28" />
          <Block className="mt-4 h-7 w-64" />
          <Block className="mt-3 h-3 w-40" />
        </View>

        <View className="mt-7">
          <Block className="h-5 w-28" />
          <Block className="mt-2 h-3 w-60" />
          <View className="mt-3 rounded-[18px] bg-white p-5">
            <View className="flex-row justify-between">
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} className="items-center">
                  <Block className="h-11 w-11 rounded-full" />
                  <Block className="mt-2 h-2.5 w-12" />
                  <Block className="mt-2 h-2.5 w-8" />
                </View>
              ))}
            </View>
          </View>
        </View>

        <Block className="mt-7 h-5 w-36" />
        <View className="mt-3 flex-row flex-wrap justify-between gap-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <Block key={index} className="h-[94px] w-[48.5%] rounded-[16px]" />
          ))}
        </View>

        <Block className="mt-7 h-5 w-40" />
        <Block className="mt-3 h-[470px] w-full rounded-[18px]" />

        <Block className="mt-7 h-5 w-44" />
        <Block className="mt-3 h-[120px] w-full rounded-[18px]" />

        <Block className="mt-7 h-5 w-24" />
        <Block className="mt-3 h-[100px] w-full rounded-[18px]" />
      </ScrollView>
    </SafeAreaView>
  );
}

function DeleteModal({
  visible,
  deleting,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!deleting) onCancel();
      }}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full max-w-[370px] rounded-[22px] bg-white p-6">
          <View className="items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF0EE]">
              <Ionicons name="trash-outline" size={25} color={COLORS.red} />
            </View>
          </View>

          <Text className="mt-4 text-center text-[20px] font-bold text-[#263128]">
            Delete check-in?
          </Text>

          <Text className="mt-2 text-center text-[12px] leading-[18px] text-[#7C827A]">
            This daily progress entry will be permanently removed. This action
            cannot be undone.
          </Text>

          <View className="mt-5 flex-row">
            <Pressable
              disabled={deleting}
              onPress={onCancel}
              className="h-12 flex-1 items-center justify-center rounded-xl border border-[#E5E3DB] bg-white"
              style={{ opacity: deleting ? 0.5 : 1 }}
            >
              <Text className="text-[13px] font-bold text-[#59635B]">
                Keep it
              </Text>
            </Pressable>

            <Pressable
              disabled={deleting}
              onPress={onConfirm}
              className="ml-3 h-12 flex-1 items-center justify-center rounded-xl bg-[#B65D54]"
              style={{ opacity: deleting ? 0.85 : 1 }}
            >
              {deleting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="ml-2 text-[13px] font-bold text-white">
                    Deleting...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="trash-outline" size={15} color="#FFFFFF" />
                  <Text className="ml-2 text-[13px] font-bold text-white">
                    Delete
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ProgressDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [progress, setProgress] = useState<ProgressEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  const loadProgress = useCallback(
    async (showRefresh = false) => {
      if (!id) {
        setError("This progress entry could not be found.");
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data = await getProgressById(id);
        setProgress(data);
      } catch (err: any) {
        console.error("Progress detail error:", err);
        setError(
          err?.response?.data?.message ||
            "Unable to load this progress entry right now.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useFocusEffect(
    useCallback(() => {
      loadProgress(false);
    }, [loadProgress]),
  );

  const handleRefresh = useCallback(() => {
    loadProgress(true);
  }, [loadProgress]);

  const handleDelete = async () => {
    if (!progress?._id || deleting) return;

    try {
      setDeleting(true);
      await deleteProgress(progress._id);
      setShowDeleteModal(false);
      router.replace("/progress" as any);
    } catch (err: any) {
      console.error("Progress delete error:", err);
      setShowDeleteModal(false);
      setError(
        err?.response?.data?.message ||
          "Unable to delete this progress entry. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !progress) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
      >
        <View className="flex-row px-[18px] pt-3">
          <HeaderButton icon="arrow-back" onPress={() => router.back()} />
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF0EE]">
            <Ionicons
              name="alert-circle-outline"
              size={27}
              color={COLORS.red}
            />
          </View>

          <Text className="mt-5 text-[20px] font-bold text-[#263128]">
            Progress unavailable
          </Text>

          <Text className="mt-2 text-center text-[11px] leading-[18px] text-[#858B83]">
            {error || "This progress entry may have been removed."}
          </Text>

          <Pressable
            onPress={() => loadProgress(false)}
            className="mt-5 h-11 items-center justify-center rounded-xl bg-[#304B36] px-5"
          >
            <Text className="text-[12px] font-bold text-white">Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
            colors={[COLORS.green]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 45,
        }}
      >
        <View className="flex-row items-center justify-between pt-3">
          <HeaderButton icon="arrow-back" onPress={() => router.back()} />

          <View className="flex-row">
            <HeaderButton
              icon="create-outline"
              onPress={() =>
                router.push({
                  pathname: "/progress-create",
                  params: { id: progress._id },
                } as any)
              }
            />

            <View className="ml-2">
              <HeaderButton
                icon="trash-outline"
                danger
                disabled={deleting}
                onPress={() => setShowDeleteModal(true)}
              />
            </View>
          </View>
        </View>

        {/* Entry header */}
        <View className="mt-5 rounded-[20px] border border-[#E5E3DB] bg-white p-5">
          <Text className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#718071]">
            Daily check-in
          </Text>

          <Text className="mt-2 text-[23px] font-bold leading-7 text-[#263128]">
            {formatDate(progress.date)}
          </Text>

          <View className="mt-4 flex-row items-center">
            <View className="h-1.5 w-1.5 rounded-full bg-[#6F9474]" />
            <Text className="ml-2 text-[10px] text-[#858B83]">
              Personal progress record
            </Text>
          </View>
        </View>

        <WellbeingSection progress={progress} />

        <DailyMetrics progress={progress} />

        <CompleteRecord progress={progress} />

        <ActivitiesSection activities={progress.completedActivities} />

        <NotesSection notes={progress.notes} />

        <RecordInformation progress={progress} />

        <View className="mt-9 items-center pb-2">
          <Text className="text-[9px] text-[#A4A89F]">
            Pull down to refresh this check-in.
          </Text>
        </View>
      </ScrollView>

      <DeleteModal
        visible={showDeleteModal}
        deleting={deleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}
