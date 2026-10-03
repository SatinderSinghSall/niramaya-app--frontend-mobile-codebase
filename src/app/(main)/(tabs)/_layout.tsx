import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

/**
 * ===============================================================
 * COLORS
 * ===============================================================
 */

const COLORS = {
  green: "#4D6A50",
  greenDark: "#304A36",
  greenSoft: "#E8F0E8",
  inactive: "#8B9590",
  white: "#FFFFFF",
  border: "#E5EAE5",
  text: "#202722",
};

/**
 * ===============================================================
 * TAB CONFIGURATION
 * ===============================================================
 */

const TAB_CONFIG = {
  home: {
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  explore: {
    label: "Explore",
    icon: "compass-outline",
    activeIcon: "compass",
  },
  yoga: {
    label: "Yoga",
  },
  ayurveda: {
    label: "Ayurveda",
    icon: "leaf-outline",
    activeIcon: "leaf",
  },
  profile: {
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
} as const;

/**
 * ===============================================================
 * NAVIGATION DIMENSIONS
 * ===============================================================
 */

const BAR_HEIGHT = 72;
const ACTIVE_SIZE = 50;

/**
 * ===============================================================
 * SHADOWS
 * ===============================================================
 */

const FLOATING_SHADOW = {
  elevation: 16,
  shadowColor: "#111814",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
};

const ACTIVE_ICON_SHADOW = {
  elevation: 8,
  shadowColor: "#304A36",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.22,
  shadowRadius: 8,
};

/**
 * ===============================================================
 * STANDARD TAB ITEM
 * ===============================================================
 */

function StandardTabIcon({
  focused,
  icon,
  activeIcon,
  label,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: focused ? 1 : 0,
      damping: 16,
      stiffness: 220,
      mass: 0.55,
      useNativeDriver: true,
    }).start();
  }, [focused, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <Animated.View
      className="items-center justify-center"
      style={{
        transform: [{ translateY }],
      }}
    >
      {focused ? (
        <View className="items-center justify-center">
          <View
            className="items-center justify-center rounded-full bg-[#4D6A50]"
            style={{
              width: ACTIVE_SIZE,
              height: ACTIVE_SIZE,
              borderWidth: 3,
              borderColor: COLORS.white,
              ...ACTIVE_ICON_SHADOW,
            }}
          >
            <Ionicons name={activeIcon} size={22} color="#FFFFFF" />
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-bold text-[#304A36]"
            style={{ marginTop: 5 }}
          >
            {label}
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center">
          <Ionicons name={icon} size={24} color={COLORS.inactive} />
          <Text
            numberOfLines={1}
            className="text-[11px] font-medium text-[#8B9590]"
            style={{ marginTop: 5 }}
          >
            {label}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/**
 * ===============================================================
 * YOGA TAB ITEM
 * ===============================================================
 */

function YogaTabIcon({ focused, label }: { focused: boolean; label: string }) {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: focused ? 1 : 0,
      damping: 16,
      stiffness: 220,
      mass: 0.55,
      useNativeDriver: true,
    }).start();
  }, [focused, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <Animated.View
      className="items-center justify-center"
      style={{
        transform: [{ translateY }],
      }}
    >
      {focused ? (
        <View className="items-center justify-center">
          <View
            className="items-center justify-center rounded-full bg-[#4D6A50]"
            style={{
              width: ACTIVE_SIZE,
              height: ACTIVE_SIZE,
              borderWidth: 3,
              borderColor: COLORS.white,
              ...ACTIVE_ICON_SHADOW,
            }}
          >
            <MaterialCommunityIcons name="yoga" size={24} color="#FFFFFF" />
          </View>
          <Text
            numberOfLines={1}
            className="text-[11px] font-bold text-[#304A36]"
            style={{ marginTop: 5 }}
          >
            {label}
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center">
          <MaterialCommunityIcons
            name="yoga"
            size={24}
            color={COLORS.inactive}
          />
          <Text
            numberOfLines={1}
            className="text-[11px] font-medium text-[#8B9590]"
            style={{ marginTop: 5 }}
          >
            {label}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/**
 * ===============================================================
 * CUSTOM FLOATING TAB BAR
 * ===============================================================
 */

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  // Safe calculation to ensure it clears device system bars safely on both iOS & Android
  const bottomMargin = Math.max(insets.bottom, 14);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center pointer-events-box-none"
      style={{
        paddingBottom: bottomMargin,
        paddingHorizontal: 16,
      }}
    >
      {/* FLOATING PILL CONTAINER */}
      <View
        className="w-full flex-row items-center justify-around bg-white rounded-full border border-[#E5EAE5]"
        style={{
          height: BAR_HEIGHT,
          overflow: "visible",
          ...FLOATING_SHADOW,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];

          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                height: BAR_HEIGHT,
              })}
            >
              <View className="items-center justify-center">
                {route.name === "yoga" ? (
                  <YogaTabIcon focused={focused} label={config.label} />
                ) : (
                  <StandardTabIcon
                    focused={focused}
                    icon={config.icon as keyof typeof Ionicons.glyphMap}
                    activeIcon={
                      config.activeIcon as keyof typeof Ionicons.glyphMap
                    }
                    label={config.label}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * ===============================================================
 * MAIN TAB LAYOUT
 * ===============================================================
 */

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        animation: "shift",
        sceneStyle: {
          paddingBottom: 100, // Provides ample scroll clearance so content scrolls completely past the bar
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="yoga" options={{ title: "Yoga" }} />
      <Tabs.Screen name="ayurveda" options={{ title: "Ayurveda" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
