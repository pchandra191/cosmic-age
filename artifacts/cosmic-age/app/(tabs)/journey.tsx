import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useBirthDate, useUser } from '@/context/UserContext';
import { SpaceBackground } from '@/components/SpaceBackground';
import { CosmicCard, StatRow } from '@/components/CosmicCard';
import { getDistanceTraveled, getMilkyWayStats, getUniverseExpansion, formatKm, formatLargeNumber } from '@/utils/calculations';
import { AU_IN_KM, LIGHT_YEAR_IN_KM } from '@/constants/cosmic';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(percent, 100), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={progressStyles.track}>
      <Animated.View style={[progressStyles.fill, { backgroundColor: color }, fillStyle]} />
    </View>
  );
}

export default function JourneyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const birthDate = useBirthDate();
  const { now } = useUser();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const dist = useMemo(() => {
    if (!birthDate) return null;
    return getDistanceTraveled(birthDate, now);
  }, [birthDate, now]);

  const milkyWay = useMemo(() => {
    if (!birthDate) return null;
    return getMilkyWayStats(birthDate, now);
  }, [birthDate, now]);

  const expansion = useMemo(() => {
    if (!birthDate) return null;
    return getUniverseExpansion(birthDate, now);
  }, [birthDate, now]);

  return (
    <SpaceBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topPad + 16,
            paddingBottom: Platform.OS === 'web' ? 34 + 84 : insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Space Journey</Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          Distance traveled through the cosmos since your birth
        </Text>

        {/* Earth Orbit Distance */}
        {dist && (
          <CosmicCard style={styles.card} accent>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>EARTH ORBITAL JOURNEY</Text>
            <Text style={[styles.heroValue, { color: colors.foreground }]}>
              {formatLargeNumber(Math.round(dist.earthOrbitKm))} km
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              Earth's journey around the Sun
            </Text>
            <View style={{ height: 12 }} />
            <StatRow label="In Astronomical Units" value={`${dist.earthOrbitAU.toFixed(2)} AU`} valueColor={colors.primary} />
            <StatRow label="In Light-years" value={`${(dist.earthOrbitKm / LIGHT_YEAR_IN_KM).toFixed(6)} ly`} />
            <StatRow label="Earth's speed" value="29.78 km/s" />
          </CosmicCard>
        )}

        {/* Galactic Distance */}
        {dist && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>GALACTIC JOURNEY</Text>
            <Text style={[styles.heroValue, { color: colors.accent }]}>
              {formatLargeNumber(Math.round(dist.galacticKm))} km
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              Solar system's journey around Milky Way center
            </Text>
            <View style={{ height: 12 }} />
            <StatRow label="In Light-years" value={`${dist.galacticLightYears.toFixed(4)} ly`} valueColor={colors.accent} />
            <StatRow label="In AU" value={`${(dist.galacticKm / AU_IN_KM).toFixed(2)} AU`} />
            <StatRow label="Galactic speed" value="220 km/s" />
          </CosmicCard>
        )}

        {/* Milky Way Progress */}
        {milkyWay && (
          <CosmicCard style={styles.card} accent>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>MILKY WAY ORBIT</Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              One galactic year = 225 million Earth years
            </Text>
            <View style={{ height: 8 }} />
            <Text style={[styles.progressLabel, { color: colors.foreground }]}>
              {milkyWay.galacticOrbitPercent.toFixed(10)}% of one orbit completed
            </Text>
            <ProgressBar percent={milkyWay.galacticOrbitPercent} color={colors.primary} />
            <View style={{ height: 8 }} />
            <StatRow label="Galactic distance traveled" value={`${milkyWay.distanceTraveledLY.toFixed(4)} light-years`} />
            <StatRow label="Galactic years completed" value={milkyWay.galacticYears.toFixed(9)} />
          </CosmicCard>
        )}

        {/* Light Travel */}
        {dist && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LIGHT TRAVEL STATISTICS</Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              Distance light has traveled during your lifetime
            </Text>
            <View style={{ height: 8 }} />
            <Text style={[styles.heroValue, { color: colors.foreground }]}>
              {dist.lightTravelLightYears.toFixed(4)} ly
            </Text>
            <View style={{ height: 12 }} />
            <StatRow label="In kilometers" value={`${(dist.lightTravelKm / 1e12).toFixed(3)} trillion km`} valueColor={colors.primary} />
            <StatRow label="Speed of light" value="299,792.458 km/s" />
            <StatRow label="Equivalent" value={`${(dist.lightTravelKm / AU_IN_KM).toFixed(0)} AU`} />
          </CosmicCard>
        )}

        {/* Universe Expansion */}
        {expansion && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>UNIVERSE EXPANSION</Text>
            <View style={[styles.approxBadge, { backgroundColor: 'rgba(255,209,102,0.15)', borderColor: 'rgba(255,209,102,0.3)' }]}>
              <Text style={[styles.approxText, { color: colors.accent }]}>APPROXIMATION</Text>
            </View>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              The observable universe has grown since your birth:
            </Text>
            <View style={{ height: 8 }} />
            <StatRow label="Expansion in light-years" value={`~${expansion.expansionLY.toFixed(2)} ly`} valueColor={colors.primary} />
            <StatRow label="In kilometers" value={`~${(expansion.expansionKm / 1e12).toFixed(4)} trillion km`} />
            <View style={{ height: 8 }} />
            <Text style={[styles.note, { color: colors.mutedForeground }]}>{expansion.note}</Text>
          </CosmicCard>
        )}

        {/* Comparison context */}
        <View style={[styles.contextCard, { borderColor: 'rgba(77,159,255,0.2)', backgroundColor: 'rgba(77,159,255,0.05)' }]}>
          <Text style={[styles.contextTitle, { color: colors.primary }]}>For Context</Text>
          <Text style={[styles.contextItem, { color: colors.foreground }]}>
            * The nearest star (Proxima Centauri) is 4.24 light-years away
          </Text>
          <Text style={[styles.contextItem, { color: colors.foreground }]}>
            * The Milky Way galaxy is ~100,000 light-years across
          </Text>
          <Text style={[styles.contextItem, { color: colors.foreground }]}>
            * The Andromeda Galaxy is 2.537 million light-years away
          </Text>
          <Text style={[styles.contextItem, { color: colors.foreground }]}>
            * The observable universe spans ~93 billion light-years
          </Text>
        </View>
      </ScrollView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  screenSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: -6,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  card: {},
  heroValue: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  approxBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  approxText: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  note: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  contextCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  contextTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  contextItem: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});

const progressStyles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
