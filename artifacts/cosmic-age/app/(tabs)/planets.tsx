import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBirthDate, useUser } from '@/context/UserContext';
import { SpaceBackground } from '@/components/SpaceBackground';
import { CosmicCard, StatRow } from '@/components/CosmicCard';
import { PLANETS } from '@/constants/cosmic';
import { getPlanetaryAges, formatCountdown } from '@/utils/calculations';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function PlanetOrbit({ size, color, glowColor, selected }: { size: number; color: string; glowColor: string; selected: boolean }) {
  const displaySize = Math.max(16, Math.min(50, size * 5));
  const scale = useSharedValue(selected ? 1.1 : 1);
  const pulse = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.16 : 1, { damping: 12, stiffness: 180 });
  }, [selected]);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value + (selected ? pulse.value * 0.04 : 0) }],
  }));

  return (
    <Animated.View style={[
      orbitStyles.planet,
      {
        width: displaySize,
        height: displaySize,
        borderRadius: displaySize / 2,
        backgroundColor: color,
        shadowColor: glowColor,
        shadowOpacity: selected ? 0.8 : 0.3,
        shadowRadius: selected ? 12 : 4,
        elevation: selected ? 8 : 2,
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? '#FFFFFF' : 'transparent',
      },
      animStyle,
    ]} />
  );
}

function PulseSun() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2100, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.08 }],
    opacity: 0.86 + pulse.value * 0.14,
  }));

  return <Animated.View style={[styles.sun, animStyle]} />;
}

export default function PlanetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const birthDate = useBirthDate();
  const { now } = useUser();
  const [selectedId, setSelectedId] = useState('earth');

  const planetaryAges = useMemo(() => {
    if (!birthDate) return [];
    return getPlanetaryAges(birthDate, now);
  }, [birthDate, now]);

  const selectedPlanet = PLANETS.find((p) => p.id === selectedId)!;
  const selectedAge = planetaryAges.find((a) => a.planetId === selectedId);
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

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
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Planetary Ages</Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          How old are you on each world?
        </Text>

        {/* Solar system mini-view */}
        <View style={[styles.solarSystem, { borderColor: colors.border, backgroundColor: 'rgba(0,0,30,0.6)' }]}>
          <PulseSun />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orbitRow}>
            {PLANETS.map((planet) => (
              <TouchableOpacity
                key={planet.id}
                style={styles.planetWrapper}
                onPress={() => setSelectedId(planet.id)}
                activeOpacity={0.7}
              >
                <PlanetOrbit
                  size={planet.size}
                  color={planet.color}
                  glowColor={planet.glowColor}
                  selected={selectedId === planet.id}
                />
                <Text style={[
                  styles.planetName,
                  {
                    color: selectedId === planet.id ? colors.foreground : colors.mutedForeground,
                    fontFamily: selectedId === planet.id ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  },
                ]}>
                  {planet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected planet detail */}
        {selectedPlanet && selectedAge && (
          <CosmicCard style={styles.detailCard} accent glow glowColor={selectedPlanet.glowColor}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailPlanetDot, { backgroundColor: selectedPlanet.color, shadowColor: selectedPlanet.glowColor }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailPlanetName, { color: colors.foreground }]}>{selectedPlanet.name}</Text>
                <Text style={[styles.detailPlanetDesc, { color: colors.mutedForeground }]}>{selectedPlanet.description}</Text>
              </View>
            </View>

            <View style={styles.ageDisplay}>
              <Text style={[styles.ageLabel, { color: colors.mutedForeground }]}>YOUR AGE ON {selectedPlanet.name.toUpperCase()}</Text>
              <Text style={[styles.ageValue, { color: selectedPlanet.color }]}>
                {Math.floor(selectedAge.ageInPlanetYears).toLocaleString()}
                <Text style={{ fontSize: 18, color: colors.mutedForeground }}>
                  {(selectedAge.ageInPlanetYears % 1).toFixed(3).slice(1)} yrs
                </Text>
              </Text>
            </View>

            <StatRow
              label="One year on this planet"
              value={`${selectedPlanet.orbitalPeriodDays.toFixed(1)} Earth days`}
            />
            <StatRow
              label="Next planetary birthday"
              value={formatCountdown(selectedAge.daysUntilNextBirthday)}
              valueColor={selectedAge.daysUntilNextBirthday < 30 ? colors.accent : undefined}
            />
            <StatRow
              label="Distance from Sun"
              value={`${selectedPlanet.distanceFromSunAU} AU`}
            />
          </CosmicCard>
        )}

        {/* All planets list */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>All Planetary Ages</Text>
        {PLANETS.map((planet, index) => {
          const pAge = planetaryAges.find((a) => a.planetId === planet.id);
          if (!pAge) return null;
          return (
            <Animated.View
              key={planet.id}
              entering={FadeInUp.delay(80 + index * 45).duration(360).springify().damping(18)}
            >
              <TouchableOpacity
                onPress={() => setSelectedId(planet.id)}
                activeOpacity={0.8}
              >
                <CosmicCard
                  style={[styles.planetRow, selectedId === planet.id && { borderColor: `${planet.color}66` }]}
                >
                  <View style={styles.planetRowInner}>
                    <View style={[styles.rowDot, { backgroundColor: planet.color, shadowColor: planet.glowColor }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowPlanetName, { color: colors.foreground }]}>{planet.name}</Text>
                      <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{planet.description}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.rowAge, { color: planet.color }]}>
                        {Math.floor(pAge.ageInPlanetYears).toLocaleString()} yrs
                      </Text>
                      <Text style={[styles.rowCountdown, { color: colors.mutedForeground }]}>
                        Next bday: {formatCountdown(pAge.daysUntilNextBirthday)}
                      </Text>
                    </View>
                  </View>
                </CosmicCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
  },
  solarSystem: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  sun: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD166',
    shadowColor: '#FFD166',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 8,
  },
  orbitRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    gap: 12,
  },
  planetWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  planetName: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  detailCard: {
    marginTop: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailPlanetDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  detailPlanetName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  detailPlanetDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  ageDisplay: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  ageLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  ageValue: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  planetRow: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  planetRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.38,
    shadowRadius: 6,
    elevation: 3,
  },
  rowPlanetName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  rowDesc: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  rowAge: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  rowCountdown: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});

const orbitStyles = StyleSheet.create({
  planet: {
    shadowOffset: { width: 0, height: 0 },
  },
});
