import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';

type Palette = typeof colors.light;

export function useColors(): Palette & { radius: number } {
  const scheme = useColorScheme();
  // Both light and dark are space-dark palettes for this app.
  // The 'dark' key is defined in constants/colors.ts, so we can safely access it.
  const palette: Palette =
    scheme === 'dark' && 'dark' in colors
      ? (colors.dark as Palette)
      : colors.light;
  return { ...palette, radius: colors.radius };
}
