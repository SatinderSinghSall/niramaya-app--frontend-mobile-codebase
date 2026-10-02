import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
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
import { router, useFocusEffect } from "expo-router";

import {
  getRecommendations,
  getYogaCategories,
  getYogaPage,
  YogaPagination,
} from "@/services/explore.service";

import { CategoryItem, ExploreItem, RecommendationItem } from "@/types/explore";

import { API_BASE_URL } from "@/services/api";

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
  inputBorder: "#DDD8CD",
  warm: "#EEE5D5",
};

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

const YOGA_HERO = {
  uri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=88",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=85";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatCategoryLabel(value?: string) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getImage(item: ExploreItem) {
  return getYogaImageUrl(
    item.imageUrl || item.image || item.thumbnailUrl || undefined,
  );
}

function getYogaImageUrl(value?: string | null) {
  if (!value) return FALLBACK_IMAGE;

  const url = String(value).trim();

  if (!url) return FALLBACK_IMAGE;

  if (url.includes("commons.wikimedia.org/wiki/Special:FilePath/")) {
    return `${API_BASE_URL}/yoga/image?url=${encodeURIComponent(url)}`;
  }

  return url;
}

function getDuration(item: ExploreItem) {
  const duration = item.durationMinutes ?? item.duration;

  if (!duration) return null;

  return `${duration} min`;
}

function getDifficultyLabel(item: ExploreItem) {
  if (!item.difficulty) return null;

  return String(item.difficulty)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function YogaHeader() {
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

      <Text className="text-[11px] font-medium" style={{ color: COLORS.muted }}>
        Mindful movement
      </Text>

      <Text
        className="mt-1 text-[30px] font-bold"
        style={{
          color: COLORS.text,
          fontFamily: "serif",
        }}
      >
        Yoga
      </Text>

      <Text
        className="mt-2 max-w-[340px] text-[13px] leading-5"
        style={{ color: COLORS.muted }}
      >
        Explore gentle practices to support your body, mind and everyday
        wellbeing.
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

function YogaSearch({
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
      {/* Search icon */}
      <View className="h-5 w-5 items-center justify-center">
        <Ionicons name="search-outline" size={19} color={COLORS.muted} />
      </View>

      {/* Search input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search yoga practices..."
        placeholderTextColor="#A0A29B"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        className="ml-3 flex-1"
        style={{
          height: 48,
          paddingVertical: 0,
          paddingHorizontal: 0,
          margin: 0,
          color: COLORS.text,
          fontSize: 13,
          lineHeight: 18,
          includeFontPadding: false,
          textAlignVertical: "center",
        }}
      />

      {/* Clear button */}
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          activeOpacity={0.7}
          className="ml-2 h-7 w-7 items-center justify-center rounded-full bg-[#F0EEE8]"
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

function YogaHero() {
  return (
    <View
      className="mt-5 overflow-hidden rounded-[22px]"
      style={{
        height: 205,
        backgroundColor: COLORS.lightGreen,
      }}
    >
      <Image
        source={YOGA_HERO}
        resizeMode="cover"
        className="absolute inset-0 h-full w-full"
      />

      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(30, 50, 36, 0.38)",
        }}
      />

      <View className="flex-1 justify-end p-5">
        <Text className="text-[9px] font-bold uppercase tracking-[2px] text-white/80">
          FIND YOUR PRACTICE
        </Text>

        <Text
          className="mt-2 max-w-[290px] text-[24px] font-bold leading-8 text-white"
          style={{ fontFamily: "serif" }}
        >
          Move gently.
          {"\n"}
          Breathe deeply.
        </Text>

        <Text className="mt-2 max-w-[300px] text-[12px] leading-[18px] text-white/85">
          Begin where you are and discover a practice that feels right for you.
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Intro                                                                      */
/* -------------------------------------------------------------------------- */

function YogaIntroCard() {
  return (
    <View
      className="mt-5 overflow-hidden rounded-[18px] p-4"
      style={{ backgroundColor: "#DCE7D7" }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#C4D4BE" }}
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
            Find your rhythm
          </Text>

          <Text
            className="mt-1 text-[11px] leading-[17px]"
            style={{ color: "#58705B" }}
          >
            Whether you are beginning or returning to yoga, explore practices at
            your own pace.
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
  categories: { value: string; label: string }[];
  selectedCategory: string | null;
  onSelect: (value: string | null) => void;
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <View className="mt-8">
      <Text
        className="text-[19px] font-bold"
        style={{
          color: COLORS.text,
          fontFamily: "serif",
        }}
      >
        Explore by practice
      </Text>

      <Text className="mt-1 text-[11px]" style={{ color: COLORS.softMuted }}>
        Find a practice that fits your needs
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{ paddingRight: 20 }}
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
/* Yoga For You                                                               */
/* -------------------------------------------------------------------------- */

function YogaRecommendationCard({
  item,
  onPress,
}: {
  item: RecommendationItem;
  onPress: () => void;
}) {
  const data = item as RecommendationItem & {
    _id?: string;
    title?: string;
    name?: string;
    imageUrl?: string;
    image?: string;
    category?: string;
    difficulty?: string;
    durationMinutes?: number;
    duration?: number | string;
  };

  const duration =
    (data.durationMinutes ?? data.duration)
      ? `${data.durationMinutes ?? data.duration} min`
      : null;

  const difficulty = data.difficulty
    ? String(data.difficulty)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : null;

  const image = data.imageUrl || data.image || FALLBACK_IMAGE;

  const title = data.title || data.name || "Yoga Practice";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mr-3 overflow-hidden rounded-[20px] bg-white"
      style={{
        width: 245,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View className="h-[138px] overflow-hidden">
        <Image
          source={{ uri: getYogaImageUrl(image) }}
          resizeMode="cover"
          className="h-full w-full"
          onError={(event) => {
            console.log(
              "Yoga recommendation image failed:",
              getYogaImageUrl(image),
              event.nativeEvent.error,
            );
          }}
        />

        <View
          className="absolute left-3 top-3 rounded-full px-2.5 py-1"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        >
          <Text
            className="text-[9px] font-bold"
            style={{ color: COLORS.green }}
          >
            FOR YOU
          </Text>
        </View>
      </View>

      <View className="p-3.5">
        <Text
          className="text-[16px] font-bold"
          style={{
            color: COLORS.text,
            fontFamily: "serif",
          }}
          numberOfLines={1}
        >
          {title}
        </Text>

        {data.category ? (
          <Text
            className="mt-1 text-[10px]"
            style={{ color: COLORS.muted }}
            numberOfLines={1}
          >
            {formatCategoryLabel(data.category)}
          </Text>
        ) : null}

        <View className="mt-3 flex-row items-center">
          {difficulty ? (
            <View className="mr-2 flex-row items-center">
              <Ionicons name="leaf-outline" size={12} color={COLORS.green} />

              <Text
                className="ml-1 text-[10px]"
                style={{ color: COLORS.muted }}
              >
                {difficulty}
              </Text>
            </View>
          ) : null}

          {duration ? (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={12} color={COLORS.green} />

              <Text
                className="ml-1 text-[10px]"
                style={{ color: COLORS.muted }}
              >
                {duration}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function YogaForYou({
  recommendations,
  onPress,
}: {
  recommendations: RecommendationItem[];
  onPress: (item: RecommendationItem) => void;
}) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View className="mt-8">
      <View className="flex-row items-end justify-between">
        <View className="flex-1">
          <Text
            className="text-[21px] font-bold"
            style={{
              color: COLORS.text,
              fontFamily: "serif",
            }}
          >
            Yoga for you
          </Text>

          <Text
            className="mt-1 text-[11px]"
            style={{ color: COLORS.softMuted }}
          >
            Practices selected around your wellness profile
          </Text>
        </View>

        <View
          className="ml-3 h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.lightGreen }}
        >
          <Ionicons name="sparkles-outline" size={15} color={COLORS.green} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ paddingRight: 18 }}
      >
        {recommendations.map((item) => (
          <YogaRecommendationCard
            key={item._id}
            item={item}
            onPress={() => onPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Yoga Practice Card                                                         */
/* -------------------------------------------------------------------------- */

function YogaPracticeCard({
  item,
  onPress,
}: {
  item: ExploreItem;
  onPress: () => void;
}) {
  const duration = getDuration(item);
  const difficulty = getDifficultyLabel(item);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4 overflow-hidden rounded-[20px] bg-white"
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View className="h-[170px] overflow-hidden">
        <Image
          source={{ uri: getImage(item) }}
          resizeMode="cover"
          className="h-full w-full"
        />

        <View
          className="absolute bottom-3 left-3 flex-row items-center rounded-full px-2.5 py-1.5"
          style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
        >
          <Ionicons name="leaf-outline" size={11} color={COLORS.green} />

          <Text
            className="ml-1 text-[9px] font-semibold"
            style={{ color: COLORS.green }}
          >
            {formatCategoryLabel(item.category)}
          </Text>
        </View>

        {item.isFeatured ? (
          <View
            className="absolute right-3 top-3 rounded-full px-2.5 py-1"
            style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
          >
            <Text
              className="text-[9px] font-bold"
              style={{ color: COLORS.green }}
            >
              FEATURED
            </Text>
          </View>
        ) : null}
      </View>

      <View className="p-4">
        <View className="flex-row items-start">
          <View className="flex-1 pr-3">
            <Text
              className="text-[18px] font-bold"
              style={{
                color: COLORS.text,
                fontFamily: "serif",
              }}
              numberOfLines={2}
            >
              {item.title || item.name}
            </Text>

            {item.description ? (
              <Text
                className="mt-1.5 text-[11px] leading-[17px]"
                style={{ color: COLORS.muted }}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            ) : null}
          </View>

          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.lighterGreen }}
          >
            <Ionicons name="arrow-forward" size={15} color={COLORS.green} />
          </View>
        </View>

        <View className="mt-4 flex-row items-center">
          {difficulty ? (
            <View
              className="mr-2 flex-row items-center rounded-full px-2.5 py-1.5"
              style={{ backgroundColor: "#F1F3ED" }}
            >
              <Ionicons name="leaf-outline" size={11} color={COLORS.green} />
              <Text
                className="ml-1 text-[9px] font-semibold"
                style={{ color: COLORS.muted }}
              >
                {difficulty}
              </Text>
            </View>
          ) : null}

          {duration ? (
            <View
              className="mr-2 flex-row items-center rounded-full px-2.5 py-1.5"
              style={{ backgroundColor: "#F5F0E7" }}
            >
              <Ionicons name="time-outline" size={11} color="#82755F" />
              <Text
                className="ml-1 text-[9px] font-semibold"
                style={{ color: COLORS.muted }}
              >
                {duration}
              </Text>
            </View>
          ) : null}

          {item.videoUrl ? (
            <View
              className="flex-row items-center rounded-full px-2.5 py-1.5"
              style={{ backgroundColor: "#EDF2EE" }}
            >
              <Ionicons
                name="play-circle-outline"
                size={11}
                color={COLORS.green}
              />

              <Text
                className="ml-1 text-[9px] font-semibold"
                style={{ color: COLORS.muted }}
              >
                Guided
              </Text>
            </View>
          ) : null}
        </View>

        {item.benefits && item.benefits.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap">
            {item.benefits.slice(0, 2).map((benefit, index) => (
              <View
                key={`${item._id}-benefit-${index}`}
                className="mr-1.5 mt-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: "#F7F5EF" }}
              >
                <Text
                  className="text-[9px]"
                  style={{ color: COLORS.muted }}
                  numberOfLines={1}
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/* Calm Strip                                                                 */
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
            uri: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=700&q=85",
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(40,65,48,0.30)" }}
        />

        <View className="flex-1 justify-end p-3.5">
          <Text className="text-[15px] font-bold text-white">Breathe</Text>

          <Text className="mt-1 text-[10px] text-white/85">
            Slow down and reconnect
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
            uri: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=700&q=85",
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(45,45,30,0.24)" }}
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
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

function YogaEmptyState({
  searched,
  filtered,
}: {
  searched: boolean;
  filtered: boolean;
}) {
  return (
    <View
      className="rounded-[20px] bg-white px-5 py-8"
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View className="items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.lighterGreen }}
        >
          <Ionicons
            name={searched || filtered ? "search-outline" : "leaf-outline"}
            size={24}
            color={COLORS.green}
          />
        </View>

        <Text
          className="mt-4 text-center text-[19px] font-bold"
          style={{
            color: COLORS.text,
            fontFamily: "serif",
          }}
        >
          {searched || filtered ? "Nothing found" : "No practices yet"}
        </Text>

        <Text
          className="mt-2 max-w-[290px] text-center text-[12px] leading-5"
          style={{ color: COLORS.muted }}
        >
          {searched || filtered
            ? "Try another search or explore a different practice category."
            : "Yoga practices will appear here when they become available."}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

function PaginationFooter({
  pagination,
  loading,
  onPrevious,
  onNext,
}: {
  pagination: YogaPagination;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <View className="mt-2 flex-row items-center justify-between rounded-[18px] bg-white p-3.5">
      <TouchableOpacity
        onPress={onPrevious}
        disabled={loading || pagination.page <= 1}
        activeOpacity={0.8}
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            pagination.page <= 1 ? "#F2F0EA" : COLORS.lighterGreen,
          opacity: pagination.page <= 1 ? 0.45 : 1,
        }}
      >
        <Ionicons name="chevron-back" size={17} color={COLORS.green} />
      </TouchableOpacity>

      <View className="items-center">
        <Text
          className="text-[11px] font-semibold"
          style={{ color: COLORS.text }}
        >
          Page {pagination.page} of {pagination.totalPages}
        </Text>

        <Text className="mt-0.5 text-[9px]" style={{ color: COLORS.softMuted }}>
          {pagination.total} practices
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={loading || pagination.page >= pagination.totalPages}
        activeOpacity={0.8}
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            pagination.page >= pagination.totalPages
              ? "#F2F0EA"
              : COLORS.lighterGreen,
          opacity: pagination.page >= pagination.totalPages ? 0.45 : 1,
        }}
      >
        <Ionicons name="chevron-forward" size={17} color={COLORS.green} />
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export default function YogaScreen() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );

  const [pagination, setPagination] = useState<YogaPagination>({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [error, setError] = useState("");

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Categories                                                             */
  /* ---------------------------------------------------------------------- */

  const loadCategories = useCallback(async () => {
    try {
      const data = await getYogaCategories();
      setCategories(data);
    } catch (error) {
      console.error("Yoga categories loading error:", error);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Recommendations                                                        */
  /* ---------------------------------------------------------------------- */

  const loadRecommendations = useCallback(async () => {
    try {
      setRecommendationLoading(true);

      const data = await getRecommendations("yoga", 6);

      setRecommendations(data);
    } catch (error) {
      console.error("Yoga recommendations loading error:", error);
      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Yoga Library                                                           */
  /* ---------------------------------------------------------------------- */

  const loadYoga = useCallback(
    async (
      page = 1,
      options?: {
        category?: string | null;
        search?: string;
        difficulty?: string | null;
        showLoader?: boolean;
      },
    ) => {
      try {
        if (options?.showLoader) {
          setLoading(true);
        } else if (page > 1) {
          setLoadingMore(true);
        }

        setError("");

        const result = await getYogaPage({
          category:
            options?.category !== undefined
              ? options.category || undefined
              : selectedCategory || undefined,

          search:
            options?.search !== undefined
              ? options.search.trim() || undefined
              : search.trim() || undefined,

          difficulty:
            options?.difficulty !== undefined
              ? options.difficulty || undefined
              : selectedDifficulty || undefined,

          page,
          limit: 8,
        });

        setItems(result.items);
        setPagination(result.pagination);
      } catch (err: any) {
        console.error("Yoga loading error:", err);

        const serverMessage = err?.response?.data?.message;

        setError(
          typeof serverMessage === "string" && serverMessage.trim()
            ? serverMessage.trim()
            : "We couldn't load yoga practices right now. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [search, selectedCategory, selectedDifficulty],
  );

  /* ---------------------------------------------------------------------- */
  /* Initial load                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      await Promise.all([
        loadCategories(),
        loadRecommendations(),
        loadYoga(1, {
          category: null,
          search: "",
          difficulty: null,
          showLoader: false,
        }),
      ]);

      setLoading(false);
    };

    loadInitialData();
  }, [loadCategories, loadRecommendations]);

  /* ---------------------------------------------------------------------- */
  /* Refresh when returning to screen                                        */
  /* ---------------------------------------------------------------------- */

  useFocusEffect(
    useCallback(() => {
      loadRecommendations();

      return undefined;
    }, [loadRecommendations]),
  );

  /* ---------------------------------------------------------------------- */
  /* Search                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      loadYoga(1, {
        search: value,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        showLoader: false,
      });
    }, 400);
  };

  const clearSearch = () => {
    setSearch("");

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    loadYoga(1, {
      search: "",
      category: selectedCategory,
      difficulty: selectedDifficulty,
      showLoader: false,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Category                                                                */
  /* ---------------------------------------------------------------------- */

  const handleCategory = async (value: string | null) => {
    setSelectedCategory(value);
    setSearch("");

    await loadYoga(1, {
      category: value,
      search: "",
      difficulty: selectedDifficulty,
      showLoader: true,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Difficulty                                                              */
  /* ---------------------------------------------------------------------- */

  const handleDifficulty = async (value: string | null) => {
    setSelectedDifficulty(value);

    await loadYoga(1, {
      category: selectedCategory,
      search,
      difficulty: value,
      showLoader: true,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Refresh                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      loadRecommendations(),
      loadYoga(1, {
        category: selectedCategory,
        search,
        difficulty: selectedDifficulty,
        showLoader: false,
      }),
    ]);
  };

  /* ---------------------------------------------------------------------- */
  /* Pagination                                                              */
  /* ---------------------------------------------------------------------- */

  const goToPage = async (page: number) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page ||
      loadingMore
    ) {
      return;
    }

    await loadYoga(page, {
      category: selectedCategory,
      search,
      difficulty: selectedDifficulty,
      showLoader: false,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Categories cleanup                                                      */
  /* ---------------------------------------------------------------------- */

  const cleanCategories = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();

    categories.forEach((category, index) => {
      const data = category as CategoryItem & {
        value?: string;
        name?: string;
        label?: string;
        slug?: string;
        key?: string;
        category?: string;
      };

      const value =
        data.value ||
        data.slug ||
        data.key ||
        data.category ||
        data.name ||
        data.label ||
        `category-${index}`;

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
      if (!item.category) {
        return;
      }

      const value = String(item.category);
      const label = formatCategoryLabel(value);

      if (label && !map.has(value)) {
        map.set(value, {
          value,
          label,
        });
      }
    });

    return Array.from(map.values());
  }, [categories, items]);

  /* ---------------------------------------------------------------------- */
  /* Difficulty filters                                                      */
  /* ---------------------------------------------------------------------- */

  const difficultyFilters = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  if (loading && items.length === 0) {
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
            paddingBottom: 50,
          }}
        >
          <View className="h-10 w-10 rounded-full bg-[#E8E3D9]" />

          <View className="mt-5 h-3 w-28 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-9 w-24 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-4 w-[82%] rounded bg-[#E8E3D9]" />

          <View className="mt-5 h-[50px] rounded-[16px] bg-[#EAE6DD]" />
          <View className="mt-5 h-[205px] rounded-[22px] bg-[#E5E0D6]" />

          <View className="mt-8 h-[24px] w-36 rounded bg-[#E8E3D9]" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {[1, 2, 3].map((item) => (
              <View
                key={item}
                className="mr-3 h-[215px] w-[245px] rounded-[20px] bg-[#E7E3DA]"
              />
            ))}
          </ScrollView>

          <View className="mt-9 h-6 w-44 rounded bg-[#E8E3D9]" />
          <View className="mt-2 h-3 w-56 rounded bg-[#E8E3D9]" />

          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mt-4 h-[330px] rounded-[20px] bg-white"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <View className="h-[170px] rounded-t-[20px] bg-[#E9E5DC]" />
              <View className="p-4">
                <View className="h-5 w-[72%] rounded bg-[#E8E3D9]" />
                <View className="mt-2 h-3 w-[90%] rounded bg-[#E8E3D9]" />
                <View className="mt-2 h-3 w-[65%] rounded bg-[#E8E3D9]" />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                   */
  /* ---------------------------------------------------------------------- */

  if (error && items.length === 0) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: COLORS.background }}
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
              style={{ backgroundColor: COLORS.lightGreen }}
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
              Yoga is unavailable
            </Text>

            <Text
              className="mt-2 text-center text-[13px] leading-5"
              style={{ color: COLORS.muted }}
            >
              {error}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              loadYoga(1, {
                category: selectedCategory,
                search,
                difficulty: selectedDifficulty,
                showLoader: true,
              })
            }
            activeOpacity={0.8}
            className="mt-6 items-center rounded-[14px] py-3.5"
            style={{ backgroundColor: COLORS.green }}
          >
            <Text className="text-[13px] font-semibold text-white">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Main                                                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
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
            paddingBottom: 40,
          }}
        >
          <YogaHeader />

          <YogaSearch
            value={search}
            onChangeText={handleSearch}
            onClear={clearSearch}
          />

          <YogaHero />

          <YogaIntroCard />

          {/* -------------------------------------------------------------- */}
          {/* Yoga For You                                                    */}
          {/* -------------------------------------------------------------- */}

          {!search && !selectedCategory ? (
            recommendationLoading ? (
              <View className="mt-8">
                <View className="flex-row items-center">
                  <View className="h-6 w-32 rounded bg-[#E8E3D9]" />
                  <ActivityIndicator
                    size="small"
                    color={COLORS.green}
                    className="ml-2"
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-4"
                >
                  {[1, 2].map((item) => (
                    <View
                      key={item}
                      className="mr-3 h-[215px] w-[245px] rounded-[20px] bg-[#E7E3DA]"
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <YogaForYou
                recommendations={recommendations}
                onPress={(item) =>
                  router.push({
                    pathname: "/(main)/yoga/[id]",
                    params: { id: item._id },
                  })
                }
              />
            )
          ) : null}

          {/* -------------------------------------------------------------- */}
          {/* Explore by Practice                                              */}
          {/* -------------------------------------------------------------- */}

          <CategorySection
            categories={cleanCategories}
            selectedCategory={selectedCategory}
            onSelect={handleCategory}
          />

          {/* -------------------------------------------------------------- */}
          {/* All Yoga                                                          */}
          {/* -------------------------------------------------------------- */}

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
                      : "All yoga"}
                </Text>

                <Text
                  className="mt-1 text-[11px]"
                  style={{ color: COLORS.muted }}
                >
                  {search
                    ? `${pagination.total} practices found`
                    : selectedCategory
                      ? "Practices in this category"
                      : "A quiet library of practices for every day"}
                </Text>
              </View>

              <View
                className="h-8 min-w-8 items-center justify-center rounded-full px-2"
                style={{ backgroundColor: COLORS.lightGreen }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{ color: COLORS.green }}
                >
                  {pagination.total}
                </Text>
              </View>
            </View>

            {/* ------------------------------------------------------------ */}
            {/* Difficulty filters                                             */}
            {/* ------------------------------------------------------------ */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <TouchableOpacity
                onPress={() => handleDifficulty(null)}
                activeOpacity={0.8}
                className="mr-2 flex-row items-center rounded-full px-3.5"
                style={{
                  height: 34,
                  backgroundColor: !selectedDifficulty
                    ? COLORS.green
                    : COLORS.surface,
                  borderWidth: !selectedDifficulty ? 0 : 1,
                  borderColor: COLORS.border,
                }}
              >
                <Ionicons
                  name="options-outline"
                  size={13}
                  color={!selectedDifficulty ? "#FFFFFF" : COLORS.muted}
                />

                <Text
                  className="ml-1.5 text-[10px] font-semibold"
                  style={{
                    color: !selectedDifficulty ? "#FFFFFF" : COLORS.muted,
                  }}
                >
                  All levels
                </Text>
              </TouchableOpacity>

              {difficultyFilters.map((filter) => {
                const selected = selectedDifficulty === filter.value;

                return (
                  <TouchableOpacity
                    key={filter.value}
                    onPress={() => handleDifficulty(filter.value)}
                    activeOpacity={0.8}
                    className="mr-2 rounded-full px-3.5"
                    style={{
                      height: 34,
                      justifyContent: "center",
                      backgroundColor: selected ? COLORS.green : COLORS.surface,
                      borderWidth: selected ? 0 : 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <Text
                      className="text-[10px] font-semibold"
                      style={{
                        color: selected ? "#FFFFFF" : COLORS.muted,
                      }}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {loading && items.length > 0 ? (
              <View className="mt-3 flex-row items-center">
                <ActivityIndicator size="small" color={COLORS.green} />

                <Text
                  className="ml-2 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Updating practices...
                </Text>
              </View>
            ) : null}

            {search ? (
              <View className="mt-3 flex-row items-center">
                <Ionicons
                  name="search-outline"
                  size={13}
                  color={COLORS.green}
                />

                <Text
                  className="ml-1.5 text-[11px]"
                  style={{ color: COLORS.muted }}
                >
                  Showing results for{" "}
                  <Text
                    className="font-semibold"
                    style={{ color: COLORS.green }}
                  >
                    "{search}"
                  </Text>
                </Text>
              </View>
            ) : null}

            {/* ------------------------------------------------------------ */}
            {/* Cards                                                          */}
            {/* ------------------------------------------------------------ */}

            {items.length > 0 ? (
              <View className="mt-4">
                {items.map((item) => (
                  <YogaPracticeCard
                    key={item._id}
                    item={item}
                    onPress={() =>
                      router.push({
                        pathname: "/(main)/yoga/[id]",
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
                <YogaEmptyState
                  searched={Boolean(search)}
                  filtered={Boolean(selectedCategory || selectedDifficulty)}
                />
              </View>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Pagination                                                     */}
            {/* ------------------------------------------------------------ */}

            <PaginationFooter
              pagination={pagination}
              loading={loadingMore}
              onPrevious={() => goToPage(pagination.page - 1)}
              onNext={() => goToPage(pagination.page + 1)}
            />

            {loadingMore ? (
              <View className="mt-3 flex-row items-center justify-center">
                <ActivityIndicator size="small" color={COLORS.green} />

                <Text
                  className="ml-2 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Finding more practices...
                </Text>
              </View>
            ) : null}
          </View>

          {/* -------------------------------------------------------------- */}
          {/* Calm Visual Section                                              */}
          {/* -------------------------------------------------------------- */}

          {!search && items.length > 0 ? <CalmStrip /> : null}

          {/* -------------------------------------------------------------- */}
          {/* Quote                                                            */}
          {/* -------------------------------------------------------------- */}

          {!search ? (
            <View className="mt-10 items-center px-5">
              <View
                className="mb-5 h-px w-10"
                style={{ backgroundColor: COLORS.border }}
              />

              <Text
                className="text-center text-[19px] font-bold leading-7"
                style={{
                  color: COLORS.text,
                  fontFamily: "serif",
                }}
              >
                Come to the practice
                {"\n"}
                with no expectation.
              </Text>

              <Text
                className="mt-3 text-center text-[11px] leading-5"
                style={{ color: COLORS.softMuted }}
              >
                Take a few moments for yourself.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
