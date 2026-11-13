import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  primary: "#4D6A50",
  dark: "#304B36",
  deeper: "#263D2C",
  white: "#FFFFFF",
  secondary: "#E8EFE8",
  muted: "#D0DDD1",
  gold: "#D2B477",
  chip: "rgba(255,255,255,0.14)",
  chipBorder: "rgba(255,255,255,0.22)",
  divider: "rgba(255,255,255,0.22)",
};

export default function HealthProfileCTA() {
  const handlePress = () => {
    router.push("/(main)/health-profile" as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="View your health profile"
      accessibilityHint="Opens your personal health profile"
      className="mb-5 mt-4 overflow-hidden rounded-[25px]"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.99 : 1 }],
        shadowColor: "#263D2C",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 4,
      })}
    >
      {/* MAIN CARD BACKGROUND */}
      <View
        className="overflow-hidden rounded-[25px]"
        style={{ backgroundColor: COLORS.primary }}
      >
        {/* TOP ACCENT */}
        <View className="h-[3px] flex-row">
          <View className="flex-1" style={{ backgroundColor: COLORS.gold }} />
          <View className="w-12" style={{ backgroundColor: COLORS.deeper }} />
        </View>

        {/* DECORATIVE CIRCLES */}
        <View
          pointerEvents="none"
          className="absolute right-[-45px] top-[65px] h-[150px] w-[150px] rounded-full"
          style={{
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />

        <View
          pointerEvents="none"
          className="absolute right-[-18px] top-[90px] h-[95px] w-[95px] rounded-full"
          style={{
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
          }}
        />

        <View className="p-[17px]">
          {/* EYEBROW */}
          <View className="mb-4 flex-row items-center">
            <View
              className="mr-2 h-[3px] w-5 rounded-full"
              style={{ backgroundColor: COLORS.gold }}
            />

            <Text
              className="text-[9px] font-bold tracking-[1.4px]"
              style={{ color: COLORS.secondary }}
            >
              YOUR PERSONAL HEALTH SPACE
            </Text>

            <View
              className="ml-auto flex-row items-center rounded-full px-2.5 py-1"
              style={{
                backgroundColor: COLORS.chip,
                borderWidth: 1,
                borderColor: COLORS.chipBorder,
              }}
            >
              <Ionicons
                name="heart-circle-outline"
                size={12}
                color={COLORS.gold}
              />

              <Text
                className="ml-1 text-[8px] font-bold"
                style={{ color: COLORS.white }}
              >
                HEALTH & WELLNESS
              </Text>
            </View>
          </View>

          {/* MAIN CONTENT */}
          <View className="flex-row items-center">
            {/* ICON */}
            <View
              className="h-[58px] w-[58px] items-center justify-center rounded-[19px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.16)",
                borderWidth: 1,
                borderColor: COLORS.chipBorder,
              }}
            >
              <Ionicons name="heart-outline" size={29} color={COLORS.white} />

              {/* GOLD CHECK */}
              <View
                className="absolute bottom-[-4px] right-[-4px] h-[19px] w-[19px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.gold,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              >
                <Ionicons name="checkmark" size={10} color={COLORS.deeper} />
              </View>
            </View>

            {/* TEXT */}
            <View className="ml-3.5 flex-1 pr-1">
              <Text
                className="font-serif text-[18px] font-bold leading-[24px]"
                style={{ color: COLORS.white }}
              >
                Your health, all in one place.
              </Text>

              <Text
                numberOfLines={3}
                className="mt-1.5 text-[10px] leading-[16px]"
                style={{ color: COLORS.secondary }}
              >
                Keep your health information, lifestyle and wellbeing details
                together in one personal profile.
              </Text>
            </View>
          </View>

          {/* PROFILE CATEGORIES */}
          <View className="mt-4 flex-row flex-wrap items-center">
            {[
              {
                icon: "person-outline" as const,
                label: "Personal details",
              },
              {
                icon: "fitness-outline" as const,
                label: "Health",
              },
              {
                icon: "leaf-outline" as const,
                label: "Lifestyle",
              },
            ].map((item) => (
              <View
                key={item.label}
                className="mb-1.5 mr-2 flex-row items-center rounded-full px-2.5 py-1.5"
                style={{
                  backgroundColor: COLORS.chip,
                  borderWidth: 1,
                  borderColor: COLORS.chipBorder,
                }}
              >
                <Ionicons name={item.icon} size={11} color={COLORS.gold} />

                <Text
                  className="ml-1.5 text-[9px] font-semibold"
                  style={{ color: COLORS.white }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* DIVIDER */}
          <View
            className="my-3.5 h-px"
            style={{ backgroundColor: COLORS.divider }}
          />

          {/* CTA BUTTON */}
          <View
            className="flex-row items-center justify-between rounded-[15px] px-3.5 py-3.5"
            style={{
              backgroundColor: COLORS.dark,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.13)",
            }}
          >
            <View className="flex-1 flex-row items-center">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              >
                <Ionicons
                  name="medical-outline"
                  size={15}
                  color={COLORS.gold}
                />
              </View>

              <View className="ml-2.5 flex-1">
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: COLORS.white }}
                >
                  Explore Your Health Profile
                </Text>

                <Text
                  className="mt-0.5 text-[8px]"
                  style={{ color: COLORS.muted }}
                >
                  Review your personal health information
                </Text>
              </View>
            </View>

            <View
              className="ml-2 h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.16)",
              }}
            >
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </View>
          </View>

          {/* FOOTER */}
          <View className="mt-3 flex-row items-center justify-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={11}
              color={COLORS.gold}
            />

            <Text
              className="ml-1.5 text-[8px] font-medium"
              style={{ color: COLORS.secondary }}
            >
              Your personal wellbeing, thoughtfully organised
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
