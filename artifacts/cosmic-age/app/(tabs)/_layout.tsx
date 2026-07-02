import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function TabIconShell({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const scale = useSharedValue(focused ? 1 : 0.92);
  const lift = useSharedValue(focused ? -2 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 0.92, { damping: 14, stiffness: 220 });
    lift.value = withSpring(focused ? -3 : 0, { damping: 16, stiffness: 180 });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }],
  }));

  return <Animated.View style={[styles.tabIconShell, animStyle]}>{children}</Animated.View>;
}

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'clock', selected: 'clock.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="planets">
        <Icon sf={{ default: 'globe', selected: 'globe.europe.africa.fill' }} />
        <Label>Planets</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journey">
        <Icon sf={{ default: 'airplane', selected: 'airplane' }} />
        <Label>Journey</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="timeline">
        <Icon sf={{ default: 'calendar', selected: 'calendar' }} />
        <Label>Timeline</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : undefined,
        },
        tabBarBackground: () => (
          isIOS ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,20,0.92)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)' }]} />
          )
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconShell focused={focused}>
              {isIOS ? (
                <SymbolView name="clock.fill" tintColor={color} size={size} />
              ) : (
                <Feather name="clock" size={size} color={color} />
              )}
            </TabIconShell>
          ),
        }}
      />
      <Tabs.Screen
        name="planets"
        options={{
          title: 'Planets',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconShell focused={focused}>
              {isIOS ? (
                <SymbolView name="globe.europe.africa.fill" tintColor={color} size={size} />
              ) : (
                <MaterialCommunityIcons name="earth" size={size} color={color} />
              )}
            </TabIconShell>
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconShell focused={focused}>
              {isIOS ? (
                <SymbolView name="airplane" tintColor={color} size={size} />
              ) : (
                <MaterialCommunityIcons name="rocket-launch" size={size} color={color} />
              )}
            </TabIconShell>
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconShell focused={focused}>
              {isIOS ? (
                <SymbolView name="calendar" tintColor={color} size={size} />
              ) : (
                <MaterialCommunityIcons name="timeline" size={size} color={color} />
              )}
            </TabIconShell>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconShell focused={focused}>
              {isIOS ? (
                <SymbolView name="person.fill" tintColor={color} size={size} />
              ) : (
                <Feather name="user" size={size} color={color} />
              )}
            </TabIconShell>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconShell: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 30,
  },
});

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
