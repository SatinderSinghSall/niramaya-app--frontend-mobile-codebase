import React, { useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ExploreContentType, ExploreItem } from "@/types/explore";

interface Props {
  item: ExploreItem;
  type: ExploreContentType;
  onPress: () => void;
  compact?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Colors                                                                     */
/* -------------------------------------------------------------------------- */

const COLORS = {
  text: "#263128",
  muted: "#747A72",
  green: "#4E6A51",
  lightGreen: "#E8F0E4",
  border: "#E5E0D6",
  background: "#F7F3EA",
};

/* -------------------------------------------------------------------------- */
/* Relevant fallback photography                                             */
/* -------------------------------------------------------------------------- */

/*
 * These are only fallbacks.
 *
 * If your API already provides image/imageUrl/thumbnail/coverImage,
 * that backend image will be used instead.
 */

const YOGA_IMAGES = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=900&q=85",
];

const AYURVEDA_IMAGES = [
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getTitle(item: ExploreItem) {
  return item.title || item.name || "Wellness practice";
}

function getDuration(item: ExploreItem) {
  const value = item.durationMinutes ?? item.duration;

  if (!value) {
    return null;
  }

  return `${value} min`;
}

function formatValue(value?: string) {
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

function getBackendImage(item: ExploreItem) {
  const data = item as ExploreItem & {
    image?: string;
    imageUrl?: string;
    thumbnail?: string;
    thumbnailUrl?: string;
    coverImage?: string;
    coverImageUrl?: string;
  };

  return (
    data.imageUrl ||
    data.image ||
    data.thumbnailUrl ||
    data.thumbnail ||
    data.coverImageUrl ||
    data.coverImage ||
    ""
  );
}

function getFallbackImage(item: ExploreItem, type: ExploreContentType) {
  const images = type === "yoga" ? YOGA_IMAGES : AYURVEDA_IMAGES;

  const seed = String(item._id || item.title || item.name || "wellness");

  const index =
    seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0) %
    images.length;

  return images[index];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ExploreContentCard({
  item,
  type,
  onPress,
  compact = false,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const title = getTitle(item);
  const duration = getDuration(item);

  const imageUri = useMemo(() => {
    if (imageFailed) {
      return getFallbackImage(item, type);
    }

    return getBackendImage(item) || getFallbackImage(item, type);
  }, [item, type, imageFailed]);

  /* ======================================================================== */
  /* COMPACT CARD                                                            */
  /* ======================================================================== */

  if (compact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
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
        {/* Image */}

        <View
          style={{
            height: 142,
            width: "100%",
            backgroundColor: "#DCE6D8",
          }}
        >
          <Image
            source={{ uri: imageUri }}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          {/* subtle image shade */}

          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 50,
              backgroundColor: "rgba(30,45,34,0.12)",
            }}
          />

          {/* type */}

          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.94)",
            }}
          >
            <Text
              style={{
                color: COLORS.green,
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {type === "yoga" ? "Yoga" : "Ayurveda"}
            </Text>
          </View>
        </View>

        {/* Content */}

        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 13,
            paddingBottom: 14,
          }}
        >
          {item.category ? (
            <Text
              numberOfLines={1}
              style={{
                color: "#5C8461",
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 1.1,
                textTransform: "uppercase",
              }}
            >
              {formatValue(item.category)}
            </Text>
          ) : null}

          <Text
            numberOfLines={2}
            style={{
              color: COLORS.text,
              fontSize: 17,
              lineHeight: 22,
              fontWeight: "700",
              marginTop: 4,
            }}
          >
            {title}
          </Text>

          {item.description ? (
            <Text
              numberOfLines={2}
              style={{
                color: COLORS.muted,
                fontSize: 11,
                lineHeight: 16,
                marginTop: 6,
              }}
            >
              {item.description}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: "#EEEAE2",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {duration ? (
                <>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={COLORS.muted}
                  />

                  <Text
                    style={{
                      marginLeft: 5,
                      color: COLORS.muted,
                      fontSize: 10,
                    }}
                  >
                    {duration}
                  </Text>
                </>
              ) : null}
            </View>

            {item.difficulty ? (
              <Text
                style={{
                  color: COLORS.green,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {formatValue(item.difficulty)}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  /* ======================================================================== */
  /* FULL CARD                                                                */
  /* ======================================================================== */

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={{
        width: "100%",
        marginBottom: 18,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 185,
          backgroundColor: "#DCE6D8",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 13,
            left: 13,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.94)",
          }}
        >
          <Text
            style={{
              color: COLORS.green,
              fontSize: 9,
              fontWeight: "700",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {type === "yoga" ? "Yoga" : "Ayurveda"}
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: 17,
        }}
      >
        {item.category ? (
          <Text
            style={{
              color: "#5C8461",
              fontSize: 9,
              fontWeight: "700",
              letterSpacing: 1.1,
              textTransform: "uppercase",
            }}
          >
            {formatValue(item.category)}
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          style={{
            color: COLORS.text,
            fontSize: 19,
            lineHeight: 25,
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          {title}
        </Text>

        {item.description ? (
          <Text
            numberOfLines={3}
            style={{
              color: COLORS.muted,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 7,
            }}
          >
            {item.description}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          {duration ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="time-outline" size={15} color={COLORS.muted} />

              <Text
                style={{
                  marginLeft: 5,
                  color: COLORS.muted,
                  fontSize: 11,
                }}
              >
                {duration}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {item.difficulty ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: COLORS.lightGreen,
              }}
            >
              <Text
                style={{
                  color: COLORS.green,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {formatValue(item.difficulty)}
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#EEEAE2",
            marginTop: 14,
          }}
        />

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.green,
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            View details
          </Text>

          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.lightGreen,
            }}
          >
            <Ionicons name="arrow-forward" size={14} color={COLORS.green} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
