import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBirthDate } from '@/context/UserContext';
import { SpaceBackground } from '@/components/SpaceBackground';
import { CosmicCard } from '@/components/CosmicCard';
import { BIG_BANG_TIMELINE, SPACE_EVENTS } from '@/constants/cosmic';
import { getBigBangStats, getSpaceEventsWithAge } from '@/utils/calculations';

function BigBangNode({ event, isUser, isLast }: { event: typeof BIG_BANG_TIMELINE[0]; isUser?: boolean; isLast?: boolean }) {
  const colors = useColors();
  return (
    <View style={bbStyles.node}>
      <View style={bbStyles.leftCol}>
        <View style={[bbStyles.dot, { backgroundColor: event.color, shadowColor: event.color }, isUser && bbStyles.dotLarge]} />
        {!isLast && <View style={[bbStyles.line, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />}
      </View>
      <View style={[bbStyles.content, isUser && { backgroundColor: 'rgba(77,159,255,0.08)', borderRadius: 12, padding: 8, flex: 1 }]}>
        <Text style={[bbStyles.eventName, { color: isUser ? colors.primary : colors.foreground }]}>{event.name}</Text>
        <Text style={[bbStyles.eventDesc, { color: colors.mutedForeground }]}>{event.description}</Text>
        {isUser && (
          <Text style={[bbStyles.youTag, { color: colors.primary }]}>YOUR BIRTH</Text>
        )}
      </View>
    </View>
  );
}

export default function TimelineScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const birthDate = useBirthDate();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const bigBang = useMemo(() => {
    if (!birthDate) return null;
    return getBigBangStats(birthDate, new Date());
  }, [birthDate]);

  const spaceEvents = useMemo(() => {
    if (!birthDate) return [];
    return getSpaceEventsWithAge(birthDate);
  }, [birthDate]);

  const categoryColors: Record<string, string> = {
    telescope: '#4D9FFF',
    station: '#06D6A0',
    rover: '#C1440E',
    mission: '#FFD166',
    discovery: '#EF476F',
    launch: '#8A63D2',
  };

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
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Cosmic Timeline</Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          Your place in the universe's story
        </Text>

        {/* Big Bang Timeline */}
        <CosmicCard style={styles.card}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>BIG BANG TIMELINE</Text>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>13.8 billion years of cosmic history</Text>
          <View style={{ height: 12 }} />
          {BIG_BANG_TIMELINE.map((event, i) => {
            const isLast = i === BIG_BANG_TIMELINE.length - 1;
            return (
              <BigBangNode key={event.name} event={event} isLast={isLast} />
            );
          })}
          {/* User birth position */}
          {bigBang && (
            <View style={[bbStyles.node, { marginTop: -8 }]}>
              <View style={bbStyles.leftCol}>
                <View style={[bbStyles.dot, bbStyles.dotLarge, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />
              </View>
              <View style={[bbStyles.content, { backgroundColor: 'rgba(77,159,255,0.08)', borderRadius: 12, padding: 8, flex: 1 }]}>
                <Text style={[bbStyles.eventName, { color: colors.primary }]}>Your Birth</Text>
                <Text style={[bbStyles.eventDesc, { color: colors.mutedForeground }]}>
                  {(bigBang.yearsAfterBigBangAtBirth / 1e9).toFixed(3)} billion years after the Big Bang
                </Text>
                <Text style={[bbStyles.youTag, { color: colors.primary }]}>YOU ARE HERE</Text>
              </View>
            </View>
          )}
          <View style={[bbStyles.node]}>
            <View style={bbStyles.leftCol}>
              <View style={[bbStyles.dot, { backgroundColor: colors.accent, shadowColor: colors.accent }]} />
            </View>
            <View style={[bbStyles.content, { flex: 1 }]}>
              <Text style={[bbStyles.eventName, { color: colors.accent }]}>Today</Text>
              <Text style={[bbStyles.eventDesc, { color: colors.mutedForeground }]}>13.8 billion years after the Big Bang</Text>
            </View>
          </View>
        </CosmicCard>

        {/* Carl Sagan Cosmic Calendar */}
        {bigBang && (
          <CosmicCard style={styles.card} accent>
            <Text style={[styles.sectionLabel, { color: colors.accent }]}>CARL SAGAN COSMIC CALENDAR</Text>
            <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
              13.8 billion years compressed into one calendar year
            </Text>
            <View style={{ height: 12 }} />
            <View style={styles.calendarHighlight}>
              <Text style={[styles.calendarDate, { color: colors.foreground }]}>{bigBang.cosmicCalendarDate}</Text>
              <Text style={[styles.calendarDesc, { color: colors.mutedForeground }]}>Your birth on the cosmic calendar</Text>
            </View>
            <View style={{ height: 12 }} />
            <Text style={[styles.calendarContext, { color: colors.mutedForeground }]}>
              On this cosmic calendar, the Big Bang is January 1. The entire history of humanity spans just the last 22 seconds of December 31. Your entire life fits in a fraction of a cosmic second.
            </Text>
            <View style={{ height: 8 }} />
            <View style={styles.calendarFacts}>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>First stars formed</Text>
                <Text style={[styles.calFactValue, { color: colors.foreground }]}>Jan 22</Text>
              </View>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>Milky Way forms</Text>
                <Text style={[styles.calFactValue, { color: colors.foreground }]}>Mar 16</Text>
              </View>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>Earth forms</Text>
                <Text style={[styles.calFactValue, { color: colors.foreground }]}>Sep 2</Text>
              </View>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>Dinosaurs extinct</Text>
                <Text style={[styles.calFactValue, { color: colors.foreground }]}>Dec 30, 06:24</Text>
              </View>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>Modern humans</Text>
                <Text style={[styles.calFactValue, { color: colors.foreground }]}>Dec 31, 23:37</Text>
              </View>
              <View style={[styles.calFactRow, { borderColor: colors.border }]}>
                <Text style={[styles.calFactLabel, { color: colors.mutedForeground }]}>Your birth</Text>
                <Text style={[styles.calFactValue, { color: colors.primary }]}>{bigBang.cosmicCalendarDate}</Text>
              </View>
            </View>
          </CosmicCard>
        )}

        {/* Space Events */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Space Events in Your Lifetime</Text>
        {spaceEvents.map((item) => {
          const catColor = categoryColors[item.event.category] ?? colors.primary;
          const eventDate = new Date(item.event.date);
          return (
            <View
              key={item.event.date + item.event.name}
              style={[
                styles.eventCard,
                {
                  borderColor: item.wasAlive ? `${catColor}33` : 'rgba(255,255,255,0.05)',
                  backgroundColor: item.wasAlive ? 'rgba(0,0,30,0.7)' : 'rgba(0,0,20,0.4)',
                },
              ]}
            >
              <View style={styles.eventLeft}>
                <View style={[styles.eventDot, { backgroundColor: item.wasAlive ? catColor : colors.mutedForeground }]} />
                <View style={[styles.eventLine, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />
              </View>
              <View style={styles.eventContent}>
                <View style={[styles.eventCatBadge, { backgroundColor: `${catColor}22`, borderColor: `${catColor}44` }]}>
                  <Text style={[styles.eventCat, { color: catColor }]}>{item.event.category.toUpperCase()}</Text>
                </View>
                <Text style={[styles.eventName, { color: item.wasAlive ? colors.foreground : colors.mutedForeground }]}>
                  {item.event.name}
                </Text>
                <Text style={[styles.eventDesc, { color: colors.mutedForeground }]}>{item.event.description}</Text>
                <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
                  {eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {item.wasAlive && item.ageAtEvent
                    ? `  ·  You were ${item.ageAtEvent.years} yrs ${item.ageAtEvent.months} mo old`
                    : item.wasAlive ? '' : '  ·  Before your birth'}
                </Text>
              </View>
            </View>
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
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  card: {},
  calendarHighlight: {
    backgroundColor: 'rgba(77,159,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  calendarDate: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  calendarDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  calendarContext: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  calendarFacts: {
    gap: 0,
  },
  calFactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  calFactLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  calFactValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  eventCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  eventLeft: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  eventLine: {
    width: 1,
    flex: 1,
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
    gap: 4,
  },
  eventCatBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eventCat: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
  },
  eventName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  eventDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  eventDate: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});

const bbStyles = StyleSheet.create({
  node: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 50,
  },
  leftCol: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  dotLarge: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  line: {
    width: 1,
    flex: 1,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
  },
  eventName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  eventDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  youTag: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    marginTop: 4,
  },
});
