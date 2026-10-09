/**
 * Mathematical calculations and cosmic scale physical comparisons
 * demonstrating the mathematical impossibility of brute-forcing a 256-bit Bitcoin key.
 */

export interface CosmicMilestone {
  id: string;
  name: string;
  nameEn: string;
  category: 'cosmos' | 'matter' | 'time' | 'energy';
  exponent: number; // 10^exponent
  valueFormatted: string;
  descriptionDe: string;
  descriptionEn: string;
  comparisonWithKeyspace: string;
  comparisonWithKeyspaceEn: string;
}

// 2^256 in exact decimal string
export const KEYSPACE_2_256_DECIMAL =
  '115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936';

// 2^256 as approximate scientific value: 1.1579209 x 10^77
export const KEYSPACE_EXPONENT = 77.0637;
export const KEYSPACE_APPROX_BASE = 1.15792089;

// Observable Universe volume in m³: approx 3.57 x 10^80 m³ (Radius ≈ 46.5 billion light years ≈ 4.4e26 m)
export const UNIVERSE_VOLUME_M3_EXP = 80.55;
export const UNIVERSE_VOLUME_KM3_EXP = 71.55; // in cubic kilometers!

// Age of the universe in seconds (13.8 billion years ≈ 4.35 x 10^17 s)
export const UNIVERSE_AGE_SECONDS = 4.3549e17;
export const UNIVERSE_AGE_YEARS = 1.38e10;

export const COSMIC_MILESTONES: CosmicMilestone[] = [
  {
    id: 'sand',
    name: 'Sandkörner der gesamten Erde',
    nameEn: 'Grains of sand on Earth',
    category: 'matter',
    exponent: 18.87, // ~7.5 x 10^18
    valueFormatted: '7,500,000,000,000,000,000 (7.5 × 10¹⁸)',
    descriptionDe: 'Alle Sandkörner an sämtlichen Stränden und Wüsten unseres Planeten Erde zusammen.',
    descriptionEn: 'All grains of sand across all beaches and deserts on Earth combined.',
    comparisonWithKeyspace: 'Der Bitcoin-Zahlenraum ist ~10⁵⁸-mal größer als alle Sandkörner der Erde.',
    comparisonWithKeyspaceEn: 'The Bitcoin keyspace is ~10⁵⁸ times larger than all sand grains on Earth.',
  },
  {
    id: 'ocean_drops',
    name: 'Wassertropfen in allen Weltmeeren',
    nameEn: 'Drops of water in all oceans',
    category: 'matter',
    exponent: 26.11, // ~1.3 x 10^26
    valueFormatted: '1.3 × 10²⁶ Tropfen',
    descriptionDe: 'Jeder einzelne Milliliter Wasser enthält etwa 20 Tropfen. Alle Ozeane der Erde zusammen.',
    descriptionEn: 'Every milliliter contains ~20 drops. The volume of all oceans on planet Earth combined.',
    comparisonWithKeyspace: 'Der Bitcoin-Zahlenraum ist ~10⁵¹-mal größer als alle Wassertropfen der Welt.',
    comparisonWithKeyspaceEn: 'The Bitcoin keyspace is ~10⁵¹ times larger than all water drops on Earth.',
  },
  {
    id: 'earth_atoms',
    name: 'Atome des Planeten Erde',
    nameEn: 'Atoms in Planet Earth',
    category: 'matter',
    exponent: 50.11, // ~1.3 x 10^50
    valueFormatted: '1.33 × 10⁵⁰ Atome',
    descriptionDe: 'Jedes Eisen-, Silizium- und Sauerstoffatom im Erdkern, Erdmantel und der Erdkruste.',
    descriptionEn: 'Every iron, silicon, and oxygen atom in Earth’s core, mantle, and crust.',
    comparisonWithKeyspace: 'Der Bitcoin-Zahlenraum ist ~10²⁷-mal größer als alle Atome der Erde.',
    comparisonWithKeyspaceEn: 'The Bitcoin keyspace is ~10²⁷ times larger than all atoms making up Earth.',
  },
  {
    id: 'sun_energy',
    name: 'Massengröße / Energie der Sonne (in Joule)',
    nameEn: 'Mass-energy of the Sun (Joules)',
    category: 'energy',
    exponent: 47.25, // E = mc^2 of Sun ≈ 1.8 x 10^47 J
    valueFormatted: '1.8 × 10⁴⁷ Joule',
    descriptionDe: 'Die gesamte Masse der Sonne nach Einsteins Formel E = mc² vollständig in reine Energie verwandelt.',
    descriptionEn: 'The entire mass of our Sun converted completely to pure energy via E = mc².',
    comparisonWithKeyspace: 'Selbst die vollständige Vernichtung unserer Sonne liefert zu wenig Energie für 2²⁵⁶ Zählschritte!',
    comparisonWithKeyspaceEn: 'Even annihilating the entire Sun yields far too little energy to count to 2²⁵⁶!',
  },
  {
    id: 'universe_volume_km3',
    name: 'Volumen des Universums in km³',
    nameEn: 'Observable universe volume in km³',
    category: 'cosmos',
    exponent: 71.55, // 3.57 x 10^71 km³
    valueFormatted: '3.57 × 10⁷¹ km³',
    descriptionDe: 'Das Raumvolumen des gesamten beobachtbaren Universums in gigantischen Kubikkilometern ausgedrückt.',
    descriptionEn: 'The spatial volume of the observable universe expressed in cubic kilometers.',
    comparisonWithKeyspace: 'Der Bitcoin-Zahlenraum ist über 3.000.000-mal GRÖSSER als das Universum in Kubikkilometern!',
    comparisonWithKeyspaceEn: 'The Bitcoin keyspace is over 3,000,000 times LARGER than the universe in cubic kilometers!',
  },
  {
    id: 'bitcoin_keyspace',
    name: 'BITCOIN PRIVATE KEY ZAHLENRAUM (2²⁵⁶)',
    nameEn: 'BITCOIN PRIVATE KEY SPACE (2²⁵⁶)',
    category: 'energy',
    exponent: 77.06, // 1.158 x 10^77
    valueFormatted: '1.1579 × 10⁷⁷ Mögliche Schlüssel',
    descriptionDe: 'Genau 2²⁵⁶ diskrete Punkte auf der elliptischen Kurve secp256k1. Jeder Schlüssel eine Nadel im kosmischen Heuhaufen.',
    descriptionEn: 'Exactly 2²⁵⁶ discrete points on the secp256k1 curve. Each private key is a needle in a cosmic haystack.',
    comparisonWithKeyspace: 'Das mathematische Fundament moderner asymmetrischer Kryptographie.',
    comparisonWithKeyspaceEn: 'The mathematical foundation of modern asymmetric cryptography.',
  },
  {
    id: 'universe_volume_m3',
    name: 'Volumen des Universums in m³',
    nameEn: 'Observable universe volume in m³',
    category: 'cosmos',
    exponent: 80.55, // 3.57 x 10^80 m³
    valueFormatted: '3.57 × 10⁸⁰ m³',
    descriptionDe: 'Der gesamte beobachtbare Raum (Durchmesser ca. 93 Milliarden Lichtjahre) gemessen in einzelnen Kubikmetern.',
    descriptionEn: 'The entire observable space (diameter ~93 billion light-years) measured in individual cubic meters.',
    comparisonWithKeyspace: 'Gäbe man jedem m³ des Universums einen Schlüssel, blieben nur noch winzige Resträume übrig!',
    comparisonWithKeyspaceEn: 'If every m³ in the universe held one key, you would need almost a whole universe to store them all!',
  },
  {
    id: 'universe_atoms',
    name: 'Atome im beobachtbaren Universum',
    nameEn: 'Atoms in observable universe',
    category: 'cosmos',
    exponent: 80.0, // ~10^80
    valueFormatted: '10⁷⁸ bis 10⁸² Atome (≈ 10⁸⁰)',
    descriptionDe: 'Die geschätzte Gesamtzahl aller Wasserstoff-, Helium- und schwereren Atome in allen Galaxien.',
    descriptionEn: 'The estimated total count of all baryonic atoms across all galaxies in the cosmos.',
    comparisonWithKeyspace: 'Es gibt fast so viele Bitcoin-Schlüssel wie Atome im gesamten Universum!',
    comparisonWithKeyspaceEn: 'There are nearly as many private keys as there are atoms in the entire universe!',
  },
];

export interface HardwareScenario {
  id: string;
  titleDe: string;
  titleEn: string;
  deviceType: string;
  keysPerSec: number;
  descriptionDe: string;
  descriptionEn: string;
  timeToExhaust50PercentYears: number; // in astronomical years
  universeLifetimes: number;
}

export const HARDWARE_SCENARIOS: HardwareScenario[] = [
  {
    id: 'current_device',
    titleDe: 'Dein Smartphone / Aktueller Browser',
    titleEn: 'Your Smartphone / Active Browser',
    deviceType: 'ARM / x86 Multi-Thread Worker',
    keysPerSec: 5000, // dynamically overridden by actual benchmark
    descriptionDe: 'Ein moderner Smartphone-Chip führt ECDSA-Punktmultiplikationen auf Web-Workern aus.',
    descriptionEn: 'A modern mobile chip executing ECDSA point multiplications across Web Workers.',
    timeToExhaust50PercentYears: 3.67e65,
    universeLifetimes: 2.66e55,
  },
  {
    id: 'high_end_rig',
    titleDe: 'Gamer PC / Workstation (M3 Max / Ryzen 9)',
    titleEn: 'Workstation (M3 Max / Ryzen 9 / RTX 4090)',
    deviceType: 'GPU Cluster & 32 Cores',
    keysPerSec: 500000, // 500k/s
    descriptionDe: 'Hochoptimierte CUDA/C++ Pipeline mit direkter Assembler-secp256k1-Implementierung.',
    descriptionEn: 'Highly optimized CUDA/C++ pipeline with native secp256k1 assembly instructions.',
    timeToExhaust50PercentYears: 3.67e63,
    universeLifetimes: 2.66e53,
  },
  {
    id: 'frontier_supercomputer',
    titleDe: 'Frontier Exascale Supercomputer (USA)',
    titleEn: 'Frontier Exascale Supercomputer (Oak Ridge)',
    deviceType: '37,888 AMD Instinct GPUs (1.1 Exaflops)',
    keysPerSec: 10000000000, // 10 Milliarden Keys/s (10^10)
    descriptionDe: 'Der schnellste Supercomputer der Welt, der 100% seiner Kapazität nur für Schlüsseltests aufwendet.',
    descriptionEn: 'The world-leading exascale supercomputer dedicating 100% of compute to cracking.',
    timeToExhaust50PercentYears: 1.83e59,
    universeLifetimes: 1.33e49,
  },
  {
    id: 'global_btc_mining',
    titleDe: 'Weltweites Bitcoin-Minernetzwerk (700 EH/s)',
    titleEn: 'Global Bitcoin Mining Hashrate (700 EH/s)',
    deviceType: 'Millionen Antminer S21 / WhatsMiner ASICs',
    keysPerSec: 7e20, // 700 Exahashes/s (7 x 10^20)
    descriptionDe: 'Hypothetisch: Alle Bitcoin-Mining-ASICs der Erde würden umprogrammiert, um Private Keys zu brute-forcen.',
    descriptionEn: 'Hypothetical: All Bitcoin mining ASICs on Earth redirected to private key checking.',
    timeToExhaust50PercentYears: 2.62e48,
    universeLifetimes: 1.9e38,
  },
  {
    id: 'dyson_sphere',
    titleDe: 'Kardashev Typ II Dyson-Sphäre (Sonne)',
    titleEn: 'Kardashev Type II Dyson Swarm (Entire Sun)',
    deviceType: '100% Sonnenenergie (3.8 × 10²⁶ W)',
    keysPerSec: 1e38, // 10^38 operations/s at thermodynamic limit
    descriptionDe: 'Eine Megastruktur, die die gesamte Energieabgabe der Sonne auf Landauer-Grenze-Rechner bündelt.',
    descriptionEn: 'A megastructure capturing 100% solar luminosity operating at Landauer thermodynamic limit.',
    timeToExhaust50PercentYears: 1.83e31,
    universeLifetimes: 1.33e21,
  },
];

/**
 * Format huge numbers into readable scientific notation or human scale
 */
export function formatLargeNumber(val: number): string {
  if (val === 0) return '0';
  if (val < 1000) return val.toFixed(1);
  if (val < 1e6) return val.toLocaleString('de-DE');
  const exp = Math.floor(Math.log10(val));
  const base = val / Math.pow(10, exp);
  return `${base.toFixed(2)} × 10${toSuperscript(exp)}`;
}

/**
 * Format BigInt or huge power string to superscript
 */
export function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return num
    .toString()
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

/**
 * Calculate time to test 50% of 2^256 keyspace given speed in keys/sec
 */
export function calculateTimeStats(keysPerSec: number) {
  const safeSpeed = Math.max(1, keysPerSec);
  // 2^255 ≈ 5.7896e76
  const halfKeyspace = 5.7896e76;
  const secondsNeeded = halfKeyspace / safeSpeed;
  const yearsNeeded = secondsNeeded / (365.25 * 86400);
  const universeLifetimes = yearsNeeded / UNIVERSE_AGE_YEARS;

  return {
    secondsNeeded,
    yearsNeeded,
    universeLifetimes,
    formattedYears: formatLargeNumber(yearsNeeded),
    formattedLifetimes: formatLargeNumber(universeLifetimes),
  };
}
