// Second Sense - fixed technical assumptions and data
// Values follow the revised manuscript (v9): Tables 1, 3 and 5, Eqs. (1)-(12).

// Fixed technical assumptions
export const BATTERY_CONSTANTS = {
  BASE_CAPACITY_KWH: 60, // C0, nominal pack capacity (default example, user can change)
  CHEMISTRY: 'NMC811',
  SECOND_LIFE_THRESHOLD: 0.8, // second-life entry SOH (reference)
  BATTERY_EFFICIENCY: 0.9, // eta, round-trip efficiency
  USABLE_FRACTION_PER_CYCLE: 0.8, // f_u, same for all applications
  TOTAL_EV_LIFE_CYCLES: 2000, // cycles to 80% SOH (first-life reference)
  END_OF_LIFE_THRESHOLD: 0.6, // SOH_EOL, all applications and options
  LOW_SOH_THRESHOLD: 0.7, // below this SOH the low-SOH coefficient p_a applies
};

// Cycle-ageing rate d = 0.20 / 2000 = 0.0001 SOH per cycle
export const DEGRADATION_RATE = 0.0001;

// Calendar-ageing rate k_cal (per year) by temperature class: reference = midpoint, min / max = range limits
export const TEMPERATURE_CLASSES = {
  cold: { label: '< 20 °C', ref: 0.02, min: 0.01, max: 0.03 },
  mid: { label: '20–45 °C', ref: 0.065, min: 0.03, max: 0.1 },
  hot: { label: '> 45 °C', ref: 0.1, min: 0.1, max: 0.15 },
};

// Option names used everywhere (buttons, tables, charts, legends, tooltips)
export const OPTION_LABELS = {
  new: 'New (virgin)',
  recycled: 'Recycled-content',
  repurposed: 'Repurposed',
};

export const OPTION_TOOLTIPS = {
  new: 'New (virgin) battery',
  recycled: 'New battery with recycled material content',
  repurposed: 'Second-life EV battery',
};

// Applications - identical to Table 5 of the paper.
// dod: typical depth of discharge, shown for information only (it does not change lifetime or energy).
// daysPerCycle: days per cycle; nApp is given directly for telecom backup, UPS (12) and wheelchairs (52).
// pa: low-SOH coefficient, applied only when 0.60 < SOH < 0.70.
// capacityKwh: example battery capacity required by the application (buyer view).
export const APPLICATIONS = [
  { id: 'residential-household', name: 'Residential Household', dod: '83%', temp: 'cold', daysPerCycle: 1.2, pa: 0.95, capacityKwh: 30 },
  { id: 'pv-ev-charging', name: 'Off-grid PV-EV charging', dod: '~71.5%', temp: 'mid', daysPerCycle: 1.4, pa: 0.85, capacityKwh: 14 },
  { id: 'short-range-evs', name: 'Short-range EVs', dod: '~99.9%', temp: 'mid', daysPerCycle: 1, pa: 0.7, capacityKwh: 48 },
  { id: 'telecom-backups', name: 'Telecom backup', dod: '20%', temp: 'cold', nApp: 12, pa: 1, capacityKwh: 24 },
  { id: 'light-duty-forklifts', name: 'Light-duty forklifts', dod: '75%', temp: 'mid', daysPerCycle: 1.3, pa: 0.85, capacityKwh: 34 },
  { id: 'electric-wheel-loader-drive', name: 'Electric wheel loader drive', dod: '~95%', temp: 'hot', daysPerCycle: 1.05, pa: 0.75, capacityKwh: 15 },
  { id: 'frequency-regulation-storage', name: 'Frequency regulation in storage systems', dod: '50%', temp: 'cold', daysPerCycle: 2, pa: 0.65, capacityKwh: 48 },
  { id: 'power-regulation-storage', name: 'Power regulation storage systems', dod: '60%', temp: 'cold', daysPerCycle: 1.7, pa: 0.65, capacityKwh: 48 },
  { id: 'microgrids-wind', name: 'Microgrids with wind generation', dod: '70%', temp: 'mid', daysPerCycle: 1.42, pa: 0.85, capacityKwh: 48 },
  { id: 'electric-wheel-chairs', name: 'Electric wheelchairs', dod: '30%', temp: 'cold', nApp: 52, pa: 1, capacityKwh: 3 },
  { id: 'ups', name: 'UPS', dod: '20%', temp: 'cold', nApp: 12, pa: 1, capacityKwh: 48 },
  { id: 'industrial-load-following', name: 'Industrial load following', dod: '60%', temp: 'mid', daysPerCycle: 1.6, pa: 0.75, capacityKwh: 48 },
  { id: 'home-solar-offgrid', name: 'Off-grid home solar', dod: '85%', temp: 'mid', daysPerCycle: 1.1, pa: 0.85, capacityKwh: 30 },
  { id: 'golf-cart', name: 'Golf cart', dod: '75%', temp: 'mid', daysPerCycle: 1.3, pa: 0.75, capacityKwh: 10 },
  { id: 'pallet-trucks', name: 'Pallet trucks', dod: '65%', temp: 'mid', daysPerCycle: 1.5, pa: 0.85, capacityKwh: 2 },
  { id: 'microgrids-pv', name: 'Microgrids with PV', dod: '70%', temp: 'mid', daysPerCycle: 1.42, pa: 0.85, capacityKwh: 48 },
  { id: 'ev-charging-station', name: 'EV charging station', dod: '90%', temp: 'mid', daysPerCycle: 1.1, pa: 0.8, capacityKwh: 48 },
  { id: 'community-self-sufficiency', name: 'Storage for self-sufficiency for local communities', dod: '80%', temp: 'mid', daysPerCycle: 1.25, pa: 0.9, capacityKwh: 48 },
];

// Countries - electricity-related emissions (kg CO2-eq per kWh), Table 3 of the paper.
// New, recycled-content and repurposed values are derived in calculations.js (carbonPerKwh).
export const COUNTRIES = [
  { code: 'PL', name: 'Poland', emission: 39 },
  { code: 'RS', name: 'Serbia', emission: 34 },
  { code: 'CZ', name: 'Czech Republic', emission: 25 },
  { code: 'DE', name: 'Germany', emission: 22 },
  { code: 'IT', name: 'Italy', emission: 20 },
  { code: 'HU', name: 'Hungary', emission: 15 },
  { code: 'PT', name: 'Portugal', emission: 13 },
  { code: 'ES', name: 'Spain', emission: 12 },
  { code: 'SK', name: 'Slovakia', emission: 10 },
  { code: 'BE', name: 'Belgium', emission: 9 },
  { code: 'FR', name: 'France', emission: 6 },
  { code: 'SE', name: 'Sweden', emission: 3 },
  { code: 'NO', name: 'Norway', emission: 2 },
];

// Cost model ($ kWh^-1 and EUR kWh^-1)
export const COST_CONSTANTS = {
  NEW_USD: 96,
  NEW_EUR: 82.57,
  RECYCLED_FACTOR: 0.84, // flat 16% saving
  REPURPOSED_FACTOR_MIN: 0.3, // price factor F range
  REPURPOSED_FACTOR_MAX: 0.75,
  REPURPOSED_FACTOR_DEFAULT: 0.5, // reference F
  USD_TO_EUR: 0.86,
};

// Carbon emissions (kg CO2-eq per kWh of nominal capacity), cut-off allocation for the repurposed battery
export const CARBON_CONSTANTS = {
  NEW_BASE: 47.4,
  RECYCLED_BASE: 30.67, // 47.4 - 4.55 / 0.272
  REPURPOSED: 5.0, // second-life preparation only (dismantling, testing, sorting, repackaging)
};

// Critical metals per kWh of NMC811 battery (Beermann et al., IEA HEV Task 40, 2024)
export const METALS_PER_KWH = {
  nickel: 0.61,
  cobalt: 0.08,
  manganese: 0.07,
  lithium: 0.1,
};

// EU Battery Regulation 2023/1542 recovery targets. Manganese has no target (contained only).
export const RECOVERY_RATES = {
  2027: { nickel: 0.9, cobalt: 0.9, lithium: 0.5 },
  2031: { nickel: 0.95, cobalt: 0.95, lithium: 0.8 },
};

export const METAL_NAMES = {
  nickel: 'Ni',
  cobalt: 'Co',
  manganese: 'Mn',
  lithium: 'Li',
};

// Default MCDA settings: priorities lifetime : cost : CO2 = 3 : 3 : 3, alpha = 0.50
export const DEFAULT_PRIORITIES = { lifetime: 3, cost: 3, carbon: 3 };
export const DEFAULT_ALPHA = 0.5;
