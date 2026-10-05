import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DisclaimerModal from "./DisclaimerModal";

const BUTTON_WIDTH = 154;
const BUTTON_HEIGHT = 48;

const HORIZONTAL_PADDING = 12;

/*
 * Extra space reserved above the bottom tab navigation.
 *
 * This prevents the floating button from covering:
 * - Android bottom navigation
 * - iOS home indicator
 * - Niramaya bottom tab bar
 */
const BOTTOM_TAB_RESERVED_SPACE = 92;

const TOP_PADDING = 10;

const INITIAL_RIGHT = 18;
const INITIAL_BOTTOM = 112;

const DRAG_THRESHOLD = 6;

interface Position {
  x: number;
  y: number;
}

function getInitialPosition(
  width: number,
  height: number,
  topInset: number,
  bottomInset: number,
): Position {
  const minY = topInset + TOP_PADDING;

  const maxX = Math.max(
    HORIZONTAL_PADDING,
    width - BUTTON_WIDTH - HORIZONTAL_PADDING,
  );

  const maxY = Math.max(
    minY,
    height - BUTTON_HEIGHT - bottomInset - BOTTOM_TAB_RESERVED_SPACE,
  );

  return {
    x: Math.min(
      Math.max(HORIZONTAL_PADDING, width - BUTTON_WIDTH - INITIAL_RIGHT),
      maxX,
    ),

    y: Math.min(
      Math.max(minY, height - BUTTON_HEIGHT - bottomInset - INITIAL_BOTTOM),
      maxY,
    ),
  };
}

function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  topInset: number,
  bottomInset: number,
): Position {
  /*
   * Never allow the CTA into the status-bar area.
   */
  const minY = topInset + TOP_PADDING;

  /*
   * Never allow the CTA into:
   *
   * 1. Android navigation area
   * 2. iOS home indicator area
   * 3. Niramaya bottom tab navigation
   */
  const maxY = Math.max(
    minY,
    height - BUTTON_HEIGHT - bottomInset - BOTTOM_TAB_RESERVED_SPACE,
  );

  /*
   * Keep the complete CTA inside the horizontal screen bounds.
   */
  const maxX = Math.max(
    HORIZONTAL_PADDING,
    width - BUTTON_WIDTH - HORIZONTAL_PADDING,
  );

  return {
    x: Math.min(Math.max(x, HORIZONTAL_PADDING), maxX),

    y: Math.min(Math.max(y, minY), maxY),
  };
}

export default function FloatingDisclaimerCTA() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const initialPosition = useMemo(
    () => getInitialPosition(width, height, insets.top, insets.bottom),
    [width, height, insets.top, insets.bottom],
  );

  const [position, setPosition] = useState<Position>(initialPosition);

  const [modalVisible, setModalVisible] = useState(false);

  const positionRef = useRef<Position>(initialPosition);

  const dragStartPosition = useRef<Position>(initialPosition);

  const draggingRef = useRef(false);

  const hasMovedRef = useRef(false);

  /*
   * Keep the current screen dimensions/insets available
   * to the gesture handler without recreating refs.
   */
  const dimensionsRef = useRef({
    width,
    height,
    topInset: insets.top,
    bottomInset: insets.bottom,
  });

  useEffect(() => {
    dimensionsRef.current = {
      width,
      height,
      topInset: insets.top,
      bottomInset: insets.bottom,
    };

    /*
     * Re-clamp the button whenever:
     *
     * - orientation changes
     * - screen dimensions change
     * - safe-area insets change
     *
     * This is important for both Android and iOS.
     */
    const nextPosition = clampPosition(
      positionRef.current.x,
      positionRef.current.y,
      width,
      height,
      insets.top,
      insets.bottom,
    );

    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, [width, height, insets.top, insets.bottom]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        /*
         * Do not immediately capture a touch.
         * This allows a normal tap to open the modal.
         */
        onStartShouldSetPanResponder: () => false,

        /*
         * Only begin dragging after the finger actually moves.
         */
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const distance =
            Math.abs(gestureState.dx) + Math.abs(gestureState.dy);

          return distance > DRAG_THRESHOLD;
        },

        onPanResponderGrant: () => {
          draggingRef.current = true;
          hasMovedRef.current = false;

          dragStartPosition.current = positionRef.current;
        },

        onPanResponderMove: (_, gestureState) => {
          if (
            Math.abs(gestureState.dx) > DRAG_THRESHOLD ||
            Math.abs(gestureState.dy) > DRAG_THRESHOLD
          ) {
            hasMovedRef.current = true;
          }

          const {
            width: currentWidth,
            height: currentHeight,
            topInset,
            bottomInset,
          } = dimensionsRef.current;

          const nextPosition = clampPosition(
            dragStartPosition.current.x + gestureState.dx,

            dragStartPosition.current.y + gestureState.dy,

            currentWidth,
            currentHeight,
            topInset,
            bottomInset,
          );

          positionRef.current = nextPosition;

          setPosition(nextPosition);
        },

        onPanResponderRelease: () => {
          draggingRef.current = false;
        },

        onPanResponderTerminate: () => {
          draggingRef.current = false;
          hasMovedRef.current = false;
        },

        onShouldBlockNativeResponder: () => false,
      }),
    [],
  );

  const handlePress = () => {
    /*
     * If the user dragged the CTA, don't open the modal
     * when releasing the finger.
     */
    if (hasMovedRef.current || draggingRef.current) {
      hasMovedRef.current = false;
      return;
    }

    setModalVisible(true);
  };

  return (
    <>
      <View pointerEvents="box-none" className="absolute inset-0">
        <View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
          }}
          className="z-50"
        >
          <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel="Open Niramaya information"
            className="h-12 w-[154px] flex-row items-center justify-center rounded-full border border-[#DCE9E1] bg-white px-4 shadow-lg active:opacity-80"
          >
            <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EDF5F0]">
              <Ionicons
                name="information-circle-outline"
                size={17}
                color="#315C4A"
              />
            </View>

            <Text className="ml-2 text-[12px] font-bold text-[#315C4A]">
              Niramaya Info
            </Text>
          </Pressable>
        </View>
      </View>

      <DisclaimerModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
}
