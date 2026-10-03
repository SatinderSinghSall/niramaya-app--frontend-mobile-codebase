import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type DrawerItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
  badge?: number;
};

export default function DrawerItem({
  label,
  icon,
  onPress,
  active = false,
  danger = false,
  badge,
}: DrawerItemProps) {
  const iconColor = danger ? "#D35B52" : active ? "#3B5A3E" : "#68736A";
  const textColor = danger ? "#C54840" : active ? "#243D28" : "#3B463E";

  return (
    <Pressable
      onPress={onPress}
      className={`mx-3 my-0.5 h-[46px] flex-row items-center px-3 transition-all ${
        active
          ? "rounded-[12px] bg-[#EAF2E7] border border-[#D5E4D0]"
          : "rounded-[12px] bg-transparent"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {/* ================================================================
          ACTIVE ACCENT BAR (LEFT)
      ================================================================= */}
      <View className="mr-2 w-[3px] items-center justify-center">
        {active ? (
          <View className="h-[18px] w-[3px] rounded-full bg-[#4D6A50]" />
        ) : null}
      </View>

      {/* ================================================================
          ICON CONTAINER
      ================================================================= */}
      <View
        className={`h-[34px] w-[32px] items-center justify-center rounded-lg ${active ? "bg-[#DFEFE0]" : "bg-[#F4F7F3]"}`}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      {/* ================================================================
          LABEL
      ================================================================= */}
      <Text
        numberOfLines={1}
        className={`ml-2.5 flex-1 text-[13.5px] ${
          active ? "font-bold" : "font-medium"
        }`}
        style={{
          color: textColor,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>

      {/* ================================================================
          NOTIFICATION BADGE
      ================================================================= */}
      {typeof badge === "number" && badge > 0 ? (
        <View className="mr-2 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D95C57] px-[5px]">
          <Text className="text-[9px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </Text>
        </View>
      ) : null}

      {/* ================================================================
          ACTIVE SUBTLE DOT INDICATOR
      ================================================================= */}
      {active ? (
        <View className="mr-1 h-[6px] w-[6px] rounded-full bg-[#4D6A50]" />
      ) : null}
    </Pressable>
  );
}
