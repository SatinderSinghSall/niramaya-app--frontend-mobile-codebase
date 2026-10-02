import React, { useCallback, useEffect, useMemo, useState } from "react";

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

import { router, useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { API_BASE_URL } from "@/services/api";

import {
  getAyurvedaCategories,
  getFeaturedAyurveda,
  getFeaturedYoga,
  getRecommendations,
  getYogaCategories,
} from "@/services/explore.service";

import { CategoryItem, ExploreItem, RecommendationItem } from "@/types/explore";

import ExploreContentCard from "@/components/explore/ExploreContentCard";

import ExploreEmptyState from "@/components/explore/ExploreEmptyState";
import GoalsCTA from "@/components/home/GoalsCTA";
import HealthProfileCTA from "@/components/home/HealthProfileCTA";
import ConsultationCTA from "@/components/home/ConsultationCTA";

/* ========================================================================== */
/* COLORS                                                                     */
/* ========================================================================== */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#263128",
  muted: "#747A72",
  softMuted: "#9A9D95",

  green: "#4E6A51",
  darkGreen: "#3E5942",

  lightGreen: "#E8F0E4",
  sage: "#C8D5BC",
  sand: "#E8DDC8",

  border: "#E5E0D6",
};

const WELLNESS_CATEGORIES: CategoryItem[] = [
  {
    value: "energy",
    label: "Energy",
  } as CategoryItem,

  {
    value: "stress_relief",
    label: "Stress Relief",
  } as CategoryItem,

  {
    value: "sleep",
    label: "Sleep",
  } as CategoryItem,

  {
    value: "flexibility",
    label: "Flexibility",
  } as CategoryItem,

  {
    value: "focus",
    label: "Focus",
  } as CategoryItem,

  {
    value: "digestion",
    label: "Digestion",
  } as CategoryItem,

  {
    value: "immunity",
    label: "Immunity",
  } as CategoryItem,

  {
    value: "relaxation",
    label: "Relaxation",
  } as CategoryItem,
];

/* ========================================================================== */
/* CATEGORY HELPERS                                                           */
/* ========================================================================== */

function getCategoryValue(category: CategoryItem, index: number) {
  const data = category as CategoryItem & {
    value?: string;
    name?: string;
    label?: string;
    slug?: string;
    key?: string;
  };

  return (
    data.value ||
    data.slug ||
    data.key ||
    data.name ||
    data.label ||
    `category-${index}`
  );
}

function getCategoryLabel(category: CategoryItem) {
  const data = category as CategoryItem & {
    value?: string;
    name?: string;
    label?: string;
    slug?: string;
  };

  const value = data.label || data.name || data.value || data.slug || "";

  if (!value) {
    return "";
  }

  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ========================================================================== */
/* SEARCH HELPER                                                              */
/* ========================================================================== */

function matchesSearch(item: ExploreItem | RecommendationItem, query: string) {
  if (!query.trim()) {
    return true;
  }

  const search = query.trim().toLowerCase();

  const data = item as ExploreItem & {
    title?: string;
    name?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    type?: string;
    resultType?: string;
  };

  const content = [
    data.title,
    data.name,
    data.description,
    data.category,
    data.difficulty,
    data.type,
    data.resultType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return content.includes(search);
}

/* ========================================================================== */
/* HEADER                                                                     */
/* ========================================================================== */

function ExploreHeader() {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontFamily: "serif",
          fontSize: 27,
          fontWeight: "700",
          letterSpacing: -0.5,
        }}
      >
        Explore
      </Text>

      <View
        style={{
          width: 30,
          height: 1,
          marginTop: 10,
          backgroundColor: "#BDB6A9",
        }}
      />

      <Text
        style={{
          marginTop: 8,
          color: COLORS.muted,
          fontSize: 11,
        }}
      >
        Find a practice that feels right for you
      </Text>
    </View>
  );
}

/* ========================================================================== */
/* SEARCH BAR                                                                 */
/* ========================================================================== */

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View
      style={{
        height: 50,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,

        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: "#FFFFFF",
      }}
    >
      <Ionicons name="search-outline" size={18} color={COLORS.softMuted} />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search yoga, Ayurveda, wellness..."
        placeholderTextColor="#A2A59E"
        returnKeyType="search"
        autoCorrect={false}
        style={{
          flex: 1,
          marginLeft: 10,
          color: COLORS.text,
          fontSize: 13,
        }}
      />

      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChange("")}
          activeOpacity={0.7}
          style={{
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close-circle" size={18} color="#A0A59D" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ========================================================================== */
/* SECTION HEADER                                                             */
/* ========================================================================== */

function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: COLORS.text,
            fontFamily: "serif",
            fontSize: 21,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={{
              marginTop: 4,
              color: COLORS.muted,
              fontSize: 11,
              lineHeight: 16,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.7}
          style={{
            paddingBottom: 2,
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.green,
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            {action}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ========================================================================== */
/* CATEGORY ITEM                                                              */
/* ========================================================================== */

function PracticeItem({
  label,
  index,
  selected,
  onPress,
}: {
  label: string;
  index: number;
  selected: boolean;
  onPress: () => void;
}) {
  const backgrounds = [
    "#D8E5D4",
    "#E8DDC5",
    "#DDD1E8",
    "#E5D9BC",
    "#D3E0D0",
    "#E4CEC2",
  ];

  const background = backgrounds[index % backgrounds.length];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 72,
        marginRight: 13,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,

          alignItems: "center",
          justifyContent: "center",

          backgroundColor: selected ? COLORS.green : background,
        }}
      >
        {selected ? (
          <Ionicons name="checkmark" size={19} color="#FFFFFF" />
        ) : (
          <Text
            style={{
              color: COLORS.text,
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            {label.charAt(0)}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={2}
        style={{
          marginTop: 7,
          color: COLORS.text,
          fontSize: 10,
          lineHeight: 14,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ========================================================================== */
/* CATEGORY ROW                                                               */
/* ========================================================================== */

function CategoryRow({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryItem[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const cleanCategories = categories
    .map((category, index) => ({
      value: getCategoryValue(category, index),
      label: getCategoryLabel(category),
    }))
    .filter(
      (category) =>
        category.label.length > 0 &&
        category.label.toLowerCase() !== "category",
    );

  if (cleanCategories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingRight: 10,
      }}
    >
      <PracticeItem
        label="All"
        index={0}
        selected={!selected}
        onPress={() => onSelect(null)}
      />

      {cleanCategories.map((category, index) => (
        <PracticeItem
          key={category.value}
          label={category.label}
          index={index + 1}
          selected={selected === category.value}
          onPress={() => onSelect(category.value)}
        />
      ))}
    </ScrollView>
  );
}

function getExploreImageUrl(value?: string | null) {
  if (!value) return value;

  const url = String(value).trim();

  if (!url) return value;

  if (url.includes("commons.wikimedia.org/wiki/Special:FilePath/")) {
    return `${API_BASE_URL}/yoga/image?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/* ========================================================================== */
/* CONTENT ROW                                                                */
/* ========================================================================== */

function ContentRow({
  items,
  type,
  emptyTitle,
  emptyDescription,
  onPress,
}: {
  items: ExploreItem[] | RecommendationItem[];
  type: "yoga" | "ayurveda";
  emptyTitle: string;
  emptyDescription: string;
  onPress: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <ExploreEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingRight: 18,
      }}
    >
      {items.map((item, index) => {
        if (!item) {
          return null;
        }

        const itemId =
          item._id ||
          (item as any).id ||
          (item as any).yogaId ||
          (item as any).ayurvedaId;

        if (!itemId) {
          console.warn(`Explore: ${type} item is missing an ID`, item);

          return null;
        }

        return (
          <ExploreContentCard
            key={`${type}-${itemId}-${index}`}
            item={{
              ...item,
              imageUrl: getExploreImageUrl(
                item.imageUrl ||
                  (item as any).image ||
                  (item as any).thumbnailUrl,
              ),
            }}
            type={type}
            compact
            onPress={() => onPress(itemId)}
          />
        );
      })}
    </ScrollView>
  );
}

/* ========================================================================== */
/* SKELETON                                                                   */
/* ========================================================================== */

function SkeletonBlock({
  width,
  height,
  radius = 12,
  style,
}: {
  width: number | string;
  height: number;
  radius?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#E9E5DC",
        },
        style,
      ]}
    />
  );
}

/* ========================================================================== */
/* CATEGORY SKELETON                                                          */
/* ========================================================================== */

function CategorySkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          style={{
            width: 72,
            marginRight: 13,
            alignItems: "center",
          }}
        >
          <SkeletonBlock width={60} height={60} radius={30} />

          <SkeletonBlock
            width={45}
            height={9}
            radius={5}
            style={{
              marginTop: 8,
            }}
          />
        </View>
      ))}
    </View>
  );
}

/* ========================================================================== */
/* CARD SKELETON                                                              */
/* ========================================================================== */

function CardSkeleton() {
  return (
    <View
      style={{
        width: 258,
        marginRight: 14,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <SkeletonBlock width="100%" height={142} radius={0} />

      <View
        style={{
          padding: 15,
        }}
      >
        <SkeletonBlock width={55} height={8} radius={4} />

        <SkeletonBlock
          width="78%"
          height={17}
          radius={6}
          style={{
            marginTop: 9,
          }}
        />

        <SkeletonBlock
          width="92%"
          height={10}
          radius={5}
          style={{
            marginTop: 10,
          }}
        />

        <SkeletonBlock
          width="65%"
          height={10}
          radius={5}
          style={{
            marginTop: 6,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <SkeletonBlock width={50} height={9} radius={4} />

          <SkeletonBlock width={55} height={9} radius={4} />
        </View>
      </View>
    </View>
  );
}

/* ========================================================================== */
/* FULL SCREEN SKELETON                                                       */
/* ========================================================================== */

function ExploreSkeleton() {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 50,
        }}
      >
        {/* Header */}

        <View
          style={{
            alignItems: "center",
          }}
        >
          <SkeletonBlock width={90} height={25} radius={8} />

          <SkeletonBlock
            width={30}
            height={1}
            radius={0}
            style={{
              marginTop: 10,
            }}
          />

          <SkeletonBlock
            width={190}
            height={10}
            radius={5}
            style={{
              marginTop: 9,
            }}
          />
        </View>

        {/* Search */}

        <SkeletonBlock
          width="100%"
          height={50}
          radius={15}
          style={{
            marginTop: 20,
          }}
        />

        {/* Categories */}

        <View
          style={{
            marginTop: 31,
          }}
        >
          <SkeletonBlock width={90} height={21} radius={7} />

          <SkeletonBlock
            width={190}
            height={9}
            radius={4}
            style={{
              marginTop: 7,
            }}
          />

          <View
            style={{
              marginTop: 16,
            }}
          >
            <CategorySkeleton />
          </View>
        </View>

        {/* For you */}

        <View
          style={{
            marginTop: 34,
          }}
        >
          <SkeletonBlock width={75} height={21} radius={7} />

          <SkeletonBlock
            width={180}
            height={9}
            radius={4}
            style={{
              marginTop: 7,
            }}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginTop: 16,
            }}
          >
            <CardSkeleton />
            <CardSkeleton />
          </ScrollView>
        </View>

        {/* Yoga */}

        <View
          style={{
            marginTop: 34,
          }}
        >
          <SkeletonBlock width={55} height={21} radius={7} />

          <SkeletonBlock
            width={160}
            height={9}
            radius={4}
            style={{
              marginTop: 7,
            }}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginTop: 16,
            }}
          >
            <CardSkeleton />
            <CardSkeleton />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProgressExploreCard() {
  return (
    <View
      style={{
        marginTop: 32,
        overflow: "hidden",
        borderRadius: 24,
        backgroundColor: COLORS.darkGreen,
      }}
    >
      {/* Decorative shapes */}
      <View
        style={{
          position: "absolute",
          width: 130,
          height: 130,
          borderRadius: 65,
          right: -45,
          top: -45,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />

      <View
        style={{
          position: "absolute",
          width: 90,
          height: 90,
          borderRadius: 45,
          right: 35,
          bottom: -45,
          backgroundColor: "rgba(40,165,172,0.10)",
        }}
      />

      <View
        style={{
          padding: 20,
        }}
      >
        {/* Top row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Ionicons name="analytics-outline" size={21} color="#DCE9DD" />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
              paddingRight: 8,
            }}
          >
            <Text
              style={{
                color: "#BFD1C0",
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1.4,
              }}
            >
              YOUR WELLNESS JOURNEY
            </Text>

            <Text
              style={{
                marginTop: 5,
                color: "#FFFFFF",
                fontFamily: "serif",
                fontSize: 20,
                lineHeight: 25,
                fontWeight: "700",
              }}
            >
              Notice how you are doing.
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{
            marginTop: 14,
            maxWidth: 290,
            color: "#D5E0D5",
            fontSize: 11,
            lineHeight: 17,
          }}
        >
          Track your mood, sleep, energy, movement and daily habits in one quiet
          space.
        </Text>

        {/* Bottom action */}
        <View
          style={{
            marginTop: 17,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="leaf-outline" size={13} color="#A8C6AC" />

            <Text
              style={{
                marginLeft: 6,
                color: "#BFD1C0",
                fontSize: 9,
              }}
            >
              Small steps, meaningful patterns
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(main)/progress")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 13,
              paddingVertical: 9,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                color: COLORS.darkGreen,
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              View progress
            </Text>

            <Ionicons
              name="arrow-forward"
              size={13}
              color={COLORS.darkGreen}
              style={{
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ========================================================================== */
/* MAIN SCREEN                                                                */
/* ========================================================================== */

export default function ExploreScreen() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );

  const [featuredYoga, setFeaturedYoga] = useState<ExploreItem[]>([]);

  const [featuredAyurveda, setFeaturedAyurveda] = useState<ExploreItem[]>([]);

  const [yogaCategories, setYogaCategories] = useState<CategoryItem[]>([]);

  const [ayurvedaCategories, setAyurvedaCategories] = useState<CategoryItem[]>(
    [],
  );

  const [yogaCategory, setYogaCategory] = useState<string | null>(null);

  const [ayurvedaCategory, setAyurvedaCategory] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* ======================================================================== */
  /* LOAD                                                                     */
  /* ======================================================================== */

  const loadExplore = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const [
        recommendationData,
        yogaData,
        ayurvedaData,
        yogaCategoryData,
        ayurvedaCategoryData,
      ] = await Promise.all([
        getRecommendations("all", 10),
        getFeaturedYoga(),
        getFeaturedAyurveda(),
        getYogaCategories(),
        getAyurvedaCategories(),
      ]);

      setRecommendations(recommendationData);
      setFeaturedYoga(yogaData);
      setFeaturedAyurveda(ayurvedaData);
      setYogaCategories(yogaCategoryData);
      setAyurvedaCategories(ayurvedaCategoryData);
    } catch (err: any) {
      console.error("Explore loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load Explore.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ======================================================================== */
  /* INITIAL LOAD                                                             */
  /* ======================================================================== */

  useEffect(() => {
    loadExplore(true);
  }, [loadExplore]);

  /* ======================================================================== */
  /* SCREEN FOCUS                                                             */
  /* ======================================================================== */

  useFocusEffect(
    useCallback(() => {
      loadExplore(false);

      return undefined;
    }, [loadExplore]),
  );

  /* ======================================================================== */
  /* REFRESH                                                                  */
  /* ======================================================================== */

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadExplore(false);
  }, [loadExplore]);

  /* ======================================================================== */
  /* SEARCH FILTERING                                                         */
  /* ======================================================================== */

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => matchesSearch(item, searchQuery));
  }, [recommendations, searchQuery]);

  const filteredYoga = useMemo(() => {
    return featuredYoga.filter((item) => matchesSearch(item, searchQuery));
  }, [featuredYoga, searchQuery]);

  const filteredAyurveda = useMemo(() => {
    return featuredAyurveda.filter((item) => matchesSearch(item, searchQuery));
  }, [featuredAyurveda, searchQuery]);

  const recommendedYoga = filteredRecommendations.filter(
    (item) => item.resultType === "yoga" || item.type === "yoga",
  );

  const recommendedAyurveda = filteredRecommendations.filter(
    (item) => item.resultType === "ayurveda" || item.type === "ayurveda",
  );

  const hasSearch = searchQuery.trim().length > 0;

  const noSearchResults =
    hasSearch &&
    filteredRecommendations.length === 0 &&
    filteredYoga.length === 0 &&
    filteredAyurveda.length === 0;

  /* ======================================================================== */
  /* NAVIGATION                                                               */
  /* ======================================================================== */

  const openYoga = (id: string) => {
    router.push({
      pathname: "/(main)/yoga/[id]",
      params: {
        id,
      },
    });
  };

  const openAyurveda = (id: string) => {
    router.push({
      pathname: "/(main)/ayurveda/[id]",
      params: {
        id,
      },
    });
  };

  /* ======================================================================== */
  /* LOADING                                                                  */
  /* ======================================================================== */

  if (loading) {
    return <ExploreSkeleton />;
  }

  /* ======================================================================== */
  /* ERROR                                                                    */
  /* ======================================================================== */

  if (
    error &&
    recommendations.length === 0 &&
    featuredYoga.length === 0 &&
    featuredAyurveda.length === 0
  ) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 22,
          backgroundColor: COLORS.background,
        }}
      >
        <View
          style={{
            width: "100%",
            padding: 24,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.lightGreen,
            }}
          >
            <Ionicons name="leaf-outline" size={25} color={COLORS.green} />
          </View>

          <Text
            style={{
              marginTop: 15,
              color: COLORS.text,
              fontFamily: "serif",
              fontSize: 22,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Explore
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: COLORS.muted,
              fontSize: 12,
              lineHeight: 18,
              textAlign: "center",
            }}
          >
            {error}
          </Text>

          <TouchableOpacity
            onPress={() => loadExplore(true)}
            activeOpacity={0.85}
            style={{
              marginTop: 20,
              height: 46,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 13,
              backgroundColor: COLORS.green,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ======================================================================== */
  /* MAIN                                                                     */
  /* ======================================================================== */

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
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
          keyboardDismissMode="none"
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
          {/* ================================================================== */}
          {/* HEADER                                                             */}
          {/* ================================================================== */}

          <ExploreHeader />

          {/* ================================================================== */}
          {/* SEARCH                                                             */}
          {/* ================================================================== */}

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* ================================================================== */}
          {/* SEARCH RESULTS                                                     */}
          {/* ================================================================== */}

          {noSearchResults ? (
            <View
              style={{
                marginTop: 35,
                alignItems: "center",
                paddingHorizontal: 25,
              }}
            >
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.lightGreen,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={25}
                  color={COLORS.green}
                />
              </View>

              <Text
                style={{
                  marginTop: 15,
                  color: COLORS.text,
                  fontFamily: "serif",
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Nothing found
              </Text>

              <Text
                style={{
                  marginTop: 7,
                  color: COLORS.muted,
                  fontSize: 12,
                  lineHeight: 18,
                  textAlign: "center",
                }}
              >
                Try another word such as yoga, breathing, sleep or stress.
              </Text>
            </View>
          ) : (
            <>
              {/* ================================================================ */}
              {/* CATEGORIES                                                       */}
              {/* ================================================================ */}

              {!hasSearch ? (
                <View
                  style={{
                    marginTop: 32,
                  }}
                >
                  <SectionHeader
                    title="Categories"
                    subtitle="Explore ways to support your wellbeing"
                  />

                  <CategoryRow
                    categories={WELLNESS_CATEGORIES}
                    selected={yogaCategory}
                    onSelect={setYogaCategory}
                  />

                  <ProgressExploreCard />
                </View>
              ) : null}

              {/* ================================================================ */}
              {/* FOR YOU                                                          */}
              {/* ================================================================ */}

              {recommendations.length > 0 &&
              filteredRecommendations.length > 0 ? (
                <View
                  style={{
                    marginTop: 32,
                  }}
                >
                  <SectionHeader
                    title={hasSearch ? "Matches" : "For you"}
                    subtitle={
                      hasSearch
                        ? "Practices matching your search"
                        : "Wellness selected from your journey"
                    }
                  />

                  {recommendedYoga.length > 0 ? (
                    <ContentRow
                      items={recommendedYoga}
                      type="yoga"
                      emptyTitle=""
                      emptyDescription=""
                      onPress={openYoga}
                    />
                  ) : null}

                  {recommendedAyurveda.length > 0 ? (
                    <View
                      style={{
                        marginTop: recommendedYoga.length > 0 ? 16 : 0,
                      }}
                    >
                      <ContentRow
                        items={recommendedAyurveda}
                        type="ayurveda"
                        emptyTitle=""
                        emptyDescription=""
                        onPress={openAyurveda}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* Goals CTA */}
              <GoalsCTA />

              {/* ================================================================ */}
              {/* YOGA                                                             */}
              {/* ================================================================ */}

              {filteredYoga.length > 0 ? (
                <View
                  style={{
                    marginTop: 34,
                  }}
                >
                  <SectionHeader
                    title="Yoga"
                    subtitle="Practices for body and mind"
                    action={!hasSearch ? "See all" : undefined}
                    onAction={
                      !hasSearch ? () => router.push("/(main)/yoga") : undefined
                    }
                  />

                  <ContentRow
                    items={filteredYoga}
                    type="yoga"
                    emptyTitle="Yoga is coming soon"
                    emptyDescription="There are no featured yoga practices available right now."
                    onPress={openYoga}
                  />
                </View>
              ) : null}

              {/* Consultation CTA */}
              <ConsultationCTA />

              {/* ================================================================ */}
              {/* AYURVEDA                                                         */}
              {/* ================================================================ */}

              {filteredAyurveda.length > 0 ? (
                <View
                  style={{
                    marginTop: 34,
                  }}
                >
                  <SectionHeader
                    title="Ayurveda"
                    subtitle="Traditional wellness practices"
                    action={!hasSearch ? "See all" : undefined}
                    onAction={
                      !hasSearch
                        ? () => router.push("/(main)/ayurveda")
                        : undefined
                    }
                  />

                  {!hasSearch ? (
                    <CategoryRow
                      categories={ayurvedaCategories}
                      selected={ayurvedaCategory}
                      onSelect={setAyurvedaCategory}
                    />
                  ) : null}

                  <View
                    style={{
                      marginTop: hasSearch ? 0 : 12,
                    }}
                  >
                    <ContentRow
                      items={filteredAyurveda}
                      type="ayurveda"
                      emptyTitle="Ayurveda is coming soon"
                      emptyDescription="There are no featured Ayurvedic recommendations available right now."
                      onPress={openAyurveda}
                    />
                  </View>
                </View>
              ) : null}

              {/* Health History CTA */}
              <HealthProfileCTA />

              {/* ================================================================ */}
              {/* WISDOM                                                           */}
              {/* ================================================================ */}

              {!hasSearch ? (
                <View
                  style={{
                    marginTop: 4,
                  }}
                >
                  <SectionHeader
                    title="Wisdom"
                    subtitle="Simple ideas for everyday wellbeing"
                  />

                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => router.push("/(main)/search")}
                      style={{
                        flex: 1,
                        minHeight: 125,
                        marginRight: 6,
                        padding: 16,
                        borderRadius: 18,
                        justifyContent: "flex-end",
                        backgroundColor: "#D2DFC9",
                      }}
                    >
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255,255,255,0.48)",
                          marginBottom: 25,
                        }}
                      >
                        <Ionicons
                          name="book-outline"
                          size={17}
                          color={COLORS.darkGreen}
                        />
                      </View>

                      <Text
                        style={{
                          color: COLORS.text,
                          fontFamily: "serif",
                          fontSize: 18,
                          fontWeight: "700",
                        }}
                      >
                        Learn
                      </Text>

                      <Text
                        style={{
                          marginTop: 3,
                          color: COLORS.muted,
                          fontSize: 10,
                        }}
                      >
                        Discover wellness practices
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => router.push("/(main)/favorites")}
                      style={{
                        flex: 1,
                        minHeight: 125,
                        marginLeft: 6,
                        padding: 16,
                        borderRadius: 18,
                        justifyContent: "flex-end",
                        backgroundColor: "#E8DDC8",
                      }}
                    >
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255,255,255,0.48)",
                          marginBottom: 25,
                        }}
                      >
                        <Ionicons
                          name="heart-outline"
                          size={17}
                          color={COLORS.text}
                        />
                      </View>

                      <Text
                        style={{
                          color: COLORS.text,
                          fontFamily: "serif",
                          fontSize: 18,
                          fontWeight: "700",
                        }}
                      >
                        Favorites
                      </Text>

                      <Text
                        style={{
                          marginTop: 3,
                          color: COLORS.muted,
                          fontSize: 10,
                        }}
                      >
                        Keep what speaks to you
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {/* ================================================================ */}
              {/* AMBIENCE                                                         */}
              {/* ================================================================ */}

              {!hasSearch ? (
                <View
                  style={{
                    marginTop: 36,
                  }}
                >
                  <SectionHeader
                    title="Set your ambience"
                    subtitle="Create a little space for yourself"
                  />

                  <View
                    style={{
                      minHeight: 155,
                      padding: 19,
                      borderRadius: 21,
                      overflow: "hidden",
                      backgroundColor: "#B7CDBD",
                    }}
                  >
                    {/* Decorative circle */}

                    <View
                      style={{
                        position: "absolute",
                        width: 125,
                        height: 125,
                        borderRadius: 63,
                        right: -35,
                        top: -40,
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                    />

                    <View
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,255,255,0.38)",
                      }}
                    >
                      <Ionicons name="leaf-outline" size={18} color="#35523C" />
                    </View>

                    <Text
                      style={{
                        marginTop: 13,
                        maxWidth: 240,
                        color: "#20372A",
                        fontFamily: "serif",
                        fontSize: 21,
                        lineHeight: 27,
                        fontWeight: "700",
                      }}
                    >
                      Make some space for stillness.
                    </Text>

                    <Text
                      style={{
                        marginTop: 5,
                        maxWidth: 255,
                        color: "#476251",
                        fontSize: 11,
                        lineHeight: 17,
                      }}
                    >
                      Explore practices that help you slow down, breathe and
                      reconnect.
                    </Text>

                    <TouchableOpacity
                      onPress={() => router.push("/(main)/yoga")}
                      activeOpacity={0.85}
                      style={{
                        alignSelf: "flex-start",
                        marginTop: 13,
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.green,
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        Discover practices
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {/* ================================================================ */}
              {/* FOOTER                                                           */}
              {/* ================================================================ */}

              {!hasSearch ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingTop: 48,
                    paddingBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 1,
                      backgroundColor: COLORS.border,
                    }}
                  />

                  <Text
                    style={{
                      marginTop: 14,
                      color: COLORS.softMuted,
                      fontFamily: "serif",
                      fontSize: 15,
                    }}
                  >
                    Niramaya
                  </Text>

                  <Text
                    style={{
                      marginTop: 3,
                      color: COLORS.softMuted,
                      fontSize: 10,
                    }}
                  >
                    A space for your wellbeing
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
