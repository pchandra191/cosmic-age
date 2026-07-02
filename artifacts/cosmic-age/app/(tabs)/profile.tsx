import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useUser, useBirthDate } from '@/context/UserContext';
import { SpaceBackground } from '@/components/SpaceBackground';
import { CosmicCard, StatRow } from '@/components/CosmicCard';
import {
  getEarthAge,
  getBigBangStats,
  getPlanetaryAges,
  getMoonStats,
  getDistanceTraveled,
  getHumanStats,
  formatLargeNumber,
  formatKm,
} from '@/utils/calculations';
import { PLANETS } from '@/constants/cosmic';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, clearProfile, now } = useUser();
  const birthDate = useBirthDate();
  const router = useRouter();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const age = useMemo(() => {
    if (!birthDate) return null;
    return getEarthAge(birthDate, now);
  }, [birthDate, now]);

  const bigBang = useMemo(() => {
    if (!birthDate) return null;
    return getBigBangStats(birthDate, now);
  }, [birthDate, now]);

  const planetaryAges = useMemo(() => {
    if (!birthDate) return [];
    return getPlanetaryAges(birthDate, now);
  }, [birthDate, now]);

  const moon = useMemo(() => {
    if (!birthDate) return null;
    return getMoonStats(birthDate, now);
  }, [birthDate, now]);

  const dist = useMemo(() => {
    if (!birthDate) return null;
    return getDistanceTraveled(birthDate, now);
  }, [birthDate, now]);

  const human = useMemo(() => {
    if (!birthDate) return null;
    return getHumanStats(birthDate, now);
  }, [birthDate, now]);

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'This will clear your profile and return to onboarding. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await clearProfile();
            router.replace('/onboarding');
          },
        },
      ],
    );
  };

  const birthDateStr = profile?.birthDate
    ? new Date(profile.birthDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

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
        {/* Profile Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#1A3A8F', '#4D9FFF']}
            style={styles.avatar}
          >
            <Text style={styles.avatarInitial}>
              {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </LinearGradient>
          <Text style={[styles.heroName, { color: colors.foreground }]}>{profile?.name ?? 'Explorer'}</Text>
          <Text style={[styles.heroBirth, { color: colors.mutedForeground }]}>
            Born {birthDateStr}
            {profile?.birthTime ? ` at ${profile.birthTime}` : ''}
          </Text>
          {age && (
            <View style={[styles.ageBadge, { backgroundColor: 'rgba(77,159,255,0.15)', borderColor: 'rgba(77,159,255,0.3)' }]}>
              <Text style={[styles.ageBadgeText, { color: colors.primary }]}>
                {age.years} years, {age.months} months, {age.days} days old
              </Text>
            </View>
          )}
        </View>

        {/* Cosmic Summary Card */}
        <CosmicCard style={styles.card} accent>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>COSMIC IDENTITY CARD</Text>
          {age && (
            <>
              <StatRow label="Earth Age" value={`${age.years} yrs ${age.months} mo ${age.days} d`} valueColor={colors.primary} />
              <StatRow label="Total days lived" value={age.totalDays.toLocaleString()} />
              <StatRow label="Total seconds" value={formatLargeNumber(age.totalSeconds)} />
            </>
          )}
          {bigBang && (
            <>
              <StatRow label="Universe age at birth" value={`${(bigBang.universeAgeAtBirth / 1e9).toFixed(3)}B years`} />
              <StatRow
                label="% of universe history"
                value={`${bigBang.percentOfUniverseHistoryExperienced.toFixed(8)}%`}
                valueColor={colors.accent}
              />
              <StatRow label="Born on cosmic calendar" value={bigBang.cosmicCalendarDate} />
            </>
          )}
          {moon && (
            <StatRow label="Full moons witnessed" value={moon.fullMoonsExperienced.toLocaleString()} />
          )}
          {dist && (
            <StatRow label="Distance through space" value={formatKm(dist.galacticKm)} />
          )}
        </CosmicCard>

        {/* Planetary Ages Summary */}
        <CosmicCard style={styles.card}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>AGES ON OTHER WORLDS</Text>
          {PLANETS.slice(0, 6).map((planet) => {
            const pAge = planetaryAges.find((a) => a.planetId === planet.id);
            if (!pAge) return null;
            return (
              <StatRow
                key={planet.id}
                label={planet.name}
                value={`${Math.floor(pAge.ageInPlanetYears).toLocaleString()} yrs`}
                valueColor={planet.color}
              />
            );
          })}
        </CosmicCard>

        {/* Human Stats */}
        {human && (
          <CosmicCard style={styles.card}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>HUMAN BODY STATISTICS</Text>
            <Text style={[styles.estimate, { color: colors.mutedForeground }]}>* Estimates based on average rates</Text>
            <StatRow label="Heartbeats" value={formatLargeNumber(human.heartbeats)} valueColor={colors.primary} />
            <StatRow label="Breaths" value={formatLargeNumber(human.breaths)} />
            <StatRow label="Sleep hours" value={formatLargeNumber(human.sleepHours)} />
            <StatRow label="Meals eaten" value={formatLargeNumber(human.mealsEaten)} />
            <StatRow label="Distance walked" value={`~${human.distanceWalkedKm.toLocaleString()} km`} />
          </CosmicCard>
        )}

        {/* Share prompt */}
        <View style={[styles.shareCard, { borderColor: 'rgba(255,209,102,0.2)', backgroundColor: 'rgba(255,209,102,0.05)' }]}>
          <Feather name="share-2" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.shareTitle, { color: colors.foreground }]}>Share Your Cosmic Stats</Text>
            <Text style={[styles.shareDesc, { color: colors.mutedForeground }]}>
              Take a screenshot of your Cosmic Identity Card to share with friends!
            </Text>
          </View>
        </View>

        {/* App info */}
        <CosmicCard style={styles.card}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ABOUT COSMIC AGE</Text>
          <Text style={[styles.about, { color: colors.mutedForeground }]}>
            All calculations are based on NASA and IAU scientific standards. Human body statistics are estimates using average physiological rates. Universe expansion calculations are approximations for educational purposes.
          </Text>
          <Text style={[styles.about, { color: colors.mutedForeground, marginTop: 8 }]}>
            All data is stored locally on your device and never transmitted.
          </Text>
        </CosmicCard>

        {/* Reset */}
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: 'rgba(255, 77, 77, 0.3)', backgroundColor: 'rgba(255, 77, 77, 0.05)' }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.resetText, { color: colors.destructive }]}>Reset Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarInitial: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  heroName: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  heroBirth: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  ageBadge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  ageBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  card: {},
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  estimate: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  shareCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  shareDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  about: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  resetButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});
