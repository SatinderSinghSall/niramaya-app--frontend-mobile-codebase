import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getFavorites } from "@/services/explore.service";

import { ExploreContentType, ExploreItem } from "@/types/explore";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F5F0",
  surface: "#FFFFFF",

  text: "#263128",
  muted: "#747C75",
  softMuted: "#9BA39C",

  green: "#4D6A50",
  darkGreen: "#304B36",

  lightGreen: "#EEF4EA",
  paleGreen: "#F4F7F2",

  border: "#E5E1D8",

  danger: "#C85C55",
};

/* ==========================================================================
   HELPERS
========================================================================== */

function getType(item: ExploreItem): ExploreContentType {
  if (item.resultType) {
    return item.resultType;
  }

  return item.type === "ayurveda" ? "ayurveda" : "yoga";
}

function getItemImage(item: ExploreItem) {
  return (
    (item as any)?.imageUrl ||
    (item as any)?.image ||
    (item as any)?.thumbnailUrl ||
    (item as any)?.thumbnail ||
    (item as any)?.coverImage ||
    (item as any)?.featuredImage ||
    null
  );
}

/* ==========================================================================
   HEADER
========================================================================== */

function FavoritesHeader({ count }: { count: number }) {
  return (
    <View className="mt-7">
      <View className="flex-row items-end justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#89928B]">
            Your collection
          </Text>

          <Text className="mt-1.5 font-serif text-[28px] font-bold text-[#263128]">
            Favorites
          </Text>

          <Text className="mt-2 max-w-[310px] text-[12px] leading-[18px] text-[#788179]">
            Practices and wellness ideas you've chosen to keep close.
          </Text>
        </View>

        {/* Count */}
        <View className="mb-1 min-w-[54px] items-center rounded-[10px] border border-[#DDE4DA] bg-[#F1F5EE] px-3 py-2">
          <Text className="text-[17px] font-bold text-[#4D6A50]">{count}</Text>

          <Text className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.6px] text-[#7C897E]">
            saved
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ==========================================================================
   FAVORITE CARD
========================================================================== */

function FavoriteCard({
  item,
  onPress,
}: {
  item: ExploreItem;
  onPress: () => void;
}) {
  const type = getType(item);
  const image = getItemImage(item);

  const title = item.title || item.name || "Wellness practice";

  const category = item.category || "";

  const description = item.description || "";

  const isYoga = type === "yoga";

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="mb-3 overflow-hidden rounded-[14px] border border-[#E4E0D7] bg-white"
    >
      <View className="flex-row p-3.5">
        {/* ================================================================
            IMAGE / ICON
        ================================================================ */}

        <View className="h-[82px] w-[82px] overflow-hidden rounded-[10px] bg-[#EEF2EB]">
          {image ? (
            <Image
              source={{
                uri: image,
              }}
              resizeMode="cover"
              className="h-full w-full"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Ionicons
                name={isYoga ? "body-outline" : "leaf-outline"}
                size={28}
                color="#6B846E"
              />
            </View>
          )}
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <View className="ml-3 flex-1 justify-center">
          {/* Type */}
          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Ionicons
                name={isYoga ? "body-outline" : "leaf-outline"}
                size={11}
                color="#5E775F"
              />

              <Text className="ml-1 text-[9px] font-bold uppercase tracking-[0.7px] text-[#5E775F]">
                {isYoga ? "Yoga" : "Ayurveda"}
              </Text>
            </View>

            {category ? (
              <>
                <View className="mx-1.5 h-[3px] w-[3px] rounded-full bg-[#B0B7B0]" />

                <Text
                  numberOfLines={1}
                  className="max-w-[105px] text-[9px] font-medium text-[#929A93]"
                >
                  {category}
                </Text>
              </>
            ) : null}
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            className="mt-1.5 font-serif text-[14px] font-bold leading-[18px] text-[#263128]"
          >
            {title}
          </Text>

          {/* Description */}
          {description ? (
            <Text
              numberOfLines={1}
              className="mt-1 text-[9px] leading-[14px] text-[#8A928B]"
            >
              {description}
            </Text>
          ) : null}
        </View>

        {/* ================================================================
            ARROW
        ================================================================ */}

        <View className="ml-2 items-center justify-center">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-[#F3F5F1]">
            <Ionicons name="arrow-forward" size={13} color="#667568" />
          </View>
        </View>
      </View>

      {/* ================================================================
          BOTTOM ACCENT
      ================================================================ */}

      <View className={`h-[2px] ${isYoga ? "bg-[#DCE8D8]" : "bg-[#E5E0CF]"}`} />
    </TouchableOpacity>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function EmptyFavorites() {
  return (
    <View className="mt-8 overflow-hidden rounded-[16px] border border-[#E3E0D7] bg-white">
      <View className="items-center px-7 pb-8 pt-9">
        <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-[#EEF4EA]">
          <Ionicons name="heart-outline" size={27} color="#4D6A50" />
        </View>

        <Text className="mt-5 font-serif text-[20px] font-bold text-[#263128]">
          Nothing saved yet
        </Text>

        <Text className="mt-2 max-w-[280px] text-center text-[11px] leading-[18px] text-[#7C857E]">
          When you find a yoga practice or Ayurveda recommendation you love,
          save it here for easy access later.
        </Text>

        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => router.push("/(main)/explore")}
          className="mt-6 h-[43px] flex-row items-center justify-center rounded-[9px] bg-[#4D6A50] px-5"
        >
          <Text className="text-[11px] font-bold text-white">
            Explore wellness
          </Text>

          <Ionicons
            name="arrow-forward"
            size={13}
            color="#FFFFFF"
            style={{
              marginLeft: 7,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ==========================================================================
   ERROR STATE
========================================================================== */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="mt-7 rounded-[14px] border border-[#EBD9D6] bg-white p-5">
      <View className="flex-row items-start">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFF0EE]">
          <Ionicons name="alert-circle-outline" size={19} color="#C85C55" />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[13px] font-bold text-[#4A3937]">
            Something went wrong
          </Text>

          <Text className="mt-1 text-[10px] leading-[16px] text-[#8A7774]">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.8}
            className="mt-3 self-start rounded-[7px] border border-[#DADFD9] px-3.5 py-2"
          >
            <Text className="text-[10px] font-bold text-[#4D6A50]">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ==========================================================================
   LOADING
========================================================================== */

function FavoritesLoading() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F5F0]">
      <View className="px-[18px] pt-5">
        <View className="h-9 w-9 rounded-full bg-[#E7E3DA]" />

        <View className="mt-8 h-2.5 w-24 rounded bg-[#E7E3DA]" />

        <View className="mt-2 h-8 w-36 rounded bg-[#E7E3DA]" />

        <View className="mt-2 h-3 w-64 rounded bg-[#E7E3DA]" />

        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="mt-5 h-[110px] rounded-[14px] bg-white p-3"
          >
            <View className="flex-row">
              <View className="h-[82px] w-[82px] rounded-[10px] bg-[#E7E3DA]" />

              <View className="ml-3 flex-1">
                <View className="h-2.5 w-14 rounded bg-[#E7E3DA]" />

                <View className="mt-3 h-4 w-[80%] rounded bg-[#E7E3DA]" />

                <View className="mt-2 h-2.5 w-[60%] rounded bg-[#E7E3DA]" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   FAVORITES SCREEN
========================================================================== */

export default function FavoritesScreen() {
  const [items, setItems] = useState<ExploreItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* ==========================================================================
     LOAD FAVORITES
  ========================================================================== */

  const loadFavorites = useCallback(async () => {
    try {
      setError("");

      const data = await getFavorites();

      setItems(data || []);
    } catch (error) {
      console.error("Favorites loading error:", error);

      setItems([]);

      setError("Unable to load your favorites.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ==========================================================================
     INITIAL LOAD
  ========================================================================== */

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  /* ==========================================================================
     REFRESH
  ========================================================================== */

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadFavorites();
  };

  /* ==========================================================================
     NAVIGATION
  ========================================================================== */

  const handleItemPress = (item: ExploreItem) => {
    const type = getType(item);

    if (type === "yoga") {
      router.push({
        pathname: "/(main)/yoga/[id]",
        params: {
          id: item._id,
        },
      });

      return;
    }

    router.push({
      pathname: "/(main)/ayurveda/[id]",
      params: {
        id: item._id,
      },
    });
  };

  /* ==========================================================================
     LOADING
  ========================================================================== */

  if (loading) {
    return <FavoritesLoading />;
  }

  /* ==========================================================================
     SCREEN
  ========================================================================== */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F5F0]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 45,
        }}
      >
        {/* ================================================================
            BACK
        ================================================================ */}

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.75}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#E2DED5] bg-white"
        >
          <Ionicons name="arrow-back" size={18} color="#344038" />
        </TouchableOpacity>

        {/* ================================================================
            HEADER
        ================================================================ */}

        <FavoritesHeader count={items.length} />

        {/* ================================================================
            ERROR
        ================================================================ */}

        {error ? <ErrorState message={error} onRetry={loadFavorites} /> : null}

        {/* ================================================================
            EMPTY
        ================================================================ */}

        {!error && items.length === 0 ? <EmptyFavorites /> : null}

        {/* ================================================================
            SAVED ITEMS
        ================================================================ */}

        {!error && items.length > 0 ? (
          <View className="mt-8">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="font-serif text-[17px] font-bold text-[#263128]">
                  Saved practices
                </Text>

                <Text className="mt-0.5 text-[9px] text-[#929A93]">
                  Tap an item to continue
                </Text>
              </View>

              <Ionicons name="heart" size={16} color="#718771" />
            </View>

            {items.map((item) => (
              <FavoriteCard
                key={item._id}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </View>
        ) : null}

        {/* ================================================================
            FOOTER
        ================================================================ */}

        {!error && items.length > 0 ? (
          <View className="items-center pb-2 pt-8">
            <View className="h-px w-8 bg-[#D8D3C8]" />

            <Text className="mt-3 font-serif text-[13px] text-[#8D948D]">
              Niramaya
            </Text>

            <Text className="mt-0.5 text-[8px] text-[#A2A69F]">
              A space for your wellbeing
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
