// ────────────────────────────────────────────────────────────
// Cosmic Age – Scientific Constants
// All values are from NASA / IAU standards unless noted.
// ────────────────────────────────────────────────────────────

export const UNIVERSE_AGE_YEARS = 13.8e9; // years
export const UNIVERSE_AGE_SECONDS = UNIVERSE_AGE_YEARS * 365.25 * 24 * 3600;

// Orbital periods in Earth days
export const ORBITAL_PERIODS: Record<string, number> = {
  mercury: 87.9691,
  venus: 224.701,
  earth: 365.256363,
  mars: 686.971,
  jupiter: 4332.589,
  saturn: 10759.22,
  uranus: 30688.5,
  neptune: 60182.0,
  pluto: 90560.0,
};

export const MOON_SYNODIC_PERIOD_DAYS = 29.530588853; // full moon cycle
export const MOON_SIDEREAL_PERIOD_DAYS = 27.321661; // orbit cycle

export const EARTH_ORBITAL_VELOCITY_KMS = 29.78; // km/s
export const GALACTIC_ORBITAL_VELOCITY_KMS = 220; // km/s (solar system around galactic center)
export const SPEED_OF_LIGHT_KMS = 299_792.458; // km/s
export const AU_IN_KM = 149_597_870.7;
export const LIGHT_YEAR_IN_KM = 9.461e12;
export const MILKY_WAY_ORBITAL_PERIOD_YEARS = 225_000_000; // one galactic year

// Human body averages
export const AVG_HEARTRATE_BPM = 70;
export const AVG_BREATHS_PER_MIN = 15;
export const AVG_STEPS_PER_DAY = 8_000;
export const AVG_STEP_LENGTH_KM = 0.00076;
export const AVG_SLEEP_HOURS_PER_DAY = 8;
export const AVG_MEALS_PER_DAY = 3;

// Hubble constant (km/s/Mpc) – for universe expansion estimates
export const HUBBLE_CONSTANT = 70;
export const OBSERVABLE_UNIVERSE_RADIUS_LY = 46.5e9; // light-years

export interface Planet {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  orbitalPeriodDays: number;
  distanceFromSunAU: number;
  description: string;
  size: number; // relative display size
}

export const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#B8B8B8',
    glowColor: '#D0D0D0',
    orbitalPeriodDays: 87.9691,
    distanceFromSunAU: 0.387,
    description: 'Closest to the Sun',
    size: 0.38,
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E8C57A',
    glowColor: '#F0D690',
    orbitalPeriodDays: 224.701,
    distanceFromSunAU: 0.723,
    description: 'Hottest Planet',
    size: 0.95,
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#4B9CD3',
    glowColor: '#6ABBE0',
    orbitalPeriodDays: 365.256,
    distanceFromSunAU: 1.0,
    description: 'Our Home',
    size: 1.0,
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#C1440E',
    glowColor: '#E05020',
    orbitalPeriodDays: 686.971,
    distanceFromSunAU: 1.524,
    description: 'The Red Planet',
    size: 0.53,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#C88B3A',
    glowColor: '#E0A040',
    orbitalPeriodDays: 4332.589,
    distanceFromSunAU: 5.203,
    description: 'The Giant',
    size: 11.2,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#E4D191',
    glowColor: '#F0E0A0',
    orbitalPeriodDays: 10759.22,
    distanceFromSunAU: 9.537,
    description: 'Lord of the Rings',
    size: 9.45,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#7DE8E8',
    glowColor: '#9AF0F0',
    orbitalPeriodDays: 30688.5,
    distanceFromSunAU: 19.19,
    description: 'The Ice Giant',
    size: 4.0,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#4B70DD',
    glowColor: '#6080F0',
    orbitalPeriodDays: 60182.0,
    distanceFromSunAU: 30.07,
    description: 'Windy World',
    size: 3.88,
  },
  {
    id: 'pluto',
    name: 'Pluto',
    color: '#A08878',
    glowColor: '#B89888',
    orbitalPeriodDays: 90560.0,
    distanceFromSunAU: 39.48,
    description: 'Dwarf Planet',
    size: 0.18,
  },
];

export interface SpaceEvent {
  date: string; // YYYY-MM-DD
  name: string;
  description: string;
  category: 'telescope' | 'station' | 'rover' | 'mission' | 'discovery' | 'launch';
}

export const SPACE_EVENTS: SpaceEvent[] = [
  { date: '1969-07-20', name: 'Apollo 11 Moon Landing', description: 'First humans set foot on the Moon', category: 'mission' },
  { date: '1977-09-05', name: 'Voyager 1 Launch', description: 'Embarked on a journey to interstellar space', category: 'launch' },
  { date: '1990-04-24', name: 'Hubble Space Telescope', description: 'Revolutionary orbital telescope launched', category: 'telescope' },
  { date: '1995-12-02', name: 'SOHO Launch', description: 'Solar observatory begins monitoring the Sun', category: 'mission' },
  { date: '1997-07-04', name: 'Mars Pathfinder Landing', description: 'First rover on Mars — Sojourner', category: 'rover' },
  { date: '1998-11-20', name: 'ISS Construction Begins', description: 'First module of the International Space Station launched', category: 'station' },
  { date: '2001-02-12', name: 'NEAR Shoemaker Landing', description: 'First spacecraft to land on an asteroid', category: 'mission' },
  { date: '2003-01-25', name: 'Opportunity Rover Lands', description: 'Mars exploration rover begins 15-year mission', category: 'rover' },
  { date: '2004-01-04', name: 'Spirit Rover Lands', description: 'Twin Mars rover begins exploration', category: 'rover' },
  { date: '2004-07-01', name: 'Cassini Arrives at Saturn', description: 'Begins 13-year study of Saturn and its moons', category: 'mission' },
  { date: '2006-01-19', name: 'New Horizons Launch', description: 'Mission to Pluto and the Kuiper Belt', category: 'launch' },
  { date: '2008-11-14', name: 'Chandrayaan-1 Moon Impact', description: "India's first lunar mission confirms water ice", category: 'mission' },
  { date: '2011-08-06', name: 'Curiosity Rover Lands', description: 'Car-sized rover begins studying Martian geology', category: 'rover' },
  { date: '2015-07-14', name: 'Pluto Flyby', description: 'New Horizons reveals Pluto in stunning detail', category: 'discovery' },
  { date: '2016-02-11', name: 'Gravitational Waves Detected', description: 'LIGO confirms Einstein\'s century-old prediction', category: 'discovery' },
  { date: '2019-04-10', name: 'First Black Hole Image', description: 'Event Horizon Telescope reveals M87 black hole', category: 'discovery' },
  { date: '2020-07-30', name: 'Perseverance Launch', description: 'Next-gen Mars rover carrying Ingenuity helicopter', category: 'launch' },
  { date: '2021-02-18', name: 'Perseverance Lands on Mars', description: 'Jezero Crater becomes new target in search for life', category: 'rover' },
  { date: '2021-12-25', name: 'James Webb Telescope Launch', description: 'Most powerful space telescope ever built', category: 'telescope' },
  { date: '2022-07-12', name: 'Webb First Images Released', description: 'Deepest infrared view of the universe revealed', category: 'telescope' },
  { date: '2022-09-26', name: 'DART Asteroid Impact', description: 'First planetary defense test successfully deflects asteroid', category: 'mission' },
];

export interface BigBangEvent {
  yearsAfterBigBang: number;
  name: string;
  description: string;
  color: string;
}

export const BIG_BANG_TIMELINE: BigBangEvent[] = [
  { yearsAfterBigBang: 0, name: 'Big Bang', description: 'The universe begins', color: '#FF6B35' },
  { yearsAfterBigBang: 3.8e5, name: 'First Light', description: 'Universe becomes transparent', color: '#FF9F1C' },
  { yearsAfterBigBang: 2e8, name: 'First Stars', description: 'Cosmic dawn', color: '#FFDA00' },
  { yearsAfterBigBang: 1e9, name: 'First Galaxies', description: 'Galaxies begin to form', color: '#A8DADC' },
  { yearsAfterBigBang: 4.6e9, name: 'Milky Way Forms', description: 'Our galaxy takes shape', color: '#4D9FFF' },
  { yearsAfterBigBang: 9.2e9, name: 'Solar System Forms', description: 'Sun and planets born', color: '#FFD166' },
  { yearsAfterBigBang: 9.6e9, name: 'Earth Forms', description: '4.5 billion years ago', color: '#4B9CD3' },
  { yearsAfterBigBang: 10.1e9, name: 'First Life', description: '3.7 billion years ago', color: '#06D6A0' },
  { yearsAfterBigBang: 13.2e9, name: 'Dinosaurs', description: '65 million years ago', color: '#118AB2' },
  { yearsAfterBigBang: 13.799997e9, name: 'Humans', description: '300,000 years ago', color: '#EF476F' },
];
