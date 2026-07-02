import React, { useMemo } from 'react';
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
import { useUser, useBirthDate } from '@/context/UserContext';
import { SpaceBackground } from '@/components/SpaceBackground';
import { CosmicCard, StatRow } from '@/components/CosmicCard';
import {
  getEarthAge,
  getHumanStats,
  getDailyFact,
  getCosmicComparisons,
  getBigBangStats,
  getMoonStats,
  formatLargeNumber,
} from '@/utils/calculations';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function CounterUnit({ value, label }: { value: number; label: string }) {
  const colors = useColors();
  return (
    <View style={counter.unit}>
      <Text style={[counter.value, { color: colors.foreground }]}>{pad(value)}</Text>
      <Text style={[counter.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function CounterSep() {
  const colors = useColors();
  return <Text style={[counter.sep, { color: colors.mutedForeground }]}>:</Text>;
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, now } = useUser();
  const birthDate = useBirthDate();

  const age = useMemo(() => {
    if (!birthDate) return null;
    return getEarthAge(birthDate, now);
  }, [birthDate, now]);

  const human = useMemo(() => {
    if (!birthDate) return null;
    return getHumanStats(birthDate, now);
  }, [birthDate, now]);

  const bigBang = useMemo(() => {
    if (!birthDate) return null;
    return getBigBangStats(birthDate, now);
  }, [birthDate, now]);

  const moon = useMemo(() => {
    if (!birthDate) return null;
    return getMoonStats(birthDate, now);
  }, [birthDate, now]);

  const dailyFact = useMemo(() => {
    if (!birthDate) return '';
    return getDailyFact(birthDate, now);
  }, [birthDate]); // only recalc once per day, not every second

  const comparisons = useMemo(() => {
    if (!birthDate) return [];
    return getCosmicComparisons(birthDate, now);
  }, [birthDate, now]);

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
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back</Text>
        <Text style={[styles.name, { color: colors.foreground }]}>{profile?.name ?? 'Explorer'}</Text>

        {/* Live Counter */}
        <CosmicCard style={styles.counterCard}>
          <Text style={[styles.sectionLabel, { color: colors.accent }]}>LIVE COSMIC AGE</Text>
          {age ? (
            <View style={counter.row}>
              <CounterUnit value={age.years} label="YRS" />
              <CounterSep />
              <CounterUnit value={age.months} label="MO" />
              <CounterSep />
              <CounterUnit value={age.days} label="D" />
              <CounterSep />
              <CounterUnit value={age.hours} label="H" />
              <CounterSep />
              <CounterUnit value={age.minutes} label="M" />
              <CounterSep />
              <CounterUnit value={age.seconds} label="S" />
            </View>
          ) : (
            <Text style={{ color: colors.mutedForeground }}>Loading...</Text>
          )}
        </CosmicCard>

        {/* Universe progress */}
        {bigBang && (
          <CosmicCard style={styles.card} accent>
            <Text style={[styles.sectionLabel, { color: colors.accent }]}>UNIVERSE PERSPECTIVE</Text>
            <Text style={[styles.bigNumber, { color: colors.primary }]}>
              {bigBang.percentOfUniverseHistoryExperienced.toFixed(8)}%
            </Text>
            <Text style={[styles.bigNumberSub, { color: colors.mutedForeground }]}>
              of universal history experienced
            </Text>
            <View style={{ height: 8 }} />
            <StatRow
              label="Universe age at your birth"
              value={`${(bigBang.universeAgeAtBirth / 1e9).toFixed(3)} billion years`}
            />
            <StatRow
              label="Born on cosmic calendar"
              value={bigBang.cosmicCalendarDate}
            />
          </CosmicCard>
        )}

        {/* Daily Fact */}
        {dailyFact ? (
          <View style={[styles.factCard, { borderColor: 'rgba(255,209,102,0.2)', backgroundColor: 'rgba(255,209,102,0.05)' }]}>
            <LinearGradient
              colors={['rgba(255,209,102,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={[styles.factLabel, { color: colors.accent }]}>DAILY COSMIC FACT</Text>
            <Text style={[styles.factText, { color: colors.foreground }]}>{dailyFact}</Text>
          </View>
        ) : null}

        {/* Earth Stats */}
        {age && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>EARTH TIME STATISTICS</Text>
            <StatRow label="Total days" value={age.totalDays.toLocaleString()} valueColor={colors.primary} />
            <StatRow label="Total weeks" value={age.totalWeeks.toLocaleString()} />
            <StatRow label="Total hours" value={formatLargeNumber(age.totalHours)} />
            <StatRow label="Total minutes" value={formatLargeNumber(age.totalMinutes)} />
            <StatRow label="Total seconds" value={formatLargeNumber(age.totalSeconds)} valueColor={colors.accent} />
          </CosmicCard>
        )}

        {/* Human Stats */}
        {human && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>HUMAN PERSPECTIVE</Text>
            <Text style={[styles.estimate, { color: colors.mutedForeground }]}>* All values are estimates</Text>
            <StatRow label="Heartbeats" value={formatLargeNumber(human.heartbeats)} valueColor={colors.primary} />
            <StatRow label="Breaths taken" value={formatLargeNumber(human.breaths)} />
            <StatRow label="Hours of sleep" value={formatLargeNumber(human.sleepHours)} />
            <StatRow label="Meals eaten" value={formatLargeNumber(human.mealsEaten)} />
            <StatRow label="Distance walked" value={`~${human.distanceWalkedKm.toLocaleString()} km`} />
          </CosmicCard>
        )}

        {/* Moon stats */}
        {moon && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>MOON STATISTICS</Text>
            <StatRow label="Full moons witnessed" value={moon.fullMoonsExperienced.toLocaleString()} valueColor={colors.primary} />
            <StatRow label="Lunar cycles completed" value={moon.lunarCyclesCompleted.toLocaleString()} />
            <StatRow label="Moon orbits since birth" value={moon.moonOrbits.toLocaleString()} />
            <StatRow label="Current moon phase" value={moon.currentMoonPhaseName} valueColor={colors.accent} />
          </CosmicCard>
        )}

        {/* Comparisons */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Cosmic Comparisons</Text>
        {comparisons.map((c, i) => (
          <View
            key={i}
            style={[
              styles.compCard,
              {
                backgroundColor: 'rgba(77, 159, 255, 0.05)',
                borderColor: 'rgba(77, 159, 255, 0.15)',
              },
            ]}
          >
            <Text style={[styles.compText, { color: colors.foreground }]}>"{c}"</Text>
          </View>
        ))}
      </ScrollView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
    marginBottom: -6,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  counterCard: {
    marginTop: 4,
  },
  card: {},
  bigNumber: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  bigNumberSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  factCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  factLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  factText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
  },
  estimate: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  compCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  compText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

const counter = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 4,
  },
  unit: {
    alignItems: 'center',
    minWidth: 40,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
    marginTop: 2,
  },
  sep: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
});
