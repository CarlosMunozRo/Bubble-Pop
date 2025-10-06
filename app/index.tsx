import Bubble from "@/components/Bubble";
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export default function Index() {
  const numerOfBubbles = 20;

  // Front card (visible) and back card (incoming) states
  const [frontPopped, setFrontPopped] = useState<boolean[]>(() =>
    Array.from({ length: numerOfBubbles }, () => false)
  );
  const [backPopped, setBackPopped] = useState<boolean[]>(() =>
    Array.from({ length: numerOfBubbles }, () => false)
  );

  // Animated values for vertical translation
  const frontY = useRef(new Animated.Value(0)).current;
  const backY = useRef(new Animated.Value(WINDOW_HEIGHT)).current;
  const isAnimatingRef = useRef(false);
  const [animating, setAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setAnimating(true);

    Animated.parallel([
      Animated.timing(frontY, { toValue: -WINDOW_HEIGHT, duration: 700, useNativeDriver: true }),
      Animated.timing(backY, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start(() => {
      // After animation, swap states: back becomes front, and back resets
      setFrontPopped(backPopped);
      setBackPopped(Array.from({ length: numerOfBubbles }, () => false));

      // Delay resetting animated values a tick to avoid visual jump/flicker
      setTimeout(() => {
        frontY.setValue(0);
        backY.setValue(WINDOW_HEIGHT);
        isAnimatingRef.current = false;
        setAnimating(false);
      }, 80);
    });
  }, [backPopped, frontY, backY, numerOfBubbles]);

  const handlePopFront = useCallback((id?: number) => {
    if (id == null || isAnimatingRef.current) return;
    setFrontPopped(prev => {
      if (prev[id]) return prev; // already popped
      const next = [...prev];
      next[id] = true;
      if (next.every(Boolean)) {
        triggerAnimation();
      }
      return next;
    });
  }, [triggerAnimation]);

  const handlePopBack = useCallback((id?: number) => {
    if (id == null || isAnimatingRef.current) return;
    setBackPopped(prev => {
      if (prev[id]) return prev; // already popped
      const next = [...prev];
      next[id] = true;
      if (next.every(Boolean)) {
        triggerAnimation();
      }
      return next;
    });
  }, [triggerAnimation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#75bfec', '#bfe6c4']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView>
        <View style={styles.wrapper}>
          {/* Front card (visible) */}
          <Animated.View style={[styles.card, { transform: [{ translateY: frontY }] }]} pointerEvents={animating ? 'none' : 'auto'}>
            <FlatList
              data={Array.from({ length: numerOfBubbles })}
              keyExtractor={(_, index) => `front-${index}`}
              renderItem={({ index }) => (
                <Bubble id={index} popped={frontPopped[index]} onPop={handlePopFront} />
              )}
              numColumns={4}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            />
          </Animated.View>

          {/* Back card (incoming) */}
          <Animated.View style={[styles.card, styles.cardAbsolute, { transform: [{ translateY: backY }] }]} pointerEvents={animating ? 'auto' : 'none'}> 
            <FlatList
              data={Array.from({ length: numerOfBubbles })}
              keyExtractor={(_, index) => `back-${index}`}
              renderItem={({ index }) => (
                <Bubble id={index} popped={backPopped[index]} onPop={handlePopBack} />
              )}
              numColumns={4}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 12,
  },
  cardAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
