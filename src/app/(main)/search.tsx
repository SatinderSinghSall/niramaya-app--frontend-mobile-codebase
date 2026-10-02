import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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

  text: "#263128",
  secondary: "#667169",
  muted: "#8B948D",
  softMuted: "#A5ADA7",

  green: "#4D6A50",
  greenDark: "#304B36",
  greenSoft: "#EAF2E8",
  greenPale: "#F2F6F0",

  border: "#E2E7E1",
  borderLight: "#E9EDE8",

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
   FILTER CHIP
========================================================================== */

function FilterChip({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      disabled={disabled}
      className={`mr-2 h-[36px] flex-row items-center rounded-[10px] px-3.5 ${
        selected ? "bg-[#4D6A50]" : "border border-[#DDE3DC] bg-white"
      } ${disabled ? "opacity-50" : ""}`}
    >
      {selected ? (
        <Ionicons
          name="checkmark"
          size={13}
          color="#FFFFFF"
          style={{ marginRight: 5 }}
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
      className={`h-[48px] w-[48px] items-center justify-center rounded-[13px] ${
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
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-3.5 rounded-[15px] border border-[#E3E8E2] bg-white px-3.5 py-3.5"
    >
      <View className="flex-row items-start">
        <ResultIcon type={itemType} />

        <View className="ml-3.5 flex-1 pr-1">
          {/* TYPE */}
          <View className="flex-row items-center">
            <Text
              className={`text-[9px] font-bold uppercase tracking-[0.8px] ${
                isYoga ? "text-[#4D8A63]" : "text-[#8A815D]"
              }`}
            >
              {isYoga ? "Yoga" : "Ayurveda"}
            </Text>

            {item.category ? (
              <>
                <View className="mx-1.5 h-[3px] w-[3px] rounded-full bg-[#B0B7B1]" />

                <Text
                  numberOfLines={1}
                  className="flex-1 text-[9px] font-medium text-[#8A928B]"
                >
                  {item.category}
                </Text>
              </>
            ) : null}
          </View>

          {/* TITLE */}
          <Text
            numberOfLines={2}
            className="mt-1 font-serif text-[16px] font-bold leading-[21px] text-[#263128]"
          >
            {title}
          </Text>

          {/* DESCRIPTION */}
          {item.description ? (
            <Text
              numberOfLines={2}
              className="mt-1.5 text-[10px] leading-[16px] text-[#778079]"
            >
              {item.description}
            </Text>
          ) : null}

          {/* METADATA */}
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

        {/* ARROW */}
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
    <View className="items-center rounded-[16px] border border-[#E3E8E2] bg-white px-5 py-8">
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
    <View className="mt-5 rounded-[14px] border border-[#F0DAD8] bg-[#FFF9F8] px-4 py-4">
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
   SKELETON
========================================================================== */

function ResultSkeleton() {
  return (
    <View className="mb-3.5 rounded-[15px] border border-[#E7EBE6] bg-white px-3.5 py-3.5">
      <View className="flex-row">
        <View className="h-[48px] w-[48px] rounded-[13px] bg-[#E5EAE4]" />

        <View className="ml-3.5 flex-1">
          <View className="h-2.5 w-16 rounded bg-[#E5EAE4]" />

          <View className="mt-2 h-4 w-[72%] rounded bg-[#E5EAE4]" />

          <View className="mt-2 h-2.5 w-[92%] rounded bg-[#E5EAE4]" />

          <View className="mt-1.5 h-2.5 w-[65%] rounded bg-[#E5EAE4]" />
        </View>

        <View className="ml-2 h-7 w-7 rounded-full bg-[#EEF1ED]" />
      </View>
    </View>
  );
}

/* ==========================================================================
   SEARCH SCREEN
========================================================================== */

export default function SearchScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExploreItem[]>([]);

  const [type, setType] = useState<"all" | "yoga" | "ayurveda">("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================================
     KEYBOARD → SCROLL TO END
  ========================================================================== */

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({
          animated: true,
        });
      }, 180);
    });
  }, []);

  useEffect(() => {
    const keyboardEvent =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", scrollToBottom)
        : Keyboard.addListener("keyboardDidShow", scrollToBottom);

    return () => {
      keyboardEvent.remove();
    };
  }, [scrollToBottom]);

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
     CLEAR SEARCH
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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
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
            paddingBottom: 40,
          }}
        >
          {/* ================================================================
              HEADER
          ================================================================ */}

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="h-9 w-9 items-center justify-center rounded-full border border-[#E2E7E1] bg-white"
            >
              <Ionicons name="arrow-back" size={18} color="#304037" />
            </TouchableOpacity>

            <View className="ml-3 flex-1">
              <Text className="text-[9px] font-semibold uppercase tracking-[1.2px] text-[#879189]">
                Wellness library
              </Text>

              <Text className="mt-0.5 font-serif text-[22px] font-bold text-[#263128]">
                Find something for you
              </Text>
            </View>
          </View>

          {/* ================================================================
              INTRO
          ================================================================ */}

          <Text className="mt-3 max-w-[340px] text-[11px] leading-[17px] text-[#7D8780]">
            Search practices, Ayurvedic guidance, and simple ways to support
            your everyday wellbeing.
          </Text>

          {/* ================================================================
              SEARCH
          ================================================================ */}

          <View className="mt-5 flex-row items-center rounded-[14px] border border-[#DCE2DB] bg-white px-3 shadow-sm">
            <Ionicons name="search-outline" size={19} color="#8E9990" />

            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={scrollToBottom}
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
              className={`ml-2 h-9 w-9 items-center justify-center rounded-[10px] bg-[#4D6A50] ${
                loading ? "opacity-70" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* ================================================================
              FILTERS
          ================================================================ */}

          <View className="mt-5">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-[9px] font-bold uppercase tracking-[1.1px] text-[#9AA29B]">
                Browse by type
              </Text>

              {!searched && results.length > 0 ? (
                <Text className="text-[9px] text-[#A0A7A1]">
                  {results.length} available
                </Text>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FilterChip
                label="All"
                selected={type === "all"}
                disabled={loading}
                onPress={() => handleTypeChange("all")}
              />

              <FilterChip
                label="Yoga"
                selected={type === "yoga"}
                disabled={loading}
                onPress={() => handleTypeChange("yoga")}
              />

              <FilterChip
                label="Ayurveda"
                selected={type === "ayurveda"}
                disabled={loading}
                onPress={() => handleTypeChange("ayurveda")}
              />
            </ScrollView>
          </View>

          {/* ================================================================
              ERROR
          ================================================================ */}

          {error ? (
            <ErrorState
              message={error}
              onRetry={() =>
                query.trim() ? handleSearch() : loadContent(type)
              }
            />
          ) : null}

          {/* ================================================================
              RESULTS
          ================================================================ */}

          {!loading ? (
            <View className="mt-7">
              <View className="mb-4 flex-row items-end justify-between">
                <View>
                  <Text className="font-serif text-[19px] font-bold text-[#263128]">
                    {getResultsTitle()}
                  </Text>

                  {searched && results.length > 0 ? (
                    <Text className="mt-1 text-[9px] text-[#969E98]">
                      Showing your matching wellness content
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

              {results.length === 0 ? (
                <EmptyState searched={searched} query={query} />
              ) : (
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
            <View className="mt-8">
              <View className="mb-4 h-5 w-40 rounded bg-[#E5EAE4]" />

              {[1, 2, 3, 4].map((item) => (
                <ResultSkeleton key={item} />
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
