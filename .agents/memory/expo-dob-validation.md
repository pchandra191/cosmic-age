---
name: Expo DOB validation
description: Pattern for strict date-of-birth validation in React Native forms to prevent silent date normalization bugs.
---

## Rule

After parsing day/month/year from text inputs, always round-trip validate:

```ts
const birthDate = new Date(y, m - 1, d);
if (
  birthDate.getFullYear() !== y ||
  birthDate.getMonth() !== m - 1 ||
  birthDate.getDate() !== d
) {
  Alert.alert('Invalid date', 'That date does not exist.');
  return;
}
```

**Why:** JavaScript's `Date` silently normalizes impossible dates (e.g., Feb 31 → March 2). Without this check, the stored DOB can be wrong, corrupting all downstream astronomical calculations.

**How to apply:** Any time a form collects separate day/month/year fields (not a native date picker), add this check before saving to state or storage.
