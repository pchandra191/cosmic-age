---
name: Expo dark-only palette pattern
description: Fixes a TS error in useColors.ts when both light and dark palettes are the same type and colors.radius is a number.
---

## Rule

When adding a `dark` key to `constants/colors.ts` that mirrors the `light` palette shape, the scaffold's original `useColors.ts` cast breaks:

```ts
// BROKEN — radius is number, not Palette shape; TS2352
(colors as Record<string, typeof colors.light>).dark
```

Use a direct cast instead:

```ts
type Palette = typeof colors.light;
const palette: Palette = scheme === 'dark' && 'dark' in colors
  ? (colors.dark as Palette)   // safe because we control colors.ts shape
  : colors.light;
```

**Why:** The Record cast requires all values to be the same type, but `radius: number` conflicts with `Palette`. The direct cast is safe because the agent owns `constants/colors.ts` and guarantees `dark` matches `light`'s shape.

**How to apply:** Any time you add a `dark` key to `constants/colors.ts` in an Expo monorepo project, update `hooks/useColors.ts` with the direct cast pattern above.
