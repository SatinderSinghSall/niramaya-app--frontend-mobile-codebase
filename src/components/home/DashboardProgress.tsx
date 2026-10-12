import React from "react";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import type {
  DashboardData,
  DashboardGoal,
  DashboardConsultation,
  DashboardProgressEntry,
  DashboardFavorite,
  DashboardYogaItem,
  DashboardAyurvedaItem,
} from "@/types/dashboard";

interface DashboardProgressProps {
  data: DashboardData | null;

  loading?: boolean;

  error?: string | null;

  onRetry?: () => void;
}

const GREEN = "#4D6A50";

const DARK_GREEN = "#304B36";

const MUTED = "#777C74";

function formatValue(value: unknown, fallback = "Not provided"): string {
  if (value === null || value === undefined || value === "") return fallback;

  if (typeof value === "number")
    return Number.isFinite(value) ? String(value) : fallback;

  if (typeof value !== "string") return fallback;

  return value

    .replace(/([a-z])([A-Z])/g, "$1 $2")

    .replace(/[_-]/g, " ")

    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null): string {
  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",

    month: "short",

    year: "numeric",
  });
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value)
    ? value.filter((item): item is T =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

function Section({
  title,

  subtitle,

  icon,

  action,

  onAction,

  children,
}: {
  title: string;

  subtitle?: string;

  icon: keyof typeof Ionicons.glyphMap;

  action?: string;

  onAction?: () => void;

  children: React.ReactNode;
}) {
  return (
    <View className="mb-4 rounded-2xl border border-[#E7E0D5] bg-white p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EDF3E9]">
            <Ionicons name={icon} size={20} color={GREEN} />
          </View>

          <View className="flex-1">
            <Text className="font-serif text-base font-bold text-[#263128]">
              {title}
            </Text>

            {subtitle ? (
              <Text className="mt-0.5 text-xs text-[#858B82]">{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {action && onAction ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${action} ${title}`}
            activeOpacity={0.75}
            onPress={onAction}
            className="ml-2 flex-row items-center rounded-full bg-[#F0F5EE] px-3 py-2"
          >
            <Text className="text-xs font-bold text-[#4D6A50]">{action}</Text>

            <Ionicons
              name="chevron-forward"
              size={13}
              color={GREEN}
              style={{ marginLeft: 3 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {children}
    </View>
  );
}

function CTA({
  title,

  subtitle,

  icon,

  onPress,

  secondary = false,
}: {
  title: string;

  subtitle?: string;

  icon: keyof typeof Ionicons.glyphMap;

  onPress: () => void;

  secondary?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      activeOpacity={0.78}
      onPress={onPress}
      className={`mt-3 flex-row items-center rounded-xl px-4 py-3.5 ${
        secondary ? "border border-[#DCE5D9] bg-[#FAFBF8]" : "bg-[#3F6045]"
      }`}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          secondary ? "bg-[#EAF1E6]" : "bg-white/15"
        }`}
      >
        <Ionicons name={icon} size={18} color={secondary ? GREEN : "#FFFFFF"} />
      </View>

      <View className="ml-3 flex-1">
        <Text
          className={`text-sm font-semibold ${secondary ? "text-[#304B36]" : "text-white"}`}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            className={`mt-1 text-xs leading-4 ${secondary ? "text-[#777C74]" : "text-white/75"}`}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View
        className={`ml-2 h-8 w-8 items-center justify-center rounded-full ${
          secondary ? "bg-white" : "bg-white/10"
        }`}
      >
        <Ionicons
          name="arrow-forward"
          size={16}
          color={secondary ? GREEN : "#FFFFFF"}
        />
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({
  icon,

  title,

  message,

  cta,

  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;

  title: string;

  message: string;

  cta?: string;

  onPress?: () => void;
}) {
  return (
    <View className="items-center rounded-xl bg-[#F8F7F2] px-4 py-6">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE4]">
        <Ionicons name={icon} size={23} color={GREEN} />
      </View>

      <Text className="text-center text-sm font-bold text-[#304B36]">
        {title}
      </Text>

      <Text className="mt-1 max-w-[260px] text-center text-xs leading-5 text-[#777C74]">
        {message}
      </Text>

      {cta && onPress ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPress}
          activeOpacity={0.8}
          className="mt-4 flex-row items-center rounded-full bg-[#4D6A50] px-5 py-3"
        >
          <Ionicons name="add" size={17} color="#FFFFFF" />

          <Text className="ml-1.5 text-xs font-bold text-white">{cta}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function InfoRow({
  label,

  value,
}: {
  label: string;

  value: string | number | null | undefined;
}) {
  return (
    <View className="flex-row items-start justify-between border-b border-[#F0EEE8] py-2.5">
      <Text className="flex-1 text-xs text-[#777C74]">{label}</Text>

      <Text className="ml-3 flex-1 text-right text-xs font-semibold text-[#263128]">
        {formatValue(value)}
      </Text>
    </View>
  );
}

function Stat({
  label,

  value,

  icon,
}: {
  label: string;

  value: string | number;

  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="min-w-[30%] flex-1 rounded-xl bg-[#F5F6F0] p-3">
      <Ionicons name={icon} size={17} color={GREEN} />

      <Text className="mt-2 font-serif text-xl font-bold text-[#304B36]">
        {value}
      </Text>

      <Text className="mt-1 text-[10px] text-[#777C74]">{label}</Text>
    </View>
  );
}

function GoalCard({ goal }: { goal: DashboardGoal }) {
  const progress = Math.max(
    0,

    Math.min(100, Number(goal?.progressPercentage) || 0),
  );

  return (
    <View className="mb-2 rounded-xl border border-[#EAE9E1] bg-[#FCFCF9] p-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-bold text-[#304B36]">
            {goal.title || "Personal wellness goal"}
          </Text>

          {goal.description ? (
            <Text className="mt-1 text-xs leading-5 text-[#777C74]">
              {goal.description}
            </Text>
          ) : null}
        </View>

        <View className="rounded-full bg-[#E9F1E5] px-2.5 py-1">
          <Text className="text-[10px] font-bold text-[#4D6A50]">
            {formatValue(goal.status)}
          </Text>
        </View>
      </View>

      <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7E9DF]">
        <View
          className="h-full rounded-full bg-[#4D8A5B]"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="mt-2 flex-row justify-between">
        <Text className="text-[10px] text-[#777C74]">Your progress</Text>

        <Text className="text-xs font-bold text-[#4D6A50]">{progress}%</Text>
      </View>
    </View>
  );
}

function ConsultationCard({
  consultation,
}: {
  consultation: DashboardConsultation;
}) {
  const type =
    typeof consultation.consultationType === "string"
      ? consultation.consultationType
      : "Wellness consultation";

  const date = consultation.scheduledAt || consultation.preferredDate || null;

  const status =
    typeof consultation.status === "string" ? consultation.status : "Requested";

  return (
    <View className="mb-2 rounded-xl border border-[#EAE9E1] bg-[#FCFCF9] p-3">
      <View className="flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2ED]">
          <Ionicons name="calendar-outline" size={20} color={GREEN} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-bold text-[#304B36]">
            {formatValue(type, "Wellness consultation")}
          </Text>

          <Text className="mt-1 text-xs text-[#777C74]">
            {formatDate(date)}
          </Text>

          {consultation.preferredTime ? (
            <Text className="mt-1 text-xs text-[#777C74]">
              Preferred time: {String(consultation.preferredTime)}
            </Text>
          ) : null}
        </View>

        <View className="ml-2 rounded-full bg-[#E9F1E5] px-2 py-1">
          <Text className="text-[10px] font-semibold text-[#4D6A50]">
            {formatValue(status, "Requested")}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ProgressCard({ entry }: { entry: DashboardProgressEntry }) {
  return (
    <View className="mb-2 rounded-xl border border-[#EAE9E1] bg-[#FCFCF9] p-3">
      <View className="mb-2 flex-row items-center">
        <Ionicons name="calendar-outline" size={15} color={GREEN} />

        <Text className="ml-2 text-xs font-bold text-[#304B36]">
          {formatDate(entry.date || entry.createdAt)}
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {entry.weightKg != null ? (
          <View className="mb-2 mr-2 rounded-lg bg-[#EDF3E9] px-3 py-2">
            <Text className="text-[10px] text-[#777C74]">Weight</Text>

            <Text className="mt-1 text-sm font-bold text-[#304B36]">
              {entry.weightKg} kg
            </Text>
          </View>
        ) : null}

        {entry.mood ? (
          <View className="mb-2 mr-2 rounded-lg bg-[#F4EEE2] px-3 py-2">
            <Text className="text-[10px] text-[#777C74]">Mood</Text>

            <Text className="mt-1 text-sm font-bold text-[#5E503B]">
              {formatValue(entry.mood)}
            </Text>
          </View>
        ) : null}

        {entry.energyLevel ? (
          <View className="mb-2 mr-2 rounded-lg bg-[#E8F2F2] px-3 py-2">
            <Text className="text-[10px] text-[#777C74]">Energy</Text>

            <Text className="mt-1 text-sm font-bold text-[#286C70]">
              {formatValue(entry.energyLevel)}
            </Text>
          </View>
        ) : null}
      </View>

      {entry.notes ? (
        <Text className="mt-1 text-xs leading-5 text-[#777C74]">
          {entry.notes}
        </Text>
      ) : null}
    </View>
  );
}

function DashboardSkeleton() {
  return (
    <View className="mt-7">
      <View className="mb-4">
        <View className="h-7 w-44 rounded-lg bg-[#E5E8DF]" />

        <View className="mt-2 h-3 w-64 rounded bg-[#ECEDE7]" />
      </View>

      <View className="mb-4 rounded-2xl bg-[#304B36] p-5">
        <View className="h-4 w-24 rounded bg-white/20" />

        <View className="mt-3 h-6 w-48 rounded bg-white/20" />

        <View className="mt-4 h-3 w-full rounded bg-white/15" />
      </View>

      {[1, 2, 3].map((item) => (
        <View
          key={item}
          className="mb-4 rounded-2xl border border-[#E7E0D5] bg-white p-4"
        >
          <View className="flex-row items-center">
            <View className="h-10 w-10 rounded-xl bg-[#E5E8DF]" />

            <View className="ml-3 flex-1">
              <View className="h-4 w-32 rounded bg-[#E5E8DF]" />

              <View className="mt-2 h-3 w-48 rounded bg-[#ECEDE7]" />
            </View>
          </View>

          <View className="mt-5 h-3 w-full rounded bg-[#ECEDE7]" />

          <View className="mt-2 h-3 w-3/4 rounded bg-[#ECEDE7]" />
        </View>
      ))}

      <View className="flex-row items-center justify-center py-2">
        <ActivityIndicator color={GREEN} />

        <Text className="ml-2 text-xs text-[#777C74]">
          Preparing your wellness dashboard…
        </Text>
      </View>
    </View>
  );
}

function DashboardError({
  message,

  onRetry,
}: {
  message: string;

  onRetry?: () => void;
}) {
  return (
    <View className="mt-7 rounded-2xl border border-[#E8DCD0] bg-white p-6">
      <View className="h-12 w-12 items-center justify-center self-center rounded-full bg-[#F8EEE5]">
        <Ionicons name="cloud-offline-outline" size={24} color="#9A6546" />
      </View>

      <Text className="mt-3 text-center font-serif text-lg font-bold text-[#263128]">
        Wellness data unavailable
      </Text>

      <Text className="mt-2 text-center text-xs leading-5 text-[#777C74]">
        {message}
      </Text>

      {onRetry ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onRetry}
          className="mt-5 items-center rounded-xl bg-[#4D6A50] py-3"
        >
          <Text className="text-sm font-bold text-white">Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function DashboardProgress({
  data,

  loading = false,

  error = null,

  onRetry,
}: DashboardProgressProps) {
  if (loading && !data) return <DashboardSkeleton />;

  if (error && !data)
    return <DashboardError message={error} onRetry={onRetry} />;

  if (!data) {
    return (
      <DashboardError
        message="We couldn't find dashboard information for your account."
        onRetry={onRetry}
      />
    );
  }

  const user = data.user ?? ({} as DashboardData["user"]);

  const profile = data.profile ?? ({} as DashboardData["profile"]);

  const healthSnapshot = data.healthSnapshot ?? null;

  const goalsData = data.goals ?? ({} as DashboardData["goals"]);

  const goals = safeArray<DashboardGoal & { description?: string }>(
    goalsData.recent,
  );

  const consultationsData = data.consultations;

  const upcomingConsultations = safeArray<DashboardConsultation>(
    consultationsData?.upcoming,
  );

  const recentConsultations = safeArray<DashboardConsultation>(
    consultationsData?.recent,
  );

  const progressData = data.progress;

  const recentProgress = safeArray<
    DashboardProgressEntry & { createdAt?: string; notes?: string }
  >(progressData?.recent);

  const announcements = safeArray<{
    id?: string;
    title?: string;
    message?: string;
  }>(data.announcements?.items);

  const tips = safeArray<{
    id?: string;
    title?: string;
    shortDescription?: string;
    category?: string;
  }>(data.wellnessTips?.items);

  const notifications = safeArray<{
    id?: string;
    title?: string;
    message?: string;
    isRead?: boolean;
  }>(data.notifications?.recent);

  const favorites = safeArray<DashboardFavorite>(data.favorites?.items);
  const yogaItems = safeArray<DashboardYogaItem>(data.yoga?.items);
  const ayurvedaItems = safeArray<DashboardAyurvedaItem>(data.ayurveda?.items);

  const fullName = [user.firstName, user.lastName]

    .filter((part) => typeof part === "string" && part.trim())

    .join(" ");

  const completion = Math.max(
    0,

    Math.min(100, Number(profile.completionPercentage) || 0),
  );

  const averageProgress = Math.max(
    0,

    Math.min(100, Number(goalsData.averageProgress) || 0),
  );

  return (
    <View className="mt-7">
      <View className="mb-4">
        <Text className="font-serif text-2xl font-bold text-[#263128]">
          Your Wellness
        </Text>

        <Text className="mt-1 text-xs leading-5 text-[#777C74]">
          Your personal health, goals and daily progress in one place.
        </Text>
      </View>

      {loading ? (
        <View className="mb-4 flex-row items-center rounded-xl bg-[#F0F5EE] px-4 py-3">
          <ActivityIndicator size="small" color={GREEN} />

          <Text className="ml-2 text-xs text-[#4D6A50]">
            Refreshing your wellness data…
          </Text>
        </View>
      ) : null}

      {error ? (
        <View className="mb-4 rounded-xl border border-[#E8DCD0] bg-[#FFF9F3] p-3">
          <Text className="text-xs leading-5 text-[#80583D]">
            {error} Your last loaded information is still shown.
          </Text>

          {onRetry ? (
            <TouchableOpacity
              onPress={onRetry}
              className="mt-2 self-start rounded-full bg-white px-3 py-2"
            >
              <Text className="text-xs font-bold text-[#4D6A50]">Retry</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      <View className="mb-4 overflow-hidden rounded-2xl border border-[#DCE5D8] bg-[#304B36] p-5">
        <View className="absolute -right-7 -top-8 h-36 w-36 rounded-full border-[18px] border-white/5" />

        <View className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-white/5" />

        <View className="flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Text className="text-lg font-bold text-white">
              {(user.firstName?.trim()?.[0] || "N").toUpperCase()}

              {(user.lastName?.trim()?.[0] || "").toUpperCase()}
            </Text>
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/65">
              NAMASKARAM
            </Text>

            <Text className="mt-1 text-xl font-bold tracking-tight text-white">
              {fullName || "Welcome to Niramaya"}
            </Text>

            {user.email ? (
              <Text numberOfLines={1} className="mt-1 text-xs text-white/70">
                {user.email}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open health profile"
            activeOpacity={0.8}
            onPress={() => router.push("/(main)/profile")}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <Ionicons name="create-outline" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="my-4 h-px bg-white/15" />

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-semibold text-white">
              Your wellbeing, at a glance
            </Text>

            <Text className="mt-1 text-xs leading-5 text-white/70">
              Build healthy routines, one day at a time.
            </Text>
          </View>

          <View className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
            <Text className="text-[10px] text-white/65">PROFILE</Text>

            <Text className="mt-0.5 text-base font-bold text-white">
              {completion}%
            </Text>
          </View>
        </View>
      </View>

      <Section
        title="Health Profile"
        subtitle="Your wellness foundation"
        icon="person-circle-outline"
        action="View"
        onAction={() => router.push("/(main)/profile")}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xs text-[#777C74]">Profile completion</Text>

          <Text className="text-sm font-bold text-[#4D6A50]">
            {completion}%
          </Text>
        </View>

        <View className="h-2.5 overflow-hidden rounded-full bg-[#E7E9DF]">
          <View
            className="h-full rounded-full bg-[#4D8A5B]"
            style={{ width: `${completion}%` }}
          />
        </View>

        <View className="mt-3 flex-row items-center">
          <Ionicons
            name={
              profile.completed ? "checkmark-circle" : "alert-circle-outline"
            }
            size={17}
            color={profile.completed ? GREEN : "#B47B31"}
          />

          <Text className="ml-2 flex-1 text-xs text-[#777C74]">
            {profile.completed
              ? "Your onboarding is complete."
              : "Complete your profile for a more personalised experience."}
          </Text>
        </View>

        {!profile.completed || !profile.exists ? (
          <CTA
            title="Complete health profile"
            subtitle="Add your health and lifestyle details"
            icon="arrow-forward-circle-outline"
            onPress={() => router.push("/(main)/profile")}
          />
        ) : null}

        <CTA
          title="Open health profile"
          subtitle="Review and manage your personal details"
          icon="person-outline"
          secondary
          onPress={() => router.push("/(main)/profile")}
        />
      </Section>

      <Section
        title="Health Snapshot"
        subtitle="Your current wellness details"
        icon="heart-outline"
        action="Update"
        onAction={() => router.push("/(main)/profile")}
      >
        {healthSnapshot ? (
          <>
            <InfoRow
              label="Height"
              value={
                healthSnapshot.heightCm != null
                  ? `${healthSnapshot.heightCm} cm`
                  : null
              }
            />

            <InfoRow
              label="Weight"
              value={
                healthSnapshot.weightKg != null
                  ? `${healthSnapshot.weightKg} kg`
                  : null
              }
            />

            <InfoRow label="Energy level" value={healthSnapshot.energyLevel} />

            <InfoRow label="Digestion" value={healthSnapshot.digestion} />

            <InfoRow label="Stress level" value={healthSnapshot.stressLevel} />

            <InfoRow label="Mood" value={healthSnapshot.mood} />

            <InfoRow
              label="Activity level"
              value={healthSnapshot.activityLevel}
            />

            <InfoRow
              label="Sleep duration"
              value={
                healthSnapshot.sleepHours != null
                  ? `${healthSnapshot.sleepHours} hours`
                  : null
              }
            />

            <InfoRow
              label="Sleep quality"
              value={healthSnapshot.sleepQuality}
            />
          </>
        ) : (
          <EmptyState
            icon="heart-outline"
            title="Your snapshot starts here"
            message="Add your wellness details to make this space more personal."
            cta="Update profile"
            onPress={() => router.push("/(main)/profile")}
          />
        )}

        <CTA
          title="Edit health details"
          subtitle="Keep your wellness information up to date"
          icon="create-outline"
          secondary
          onPress={() => router.push("/(main)/profile")}
        />
      </Section>

      <Section
        title="Your Goals"
        subtitle="Small steps, meaningful progress"
        icon="flag-outline"
        action="View goals"
        onAction={() => router.push("/(main)/goals")}
      >
        <View className="mb-3 flex-row flex-wrap gap-2">
          <Stat
            label="Active"
            value={Number(goalsData.active) || 0}
            icon="flash-outline"
          />

          <Stat
            label="Completed"
            value={Number(goalsData.completed) || 0}
            icon="checkmark-circle-outline"
          />

          <Stat
            label="Avg. progress"
            value={`${averageProgress}%`}
            icon="trending-up-outline"
          />
        </View>

        {goals.length ? (
          goals

            .slice(0, 3)

            .map((goal, index) => (
              <GoalCard key={goal.id || `goal-${index}`} goal={goal} />
            ))
        ) : (
          <EmptyState
            icon="flag-outline"
            title="Make your first wellness goal"
            message="Choose one achievable habit and build from there."
            cta="Explore goals"
            onPress={() => router.push("/(main)/goals")}
          />
        )}

        <CTA
          title="Go to all goals"
          subtitle="Review milestones and update your routines"
          icon="flag-outline"
          secondary
          onPress={() => router.push("/(main)/goals")}
        />
      </Section>

      <Section
        title="Today's Progress"
        subtitle="Check in with yourself"
        icon="pulse-outline"
        action="View progress"
        onAction={() => router.push("/(main)/progress")}
      >
        {progressData?.today && typeof progressData.today === "object" ? (
          <ProgressCard entry={progressData.today} />
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="A little check-in goes a long way"
            message="Record how you feel today and notice your patterns over time."
            cta="Log today's progress"
            onPress={() => router.push("/(main)/progress")}
          />
        )}

        {recentProgress.length ? (
          <View className="mt-2">
            <Text className="mb-2 text-xs font-bold text-[#304B36]">
              Recent entries
            </Text>

            {recentProgress.slice(0, 3).map((entry, index) => (
              <ProgressCard
                key={entry.id || `progress-${index}`}
                entry={entry}
              />
            ))}
          </View>
        ) : null}

        <CTA
          title="Open progress tracker"
          subtitle="View trends and add a daily check-in"
          icon="trending-up-outline"
          secondary
          onPress={() => router.push("/(main)/progress")}
        />
      </Section>

      <Section
        title="Consultations"
        subtitle="Your wellness support"
        icon="calendar-outline"
        action="View all"
        onAction={() => router.push("/(main)/consultation")}
      >
        {upcomingConsultations.length ? (
          <>
            <Text className="mb-2 text-xs font-bold text-[#304B36]">
              Upcoming
            </Text>

            {upcomingConsultations.slice(0, 3).map((item, index) => (
              <ConsultationCard
                key={item.id || `upcoming-${index}`}
                consultation={item}
              />
            ))}
          </>
        ) : null}

        {recentConsultations.length ? (
          <View className="mt-2">
            <Text className="mb-2 text-xs font-bold text-[#304B36]">
              {upcomingConsultations.length
                ? "Recent requests"
                : "Recent consultations"}
            </Text>

            {recentConsultations.slice(0, 3).map((item, index) => (
              <ConsultationCard
                key={item.id || `recent-${index}`}
                consultation={item}
              />
            ))}
          </View>
        ) : null}

        {!upcomingConsultations.length && !recentConsultations.length ? (
          <EmptyState
            icon="calendar-outline"
            title="Support when you need it"
            message="Book a wellness consultation to discuss your goals and questions."
            cta="Book a consultation"
            onPress={() => router.push("/(main)/consultation")}
          />
        ) : null}

        <CTA
          title="Manage consultations"
          subtitle="View requests or book a new session"
          icon="calendar-outline"
          secondary
          onPress={() => router.push("/(main)/consultation")}
        />
      </Section>

      <Section
        title="Announcements"
        subtitle="What's happening at Niramaya"
        icon="megaphone-outline"
        action="See all"
        onAction={() => router.push("/(main)/announcements")}
      >
        {announcements.length ? (
          announcements.slice(0, 3).map((item, index) => (
            <View
              key={item.id || `announcement-${index}`}
              className="mb-2 rounded-xl bg-[#F8F7F2] p-3"
            >
              <Text className="text-sm font-bold text-[#304B36]">
                {item.title || "Niramaya update"}
              </Text>

              <Text className="mt-1 text-xs leading-5 text-[#777C74]">
                {item.message ||
                  item.content ||
                  "Read the latest update from Niramaya."}
              </Text>
            </View>
          ))
        ) : (
          <EmptyState
            icon="megaphone-outline"
            title="You're all caught up"
            message="New announcements will appear here when available."
            cta="View announcements"
            onPress={() => router.push("/(main)/announcements")}
          />
        )}

        <CTA
          title="View all announcements"
          subtitle="Read the latest updates from Niramaya"
          icon="megaphone-outline"
          secondary
          onPress={() => router.push("/(main)/announcements")}
        />
      </Section>

      <Section
        title="Wellness Tips"
        subtitle="Ideas for your everyday routine"
        icon="leaf-outline"
        action="Explore"
        onAction={() => router.push("/(main)/health-wellness-tips")}
      >
        {tips.length ? (
          tips.slice(0, 3).map((item, index) => (
            <View
              key={item.id || `tip-${index}`}
              className="mb-2 flex-row rounded-xl bg-[#F5F7F1] p-3"
            >
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-[#E3EDDE]">
                <Ionicons name="sunny-outline" size={19} color={GREEN} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-bold text-[#304B36]">
                  {item.title || "A mindful moment"}
                </Text>

                {item.category ? (
                  <Text className="mt-1 text-[10px] font-semibold text-[#4D6A50]">
                    {formatValue(item.category)}
                  </Text>
                ) : null}

                <Text className="mt-1 text-xs leading-5 text-[#777C74]">
                  {item.description ||
                    item.content ||
                    "Make a little space for wellbeing today."}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="leaf-outline"
            title="Your daily inspiration"
            message="Wellness tips will appear here as they become available."
            cta="Explore wellness"
            onPress={() => router.push("/(main)/health-wellness-tips")}
          />
        )}

        <CTA
          title="Explore wellness resources"
          subtitle="Find more ideas for your daily routine"
          icon="compass-outline"
          secondary
          onPress={() => router.push("/(main)/health-wellness-tips")}
        />
      </Section>

      <Section
        title="Notifications"
        subtitle="Stay in the loop"
        icon="notifications-outline"
        action="View all"
        onAction={() => router.push("/(main)/notifications")}
      >
        <View className="mb-3 flex-row items-center rounded-xl bg-[#F5F7F1] p-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E3EDDE]">
            <Ionicons name="notifications-outline" size={20} color={GREEN} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-[#304B36]">
              {Number(data.notifications?.unreadCount) || 0} unread
              notifications
            </Text>

            <Text className="mt-1 text-xs text-[#777C74]">
              Important updates and reminders in one place.
            </Text>
          </View>
        </View>

        {notifications.length ? (
          notifications.slice(0, 3).map((item, index) => (
            <View
              key={item.id || `notification-${index}`}
              className="mb-2 rounded-xl border border-[#EAE9E1] p-3"
            >
              <View className="flex-row items-start">
                <View
                  className={`mt-1 mr-2 h-2 w-2 rounded-full ${item.isRead ? "bg-[#D5D9D0]" : "bg-[#4D8A5B]"}`}
                />

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-[#304B36]">
                    {item.title || "Niramaya notification"}
                  </Text>

                  <Text className="mt-1 text-xs leading-5 text-[#777C74]">
                    {item.message ||
                      item.body ||
                      "Open notifications to see more details."}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="checkmark-circle-outline"
            title="All caught up"
            message="You don't have any recent notifications."
            cta="Open notifications"
            onPress={() => router.push("/(main)/notifications")}
          />
        )}

        <CTA
          title="Open notification centre"
          subtitle="Review reminders and account updates"
          icon="notifications-outline"
          secondary
          onPress={() => router.push("/(main)/notifications")}
        />
      </Section>
      <Section
        title="My Favourites"
        subtitle="Your saved wellness resources"
        icon="heart-outline"
        action="View all"
        onAction={() => router.push("/(main)/favorites")}
      >
        {favorites.filter((item) => item.itemData).length ? (
          favorites
            .filter((item) => item.itemData)
            .slice(0, 3)
            .map((item, index) => (
              <View
                key={item.id || `favorite-${index}`}
                className="mb-2 rounded-xl border border-[#EAE9E1] bg-[#FCFCF9] p-3"
              >
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#F7EDEB]">
                    <Ionicons name="heart" size={19} color="#A45E5E" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#304B36]">
                      {item.itemData?.title || "Saved wellness resource"}
                    </Text>
                    <Text className="mt-1 text-[10px] font-semibold uppercase text-[#4D6A50]">
                      {formatValue(item.itemType)}
                    </Text>
                    {item.itemData?.shortDescription ? (
                      <Text
                        numberOfLines={2}
                        className="mt-1 text-xs leading-5 text-[#777C74]"
                      >
                        {item.itemData.shortDescription}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
        ) : (
          <EmptyState
            icon="heart-outline"
            title="Save something for later"
            message="Your favourite yoga and Ayurveda resources will appear here."
            cta="Explore wellness"
            onPress={() => router.push("/(main)/search")}
          />
        )}
        <CTA
          title="View my favourites"
          subtitle="Return to your saved wellness resources"
          icon="heart-outline"
          secondary
          onPress={() => router.push("/(main)/favorites")}
        />
      </Section>

      <Section
        title="Yoga"
        subtitle="Practices to support your routine"
        icon="body-outline"
        action="Explore"
        onAction={() => router.push("/(main)/yoga")}
      >
        {yogaItems.length ? (
          yogaItems.slice(0, 3).map((item, index) => (
            <View
              key={item.id || `yoga-${index}`}
              className="mb-2 rounded-xl bg-[#F5F7F1] p-3"
            >
              <View className="flex-row items-start">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E3EDDE]">
                  <Ionicons name="body-outline" size={20} color={GREEN} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#304B36]">
                    {item.title}
                  </Text>
                  {item.category ? (
                    <Text className="mt-1 text-[10px] font-semibold text-[#4D6A50]">
                      {formatValue(item.category)}
                    </Text>
                  ) : null}
                  {item.shortDescription ? (
                    <Text
                      numberOfLines={2}
                      className="mt-1 text-xs leading-5 text-[#777C74]"
                    >
                      {item.shortDescription}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="body-outline"
            title="Make space to move"
            message="Yoga practices will appear here when available."
            cta="Explore yoga"
            onPress={() => router.push("/(main)/yoga")}
          />
        )}
        <CTA
          title="Explore yoga practices"
          subtitle="Find a practice for your day"
          icon="body-outline"
          secondary
          onPress={() => router.push("/(main)/yoga")}
        />
      </Section>

      <Section
        title="Ayurveda"
        subtitle="Traditional wellness resources"
        icon="leaf-outline"
        action="Explore"
        onAction={() => router.push("/(main)/ayurveda")}
      >
        {ayurvedaItems.length ? (
          ayurvedaItems.slice(0, 3).map((item, index) => (
            <View
              key={item.id || `ayurveda-${index}`}
              className="mb-2 rounded-xl bg-[#F5F7F1] p-3"
            >
              <View className="flex-row items-start">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E3EDDE]">
                  <Ionicons name="leaf-outline" size={20} color={GREEN} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#304B36]">
                    {item.title}
                  </Text>
                  {item.category || item.type ? (
                    <Text className="mt-1 text-[10px] font-semibold text-[#4D6A50]">
                      {formatValue(item.category || item.type)}
                    </Text>
                  ) : null}
                  {item.shortDescription ? (
                    <Text
                      numberOfLines={2}
                      className="mt-1 text-xs leading-5 text-[#777C74]"
                    >
                      {item.shortDescription}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="leaf-outline"
            title="Explore traditional wellness"
            message="Ayurveda resources will appear here when available."
            cta="Explore Ayurveda"
            onPress={() => router.push("/(main)/ayurveda")}
          />
        )}
        <CTA
          title="Explore Ayurveda"
          subtitle="Browse wellness articles and resources"
          icon="leaf-outline"
          secondary
          onPress={() => router.push("/(main)/ayurveda")}
        />
      </Section>
    </View>
  );
}
