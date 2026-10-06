import React from "react";
import { View } from "react-native";

export default function HealthWellnessSkeleton() {
  return (
    <View>
      {/* FEATURED SKELETON */}

      <View className="mt-5 px-5">
        <View className="h-5 w-32 rounded-full bg-slate-200" />

        <View className="mt-2 h-3 w-52 rounded-full bg-slate-100" />
      </View>

      <View className="mt-4 flex-row pl-5">
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="mr-3 w-[220px] overflow-hidden rounded-3xl bg-white"
          >
            <View className="h-[125px] bg-slate-200" />

            <View className="p-3.5">
              <View className="h-2.5 w-20 rounded-full bg-slate-100" />

              <View className="mt-3 h-4 w-full rounded-full bg-slate-100" />

              <View className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />

              <View className="mt-4 h-3 w-20 rounded-full bg-slate-100" />
            </View>
          </View>
        ))}
      </View>

      {/* CATEGORIES */}

      <View className="mt-7 px-5">
        <View className="h-5 w-40 rounded-full bg-slate-200" />

        <View className="mt-4 flex-row">
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              className="mr-2 h-9 w-20 rounded-full bg-slate-200"
            />
          ))}
        </View>
      </View>

      {/* LIST */}

      <View className="mt-7 px-5">
        <View className="h-5 w-24 rounded-full bg-slate-200" />

        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="mt-4 h-[130px] rounded-[22px] bg-white p-3"
          >
            <View className="flex-row">
              <View className="h-[104px] w-[104px] rounded-[18px] bg-slate-200" />

              <View className="ml-3 flex-1">
                <View className="h-3 w-20 rounded-full bg-slate-100" />

                <View className="mt-3 h-4 w-full rounded-full bg-slate-100" />

                <View className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />

                <View className="mt-4 h-3 w-20 rounded-full bg-slate-100" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
