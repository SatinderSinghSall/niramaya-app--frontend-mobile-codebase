import React from "react";
import { View } from "react-native";

const COLORS = {
  surface: "#FFFFFF",
  base: "#E8ECEF",
  highlight: "#F1F4F6",
  border: "#EDF0F2",
  background: "#F8FAFC",
};

function SkeletonLine({
  width = "100%",
  height = 12,
  style,
}: {
  width?: number | `${number}%` | "100%";
  height?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: 6,
          backgroundColor: COLORS.base,
        },
        style,
      ]}
    />
  );
}

function FeaturedCardSkeleton() {
  return (
    <View
      style={{
        width: 198,
        marginRight: 12,
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {/* Featured image */}
      <View
        style={{
          height: 114,
          backgroundColor: "#E2E8EB",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 76,
            height: 23,
            borderRadius: 20,
            backgroundColor: COLORS.highlight,
          }}
        />
      </View>

      {/* Card content */}
      <View style={{ padding: 12 }}>
        <SkeletonLine width={83} height={7} />

        <View style={{ marginTop: 10, gap: 6 }}>
          <SkeletonLine width="100%" height={13} />
          <SkeletonLine width="76%" height={13} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SkeletonLine width={49} height={8} />
            <View style={{ width: 8 }} />
            <SkeletonLine width={43} height={8} />
          </View>

          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#E3F5EC",
            }}
          />
        </View>
      </View>
    </View>
  );
}

function TipCardSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 12,
        padding: 10,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        minHeight: 126,
      }}
    >
      {/* Thumbnail */}
      <View
        style={{
          width: 94,
          height: 104,
          borderRadius: 14,
          backgroundColor: "#E2E8EB",
        }}
      />

      {/* Text placeholders */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 12,
          paddingVertical: 3,
        }}
      >
        <SkeletonLine width={82} height={8} />

        <View style={{ marginTop: 10, gap: 7 }}>
          <SkeletonLine width="100%" height={12} />
          <SkeletonLine width="82%" height={12} />
        </View>

        <View style={{ marginTop: 9, gap: 5 }}>
          <SkeletonLine width="100%" height={8} />
          <SkeletonLine width="67%" height={8} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <SkeletonLine width={49} height={7} />
          <View style={{ width: 10 }} />
          <SkeletonLine width={43} height={7} />
        </View>
      </View>
    </View>
  );
}

export default function HealthWellnessSkeleton() {
  return (
    <View style={{ paddingBottom: 24 }}>
      {/* Featured section */}
      <View style={{ marginTop: 26 }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <SkeletonLine width={142} height={18} />
            <SkeletonLine width={164} height={9} style={{ marginTop: 8 }} />
          </View>

          <SkeletonLine width={18} height={9} />
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingLeft: 20,
            paddingRight: 8,
            paddingTop: 14,
          }}
        >
          <FeaturedCardSkeleton />
          <FeaturedCardSkeleton />
        </View>
      </View>

      {/* Categories section */}
      <View style={{ marginTop: 28 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonLine width={157} height={18} />
          <SkeletonLine width={205} height={9} style={{ marginTop: 8 }} />
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingLeft: 20,
            paddingRight: 8,
            paddingTop: 14,
          }}
        >
          {[54, 91, 79, 68, 88].map((width, index) => (
            <View
              key={index}
              style={{
                width,
                height: 35,
                borderRadius: 20,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginRight: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: width * 0.56,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: COLORS.base,
                }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* All tips section */}
      <View style={{ marginTop: 28, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <SkeletonLine width={100} height={18} />
            <SkeletonLine width={192} height={9} style={{ marginTop: 8 }} />
          </View>

          <View
            style={{
              width: 34,
              height: 25,
              borderRadius: 15,
              backgroundColor: COLORS.base,
            }}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          {[1, 2, 3].map((item) => (
            <TipCardSkeleton key={item} />
          ))}
        </View>
      </View>
    </View>
  );
}
