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
  const iconColor = danger ? "#C85C55" : active ? "#4D6A50" : "#727C74";

  const textColor = danger ? "#B5524B" : active ? "#304B36" : "#465049";

  return (
    <Pressable
      onPress={onPress}
      className={`mx-3 mb-0.5 h-[44px] flex-row items-center px-2.5 ${
        active ? "rounded-[9px] bg-[#F1F5EE]" : "rounded-[9px]"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.58 : 1,
      })}
    >
      {/* ================================================================
          ACTIVE ACCENT
      ================================================================= */}

      <View className="mr-1.5 w-[3px] items-center justify-center">
        {active ? (
          <View className="h-[20px] w-[3px] rounded-full bg-[#4D6A50]" />
        ) : null}
      </View>

      {/* ================================================================
          ICON
      ================================================================= */}

      <View className="h-[34px] w-[30px] items-center justify-center">
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>

      {/* ================================================================
          LABEL
      ================================================================= */}

      <Text
        numberOfLines={1}
        className={`ml-2 flex-1 text-[13px] ${
          active ? "font-semibold" : "font-medium"
        }`}
        style={{
          color: textColor,
          letterSpacing: 0.05,
        }}
      >
        {label}
      </Text>

      {/* ================================================================
          NOTIFICATION BADGE
      ================================================================= */}

      {typeof badge === "number" && badge > 0 ? (
        <View className="mr-2 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D95C57] px-[5px]">
          <Text className="text-[8px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </Text>
        </View>
      ) : null}

      {/* ================================================================
          ACTIVE INDICATOR
      ================================================================= */}

      {active ? (
        <View className="mr-1 h-[5px] w-[5px] rounded-full bg-[#4D6A50]" />
      ) : null}
    </Pressable>
  );
}
