import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
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
  getAyurveda,
  getYoga,
  searchExplore,
} from "@/services/explore.service";

import { ExploreContentType, ExploreItem } from "@/types/explore";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F8F5",
  white: "#FFFFFF",

  text: "#243129",
  secondary: "#566159",
  muted: "#89928B",
  softMuted: "#A8AEA9",

  green: "#4D6A50",
  greenDark: "#304B36",
  greenSoft: "#EAF2E8",
  greenPale: "#F2F6F0",

  turquoise: "#279CA3",

  border: "#E2E7E1",
  borderDark: "#D4DBD3",

  danger: "#C85C55",
};

/* ==========================================================================
   HELPERS
========================================================================== */

function getItemType(item: ExploreItem): ExploreContentType {
  if (item.resultType) {
    return item.resultType;
  }

  if (item.type === "yoga" || itemTypeLooksLikeYoga(item)) {
    return "yoga";
  }

  return "ayurveda";
}

function itemTypeLooksLikeYoga(item: ExploreItem) {
  return Boolean(
    item.difficulty ||
    item.instructions ||
    item.duration ||
    item.durationMinutes,
  );
}

/* ==========================================================================
   FILTER
========================================================================== */

function FilterChip({
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
      activeOpacity={0.75}
      onPress={onPress}
      className={`mr-2 h-[36px] flex-row items-center rounded-[9px] px-3.5 ${
        selected ? "bg-[#4D6A50]" : "border border-[#DDE3DC] bg-white"
      }`}
    >
      {selected ? (
        <Ionicons
          name="checkmark"
          size={13}
          color="#FFFFFF"
          style={{
            marginRight: 5,
          }}
        />
      ) : null}

      <Text
        className={`text-[11px] ${
          selected ? "font-bold text-white" : "font-semibold text-[#667169]"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   RESULT ICON
========================================================================== */

function ResultIcon({ type }: { type: ExploreContentType }) {
  const isYoga = type === "yoga";

  return (
    <View
      className={`h-[46px] w-[46px] items-center justify-center rounded-[12px] ${
        isYoga ? "bg-[#EAF4EE]" : "bg-[#F1EFE5]"
      }`}
    >
      <Ionicons
        name={isYoga ? "body-outline" : "leaf-outline"}
        size={22}
        color={isYoga ? "#4D8A63" : "#8A815D"}
      />
    </View>
  );
}

/* ==========================================================================
   RESULT CARD
========================================================================== */

function ResultCard({
  item,
  onPress,
}: {
  item: ExploreItem;
  onPress: () => void;
}) {
  const itemType = getItemType(item);

  const isYoga = itemType === "yoga";

  const title = item.title || item.name || "Wellness practice";

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="mb-3.5 border-b border-[#E5E9E4] pb-3.5"
    >
      <View className="flex-row items-start">
        {/* ================================================================
            ICON
        ================================================================= */}

        <ResultIcon type={itemType} />

        {/* ================================================================
            CONTENT
        ================================================================= */}

        <View className="ml-3.5 flex-1 pr-2">
          {/* Type */}
          <View className="flex-row items-center">
            <Text
              className={`text-[9px] font-bold uppercase tracking-[0.7px] ${
                isYoga ? "text-[#4D8A63]" : "text-[#8A815D]"
              }`}
            >
              {isYoga ? "Yoga" : "Ayurveda"}
            </Text>

            {item.category ? (
              <>
                <View className="mx-1.5 h-[3px] w-[3px] rounded-full bg-[#A7AEA8]" />

                <Text
                  numberOfLines={1}
                  className="flex-1 text-[9px] font-medium text-[#8A928B]"
                >
                  {item.category}
                </Text>
              </>
            ) : null}
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            className="mt-1 font-serif text-[15px] font-bold leading-[20px] text-[#263128]"
          >
            {title}
          </Text>

          {/* Description */}
          {item.description ? (
            <Text
              numberOfLines={2}
              className="mt-1.5 text-[10px] leading-[16px] text-[#778079]"
            >
              {item.description}
            </Text>
          ) : null}

          {/* ============================================================
              METADATA
          ============================================================ */}

          {isYoga &&
          (item.difficulty || item.duration || item.durationMinutes) ? (
            <View className="mt-2.5 flex-row items-center">
              {item.difficulty ? (
                <View className="flex-row items-center">
                  <Ionicons name="fitness-outline" size={12} color="#8A938C" />

                  <Text className="ml-1 text-[9px] font-medium capitalize text-[#7E8780]">
                    {item.difficulty}
                  </Text>
                </View>
              ) : null}

              {item.difficulty && (item.duration || item.durationMinutes) ? (
                <View className="mx-2 h-[3px] w-[3px] rounded-full bg-[#B1B7B2]" />
              ) : null}

              {item.duration || item.durationMinutes ? (
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={12} color="#8A938C" />

                  <Text className="ml-1 text-[9px] font-medium text-[#7E8780]">
                    {item.duration || item.durationMinutes} min
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* ================================================================
            ARROW
        ================================================================= */}

        <View className="h-8 w-8 items-center justify-center">
          <Ionicons name="chevron-forward" size={16} color="#A5ADA6" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function EmptyState({ searched, query }: { searched: boolean; query: string }) {
  return (
    <View className="mt-4 items-center px-5 pb-8 pt-7">
      <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-[#EDF4EA]">
        <Ionicons
          name={searched ? "search-outline" : "leaf-outline"}
          size={25}
          color="#4D6A50"
        />
      </View>

      <Text className="mt-4 text-center font-serif text-[18px] font-bold text-[#263128]">
        {searched ? "Nothing found" : "No wellness content"}
      </Text>

      <Text className="mt-2 max-w-[290px] text-center text-[11px] leading-[18px] text-[#858D87]">
        {searched
          ? `We couldn't find anything matching "${query.trim()}".`
          : "There is currently no content available in this category."}
      </Text>

      {searched ? (
        <Text className="mt-1 max-w-[290px] text-center text-[10px] leading-[17px] text-[#A0A7A1]">
          Try another practice, herb, wellness topic, or keyword.
        </Text>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   ERROR
========================================================================== */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="mt-6 border border-[#F0DAD8] bg-[#FFF9F8] px-4 py-4">
      <View className="flex-row items-start">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FBE9E7]">
          <Ionicons name="alert-circle-outline" size={17} color="#C85C55" />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[11px] font-bold text-[#A9514A]">
            Something went wrong
          </Text>

          <Text className="mt-1 text-[10px] leading-[16px] text-[#8D7774]">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.7}
            className="mt-3 self-start"
          >
            <Text className="text-[10px] font-bold text-[#A9514A]">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ==========================================================================
   SEARCH SCREEN
========================================================================== */

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<ExploreItem[]>([]);

  const [type, setType] = useState<"all" | "yoga" | "ayurveda">("all");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searched, setSearched] = useState(false);

  const [error, setError] = useState("");

  /* ==========================================================================
     LOAD CONTENT
  ========================================================================== */

  const loadContent = useCallback(
    async (selectedType: "all" | "yoga" | "ayurveda", isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        if (selectedType === "yoga") {
          const yoga = await getYoga({
            page: 1,
            limit: 50,
          });

          setResults(yoga);

          return;
        }

        if (selectedType === "ayurveda") {
          const ayurveda = await getAyurveda({
            page: 1,
            limit: 50,
          });

          setResults(ayurveda);

          return;
        }

        const [yoga, ayurveda] = await Promise.all([
          getYoga({
            page: 1,
            limit: 50,
          }),

          getAyurveda({
            page: 1,
            limit: 50,
          }),
        ]);

        const combined = [
          ...yoga.map((item) => ({
            ...item,
            resultType: "yoga" as const,
          })),

          ...ayurveda.map((item) => ({
            ...item,
            resultType: "ayurveda" as const,
          })),
        ];

        setResults(combined);
      } catch (err) {
        console.error("Load Explore content error:", err);

        setResults([]);

        setError("Unable to load wellness content. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  /* ==========================================================================
     INITIAL LOAD
  ========================================================================== */

  useEffect(() => {
    loadContent("all");
  }, [loadContent]);

  /* ==========================================================================
     SEARCH
  ========================================================================== */

  const handleSearch = async () => {
    const value = query.trim();

    if (!value) {
      Keyboard.dismiss();

      setSearched(false);

      await loadContent(type);

      return;
    }

    Keyboard.dismiss();

    try {
      setLoading(true);
      setError("");

      const data = await searchExplore({
        q: value,
        type,
        page: 1,
        limit: 30,
      });

      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);

      setResults([]);

      setError("Unable to search right now. Please try again.");

      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================================
     FILTER
  ========================================================================== */

  const handleTypeChange = async (value: "all" | "yoga" | "ayurveda") => {
    setType(value);

    if (query.trim()) {
      try {
        setLoading(true);
        setError("");

        const data = await searchExplore({
          q: query.trim(),
          type: value,
          page: 1,
          limit: 30,
        });

        setResults(data);
        setSearched(true);
      } catch (err) {
        console.error("Filter search error:", err);

        setResults([]);

        setError("Unable to load filtered results.");

        setSearched(true);
      } finally {
        setLoading(false);
      }

      return;
    }

    setSearched(false);

    await loadContent(value);
  };

  /* ==========================================================================
     REFRESH
  ========================================================================== */

  const handleRefresh = async () => {
    if (query.trim()) {
      try {
        setRefreshing(true);
        setError("");

        const data = await searchExplore({
          q: query.trim(),
          type,
          page: 1,
          limit: 30,
        });

        setResults(data);
      } catch (err) {
        console.error("Refresh search error:", err);

        setError("Unable to refresh results.");
      } finally {
        setRefreshing(false);
      }

      return;
    }

    await loadContent(type, true);
  };

  /* ==========================================================================
     NAVIGATION
  ========================================================================== */

  const handleResultPress = (item: ExploreItem) => {
    const itemType = getItemType(item);

    if (itemType === "yoga") {
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
     CLEAR
  ========================================================================== */

  const clearSearch = async () => {
    setQuery("");
    setSearched(false);

    await loadContent(type);
  };

  /* ==========================================================================
     RESULTS TITLE
  ========================================================================== */

  const getResultsTitle = () => {
    if (searched) {
      if (results.length > 0) {
        return `${results.length} ${
          results.length === 1 ? "result" : "results"
        }`;
      }

      return "No results";
    }

    if (type === "yoga") {
      return "Yoga practices";
    }

    if (type === "ayurveda") {
      return "Ayurveda";
    }

    return "Wellness content";
  };

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F8F5]">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 45,
        }}
      >
        {/* ==================================================================
            HEADER
        ================================================================== */}

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="h-9 w-9 items-center justify-center rounded-full border border-[#E2E7E1] bg-white"
          >
            <Ionicons name="arrow-back" size={18} color="#304037" />
          </TouchableOpacity>

          <View className="ml-3">
            <Text className="text-[9px] font-semibold uppercase tracking-[1.2px] text-[#879189]">
              Wellness library
            </Text>

            <Text className="mt-0.5 font-serif text-[22px] font-bold text-[#263128]">
              Find something for you
            </Text>
          </View>
        </View>

        {/* ==================================================================
            INTRO
        ================================================================== */}

        <Text className="mt-3 max-w-[340px] text-[11px] leading-[17px] text-[#7D8780]">
          Search practices, Ayurvedic guidance, and simple ways to support your
          everyday wellbeing.
        </Text>

        {/* ==================================================================
            SEARCH AREA
        ================================================================== */}

        <View className="mt-5 flex-row items-center rounded-[12px] border border-[#DCE2DB] bg-white px-3">
          <Ionicons name="search-outline" size={19} color="#8E9990" />

          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            placeholder="Search wellness..."
            placeholderTextColor="#A2AAA4"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            className="ml-2.5 flex-1 py-3.5 text-[13px] text-[#263128]"
          />

          {query.length > 0 ? (
            <TouchableOpacity
              onPress={clearSearch}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#A2AAA4" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.75}
            className="ml-2 h-9 w-9 items-center justify-center rounded-[9px] bg-[#4D6A50]"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* ==================================================================
            FILTERS
        ================================================================== */}

        <View className="mt-4">
          <Text className="mb-2 text-[9px] font-bold uppercase tracking-[1.1px] text-[#9AA29B]">
            Browse by type
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip
              label="All"
              selected={type === "all"}
              onPress={() => handleTypeChange("all")}
            />

            <FilterChip
              label="Yoga"
              selected={type === "yoga"}
              onPress={() => handleTypeChange("yoga")}
            />

            <FilterChip
              label="Ayurveda"
              selected={type === "ayurveda"}
              onPress={() => handleTypeChange("ayurveda")}
            />
          </ScrollView>
        </View>

        {/* ==================================================================
            ERROR
        ================================================================== */}

        {error ? (
          <ErrorState
            message={error}
            onRetry={() => (query.trim() ? handleSearch() : loadContent(type))}
          />
        ) : null}

        {/* ==================================================================
            RESULTS
        ================================================================== */}

        {!loading ? (
          <View className="mt-7">
            {/* ==============================================================
                RESULTS HEADER
            ============================================================== */}

            <View className="mb-4 flex-row items-end justify-between">
              <View>
                <Text className="font-serif text-[19px] font-bold text-[#263128]">
                  {getResultsTitle()}
                </Text>

                {!searched && results.length > 0 ? (
                  <Text className="mt-1 text-[9px] text-[#969E98]">
                    {results.length} available
                  </Text>
                ) : null}
              </View>

              {results.length > 0 && query.trim() ? (
                <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                  <Text className="text-[10px] font-bold text-[#4D6A50]">
                    Clear search
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* ==============================================================
                EMPTY
            ============================================================== */}

            {results.length === 0 ? (
              <EmptyState searched={searched} query={query} />
            ) : (
              /* ============================================================
                 RESULTS
              ============================================================ */

              <View>
                {results.map((item) => (
                  <ResultCard
                    key={item._id}
                    item={item}
                    onPress={() => handleResultPress(item)}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          /* ================================================================
             LOADING
          ================================================================= */

          <View className="mt-8">
            <View className="mb-4 h-5 w-40 rounded bg-[#E5EAE4]" />

            {[1, 2, 3].map((item) => (
              <View
                key={item}
                className="mb-4 flex-row border-b border-[#E5E9E4] pb-4"
              >
                <View className="h-[46px] w-[46px] rounded-[12px] bg-[#E5EAE4]" />

                <View className="ml-3.5 flex-1">
                  <View className="h-2.5 w-14 rounded bg-[#E5EAE4]" />

                  <View className="mt-2 h-4 w-[75%] rounded bg-[#E5EAE4]" />

                  <View className="mt-2 h-2.5 w-[92%] rounded bg-[#E5EAE4]" />

                  <View className="mt-1.5 h-2.5 w-[65%] rounded bg-[#E5EAE4]" />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
