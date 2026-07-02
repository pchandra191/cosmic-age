import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cosmic_age_user';

export interface UserProfile {
  name: string;
  birthDate: string; // ISO date string YYYY-MM-DD
  birthTime?: string; // HH:MM optional
  hasOnboarded: boolean;
}

interface UserContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (p: UserProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  now: Date; // ticks every second
}

const UserContext = createContext<UserContextValue>({
  profile: null,
  isLoading: true,
  saveProfile: async () => {},
  clearProfile: async () => {},
  now: new Date(),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setProfile(JSON.parse(raw));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  // 1-second tick for live counters
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const saveProfile = useCallback(async (p: UserProfile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }, []);

  const clearProfile = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return (
    <UserContext.Provider value={{ profile, isLoading, saveProfile, clearProfile, now }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useBirthDate(): Date | null {
  const { profile } = useUser();
  if (!profile) return null;
  return new Date(profile.birthDate + 'T' + (profile.birthTime ?? '00:00') + ':00');
}
