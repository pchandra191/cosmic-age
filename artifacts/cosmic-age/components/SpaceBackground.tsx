import React, { useEffect, useRef, memo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const NUM_STARS = 120;

interface StarConfig {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function generateStars(): StarConfig[] {
  const stars: StarConfig[] = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * 100, // percentage
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 3000,
      duration: 2000 + Math.random() * 3000,
      opacity: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

const STARS = generateStars();

const Star = memo(({ config }: { config: StarConfig }) => {
  const opacity = useSharedValue(config.opacity * 0.3);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(config.opacity, {
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
    }, config.delay);
    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
        },
        animStyle,
      ]}
    />
  );
});

interface Props {
  children?: React.ReactNode;
  style?: object;
}

export function SpaceBackground({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#000014', '#030320', '#060830', '#000014']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Nebula glow 1 */}
      <View style={styles.nebula1} />
      {/* Nebula glow 2 */}
      <View style={styles.nebula2} />
      {/* Stars */}
      {STARS.map((star, i) => (
        <Star key={i} config={star} />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000014',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  nebula1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(77, 100, 255, 0.08)',
    top: -50,
    right: -80,
  },
  nebula2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(120, 50, 200, 0.06)',
    bottom: 100,
    left: -60,
  },
});
