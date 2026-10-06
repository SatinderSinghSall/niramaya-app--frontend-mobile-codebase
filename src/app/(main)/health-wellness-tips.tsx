import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import type {
  HealthWellnessTip,
  HealthWellnessTipCategory,
} from "../../types/healthWellnessTip";

import {
  getActiveHealthWellnessTips,
  getFeaturedHealthWellnessTips,
} from "../../services/healthWellnessTip.service";

import HealthWellnessHeader from "../../components/healthWellness/HealthWellnessHeader";
import HealthWellnessSearchBar from "../../components/healthWellness/HealthWellnessSearchBar";
import HealthWellnessFeaturedCard from "../../components/healthWellness/HealthWellnessFeaturedCard";
import HealthWellnessTipCard from "../../components/healthWellness/HealthWellnessTipCard";
import HealthWellnessSkeleton from "../../components/healthWellness/HealthWellnessSkeleton";
import HealthWellnessErrorState from "../../components/healthWellness/HealthWellnessErrorState";
import HealthWellnessDetailSheet from "../../components/healthWellness/HealthWellnessDetailSheet";

const ITEMS_PER_PAGE = 8;

const categories: {
  value: "all" | HealthWellnessTipCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: "all",
    label: "All",
    icon: "apps-outline",
  },
  {
    value: "nutrition",
    label: "Nutrition",
    icon: "nutrition-outline",
  },
  {
    value: "fitness",
    label: "Fitness",
    icon: "fitness-outline",
  },
  {
    value: "yoga",
    label: "Yoga",
    icon: "body-outline",
  },
  {
    value: "ayurveda",
    label: "Ayurveda",
    icon: "leaf-outline",
  },
  {
    value: "mental-wellbeing",
    label: "Mind",
    icon: "happy-outline",
  },
  {
    value: "sleep",
    label: "Sleep",
    icon: "moon-outline",
  },
  {
    value: "stress-management",
    label: "Stress",
    icon: "heart-outline",
  },
  {
    value: "healthy-habits",
    label: "Habits",
    icon: "checkmark-circle-outline",
  },
];

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function HealthWellnessTipsScreen() {
  const router = useRouter();

  const [tips, setTips] = useState<HealthWellnessTip[]>([]);

  const [featuredTips, setFeaturedTips] = useState<HealthWellnessTip[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | HealthWellnessTipCategory
  >("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [selectedTip, setSelectedTip] = useState<HealthWellnessTip | null>(
    null,
  );

  const [detailVisible, setDetailVisible] = useState(false);

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchTips = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const category =
          selectedCategory === "all" ? undefined : selectedCategory;

        const [listResult, featuredResult] = await Promise.all([
          getActiveHealthWellnessTips({
            category,
            search: searchQuery.trim() || undefined,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          }),

          currentPage === 1
            ? getFeaturedHealthWellnessTips(3)
            : Promise.resolve([]),
        ]);

        setTips(listResult.items || []);

        setTotalPages(listResult.pagination?.pages || 1);

        if (currentPage === 1) {
          setFeaturedTips(Array.isArray(featuredResult) ? featuredResult : []);
        }
      } catch (err) {
        console.error("Failed to load health wellness tips:", err);

        setError("We couldn't load the wellness content right now.");

        if (currentPage === 1) {
          setTips([]);
          setFeaturedTips([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCategory, searchQuery, currentPage],
  );

  useFocusEffect(
    useCallback(() => {
      fetchTips();
    }, [fetchTips]),
  );

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  /* =======================================================
     FALLBACK FEATURED
  ======================================================= */

  const featuredCards = useMemo(() => {
    if (featuredTips.length > 0) {
      return featuredTips.slice(0, 3);
    }

    return tips.slice(0, 3);
  }, [featuredTips, tips]);

  /* =======================================================
     OPEN DETAIL
  ======================================================= */

  const openTip = (tip: HealthWellnessTip) => {
    setSelectedTip(tip);
    setDetailVisible(true);
  };

  const closeTip = () => {
    setDetailVisible(false);

    setTimeout(() => {
      setSelectedTip(null);
    }, 220);
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = async () => {
    await fetchTips(true);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 bg-slate-50">
          {/* =================================================
              HEADER
          ================================================= */}

          <HealthWellnessHeader
            title="Health & Wellness"
            subtitle="Small habits. Better health."
            onBack={() => router.back()}
            icon="heart"
            iconColor="#059669"
            iconBackground="#ecfdf5"
          />

          {/* =================================================
              SCROLL
          ================================================= */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#059669"
                colors={["#059669"]}
              />
            }
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          >
            {/* =================================================
                SEARCH
            ================================================= */}

            <HealthWellnessSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? <HealthWellnessSkeleton /> : null}

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error ? (
              <HealthWellnessErrorState
                onRetry={() => fetchTips()}
                message={error}
              />
            ) : null}

            {/* =================================================
                CONTENT
            ================================================= */}

            {!loading && !error ? (
              <>
                {/* ============================================
                    FEATURED
                ============================================ */}

                {featuredCards.length > 0 ? (
                  <View className="mt-7">
                    <View className="px-5">
                      <View className="flex-row items-end justify-between">
                        <View>
                          <View className="flex-row items-center">
                            <Text className="text-[18px] font-extrabold text-slate-900">
                              Featured for you
                            </Text>

                            <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                              <Ionicons
                                name="sparkles"
                                size={11}
                                color="#059669"
                              />
                            </View>
                          </View>

                          <Text className="mt-1 text-[11px] font-medium text-slate-400">
                            Handpicked wellness ideas
                          </Text>
                        </View>

                        <Text className="text-[10px] font-semibold text-slate-400">
                          {featuredCards.length}
                        </Text>
                      </View>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingLeft: 20,
                        paddingRight: 8,
                        paddingTop: 14,
                      }}
                    >
                      {featuredCards.map((tip) => (
                        <HealthWellnessFeaturedCard
                          key={tip._id}
                          tip={tip}
                          onPress={() => openTip(tip)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                ) : null}

                {/* ============================================
                    CATEGORIES
                ============================================ */}

                <View className="mt-8">
                  <View className="px-5">
                    <Text className="text-[18px] font-extrabold text-slate-900">
                      Explore categories
                    </Text>

                    <Text className="mt-1 text-[11px] font-medium text-slate-400">
                      Find something that fits your lifestyle
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 20,
                      paddingRight: 8,
                      paddingTop: 14,
                    }}
                  >
                    {categories.map((category) => {
                      const selected = selectedCategory === category.value;

                      return (
                        <Pressable
                          key={category.value}
                          onPress={() => {
                            setSelectedCategory(category.value);
                            setCurrentPage(1);
                          }}
                          className={`mr-2 flex-row items-center rounded-full px-4 py-2.5 ${
                            selected
                              ? "bg-emerald-600"
                              : "border border-slate-200 bg-white"
                          }`}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.85 : 1,
                          })}
                        >
                          <Ionicons
                            name={category.icon}
                            size={14}
                            color={selected ? "#ffffff" : "#64748b"}
                          />

                          <Text
                            className={`ml-2 text-[11px] font-bold ${
                              selected ? "text-white" : "text-slate-600"
                            }`}
                          >
                            {category.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* ============================================
                    ALL TIPS
                ============================================ */}

                <View className="mt-8 px-5">
                  <View className="flex-row items-end justify-between">
                    <View className="flex-1">
                      <Text className="text-[18px] font-extrabold text-slate-900">
                        {searchQuery.trim()
                          ? `Results for "${searchQuery.trim()}"`
                          : selectedCategory === "all"
                            ? "All tips"
                            : `${formatCategory(selectedCategory)} tips`}
                      </Text>

                      <Text className="mt-1 text-[11px] font-medium text-slate-400">
                        Simple ideas for everyday wellbeing
                      </Text>
                    </View>

                    <View className="ml-3 rounded-full bg-white px-2.5 py-1.5">
                      <Text className="text-[10px] font-bold text-slate-500">
                        {tips.length}
                      </Text>
                    </View>
                  </View>

                  {/* EMPTY */}

                  {tips.length === 0 ? (
                    <View className="mt-5 items-center rounded-3xl border border-slate-100 bg-white px-6 py-10">
                      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                        <Ionicons
                          name="leaf-outline"
                          size={27}
                          color="#059669"
                        />
                      </View>

                      <Text className="mt-4 text-[15px] font-extrabold text-slate-900">
                        No tips found
                      </Text>

                      <Text className="mt-2 max-w-[270px] text-center text-xs leading-5 text-slate-400">
                        Try another category or search for something different.
                      </Text>

                      <Pressable
                        onPress={resetFilters}
                        className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5"
                      >
                        <Text className="text-xs font-bold text-white">
                          View all tips
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View className="mt-5">
                      {tips.map((tip) => (
                        <HealthWellnessTipCard
                          key={tip._id}
                          tip={tip}
                          onPress={() => openTip(tip)}
                        />
                      ))}
                    </View>
                  )}

                  {/* LOAD MORE */}

                  {tips.length > 0 && currentPage < totalPages ? (
                    <Pressable
                      onPress={() => setCurrentPage((page) => page + 1)}
                      className="mt-2 h-11 flex-row items-center justify-center rounded-full border border-slate-200 bg-white"
                    >
                      <Text className="text-xs font-bold text-slate-700">
                        Load more tips
                      </Text>

                      <Ionicons
                        name="chevron-down"
                        size={14}
                        color="#64748b"
                        style={{
                          marginLeft: 6,
                        }}
                      />
                    </Pressable>
                  ) : null}

                  {/* PAGE */}

                  {tips.length > 0 && totalPages > 1 ? (
                    <Text className="mt-3 text-center text-[9px] font-medium text-slate-400">
                      Page {currentPage} of {totalPages}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* =================================================
          DETAIL
      ================================================= */}

      <HealthWellnessDetailSheet
        tip={selectedTip}
        visible={detailVisible}
        onClose={closeTip}
      />
    </SafeAreaView>
  );
}
