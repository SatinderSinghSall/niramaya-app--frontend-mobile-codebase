import React, { useEffect, useRef } from "react";

import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width } = useWindowDimensions();

  /* ---------------------------------
     Animation values
  --------------------------------- */

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;

  const loaderOpacity = useRef(new Animated.Value(0)).current;

  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  /* ---------------------------------
     Splash animation
  --------------------------------- */

  useEffect(() => {
    Animated.sequence([
      /* Logo */
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),

      /* Text + loader */
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(loaderOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      /* Keep the splash visible briefly */
      Animated.delay(1200),
    ]).start(() => {
      onFinishRef.current?.();
    });
  }, [contentOpacity, contentTranslate, loaderOpacity, logoOpacity, logoScale]);

  /*
   * Keep the logo responsive without making it
   * excessively large on smaller phones.
   */
  const logoSize = Math.min(width * 0.46, 190);

  return (
    <View className="flex-1 items-center justify-center bg-[#F7F5EF]">
      <StatusBar hidden />

      {/* ---------------------------------
          Very subtle background
      --------------------------------- */}

      <View className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#E8EEE3] opacity-45" />

      <View className="absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-[#E3EBDD] opacity-45" />

      {/* ---------------------------------
          Main splash content
      --------------------------------- */}

      <View className="w-full items-center px-6">
        {/* Logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
          className="items-center justify-center"
        >
          <Image
            source={require("../../../assets/images/app-icon.jpeg")}
            resizeMode="contain"
            style={{
              width: logoSize,
              height: logoSize,
            }}
          />
        </Animated.View>

        {/* ---------------------------------
            Brand + welcome content
        --------------------------------- */}

        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslate }],
          }}
          className="mt-5 items-center"
        >
          {/* App name */}
          <Text className="text-[30px] font-semibold tracking-[4.5px] text-[#263F31]">
            NIRAMAYA
          </Text>

          {/* Three words */}
          <Text className="mt-2 text-[12px] font-medium tracking-[1.3px] text-[#6D796F]">
            Wellness
            <Text className="text-[#8BA08A]"> • </Text>
            Balance
            <Text className="text-[#8BA08A]"> • </Text>
            You
          </Text>

          {/* Divider */}
          <View className="mt-7 h-[1px] w-8 bg-[#718571] opacity-60" />

          {/* Welcome */}
          <Text className="mt-5 text-[14px] font-medium text-[#536055]">
            A healthier you starts here
          </Text>

          <Text className="mt-2 max-w-[270px] text-center text-[11px] leading-[17px] text-[#8A928B]">
            Personalized wellness for your everyday life
          </Text>
        </Animated.View>

        {/* ---------------------------------
            Loader
        --------------------------------- */}

        <Animated.View
          style={{
            opacity: loaderOpacity,
          }}
          className="mt-10 items-center"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full border border-[#D8E1D5] bg-[#FAFBF8]">
            <ActivityIndicator size="small" color="#4D6A50" />
          </View>

          <Text className="mt-3 text-[9px] font-medium tracking-[1.2px] text-[#9AA19B]">
            GETTING THINGS READY
          </Text>
        </Animated.View>
      </View>

      {/* ---------------------------------
          Bottom branding
      --------------------------------- */}

      <View className="absolute bottom-8 items-center">
        <Text className="text-[9px] tracking-[1px] text-[#9AA19B]">
          HOLISTIC HEALTH & WELLBEING
        </Text>
      </View>
    </View>
  );
}
