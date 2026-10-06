import {
  CheckCircle2,
  Info,
  Sparkles,
  TriangleAlert,
} from "lucide-react-native";
import { Text, View } from "react-native";

import type { AnnouncementType } from "@/types/announcement";

interface AnnouncementTypeBadgeProps {
  type: AnnouncementType;
  compact?: boolean;
}

const config: Record<
  AnnouncementType,
  {
    label: string;
    icon: typeof Info;
    container: string;
    iconColor: string;
    textColor: string;
  }
> = {
  info: {
    label: "Information",
    icon: Info,
    container: "bg-blue-50",
    iconColor: "#2563EB",
    textColor: "text-blue-700",
  },

  success: {
    label: "Success",
    icon: CheckCircle2,
    container: "bg-emerald-50",
    iconColor: "#059669",
    textColor: "text-emerald-700",
  },

  warning: {
    label: "Warning",
    icon: TriangleAlert,
    container: "bg-amber-50",
    iconColor: "#D97706",
    textColor: "text-amber-700",
  },

  feature: {
    label: "New feature",
    icon: Sparkles,
    container: "bg-violet-50",
    iconColor: "#7C3AED",
    textColor: "text-violet-700",
  },
};

export default function AnnouncementTypeBadge({
  type,
  compact = false,
}: AnnouncementTypeBadgeProps) {
  const item = config[type] ?? config.info;
  const Icon = item.icon;

  return (
    <View
      className={`
        ${item.container}
        flex-row
        items-center
        self-start
        rounded-full
        ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}
      `}
    >
      <Icon size={compact ? 12 : 14} color={item.iconColor} />

      <Text
        className={`
          ml-1.5
          font-semibold
          ${item.textColor}
          ${compact ? "text-[10px]" : "text-xs"}
        `}
      >
        {item.label}
      </Text>
    </View>
  );
}
