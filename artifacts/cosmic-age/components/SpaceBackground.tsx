import React, { useEffect, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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

function DriftLayer({ style, duration, x, y }: { style: object; duration: number; x: number; y: number }) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * x },
      { translateY: drift.value * y },
      { scale: 1 + drift.value * 0.08 },
    ],
    opacity: 0.78 + drift.value * 0.22,
  }));

  return <Animated.View pointerEvents="none" style={[style, animStyle]} />;
}

function ShootingStar() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withDelay(
        2400,
        withTiming(1, {
          duration: 1700,
          easing: Easing.out(Easing.cubic),
        }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.15 || progress.value > 0.82 ? 0 : 0.72,
    transform: [
      { translateX: progress.value * 360 },
      { translateY: progress.value * 170 },
      { rotate: '-28deg' },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.shootingStar, animStyle]}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(77,159,255,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

interface Props {
  children?: React.ReactNode;
  style?: object;
}

export function SpaceBackground({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#000014', '#02051F', '#07103A', '#000014']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <DriftLayer style={styles.nebula1} duration={12000} x={22} y={12} />
      <DriftLayer style={styles.nebula2} duration={15000} x={-18} y={-14} />
      <ShootingStar />
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
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(77, 159, 255, 0.08)',
    top: -50,
    right: -80,
  },
  nebula2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 209, 102, 0.045)',
    bottom: 100,
    left: -60,
  },
  shootingStar: {
    position: 'absolute',
    top: 74,
    left: -140,
    width: 140,
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
});
