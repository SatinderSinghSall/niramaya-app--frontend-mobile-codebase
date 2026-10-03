import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Keyboard,
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

import { Input } from "@/components/forms/Input";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";

export default function SignupScreen() {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------------
  // Android keyboard height
  // ---------------------------------

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Keep iOS completely unchanged
    if (Platform.OS !== "android") {
      return;
    }

    const keyboardDidShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowSubscription.remove();
      keyboardDidHideSubscription.remove();
    };
  }, []);

  /* ---------------------------------
     Validation
  --------------------------------- */

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    } else if (!/[a-z]/.test(password)) {
      nextErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
      nextErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      nextErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/g.test(password)) {
      nextErrors.password =
        "Password must contain at least one special character.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ---------------------------------
     Clear individual field error
  --------------------------------- */

  const clearFieldError = (field: string) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  /* ---------------------------------
     Signup
  --------------------------------- */

  const handleSignup = async () => {
    // Prevent duplicate requests
    if (loading) {
      return;
    }

    setGeneralError("");

    if (!validate()) {
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);

      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });

      router.replace("/(onboarding)/about-you");
    } catch (error) {
      setGeneralError(
        getApiErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     Close
  --------------------------------- */

  const handleClose = () => {
    if (loading) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(public)/landing");
    }
  };

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === "android" ? keyboardHeight + 40 : 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={!loading}
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
                Create Your Account
              </Text>

              <Text className="mt-2 text-[14px] leading-5 text-muted">
                Let's get started with your Niramaya wellness journey.
              </Text>
            </View>

            {/* ---------------------------------
                Main error
            --------------------------------- */}

            {generalError ? (
              <View className="mb-6">
                {/* Error card */}
                <View className="rounded-[14px] border border-[#F1D5D1] bg-[#FFF8F7] px-3.5 py-3">
                  <View className="flex-row items-center">
                    {/* Error icon */}
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FBE5E2]">
                      <Ionicons name="alert-circle" size={19} color="#B65D54" />
                    </View>

                    {/* Error heading */}
                    <View className="ml-3 flex-1">
                      <Text className="text-[13px] font-bold text-[#8F4943]">
                        Sign up failed
                      </Text>

                      <Text className="mt-0.5 text-[11px] text-[#B06A64]">
                        Please check your details and try again.
                      </Text>
                    </View>

                    {/* Close error */}
                    <Pressable
                      onPress={() => setGeneralError("")}
                      disabled={loading}
                      hitSlop={10}
                      className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-[#FBE5E2]"
                      style={({ pressed }) => ({
                        opacity: loading ? 0.45 : pressed ? 0.6 : 1,
                      })}
                    >
                      <Ionicons name="close" size={17} color="#9D514A" />
                    </Pressable>
                  </View>

                  {/* Actual error message */}
                  <View className="mt-3 ml-[42px] flex-row items-start">
                    <View className="mt-[2px] h-4 w-4 items-center justify-center rounded-full bg-[#FBE5E2]">
                      <Ionicons name="information" size={10} color="#A85C55" />
                    </View>

                    <Text className="ml-2 flex-1 text-[11.5px] font-medium leading-[17px] text-[#9F625C]">
                      {generalError}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* ---------------------------------
                First name
            --------------------------------- */}

            <View className="mb-5">
              <Input
                label="First Name"
                value={firstName}
                onChangeText={(value) => {
                  setFirstName(value);
                  clearFieldError("firstName");

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                placeholder="Enter your first name"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
                error={errors.firstName}
              />

              {errors.firstName ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {errors.firstName}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Last name
            --------------------------------- */}

            <View className="mb-5">
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={(value) => {
                  setLastName(value);
                  clearFieldError("lastName");

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                placeholder="Enter your last name"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
                error={errors.lastName}
              />

              {errors.lastName ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {errors.lastName}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Email
            --------------------------------- */}

            <View className="mb-5">
              <Input
                label="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  clearFieldError("email");

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                error={errors.email}
              />

              {errors.email ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {errors.email}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Phone
            --------------------------------- */}

            <View className="mb-5">
              <Input
                label="Phone (Optional)"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            {/* ---------------------------------
                Password
            --------------------------------- */}

            <View className="mb-5">
              <PasswordInput
                label="Password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearFieldError("password");

                  /*
                   * If confirm password was previously
                   * mismatched, re-check it as the user
                   * changes the main password.
                   */
                  if (confirmPassword && value === confirmPassword) {
                    clearFieldError("confirmPassword");
                  }

                  if (generalError) {
                    setGeneralError("");
                  }
                }}
                error={errors.password}
                editable={!loading}
              />

              {errors.password ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {errors.password}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Confirm password
            --------------------------------- */}

            <View className="mb-6">
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  clearFieldError("confirmPassword");

                  if (generalError) {
                    setGeneralError("");
                  }

                  /*
                   * Give immediate feedback once the
                   * user has entered something.
                   */
                  if (value && value !== password) {
                    setErrors((current) => ({
                      ...current,
                      confirmPassword: "Passwords do not match.",
                    }));
                  }
                }}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                editable={!loading}
              />

              {errors.confirmPassword ? (
                <View className="mt-1.5 flex-row items-center px-1">
                  <Ionicons
                    name="alert-circle-outline"
                    size={13}
                    color="#B65D54"
                  />

                  <Text className="ml-1 text-[11px] font-medium text-[#B65D54]">
                    {errors.confirmPassword}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ---------------------------------
                Create account button
            --------------------------------- */}

            <Pressable
              onPress={handleSignup}
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
                    Creating account...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-[14px] font-bold text-white">
                    Create Account
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
                Login
            --------------------------------- */}

            <View className="mt-7 flex-row items-center justify-center">
              <Text className="text-[13px] text-muted">
                Already have an account?
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => router.replace("/(public)/login")}
                className="ml-1.5"
                style={({ pressed }) => ({
                  opacity: loading ? 0.4 : pressed ? 0.65 : 1,
                })}
              >
                <Text className="text-[13px] font-bold text-primary-700">
                  Login
                </Text>
              </Pressable>
            </View>

            {/* ---------------------------------
                Bottom reassurance
            --------------------------------- */}

            <View className="items-center pb-4 pt-10">
              <View className="mb-2 h-[1px] w-7 bg-[#B9C8B8]" />

              <Text className="text-[9px] font-medium tracking-[0.8px] text-[#929B92]">
                YOUR WELLNESS JOURNEY STARTS HERE
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ---------------------------------
          Full-screen loading overlay
          --------------------------------- */}

      {loading ? (
        <View
          className="absolute inset-0 z-50 items-center justify-center bg-[#F8FAF6]/95"
          pointerEvents="auto"
        >
          <View className="items-center rounded-[22px] border border-[#E1E7DF] bg-white px-8 py-7 shadow-sm">
            <View className="h-16 w-16 overflow-hidden rounded-2xl bg-[#EEF2E6]">
              <Image
                source={require("../../../assets/images/app-icon.jpeg")}
                resizeMode="contain"
                className="h-full w-full"
              />
            </View>

            <ActivityIndicator
              size="large"
              color="#4D6A50"
              style={{ marginTop: 22 }}
            />

            <Text className="mt-4 text-[16px] font-bold text-[#263F31]">
              Creating your account...
            </Text>

            <Text className="mt-1.5 text-center text-[12px] leading-[18px] text-[#7B887D]">
              Please wait while we securely create your Niramaya account.
            </Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
