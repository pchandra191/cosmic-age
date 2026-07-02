import {
  UNIVERSE_AGE_SECONDS,
  UNIVERSE_AGE_YEARS,
  ORBITAL_PERIODS,
  MOON_SYNODIC_PERIOD_DAYS,
  MOON_SIDEREAL_PERIOD_DAYS,
  EARTH_ORBITAL_VELOCITY_KMS,
  GALACTIC_ORBITAL_VELOCITY_KMS,
  SPEED_OF_LIGHT_KMS,
  AU_IN_KM,
  LIGHT_YEAR_IN_KM,
  MILKY_WAY_ORBITAL_PERIOD_YEARS,
  AVG_HEARTRATE_BPM,
  AVG_BREATHS_PER_MIN,
  AVG_STEPS_PER_DAY,
  AVG_STEP_LENGTH_KM,
  AVG_SLEEP_HOURS_PER_DAY,
  AVG_MEALS_PER_DAY,
  PLANETS,
  OBSERVABLE_UNIVERSE_RADIUS_LY,
  BIG_BANG_TIMELINE,
  SPACE_EVENTS,
} from '@/constants/cosmic';

export interface EarthAge {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export function getEarthAge(birthDate: Date, now: Date = new Date()): EarthAge {
  const totalMs = now.getTime() - birthDate.getTime();
  const totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  // Calendar-accurate years/months/days
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  let years = nowYear - birthYear;
  let months = nowMonth - birthMonth;
  let days = nowDay - birthDay;

  if (days < 0) {
    months--;
    const prevMonth = new Date(nowYear, nowMonth, 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const hours = now.getHours() - birthDate.getHours();
  const minutes = now.getMinutes() - birthDate.getMinutes();
  const seconds = now.getSeconds() - birthDate.getSeconds();

  return {
    years,
    months,
    days,
    hours: (hours + 24) % 24,
    minutes: (minutes + 60) % 60,
    seconds: (seconds + 60) % 60,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

export interface PlanetaryAge {
  planetId: string;
  ageInPlanetYears: number;
  ageDisplay: string;
  daysUntilNextBirthday: number;
  nextBirthdayDate: Date;
}

export function getPlanetaryAges(birthDate: Date, now: Date = new Date()): PlanetaryAge[] {
  const totalDays = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);

  return PLANETS.map((planet) => {
    const ageInPlanetYears = totalDays / planet.orbitalPeriodDays;
    const completedYears = Math.floor(ageInPlanetYears);
    const fraction = ageInPlanetYears - completedYears;
    const daysIntoCurrentYear = fraction * planet.orbitalPeriodDays;
    const daysUntilNextBirthday = Math.ceil(planet.orbitalPeriodDays - daysIntoCurrentYear);

    const nextBirthday = new Date(now.getTime() + daysUntilNextBirthday * 24 * 60 * 60 * 1000);

    const decimal = ageInPlanetYears % 1;
    const decStr = decimal.toFixed(2).slice(1); // ".43"

    return {
      planetId: planet.id,
      ageInPlanetYears,
      ageDisplay: `${completedYears}${decStr}`,
      daysUntilNextBirthday,
      nextBirthdayDate: nextBirthday,
    };
  });
}

export interface MoonStats {
  fullMoonsExperienced: number;
  lunarCyclesCompleted: number;
  moonOrbits: number;
  currentMoonPhaseName: string;
  currentMoonPhasePercent: number; // 0–1
}

export function getMoonStats(birthDate: Date, now: Date = new Date()): MoonStats {
  const totalDays = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
  const fullMoonsExperienced = Math.floor(totalDays / MOON_SYNODIC_PERIOD_DAYS);
  const lunarCyclesCompleted = fullMoonsExperienced;
  const moonOrbits = Math.floor(totalDays / MOON_SIDEREAL_PERIOD_DAYS);

  // Current moon phase (0 = new moon, 0.5 = full moon, 1 = new moon)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const daysSinceKnown = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceKnown % MOON_SYNODIC_PERIOD_DAYS) / MOON_SYNODIC_PERIOD_DAYS;

  let phaseName = 'New Moon';
  if (phase < 0.02 || phase > 0.98) phaseName = 'New Moon';
  else if (phase < 0.25) phaseName = 'Waxing Crescent';
  else if (phase < 0.27) phaseName = 'First Quarter';
  else if (phase < 0.5) phaseName = 'Waxing Gibbous';
  else if (phase < 0.52) phaseName = 'Full Moon';
  else if (phase < 0.75) phaseName = 'Waning Gibbous';
  else if (phase < 0.77) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  return {
    fullMoonsExperienced,
    lunarCyclesCompleted,
    moonOrbits,
    currentMoonPhaseName: phaseName,
    currentMoonPhasePercent: phase,
  };
}

export interface DistanceTraveled {
  earthOrbitKm: number;
  earthOrbitAU: number;
  galacticKm: number;
  galacticLightYears: number;
  lightTravelKm: number;
  lightTravelLightYears: number;
}

export function getDistanceTraveled(birthDate: Date, now: Date = new Date()): DistanceTraveled {
  const totalSeconds = (now.getTime() - birthDate.getTime()) / 1000;

  const earthOrbitKm = EARTH_ORBITAL_VELOCITY_KMS * totalSeconds;
  const galacticKm = GALACTIC_ORBITAL_VELOCITY_KMS * totalSeconds;
  const lightTravelKm = SPEED_OF_LIGHT_KMS * totalSeconds;

  return {
    earthOrbitKm,
    earthOrbitAU: earthOrbitKm / AU_IN_KM,
    galacticKm,
    galacticLightYears: galacticKm / LIGHT_YEAR_IN_KM,
    lightTravelKm,
    lightTravelLightYears: lightTravelKm / LIGHT_YEAR_IN_KM,
  };
}

export interface BigBangStats {
  yearsAfterBigBangAtBirth: number;
  percentOfUniverseHistoryExperienced: number;
  universeAgeAtBirth: number; // years
  cosmicCalendarDate: string; // e.g. "December 31, 23:59:59"
  cosmicCalendarDayOfYear: number; // 1–365
  positionPercent: number; // 0–100 where in universe history the user sits
}

export function getBigBangStats(birthDate: Date, now: Date = new Date()): BigBangStats {
  const ageSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  const ageYears = ageSeconds / (365.25 * 24 * 3600);

  const universeAgeAtBirth = UNIVERSE_AGE_YEARS - ageYears;
  const yearsAfterBigBangAtBirth = universeAgeAtBirth;
  const percentOfUniverseHistoryExperienced = (ageYears / UNIVERSE_AGE_YEARS) * 100;

  // Cosmic calendar: compress 13.8B years into 365.25 days
  // The user appears at position: yearsAfterBigBangAtBirth / UNIVERSE_AGE_YEARS * 365.25
  const birthDayOfYear = (yearsAfterBigBangAtBirth / UNIVERSE_AGE_YEARS) * 365.25;
  const todayDayOfYear = (UNIVERSE_AGE_YEARS / UNIVERSE_AGE_YEARS) * 365.25; // always 365.25

  // Birth position on cosmic calendar
  const dayOfYear = Math.floor(birthDayOfYear);
  const fracOfDay = birthDayOfYear - dayOfYear;
  const secondsInDay = fracOfDay * 86400;
  const hh = Math.floor(secondsInDay / 3600);
  const mm = Math.floor((secondsInDay % 3600) / 60);
  const ss = Math.floor(secondsInDay % 60);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let remaining = dayOfYear;
  let monthIndex = 0;
  for (let i = 0; i < daysPerMonth.length; i++) {
    if (remaining <= daysPerMonth[i]) {
      monthIndex = i;
      break;
    }
    remaining -= daysPerMonth[i];
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const cosmicCalendarDate = `${monthNames[monthIndex]} ${remaining}, ${pad(hh)}:${pad(mm)}:${pad(ss)}`;

  return {
    yearsAfterBigBangAtBirth,
    percentOfUniverseHistoryExperienced,
    universeAgeAtBirth,
    cosmicCalendarDate,
    cosmicCalendarDayOfYear: dayOfYear,
    positionPercent: (yearsAfterBigBangAtBirth / UNIVERSE_AGE_YEARS) * 100,
  };
}

export interface HumanStats {
  heartbeats: number;
  breaths: number;
  sleepHours: number;
  mealsEaten: number;
  distanceWalkedKm: number;
}

export function getHumanStats(birthDate: Date, now: Date = new Date()): HumanStats {
  const totalSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  const totalDays = totalSeconds / 86400;
  const totalMinutes = totalSeconds / 60;

  return {
    heartbeats: Math.floor(totalMinutes * AVG_HEARTRATE_BPM),
    breaths: Math.floor(totalMinutes * AVG_BREATHS_PER_MIN),
    sleepHours: Math.floor(totalDays * AVG_SLEEP_HOURS_PER_DAY),
    mealsEaten: Math.floor(totalDays * AVG_MEALS_PER_DAY),
    distanceWalkedKm: Math.floor(totalDays * AVG_STEPS_PER_DAY * AVG_STEP_LENGTH_KM),
  };
}

export interface MilkyWayStats {
  galacticOrbitPercent: number; // percent of one galactic orbit completed
  distanceTraveledLY: number;
  galacticYears: number; // full galactic orbits completed
}

export function getMilkyWayStats(birthDate: Date, now: Date = new Date()): MilkyWayStats {
  const ageYears = (now.getTime() - birthDate.getTime()) / (1000 * 365.25 * 24 * 3600);
  const galacticYears = ageYears / MILKY_WAY_ORBITAL_PERIOD_YEARS;
  const galacticOrbitPercent = (galacticYears % 1) * 100;

  const totalSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  const galacticKm = GALACTIC_ORBITAL_VELOCITY_KMS * totalSeconds;
  const distanceTraveledLY = galacticKm / LIGHT_YEAR_IN_KM;

  return {
    galacticOrbitPercent,
    distanceTraveledLY,
    galacticYears,
  };
}

export interface UniverseExpansion {
  expansionKm: number; // approximate expansion of observable universe radius
  expansionLY: number;
  note: string;
}

export function getUniverseExpansion(birthDate: Date, now: Date = new Date()): UniverseExpansion {
  // Hubble constant: ~70 km/s/Mpc. At 46.5B LY radius, expansion rate ≈ c
  // Approximation: observable universe edge expands at ~c (actually faster due to expansion)
  // We show a simplified estimate
  const totalSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  const totalYears = totalSeconds / (365.25 * 24 * 3600);
  // Simplified: universe radius has grown by ~c * time (not physically exact, but illustrative)
  const expansionLY = totalYears; // universe expands ~1 light-year radius per year (approximate)
  const expansionKm = expansionLY * LIGHT_YEAR_IN_KM;

  return {
    expansionKm,
    expansionLY,
    note: 'Approximate — actual expansion exceeds c due to metric expansion of space',
  };
}

export interface SpaceEventWithAge {
  event: typeof SPACE_EVENTS[0];
  ageAtEvent: EarthAge | null; // null if before birth
  wasAlive: boolean;
}

export function getSpaceEventsWithAge(birthDate: Date): SpaceEventWithAge[] {
  return SPACE_EVENTS.map((event) => {
    const eventDate = new Date(event.date);
    const wasAlive = eventDate >= birthDate;
    return {
      event,
      ageAtEvent: wasAlive ? getEarthAge(birthDate, eventDate) : null,
      wasAlive,
    };
  }).sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
}

export function getDailyFact(birthDate: Date, now: Date = new Date()): string {
  const stats = getEarthAge(birthDate, now);
  const dist = getDistanceTraveled(birthDate, now);
  const moon = getMoonStats(birthDate, now);

  const facts = [
    `You have lived for exactly ${formatLargeNumber(stats.totalSeconds)} seconds`,
    `Your heart has beaten approximately ${formatLargeNumber(getHumanStats(birthDate, now).heartbeats)} times`,
    `Earth has carried you ${formatLargeNumber(Math.round(dist.earthOrbitKm))} km around the Sun`,
    `The Moon has orbited Earth ${moon.moonOrbits.toLocaleString()} times since your birth`,
    `You have experienced ${moon.fullMoonsExperienced.toLocaleString()} full moons`,
    `Light emitted on your birthday has now traveled ${dist.lightTravelLightYears.toFixed(4)} light-years`,
    `You have slept approximately ${formatLargeNumber(getHumanStats(birthDate, now).sleepHours)} hours in your lifetime`,
    `The Sun has completed ${(stats.totalDays / 365.25).toFixed(4)} orbits around the Milky Way's center... wait, that's just your age`,
  ];

  // Pick a different fact each day
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return facts[dayOfYear % facts.length];
}

export function getCosmicComparisons(birthDate: Date, now: Date = new Date()): string[] {
  const bigBang = getBigBangStats(birthDate, now);
  const planets = getPlanetaryAges(birthDate, now);
  const moon = getMoonStats(birthDate, now);
  const age = getEarthAge(birthDate, now);

  const jupiterAge = planets.find(p => p.planetId === 'jupiter');
  const mercuryAge = planets.find(p => p.planetId === 'mercury');

  return [
    `You have lived through only ${bigBang.percentOfUniverseHistoryExperienced.toFixed(8)}% of the Universe's history`,
    jupiterAge ? `On Jupiter, you would be just ${Math.floor(jupiterAge.ageInPlanetYears)} years old` : '',
    `The Moon has circled Earth over ${moon.moonOrbits.toLocaleString()} times since your birth`,
    mercuryAge ? `On Mercury, you would already be celebrating your ${Math.floor(mercuryAge.ageInPlanetYears)} birthday` : '',
    `You were born ${formatLargeNumber(Math.round(bigBang.yearsAfterBigBangAtBirth))} years after the Big Bang`,
    `You've experienced ${age.totalWeeks.toLocaleString()} sunsets and sunrises`,
    `At the speed of light, you could circle Earth ${Math.round(age.totalSeconds * 7.5).toLocaleString()} times`,
  ].filter(Boolean);
}

export function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`;
  return n.toLocaleString();
}

export function formatKm(km: number): string {
  if (km >= LIGHT_YEAR_IN_KM) return `${(km / LIGHT_YEAR_IN_KM).toFixed(4)} light-years`;
  if (km >= AU_IN_KM) return `${(km / AU_IN_KM).toFixed(2)} AU`;
  if (km >= 1e9) return `${(km / 1e9).toFixed(2)} billion km`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(2)} million km`;
  return `${Math.round(km).toLocaleString()} km`;
}

export function formatCountdown(days: number): string {
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow!';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  const remaining = days % 30;
  if (remaining === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months}m ${remaining}d`;
}
