import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DrawerProvider } from "@/components/navigation/DrawerContext";
import AppDrawer from "@/components/navigation/AppDrawer";

/**
 * ============================================================
 * COLORS
 * ============================================================
 */

const COLORS = {
  green: "#15803D",
  greenLight: "#E8F7EE",
  inactive: "#94A3B8",
  white: "#FFFFFF",
  border: "#E8ECE9",
};

/**
 * ============================================================
 * STANDARD TAB ICON
 * ============================================================
 */

type TabIconProps = {
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

function TabIcon({ focused, activeIcon, inactiveIcon }: TabIconProps) {
  return (
    <View
      className={`h-[34px] w-[42px] items-center justify-center rounded-full ${
        focused ? "bg-[#E8F7EE]" : "bg-transparent"
      }`}
    >
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={22}
        color={focused ? COLORS.green : COLORS.inactive}
      />
    </View>
  );
}

/**
 * ============================================================
 * YOGA TAB ICON
 * ============================================================
 */

function YogaTabIcon({ focused }: { focused: boolean }) {
  return (
    <View
      className={`h-[34px] w-[42px] items-center justify-center rounded-full ${
        focused ? "bg-[#E8F7EE]" : "bg-transparent"
      }`}
    >
      <MaterialCommunityIcons
        name="yoga"
        size={23}
        color={focused ? COLORS.green : COLORS.inactive}
      />
    </View>
  );
}

/**
 * ============================================================
 * MAIN LAYOUT
 * ============================================================
 */

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  /**
   * The actual navigation content.
   *
   * 62px = icon + label + comfortable touch area.
   *
   * Safe-area inset is added separately so:
   *
   * iOS:
   * - Home indicator has space
   *
   * Android:
   * - Gesture navigation has space
   * - 3-button navigation has space
   */
  const tabContentHeight = 62;

  const tabBarHeight = tabContentHeight + insets.bottom;

  return (
    <DrawerProvider>
      <View className="flex-1 bg-white">
        <Tabs
          screenOptions={{
            /**
             * ==================================================
             * HEADER
             * ==================================================
             */

            headerShown: false,

            /**
             * ==================================================
             * TAB LABEL
             * ==================================================
             */

            tabBarShowLabel: true,

            tabBarActiveTintColor: COLORS.green,
            tabBarInactiveTintColor: COLORS.inactive,

            /**
             * ==================================================
             * BOTTOM NAVIGATION
             * ==================================================
             *
             * IMPORTANT:
             *
             * No absolute positioning.
             * No floating margins.
             *
             * This stays attached to the bottom of the screen.
             */

            tabBarStyle: {
              height: tabBarHeight,

              paddingTop: 5,

              /**
               * Safe area is handled inside the tab bar.
               */
              paddingBottom: insets.bottom + 3,

              backgroundColor: COLORS.white,

              /**
               * Clean divider at the top.
               */
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: COLORS.border,

              /**
               * Android
               */
              elevation: 8,

              /**
               * iOS
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
             * ==================================================
             * TAB ITEM
             * ==================================================
             */

            tabBarItemStyle: {
              paddingTop: 0,
              paddingBottom: 0,

              /**
               * Gives every tab equal vertical alignment.
               */
              height: tabContentHeight,
            },

            /**
             * ==================================================
             * LABEL
             * ==================================================
             */

            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",

              /**
               * Keeps text visually close to the icon.
               */
              marginTop: 2,

              lineHeight: 14,
            },

            /**
             * ==================================================
             * KEYBOARD
             * ==================================================
             */

            tabBarHideOnKeyboard: true,
          }}
        >
          {/* ================================================== */}
          {/* HOME */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* EXPLORE */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* YOGA */}
          {/* ================================================== */}

          <Tabs.Screen
            name="yoga"
            options={{
              title: "Yoga",

              tabBarIcon: ({ focused }) => <YogaTabIcon focused={focused} />,
            }}
          />

          {/* ================================================== */}
          {/* AYURVEDA */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* PROFILE */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* HIDDEN SCREENS */}
          {/* ================================================== */}

          {/* GOALS */}

          <Tabs.Screen
            name="goals"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="goal-create"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="goals/[id]"
            options={{
              href: null,
            }}
          />

          {/* YOGA DETAILS */}

          <Tabs.Screen
            name="yoga/[id]"
            options={{
              href: null,
            }}
          />

          {/* AYURVEDA DETAILS */}

          <Tabs.Screen
            name="ayurveda/[id]"
            options={{
              href: null,
            }}
          />

          {/* SEARCH */}

          <Tabs.Screen
            name="search"
            options={{
              href: null,
            }}
          />

          {/* FAVORITES */}

          <Tabs.Screen
            name="favorites"
            options={{
              href: null,
            }}
          />

          {/* ================================================== */}
          {/* PROGRESS */}
          {/* ================================================== */}

          <Tabs.Screen
            name="progress"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="progress-create"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="progress/[id]"
            options={{
              href: null,
            }}
          />

          {/* ================================================== */}
          {/* HEALTH PROFILE */}
          {/* ================================================== */}

          <Tabs.Screen
            name="health-profile"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="health-profile-edit"
            options={{
              href: null,
            }}
          />

          {/* ================================================== */}
          {/* CONSULTATION */}
          {/* ================================================== */}

          <Tabs.Screen
            name="consultation/[id]"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="consultation-book"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="consultation-history"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="consultation"
            options={{
              href: null,
            }}
          />

          {/* ================================================== */}
          {/* NOTIFICATIONS */}
          {/* ================================================== */}

          <Tabs.Screen
            name="notifications"
            options={{
              href: null,
            }}
          />

          {/* ================================================== */}
          {/* SETTINGS */}
          {/* ================================================== */}

          <Tabs.Screen
            name="settings"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="profile-edit"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="change-password"
            options={{
              href: null,
            }}
          />
        </Tabs>

        {/* ==================================================== */}
        {/* APP DRAWER */}
        {/* ==================================================== */}

        <AppDrawer />
      </View>
    </DrawerProvider>
  );
}
