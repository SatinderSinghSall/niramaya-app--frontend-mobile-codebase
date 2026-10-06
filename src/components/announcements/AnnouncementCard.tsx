import {
  ChevronRight,
  Clock3,
  ExternalLink,
  Megaphone,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { Announcement } from "@/types/announcement";

import AnnouncementTypeBadge from "./AnnouncementTypeBadge";

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: (announcement: Announcement) => void;
}

function formatDate(value?: string | null) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const accentConfig = {
  info: {
    iconBg: "bg-blue-50",
    iconColor: "#2563EB",
  },
  success: {
    iconBg: "bg-emerald-50",
    iconColor: "#059669",
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "#D97706",
  },
  feature: {
    iconBg: "bg-violet-50",
    iconColor: "#7C3AED",
  },
};

export default function AnnouncementCard({
  announcement,
  onPress,
}: AnnouncementCardProps) {
  const accent = accentConfig[announcement.type] ?? accentConfig.info;

  return (
    <Pressable
      onPress={() => onPress(announcement)}
      accessibilityRole="button"
      accessibilityLabel={`View announcement: ${announcement.title}`}
      className="
        mb-3
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
      "
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        transform: [
          {
            scale: pressed ? 0.99 : 1,
          },
        ],
      })}
    >
      <View className="p-4">
        {/* Top row */}
        <View className="flex-row items-start">
          <View
            className={`
              ${accent.iconBg}
              mr-3
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
            `}
          >
            <Megaphone size={19} color={accent.iconColor} />
          </View>

          <View className="min-w-0 flex-1">
            <View className="flex-row items-start justify-between">
              <View className="mr-2 flex-1">
                <AnnouncementTypeBadge type={announcement.type} compact />
              </View>

              <ChevronRight size={18} color="#94A3B8" />
            </View>

            <Text
              numberOfLines={2}
              className="
                mt-2
                text-[15px]
                font-bold
                leading-5
                text-slate-900
              "
            >
              {announcement.title}
            </Text>
          </View>
        </View>

        {/* Message */}
        <Text
          numberOfLines={3}
          className="
            mt-3
            text-sm
            leading-6
            text-slate-500
          "
        >
          {announcement.message}
        </Text>

        {/* Footer */}
        <View
          className="
            mt-4
            flex-row
            items-center
            justify-between
            border-t
            border-slate-100
            pt-3
          "
        >
          <View className="flex-row items-center">
            <Clock3 size={13} color="#94A3B8" />

            <Text
              className="
                ml-1.5
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              {formatDate(announcement.startDate)}
            </Text>
          </View>

          {announcement.action?.enabled ? (
            <View className="flex-row items-center">
              <ExternalLink size={12} color="#64748B" />

              <Text
                className="
                  ml-1
                  text-[11px]
                  font-semibold
                  text-slate-500
                "
              >
                Action available
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
