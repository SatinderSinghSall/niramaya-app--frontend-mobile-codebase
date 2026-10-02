import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {
  getAyurvedaCategories,
  getAyurvedaPage,
} from "@/services/explore.service";

import { CategoryItem, ExploreItem } from "@/types/explore";

import ExploreContentCard from "@/components/explore/ExploreContentCard";

/* -------------------------------------------------------------------------- */

/* Colors                                                                     */

/* -------------------------------------------------------------------------- */

const COLORS = {
  background: "#F7F3EA",

  surface: "#FFFFFF",

  text: "#273128",

  muted: "#777C74",

  softMuted: "#A0A29B",

  green: "#4D6A50",

  darkGreen: "#31543B",

  lightGreen: "#DDE7D8",

  lighterGreen: "#EEF5EC",

  border: "#E5E0D6",
};

/* -------------------------------------------------------------------------- */

/* Hero                                                                       */

/* -------------------------------------------------------------------------- */

const AYURVEDA_HERO = {
  uri: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=88",
};

/* -------------------------------------------------------------------------- */

/* Category Helpers                                                           */

/* -------------------------------------------------------------------------- */

function getRawCategoryValue(category: CategoryItem, index: number) {
  const data = category as CategoryItem & {
    value?: string;

    name?: string;

    label?: string;

    slug?: string;

    key?: string;

    category?: string;
  };

  return (
    data.value ||
    data.slug ||
    data.key ||
    data.category ||
    data.name ||
    data.label ||
    `category-${index}`
  );
}

function formatCategoryLabel(value?: string) {
  if (!value) return "";

  return value

    .replace(/_/g, " ")

    .replace(/-/g, " ")

    .replace(/\s+/g, " ")

    .trim()

    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getItemCategory(item: ExploreItem) {
  const category = item.category;

  if (!category) {
    return null;
  }

  return String(category);
}

/* -------------------------------------------------------------------------- */

/* Header                                                                     */

/* -------------------------------------------------------------------------- */

function AyurvedaHeader() {
  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.75}
        className="mb-5 h-10 w-10 items-center justify-center rounded-full bg-white"
        style={{
          borderWidth: 1,

          borderColor: COLORS.border,
        }}
      >
        <Ionicons name="arrow-back" size={19} color={COLORS.text} />
      </TouchableOpacity>

      <Text
        className="text-[11px] font-medium"
        style={{
          color: COLORS.muted,
        }}
      >
        Traditional wellness
      </Text>

      <Text
        className="mt-1 text-[30px] font-bold"
        style={{
          color: COLORS.text,

          fontFamily: "serif",
        }}
      >
        Ayurveda
      </Text>

      <Text
        className="mt-2 max-w-[340px] text-[13px] leading-5"
        style={{
          color: COLORS.muted,
        }}
      >
        Discover traditional practices and simple ways to support your
        wellbeing.
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Search                                                                     */

/* -------------------------------------------------------------------------- */

function AyurvedaSearch({
  value,

  onChangeText,

  onClear,
}: {
  value: string;

  onChangeText: (value: string) => void;

  onClear: () => void;
}) {
  return (
    <View
      className="mt-5 flex-row items-center rounded-[16px] bg-white px-4"
      style={{
        height: 50,

        borderWidth: 1,

        borderColor: COLORS.border,
      }}
    >
      <Ionicons name="search-outline" size={19} color={COLORS.muted} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search Ayurveda..."
        placeholderTextColor="#A0A29B"
        returnKeyType="search"
        autoCorrect={false}
        className="ml-3 flex-1 text-[13px]"
        style={{
          color: COLORS.text,
        }}
      />

      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          activeOpacity={0.7}
          className="h-7 w-7 items-center justify-center rounded-full bg-[#F0EEE8]"
        >
          <Ionicons name="close" size={15} color={COLORS.muted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Hero                                                                       */

/* -------------------------------------------------------------------------- */

function AyurvedaHero() {
  return (
    <View
      className="mt-5 overflow-hidden rounded-[22px]"
      style={{
        height: 205,

        backgroundColor: COLORS.lightGreen,
      }}
    >
      <Image
        source={AYURVEDA_HERO}
        resizeMode="cover"
        className="absolute inset-0 h-full w-full"
      />

      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(35, 55, 40, 0.40)",
        }}
      />

      <View className="flex-1 justify-end p-5">
        <Text className="text-[9px] font-bold uppercase tracking-[2px] text-white/80">
          A PATH TO BALANCE
        </Text>

        <Text
          className="mt-2 max-w-[300px] text-[24px] font-bold leading-8 text-white"
          style={{
            fontFamily: "serif",
          }}
        >
          Come back to balance.
        </Text>

        <Text className="mt-2 max-w-[300px] text-[12px] leading-[18px] text-white/85">
          Explore simple Ayurvedic approaches to nourishment, balance and
          everyday wellbeing.
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Intro                                                                      */

/* -------------------------------------------------------------------------- */

function AyurvedaIntroCard() {
  return (
    <View
      className="mt-5 overflow-hidden rounded-[18px] p-4"
      style={{
        backgroundColor: "#E2E7D8",
      }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: "#CBD7C2",
          }}
        >
          <Ionicons name="leaf-outline" size={20} color={COLORS.darkGreen} />
        </View>

        <View className="flex-1">
          <Text
            className="text-[17px] font-bold"
            style={{
              color: COLORS.darkGreen,

              fontFamily: "serif",
            }}
          >
            Discover your balance
          </Text>

          <Text
            className="mt-1 text-[11px] leading-[17px]"
            style={{
              color: "#58705B",
            }}
          >
            Explore traditional Ayurvedic ideas at your own pace and discover
            practices that fit naturally into everyday life.
          </Text>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Category Button                                                            */

/* -------------------------------------------------------------------------- */

function CategoryButton({
  label,

  selected,

  onPress,
}: {
  label: string;

  selected: boolean;

  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mr-2 rounded-full px-4"
      style={{
        height: 38,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: selected ? COLORS.green : COLORS.surface,

        borderWidth: selected ? 0 : 1,

        borderColor: COLORS.border,
      }}
    >
      <Text
        className="text-[11px] font-semibold"
        style={{
          color: selected ? "#FFFFFF" : COLORS.muted,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */

/* Category Section                                                           */

/* -------------------------------------------------------------------------- */

function CategorySection({
  categories,

  selectedCategory,

  onSelect,
}: {
  categories: {
    value: string;

    label: string;
  }[];

  selectedCategory: string | null;

  onSelect: (value: string | null) => void;
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <View className="mt-8">
      <View className="flex-row items-end justify-between">
        <View>
          <Text
            className="text-[19px] font-bold"
            style={{
              color: COLORS.text,

              fontFamily: "serif",
            }}
          >
            Explore by practice
          </Text>

          <Text
            className="mt-1 text-[11px]"
            style={{
              color: COLORS.softMuted,
            }}
          >
            Find something that fits your needs
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{
          paddingRight: 20,
        }}
      >
        <CategoryButton
          label="All"
          selected={!selectedCategory}
          onPress={() => onSelect(null)}
        />

        {categories.map((category) => (
          <CategoryButton
            key={category.value}
            label={category.label}
            selected={selectedCategory === category.value}
            onPress={() => onSelect(category.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Calm Visual Section                                                        */

/* -------------------------------------------------------------------------- */

function CalmStrip() {
  return (
    <View className="mt-8 flex-row">
      <View
        className="mr-1.5 flex-1 overflow-hidden rounded-[18px]"
        style={{
          height: 115,

          backgroundColor: "#D6E3D8",
        }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=85",
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <View
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(40,65,48,0.30)",
          }}
        />

        <View className="flex-1 justify-end p-3.5">
          <Text className="text-[15px] font-bold text-white">Breathe</Text>

          <Text className="mt-1 text-[10px] text-white/85">
            Create space within
          </Text>
        </View>
      </View>

      <View
        className="ml-1.5 flex-1 overflow-hidden rounded-[18px]"
        style={{
          height: 115,

          backgroundColor: "#DDD6C5",
        }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=700&q=85",
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <View
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(45,45,30,0.24)",
          }}
        />

        <View className="flex-1 justify-end p-3.5">
          <Text className="text-[15px] font-bold text-white">Be present</Text>

          <Text className="mt-1 text-[10px] text-white/85">
            Make space for yourself
          </Text>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Skeleton + Empty State */

function AyurvedaSkeleton() {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 32,
        }}
      >
        <View className="mb-2">
          <View className="h-10 w-10 rounded-full bg-[#E8E3D9]" />
          <View className="mt-5 h-3 w-32 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-9 w-32 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-4 w-[84%] rounded bg-[#E8E3D9]" />
          <View className="mt-1.5 h-4 w-[66%] rounded bg-[#E8E3D9]" />
        </View>
        <View className="mt-5 h-[50px] rounded-[16px] bg-[#EAE6DD]" />
        <View className="mt-5 h-[205px] rounded-[22px] bg-[#E5E0D6]" />
        <View className="mt-5 rounded-[18px] bg-[#E1E9DD] p-4">
          <View className="flex-row items-center">
            <View className="h-10 w-10 rounded-full bg-[#C9D8C3]" />
            <View className="ml-3 flex-1">
              <View className="h-5 w-40 rounded bg-[#C9D8C3]" />
              <View className="mt-2 h-3 w-[88%] rounded bg-[#CBDAC5]" />
              <View className="mt-1.5 h-3 w-[72%] rounded bg-[#CBDAC5]" />
            </View>
          </View>
        </View>
        <View className="mt-8">
          <View className="h-6 w-44 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-3 w-56 rounded bg-[#E8E3D9]" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            {[1, 2, 3, 4].map((item) => (
              <View
                key={item}
                className="mr-2 h-[38px] w-20 rounded-full bg-[#E7E3DA]"
              />
            ))}
          </ScrollView>
        </View>
        <View className="mt-9">
          <View className="h-6 w-40 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-3 w-32 rounded bg-[#E8E3D9]" />
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mt-4 rounded-[18px] bg-white p-4"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <View className="h-32 rounded-[14px] bg-[#E9E5DC]" />
              <View className="mt-3 h-4 w-[70%] rounded bg-[#E8E3D9]" />
              <View className="mt-2 h-3 w-[92%] rounded bg-[#E8E3D9]" />
              <View className="mt-1.5 h-3 w-[62%] rounded bg-[#E8E3D9]" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AyurvedaEmptyState({ searched }: { searched: boolean }) {
  return (
    <View
      className="rounded-[20px] bg-white px-5 py-8"
      style={{ borderWidth: 1, borderColor: COLORS.border }}
    >
      <View className="items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.lighterGreen }}
        >
          <Ionicons
            name={searched ? "search-outline" : "leaf-outline"}
            size={24}
            color={COLORS.green}
          />
        </View>
        <Text
          className="mt-4 text-center text-[19px] font-bold"
          style={{ color: COLORS.text, fontFamily: "serif" }}
        >
          {searched ? "Nothing found" : "No practices yet"}
        </Text>
        <Text
          className="mt-2 max-w-[290px] text-center text-[12px] leading-5"
          style={{ color: COLORS.muted }}
        >
          {searched
            ? "Try a different search term or explore another practice."
            : "Ayurvedic practices will appear here when they become available."}
        </Text>
      </View>
    </View>
  );
}

/* Main Screen                                                                */

/* -------------------------------------------------------------------------- */

export default function AyurvedaScreen() {
  const PAGE_SIZE = 8;

  const [items, setItems] = useState<ExploreItem[]>([]);

  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load Ayurveda                                                             */
  /* ------------------------------------------------------------------------ */

  const loadAyurveda = useCallback(
    async (
      targetPage = 1,
      category = selectedCategory,
      query = search,
      showLoader = false,
    ) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const [ayurvedaResult, categoryData] = await Promise.all([
          getAyurvedaPage({
            category: category || undefined,
            search: query.trim() || undefined,
            page: targetPage,
            limit: PAGE_SIZE,
          }),
          getAyurvedaCategories(),
        ]);

        setItems(ayurvedaResult.items);
        setPage(ayurvedaResult.pagination.page);
        setTotalPages(ayurvedaResult.pagination.totalPages);
        setTotalItems(ayurvedaResult.pagination.total);
        setCategories(categoryData);
      } catch (err: any) {
        console.error("Ayurveda loading error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load Ayurveda content.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setRetrying(false);
      }
    },
    [selectedCategory, search],
  );

  /* ------------------------------------------------------------------------ */
  /* Initial Load + Server Search/Filter                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadAyurveda(1, selectedCategory, search, true);
      },
      search ? 350 : 0,
    );

    return () => clearTimeout(timer);
  }, [selectedCategory, search, loadAyurveda]);

  /* ------------------------------------------------------------------------ */
  /* Category Handling                                                         */
  /* ------------------------------------------------------------------------ */

  const handleCategory = (value: string | null) => {
    setSelectedCategory(value);
    setPage(1);
  };

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                                */
  /* ------------------------------------------------------------------------ */

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    await loadAyurveda(nextPage, selectedCategory, search, false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAyurveda(1, selectedCategory, search, false);
  };

  const handleRetry = async () => {
    setRetrying(true);
    await loadAyurveda(page || 1, selectedCategory, search, true);
  };

  /* ------------------------------------------------------------------------ */

  /* Clean Categories                                                          */

  /* ------------------------------------------------------------------------ */

  const cleanCategories = useMemo(() => {
    const map = new Map<
      string,
      {
        value: string;

        label: string;
      }
    >();

    categories.forEach((category, index) => {
      const value = getRawCategoryValue(category, index);

      if (!value || value.startsWith("category-")) {
        return;
      }

      const label = formatCategoryLabel(value);

      if (label && label.toLowerCase() !== "category") {
        map.set(value, {
          value,

          label,
        });
      }
    });

    items.forEach((item) => {
      const category = getItemCategory(item);

      if (!category) {
        return;
      }

      const label = formatCategoryLabel(category);

      if (!label || label.toLowerCase() === "category") {
        return;
      }

      if (!map.has(category)) {
        map.set(category, {
          value: category,

          label,
        });
      }
    });

    return Array.from(map.values());
  }, [categories, items]);

  /* ------------------------------------------------------------------------ */

  /* Search Filtering                                                          */

  /* ------------------------------------------------------------------------ */

  const filteredItems = items;

  /* ------------------------------------------------------------------------ */

  /* Loading                                                                   */

  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <AyurvedaSkeleton />;
  }

  /* ------------------------------------------------------------------------ */

  /* Error                                                                     */

  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1 items-center justify-center px-6"
        style={{
          backgroundColor: COLORS.background,
        }}
      >
        <View
          className="w-full rounded-[22px] bg-white p-6"
          style={{
            borderWidth: 1,

            borderColor: COLORS.border,
          }}
        >
          <View className="items-center">
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.lightGreen,
              }}
            >
              <Ionicons name="leaf-outline" size={25} color={COLORS.green} />
            </View>

            <Text
              className="mt-4 text-[21px] font-bold"
              style={{
                color: COLORS.text,

                fontFamily: "serif",
              }}
            >
              Ayurveda is unavailable
            </Text>

            <Text
              className="mt-2 text-center text-[13px] leading-5"
              style={{
                color: COLORS.muted,
              }}
            >
              {error}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRetry}
            activeOpacity={0.8}
            className="mt-6 items-center rounded-[14px] py-3.5"
            style={{
              backgroundColor: COLORS.green,
            }}
          >
            <Text className="text-[13px] font-semibold text-white">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ------------------------------------------------------------------------ */

  /* Main                                                                      */

  /* ------------------------------------------------------------------------ */

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.green}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 18,

            paddingTop: 12,

            paddingBottom: 32,
          }}
        >
          {/* Header */}

          <AyurvedaHeader />

          {/* Search */}

          <AyurvedaSearch
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch("")}
          />

          {/* Hero */}

          <AyurvedaHero />

          {/* Intro */}

          <AyurvedaIntroCard />

          {/* Categories */}

          <CategorySection
            categories={cleanCategories}
            selectedCategory={selectedCategory}
            onSelect={handleCategory}
          />

          {/* Results */}

          <View className="mt-9">
            <View className="flex-row items-end justify-between">
              <View className="flex-1">
                <Text
                  className="text-[21px] font-bold"
                  style={{
                    color: COLORS.text,

                    fontFamily: "serif",
                  }}
                >
                  {search
                    ? "Search results"
                    : selectedCategory
                      ? formatCategoryLabel(selectedCategory)
                      : "All practices"}
                </Text>

                <Text
                  className="mt-1 text-[11px]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {search
                    ? `${totalItems} ${
                        totalItems === 1 ? "practice" : "practices"
                      } found`
                    : `${totalItems} ${
                        totalItems === 1 ? "item" : "items"
                      } available`}
                </Text>
              </View>

              <View
                className="h-7 min-w-7 items-center justify-center rounded-full px-2"
                style={{
                  backgroundColor: COLORS.lightGreen,
                }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{
                    color: COLORS.green,
                  }}
                >
                  {totalItems}
                </Text>
              </View>
            </View>

            {/* Search indicator */}

            {search ? (
              <View className="mt-3 flex-row items-center">
                <Ionicons
                  name="search-outline"
                  size={13}
                  color={COLORS.green}
                />

                <Text
                  className="ml-1.5 text-[11px]"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  Showing results for{" "}
                  <Text
                    className="font-semibold"
                    style={{
                      color: COLORS.green,
                    }}
                  >
                    "{search}"
                  </Text>
                </Text>
              </View>
            ) : null}

            {/* Cards */}

            {filteredItems.length > 0 ? (
              <View className="mt-4 w-full">
                {filteredItems.map((item) => (
                  <ExploreContentCard
                    key={item._id}
                    item={item}
                    type="ayurveda"
                    onPress={() =>
                      router.push({
                        pathname: "/(main)/ayurveda/[id]",

                        params: {
                          id: item._id,
                        },
                      })
                    }
                  />
                ))}
              </View>
            ) : (
              <View className="mt-5">
                <AyurvedaEmptyState searched={Boolean(search)} />
              </View>
            )}
          </View>

          {/* Pagination */}

          {totalPages > 1 && filteredItems.length > 0 ? (
            <View className="mt-6 items-center">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  activeOpacity={0.8}
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: page <= 1 ? "#EEEAE2" : COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    opacity: page <= 1 ? 0.55 : 1,
                  }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={15}
                    color={page <= 1 ? COLORS.softMuted : COLORS.text}
                  />
                </TouchableOpacity>

                <View className="mx-3 flex-row items-center">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => {
                      let pageNumber = index + 1;

                      if (totalPages > 5) {
                        if (page <= 3) {
                          pageNumber = index + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = page - 2 + index;
                        }
                      }

                      const selected = pageNumber === page;

                      return (
                        <TouchableOpacity
                          key={pageNumber}
                          onPress={() => handlePageChange(pageNumber)}
                          activeOpacity={0.8}
                          className="mx-1 h-9 min-w-9 items-center justify-center rounded-full px-2"
                          style={{
                            backgroundColor: selected
                              ? COLORS.green
                              : COLORS.surface,
                            borderWidth: selected ? 0 : 1,
                            borderColor: COLORS.border,
                          }}
                        >
                          <Text
                            className="text-[11px] font-semibold"
                            style={{
                              color: selected ? "#FFFFFF" : COLORS.muted,
                            }}
                          >
                            {pageNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  activeOpacity={0.8}
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      page >= totalPages ? "#EEEAE2" : COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    opacity: page >= totalPages ? 0.55 : 1,
                  }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={page >= totalPages ? COLORS.softMuted : COLORS.text}
                  />
                </TouchableOpacity>
              </View>

              <Text
                className="mt-2 text-[10px]"
                style={{ color: COLORS.softMuted }}
              >
                Page {page} of {totalPages}
              </Text>
            </View>
          ) : null}

          {/* Calm Visuals */}

          {!search && filteredItems.length > 0 ? <CalmStrip /> : null}

          {/* Bottom Quote */}

          {!search ? (
            <View className="mt-10 items-center px-5">
              <View
                className="mb-5 h-px w-10"
                style={{
                  backgroundColor: COLORS.border,
                }}
              />

              <Text
                className="text-center text-[19px] font-bold leading-7"
                style={{
                  color: COLORS.text,

                  fontFamily: "serif",
                }}
              >
                Find balance
                {"\n"}
                in the way you live.
              </Text>

              <Text
                className="mt-3 text-center text-[11px] leading-5"
                style={{
                  color: COLORS.softMuted,
                }}
              >
                Take a few moments to reconnect with yourself.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
