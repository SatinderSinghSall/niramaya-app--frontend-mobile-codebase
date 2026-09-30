import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { Image } from "react-native";

import { Input } from "@/components/forms/Input";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------------------------------
     Validation
  --------------------------------- */

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  };

  /* ---------------------------------
     Login
  --------------------------------- */

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/(main)/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Unable to sign in. Please check your email and password.";

        setGeneralError(message);
      } else {
        setGeneralError(
          "Something went wrong while signing in. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     Close screen
  --------------------------------- */

  const handleClose = () => {
    if (loading) {
      return;
    }

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 px-6 pt-5">
            {/* ---------------------------------
                Header
            --------------------------------- */}

            <View className="mb-8 flex-row items-center justify-between">
              <View className="flex-row items-center">
                {/* Logo */}
                <View className="h-10 w-10 overflow-hidden rounded-xl bg-[#EEF2E6]">
                  <Image
                    source={require("../../../assets/images/app-icon.jpeg")}
                    resizeMode="contain"
                    className="h-full w-full"
                  />
                </View>

                {/* Brand */}
                <View className="ml-3">
                  <Text className="text-[15px] font-bold tracking-[1.2px] text-[#263F31]">
                    NIRAMAYA
                  </Text>

                  <Text className="mt-[1px] text-[9px] font-medium tracking-[0.6px] text-[#7B887D]">
                    WELLNESS • BALANCE • YOU
                  </Text>
                </View>
              </View>

              {/* Close */}
              <Pressable
                onPress={handleClose}
                disabled={loading}
                hitSlop={10}
                className="h-10 w-10 items-center justify-center rounded-full border border-[#E1E7DF] bg-[#F8FAF6]"
                style={({ pressed }) => ({
                  opacity: loading ? 0.45 : pressed ? 0.65 : 1,
                })}
              >
                <Ionicons name="close" size={21} color="#536055" />
              </Pressable>
            </View>

            {/* ---------------------------------
                Page heading
            --------------------------------- */}

            <View className="mb-7">
              <Text className="text-[30px] font-bold tracking-[-0.5px] text-foreground">
                Welcome Back
              </Text>

              <Text className="mt-2 text-[14px] leading-5 text-muted">
                Sign in to continue your wellness journey.
              </Text>
            </View>

            {/* ---------------------------------
                Main error
            --------------------------------- */}

            {generalError ? (
              <View className="mb-6">
                {/* Error heading row */}
                <View className="flex-row items-center">
                  {/* Error icon */}
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FBE5E2]">
                    <Ionicons name="alert-circle" size={18} color="#B65D54" />
                  </View>

                  {/* Error heading */}
                  <Text className="ml-2.5 flex-1 text-[14px] font-bold text-[#9D514A]">
                    Sign in failed
                  </Text>

                  {/* Close error */}
                  <Pressable
                    onPress={() => setGeneralError("")}
                    disabled={loading}
                    hitSlop={10}
                    className="h-8 w-8 items-center justify-center rounded-full"
                    style={({ pressed }) => ({
                      opacity: loading ? 0.45 : pressed ? 0.6 : 1,
                    })}
                  >
                    <Ionicons name="close" size={19} color="#9D514A" />
                  </Pressable>
                </View>

                {/* Error message */}
                <View className="mt-2.5 ml-[42px]">
                  <Text className="text-[12px] leading-[18px] text-[#A96761]">
                    {generalError}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* ---------------------------------
                Email
            --------------------------------- */}

            <View className="mb-5">
              <Input
                label="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);

                  if (emailError) {
                    setEmailError("");
                  }

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                error={emailError}
              />

              {/* Explicit inline error */}
              {emailError ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {emailError}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Password
            --------------------------------- */}

            <View className="mb-2">
              <PasswordInput
                label="Password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);

                  if (passwordError) {
                    setPasswordError("");
                  }

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                error={passwordError}
                editable={!loading}
              />

              {/* Explicit inline error */}
              {passwordError ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {passwordError}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Forgot password
            --------------------------------- */}

            <Pressable
              disabled={loading}
              onPress={() => {
                // Forgot password flow can be connected here later.
              }}
              className="mb-6 self-end"
              style={({ pressed }) => ({
                opacity: loading ? 0.4 : pressed ? 0.65 : 1,
              })}
            >
              <Text className="text-[13px] font-semibold text-primary-700">
                Forgot Password?
              </Text>
            </Pressable>

            {/* ---------------------------------
                Login button
            --------------------------------- */}

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="h-[52px] flex-row items-center justify-center rounded-[14px] bg-primary-600"
              style={({ pressed }) => ({
                opacity: loading ? 0.7 : pressed ? 0.85 : 1,
              })}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-2.5 text-[14px] font-bold text-white">
                    Signing in...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-[14px] font-bold text-white">
                    Login
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color="#FFFFFF"
                    style={{
                      marginLeft: 7,
                    }}
                  />
                </>
              )}
            </Pressable>

            {/* ---------------------------------
                Create account
            --------------------------------- */}

            <View className="mt-7 flex-row items-center justify-center">
              <Text className="text-[13px] text-muted">
                Don't have an account?
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => router.replace("/(public)/signup")}
                className="ml-1.5"
                style={({ pressed }) => ({
                  opacity: loading ? 0.4 : pressed ? 0.65 : 1,
                })}
              >
                <Text className="text-[13px] font-bold text-primary-700">
                  Create Account
                </Text>
              </Pressable>
            </View>

            {/* ---------------------------------
                Bottom reassurance
            --------------------------------- */}

            <View className="mt-auto items-center pb-7 pt-12">
              <View className="mb-2 h-[1px] w-7 bg-[#B9C8B8]" />

              <Text className="text-[9px] font-medium tracking-[0.8px] text-[#929B92]">
                YOUR WELLNESS JOURNEY STARTS HERE
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
