import { GoalCategory, GoalStatus } from "@/types/goal";

export const GOAL_CATEGORIES: {
  value: GoalCategory;
  label: string;
  icon: string;
}[] = [
  {
    value: "general_wellbeing",
    label: "General wellbeing",
    icon: "🌿",
  },
  {
    value: "fitness",
    label: "Fitness",
    icon: "🏃",
  },
  {
    value: "weight_management",
    label: "Weight management",
    icon: "⚖️",
  },
  {
    value: "sleep",
    label: "Better sleep",
    icon: "🌙",
  },
  {
    value: "stress_management",
    label: "Stress management",
    icon: "🧘",
  },
  {
    value: "mental_wellbeing",
    label: "Mental wellbeing",
    icon: "🧠",
  },
  {
    value: "flexibility",
    label: "Flexibility",
    icon: "🤸",
  },
  {
    value: "strength",
    label: "Strength",
    icon: "💪",
  },
  {
    value: "mobility",
    label: "Mobility",
    icon: "🚶",
  },
  {
    value: "digestion",
    label: "Digestion",
    icon: "🍃",
  },
  {
    value: "energy",
    label: "Energy",
    icon: "⚡",
  },
  {
    value: "skin_wellness",
    label: "Skin wellness",
    icon: "✨",
  },
  {
    value: "hair_wellness",
    label: "Hair wellness",
    icon: "💆",
  },
  {
    value: "other",
    label: "Other",
    icon: "🎯",
  },
];

export const GOAL_STATUSES: {
  value: GoalStatus;
  label: string;
}[] = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "paused",
    label: "Paused",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export function getGoalCategoryLabel(category: GoalCategory) {
  return (
    GOAL_CATEGORIES.find((item) => item.value === category)?.label ?? "Wellness"
  );
}

export function getGoalCategoryIcon(category: GoalCategory) {
  return GOAL_CATEGORIES.find((item) => item.value === category)?.icon ?? "🎯";
}

export function getGoalStatusLabel(status: GoalStatus) {
  return GOAL_STATUSES.find((item) => item.value === status)?.label ?? status;
}
