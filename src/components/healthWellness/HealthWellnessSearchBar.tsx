import React, { useState } from "react";

import { Pressable, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface HealthWellnessSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export default function HealthWellnessSearchBar({
  value,
  onChangeText,
  placeholder = "Search wellness tips",
}: HealthWellnessSearchBarProps) {
  const [focused, setFocused] = useState(false);

  const hasValue = value.trim().length > 0;

  return (
    <View className="mx-5 mt-4">
      <View
        className={`h-[54px] flex-row items-center rounded-[18px] border bg-white px-3 ${
          focused ? "border-emerald-300" : "border-slate-100"
        }`}
        style={{
          shadowColor: "#0f172a",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: focused ? 0.07 : 0.035,
          shadowRadius: 10,
          elevation: focused ? 2 : 1,
        }}
      >
        {/* SEARCH ICON */}

        <View
          className={`h-9 w-9 items-center justify-center rounded-xl ${
            focused ? "bg-emerald-100" : "bg-slate-50"
          }`}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={focused ? "#059669" : "#64748b"}
          />
        </View>

        {/* INPUT */}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          selectionColor="#059669"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="ml-3 flex-1 py-0 text-[14px] font-medium text-slate-800"
          style={{
            includeFontPadding: false,
          }}
        />

        {/* CLEAR */}

        {hasValue ? (
          <Pressable
            onPress={() => onChangeText("")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Ionicons name="close" size={15} color="#64748b" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
