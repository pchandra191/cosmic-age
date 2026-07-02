import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { SpaceBackground } from '@/components/SpaceBackground';
import { useUser } from '@/context/UserContext';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveProfile } = useUser();

  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (isNaN(d) || d < 1 || d > 31 || isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 1900 || y > new Date().getFullYear()) {
      Alert.alert('Invalid date', 'Please enter a valid date of birth.');
      return;
    }
    const birthDate = new Date(y, m - 1, d);
    // Strict round-trip validation: ensure Date didn't normalize (e.g. Feb 31 → Mar)
    if (
      birthDate.getFullYear() !== y ||
      birthDate.getMonth() !== m - 1 ||
      birthDate.getDate() !== d
    ) {
      Alert.alert('Invalid date', 'That date does not exist. Please enter a valid date.');
      return;
    }
    if (birthDate > new Date()) {
      Alert.alert('Invalid date', 'Birth date cannot be in the future.');
      return;
    }

    let birthTime: string | undefined;
    if (showTime && hour && minute) {
      const h = parseInt(hour, 10);
      const min = parseInt(minute, 10);
      if (!isNaN(h) && !isNaN(min) && h >= 0 && h <= 23 && min >= 0 && min <= 59) {
        birthTime = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      }
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const birthDateStr = `${y}-${pad(m)}-${pad(d)}`;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveProfile({ name: name.trim(), birthDate: birthDateStr, birthTime, hasOnboarded: true });
    router.replace('/(tabs)');
  };

  return (
    <SpaceBackground style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconRing}>
              <LinearGradient
                colors={['#1A3A8F', '#4D9FFF']}
                style={styles.iconGradient}
              >
                <Feather name="globe" size={36} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={[styles.appName, { color: colors.accent }]}>COSMIC AGE</Text>
            <Text style={[styles.headline, { color: colors.foreground }]}>
              Discover your life{'\n'}in the context of{'\n'}the Universe
            </Text>
            <Text style={[styles.subhead, { color: colors.mutedForeground }]}>
              Enter your details to begin your cosmic journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>YOUR NAME</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>DATE OF BIRTH</Text>
              <View style={styles.dateRow}>
                <TextInput
                  style={[styles.dateInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input, flex: 1 }]}
                  value={day}
                  onChangeText={(t) => setDay(t.replace(/[^0-9]/g, '').slice(0, 2))}
                  placeholder="DD"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={[styles.dateSep, { color: colors.mutedForeground }]}>/</Text>
                <TextInput
                  style={[styles.dateInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input, flex: 1 }]}
                  value={month}
                  onChangeText={(t) => setMonth(t.replace(/[^0-9]/g, '').slice(0, 2))}
                  placeholder="MM"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={[styles.dateSep, { color: colors.mutedForeground }]}>/</Text>
                <TextInput
                  style={[styles.dateInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input, flex: 2 }]}
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/[^0-9]/g, '').slice(0, 4))}
                  placeholder="YYYY"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.timeToggle}
              onPress={() => setShowTime((v) => !v)}
              activeOpacity={0.7}
            >
              <Feather
                name={showTime ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.timeToggleText, { color: colors.primary }]}>
                {showTime ? 'Hide birth time' : 'Add birth time (optional)'}
              </Text>
            </TouchableOpacity>

            {showTime && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>BIRTH TIME</Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={[styles.dateInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input, flex: 1 }]}
                    value={hour}
                    onChangeText={(t) => setHour(t.replace(/[^0-9]/g, '').slice(0, 2))}
                    placeholder="HH"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={[styles.dateSep, { color: colors.mutedForeground }]}>:</Text>
                  <TextInput
                    style={[styles.dateInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input, flex: 1 }]}
                    value={minute}
                    onChangeText={(t) => setMinute(t.replace(/[^0-9]/g, '').slice(0, 2))}
                    placeholder="MM"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.ctaButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#1A3A8F', '#4D9FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Feather name="zap" size={18} color="#FFFFFF" />
              <Text style={styles.ctaText}>Show My Cosmic Age</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            All calculations are done locally. No data leaves your device.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  iconRing: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 4,
    marginBottom: 12,
  },
  headline: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subhead: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
    gap: 20,
    marginBottom: 32,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  dateSep: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
  },
  timeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  timeToggleText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
