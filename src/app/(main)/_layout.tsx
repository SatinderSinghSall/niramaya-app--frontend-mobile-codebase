import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DrawerProvider } from "@/components/navigation/DrawerContext";
import AppDrawer from "@/components/navigation/AppDrawer";

type TabIconProps = {
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

function TabIcon({ focused, activeIcon, inactiveIcon }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={21}
        color={focused ? "#15803D" : "#94A3B8"}
      />
    </View>
  );
}

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  /*
   * Base height of the actual navigation content.
   *
   * The safe-area inset is added separately so the navigation
   * never sits underneath:
   *
   * - Android gesture navigation
   * - Android 3-button navigation
   * - iPhone home indicator
   */
  const baseTabBarHeight = Platform.OS === "ios" ? 56 : 58;

  const bottomSafeArea = insets.bottom;

  const tabBarHeight = baseTabBarHeight + bottomSafeArea;

  return (
    <DrawerProvider>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,

            tabBarShowLabel: true,

            tabBarActiveTintColor: "#15803D",
            tabBarInactiveTintColor: "#94A3B8",

            /*
             * SAFE-AREA-AWARE BOTTOM NAVIGATION
             */
            tabBarStyle: {
              height: tabBarHeight,

              paddingTop: 7,

              /*
               * The system safe-area belongs here.
               */
              paddingBottom: bottomSafeArea + 5,

              backgroundColor: "#FFFFFF",

              borderTopWidth: 1,
              borderTopColor: "#E8ECE9",

              /*
               * Android elevation
               */
              elevation: 8,

              /*
               * iOS shadow
               */
              shadowColor: "#17211B",
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },

            tabBarItemStyle: {
              paddingVertical: 0,
            },

            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
              marginTop: 2,
            },

            /*
             * Prevent keyboard from making the navigation behave badly.
             */
            tabBarHideOnKeyboard: true,
          }}
        >
          {/* ========================= */}
          {/* HOME */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* EXPLORE */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* PROFILE */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* HIDDEN SCREENS */}
          {/* ========================= */}

          {/* Goal Screen */}
          <Tabs.Screen
            name="goals"
            options={{
              href: null,
            }}
          />

          {/* Goal Creation */}
          <Tabs.Screen
            name="goal-create"
            options={{
              href: null,
            }}
          />

          {/* Goal Details */}
          <Tabs.Screen
            name="goals/[id]"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* YOGA */}
          {/* ========================= */}

          <Tabs.Screen
            name="yoga"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="yoga/[id]"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* AYURVEDA */}
          {/* ========================= */}

          <Tabs.Screen
            name="ayurveda"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="ayurveda/[id]"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* SEARCH */}
          {/* ========================= */}

          <Tabs.Screen
            name="search"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* FAVORITES */}
          {/* ========================= */}

          <Tabs.Screen
            name="favorites"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* PROGRESS */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* HEALTH PROFILE */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* CONSULTATION */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* NOTIFICATIONS */}
          {/* ========================= */}

          <Tabs.Screen
            name="notifications"
            options={{
              href: null,
            }}
          />

          {/* ========================= */}
          {/* PROFILE & SETTINGS */}
          {/* ========================= */}

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

        {/* ========================= */}
        {/* APP DRAWER */}
        {/* ========================= */}

        <AppDrawer />
      </View>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: "transparent",
  },

  iconContainerActive: {
    backgroundColor: "#E8F7EE",
  },
});
