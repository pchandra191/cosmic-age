import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  title?: string;
  subtitle?: string;
  value?: string;
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: TextStyle;
  children?: React.ReactNode;
  accent?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export function CosmicCard({
  title,
  subtitle,
  value,
  valueColor,
  style,
  titleStyle,
  children,
  accent = false,
  glow = false,
  glowColor,
}: Props) {
  const colors = useColors();

  const cardContent = (
    <>
      {title && (
        <Text style={[styles.title, { color: colors.mutedForeground }, titleStyle]}>
          {title.toUpperCase()}
        </Text>
      )}
      {value !== undefined && (
        <Text style={[styles.value, { color: valueColor ?? colors.foreground }]}>{value}</Text>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      )}
      {children}
    </>
  );

  const containerStyle: ViewStyle = {
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: accent ? 'rgba(77, 159, 255, 0.3)' : colors.border,
    overflow: 'hidden',
    ...(glow && glowColor
      ? {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }
      : {}),
  };

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={20} tint="dark" style={[containerStyle, style]}>
        <View style={[styles.inner, accent && { backgroundColor: 'rgba(77, 159, 255, 0.05)' }]}>
          {cardContent}
        </View>
      </BlurView>
    );
  }

  return (
    <View
      style={[
        containerStyle,
        { backgroundColor: 'rgba(10, 15, 40, 0.85)' },
        accent && { backgroundColor: 'rgba(20, 35, 80, 0.9)' },
        style,
      ]}
    >
      <View style={styles.inner}>{cardContent}</View>
    </View>
  );
}

export function StatRow({
  label,
  value,
  valueColor,
  unit,
}: {
  label: string;
  value: string;
  valueColor?: string;
  unit?: string;
}) {
  const colors = useColors();
  return (
    <View style={statStyles.row}>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={statStyles.valueRow}>
        <Text style={[statStyles.value, { color: valueColor ?? colors.foreground }]}>{value}</Text>
        {unit && <Text style={[statStyles.unit, { color: colors.mutedForeground }]}> {unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 16,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
  },
  unit: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
