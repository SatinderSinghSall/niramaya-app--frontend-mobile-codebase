import React, { useCallback, useEffect, useRef } from "react";

import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ArrowRight,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ToastData } from "./toast.types";

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

const TOAST_CONFIG = {
  success: {
    color: "#16A36A",
    background: "#EAF8F1",
    Icon: CheckCircle2,
  },
  error: {
    color: "#E05252",
    background: "#FFF0F0",
    Icon: XCircle,
  },
  warning: {
    color: "#D99A25",
    background: "#FFF8E9",
    Icon: AlertTriangle,
  },
  info: {
    color: "#4385D8",
    background: "#EDF5FF",
    Icon: Info,
  },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;

    closing.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: toast.position === "bottom" ? 20 : -20,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onDismiss();
      }
    });
  }, [opacity, translateY, scale, toast.position, onDismiss]);

  useEffect(() => {
    closing.current = false;

    opacity.setValue(0);
    translateY.setValue(toast.position === "bottom" ? 24 : -24);
    scale.setValue(0.97);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(close, toast.duration ?? 3500);

    return () => clearTimeout(timer);
  }, [toast.id]);

  const config = TOAST_CONFIG[toast.type ?? "info"];
  const Icon = config.Icon;

  const isBottom = toast.position === "bottom";

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        isBottom ? { bottom: insets.bottom + 14 } : { top: insets.top + 12 },
      ]}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <View style={styles.toast}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.background },
            ]}
          >
            <Icon size={23} color={config.color} strokeWidth={2.2} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {toast.title}
            </Text>

            {!!toast.message && (
              <Text style={styles.message} numberOfLines={3}>
                {toast.message}
              </Text>
            )}

            {!!toast.action && (
              <Pressable
                onPress={() => {
                  toast.action?.onPress();
                  close();
                }}
                style={styles.action}
              >
                <Text style={[styles.actionText, { color: config.color }]}>
                  {toast.action.label}
                </Text>

                <ArrowRight size={15} color={config.color} strokeWidth={2.3} />
              </Pressable>
            )}
          </View>

          <Pressable onPress={close} hitSlop={10} style={styles.closeButton}>
            <X size={18} color="#9299A3" strokeWidth={2} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 99999,
    alignItems: "center",
    paddingHorizontal: 16,
  },

  animatedContainer: {
    width: "100%",
    maxWidth: 480,
  },

  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    gap: 12,

    borderWidth: 1,
    borderColor: "#EEF0F2",

    ...Platform.select({
      ios: {
        shadowColor: "#172B22",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 9,
      },
      default: {},
    }),
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17211D",
    letterSpacing: -0.2,
  },

  message: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#747D78",
    fontWeight: "400",
  },

  closeButton: {
    alignSelf: "flex-start",
    padding: 2,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  actionText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
