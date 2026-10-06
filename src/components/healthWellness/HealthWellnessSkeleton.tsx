import React from "react";
import { View } from "react-native";

export default function HealthWellnessSkeleton() {
  return (
    <View>
      <View className="mb-6 h-[250px] overflow-hidden rounded-[28px] bg-slate-200" />

      {[1, 2, 3].map((item) => (
        <View
          key={item}
          className="mb-4 h-[132px] flex-row overflow-hidden rounded-2xl bg-slate-100"
        >
          <View className="h-full w-[118px] bg-slate-200" />

          <View className="flex-1 p-4">
            <View className="h-4 w-24 rounded-full bg-slate-200" />
            <View className="mt-3 h-5 w-4/5 rounded bg-slate-200" />
            <View className="mt-2 h-4 w-full rounded bg-slate-200" />
            <View className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
          </View>
        </View>
      ))}
    </View>
  );
}
