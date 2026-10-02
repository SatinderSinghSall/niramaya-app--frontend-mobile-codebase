import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  green: "#15803D",
  greenLight: "#E8F7EE",
  inactive: "#94A3B8",
  white: "#FFFFFF",
  border: "#E8ECE9",
  text: "#17211B",
};

type TabIconProps = {
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

/**
 * Standard tab icon
 */
function TabIcon({ focused, activeIcon, inactiveIcon }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={22}
        color={focused ? COLORS.green : COLORS.inactive}
      />
    </View>
  );
}

/**
 * Yoga tab icon
 */
function YogaTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <MaterialCommunityIcons
        name="yoga"
        size={23}
        color={focused ? COLORS.green : COLORS.inactive}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  /**
   * This is the actual usable navigation content height.
   *
   * The safe-area inset is NOT part of this value.
   * We add the system bottom inset separately below.
   */
  const TAB_CONTENT_HEIGHT = 64;

  /**
   * Total physical height of the bottom bar.
   *
   * Examples:
   *
   * Gesture navigation:
   *   64 + ~24 = ~88px
   *
   * Android 3-button navigation:
   *   64 + ~48 = ~112px
   *
   * iPhone with home indicator:
   *   64 + ~34 = ~98px
   *
   * This makes the white navigation background extend
   * behind/into the system safe area while keeping the
   * actual buttons above it.
   */
  const bottomSafeArea = insets.bottom;

  const totalTabBarHeight = TAB_CONTENT_HEIGHT + bottomSafeArea;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        /**
         * Labels
         */
        tabBarShowLabel: true,

        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.inactive,

        /**
         * =========================================================
         * BOTTOM BAR
         * =========================================================
         *
         * IMPORTANT:
         *
         * This is NOT floating.
         *
         * It is attached directly to the bottom of the screen.
         */
        tabBarStyle: {
          height: totalTabBarHeight,

          backgroundColor: COLORS.white,

          /**
           * Only the top gets visual separation.
           */
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: COLORS.border,

          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,

          /**
           * Content spacing.
           *
           * Safe-area space is reserved at the bottom.
           */
          paddingTop: 6,
          paddingBottom: bottomSafeArea,

          /**
           * Android elevation.
           */
          elevation: 8,

          /**
           * iOS shadow.
           */
          shadowColor: "#17211B",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },

        /**
         * =========================================================
         * TAB ITEM
         * =========================================================
         */
        tabBarItemStyle: {
          height: TAB_CONTENT_HEIGHT - 6,

          paddingTop: 0,
          paddingBottom: 0,

          alignItems: "center",
          justifyContent: "center",
        },

        /**
         * =========================================================
         * LABEL
         * =========================================================
         */
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",

          marginTop: 2,

          lineHeight: 14,
        },

        /**
         * Hide navigation bar while keyboard is open.
         */
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* ========================================================= */}
      {/* HOME */}
      {/* ========================================================= */}

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      {/* ========================================================= */}
      {/* EXPLORE */}
      {/* ========================================================= */}

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="compass"
              inactiveIcon="compass-outline"
            />
          ),
        }}
      />

      {/* ========================================================= */}
      {/* YOGA */}
      {/* ========================================================= */}

      <Tabs.Screen
        name="yoga"
        options={{
          title: "Yoga",

          tabBarIcon: ({ focused }) => <YogaTabIcon focused={focused} />,
        }}
      />

      {/* ========================================================= */}
      {/* AYURVEDA */}
      {/* ========================================================= */}

      <Tabs.Screen
        name="ayurveda"
        options={{
          title: "Ayurveda",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="leaf"
              inactiveIcon="leaf-outline"
            />
          ),
        }}
      />

      {/* ========================================================= */}
      {/* PROFILE */}
      {/* ========================================================= */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="person"
              inactiveIcon="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * ===============================================================
 * STYLES
 * ===============================================================
 */

const styles = StyleSheet.create({
  /**
   * Small rounded background behind the ACTIVE icon only.
   *
   * This gives the selected tab a subtle Niramaya-style
   * highlight without turning the entire navigation into
   * a floating pill.
   */
  iconContainer: {
    width: 42,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 17,

    backgroundColor: "transparent",
  },

  activeIconContainer: {
    backgroundColor: COLORS.greenLight,
  },
});
