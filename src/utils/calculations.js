import {
  BATTERY_CONSTANTS,
  DEGRADATION_RATE,
  TEMPERATURE_CLASSES,
  COST_CONSTANTS,
  CARBON_CONSTANTS,
  METALS_PER_KWH,
  RECOVERY_RATES,
} from '../data/constants.js';

const { BATTERY_EFFICIENCY: ETA, USABLE_FRACTION_PER_CYCLE: FU, END_OF_LIFE_THRESHOLD: SOH_EOL } = BATTERY_CONSTANTS;
const D = DEGRADATION_RATE;

/* ------------------------------------------------------------------ */
/* Battery condition (seller view) - Eqs. (1)-(3) of the paper         */
/* ------------------------------------------------------------------ */

/** Remaining capacity: C_r = C0 x SOH */
export const calculateRemainingCapacity = (soh, c0 = BATTERY_CONSTANTS.BASE_CAPACITY_KWH) => c0 * soh;

/** Usable capacity per cycle: C_usable = C_r x eta x f_u */
export const calculateUsableCapacity = (remainingCapacity) => remainingCapacity * ETA * FU;

/** Remaining cycle life (cycle ageing only): N_r = (SOH - 0.60) / d */
export const calculateRemainingCycles = (soh) => Math.max(0, (soh - SOH_EOL) / D);

/* ------------------------------------------------------------------ */
/* Cost model ($ kWh^-1)                                               */
/* ------------------------------------------------------------------ */

export const usdToEur = (usd) => usd * (COST_CONSTANTS.NEW_EUR / COST_CONSTANTS.NEW_USD);

export const costNew = () => COST_CONSTANTS.NEW_USD;
export const costRecycled = () => COST_CONSTANTS.NEW_USD * COST_CONSTANTS.RECYCLED_FACTOR;

/** C_repurposed = F x 96 x (SOH_current / 0.80) */
export const costRepurposed = (soh, factor = COST_CONSTANTS.REPURPOSED_FACTOR_DEFAULT) =>
  (factor * COST_CONSTANTS.NEW_USD * soh) / BATTERY_CONSTANTS.SECOND_LIFE_THRESHOLD;

/** Repurposed cost range per kWh (F = 0.30 ... 0.75) and in total for a given capacity */
export const calculateRepurposedCostRange = (soh, capacityKwh, factor = COST_CONSTANTS.REPURPOSED_FACTOR_DEFAULT) => {
  const perKwh = {
    min: costRepurposed(soh, COST_CONSTANTS.REPURPOSED_FACTOR_MIN),
    selected: costRepurposed(soh, factor),
    max: costRepurposed(soh, COST_CONSTANTS.REPURPOSED_FACTOR_MAX),
  };
  const total = {
    min: perKwh.min * capacityKwh,
    selected: perKwh.selected * capacityKwh,
    max: perKwh.max * capacityKwh,
  };
  return { perKwh, total };
};

/* ------------------------------------------------------------------ */
/* Carbon model (kg CO2-eq per kWh of nominal capacity)                */
/* ------------------------------------------------------------------ */

export const carbonPerKwh = (electricityEmission) => ({
  new: CARBON_CONSTANTS.NEW_BASE + electricityEmission,
  recycled: CARBON_CONSTANTS.RECYCLED_BASE + electricityEmission,
  repurposed: CARBON_CONSTANTS.REPURPOSED,
});

/** CO2 saving of a repurposed battery compared with a new one: (E_new - E_repurposed) x capacity */
export const calculateCarbonSaving = (electricityEmission, capacityKwh) => {
  const e = carbonPerKwh(electricityEmission);
  return (e.new - e.repurposed) * capacityKwh;
};

/* ------------------------------------------------------------------ */
/* Critical metals (Beermann et al., EU Battery Regulation 2023/1542)  */
/* ------------------------------------------------------------------ */

/** Contained metals (kg) and metals recovered by recycling (kg) for a given year (2027 or 2031). Mn: contained only. */
export const calculateMetals = (capacityKwh, year = 2027) => {
  const contained = {};
  const recovered = {};
  Object.keys(METALS_PER_KWH).forEach((metal) => {
    contained[metal] = capacityKwh * METALS_PER_KWH[metal];
    const rate = RECOVERY_RATES[year]?.[metal];
    recovered[metal] = rate === undefined ? null : contained[metal] * rate;
  });
  return { contained, recovered };
};

/* ------------------------------------------------------------------ */
/* Lifetime (combined cycle + calendar ageing)                         */
/* ------------------------------------------------------------------ */

/** Cycles per year: n_app = 365 / (days per cycle), or the fixed value (12 or 52) */
export const cyclesPerYear = (app) => (app.nApp !== undefined ? app.nApp : 365 / app.daysPerCycle);

/**
 * t_life = (SOH_start - 0.60) / (d x n_app + k_cal) [years]
 * p_a multiplies the repurposed lifetime when 0.60 < SOH < 0.70 (p_a = 1 otherwise).
 * kCal: 'ref' (midpoint), 'min' or 'max'.
 */
export const lifetimeYears = (app, sohStart, kCal = 'ref', applyPa = true) => {
  if (sohStart <= SOH_EOL) return 0;
  const k = TEMPERATURE_CLASSES[app.temp][kCal];
  const t = (sohStart - SOH_EOL) / (D * cyclesPerYear(app) + k);
  const pa = applyPa && sohStart < BATTERY_CONSTANTS.LOW_SOH_THRESHOLD ? app.pa : 1;
  return t * pa;
};

/** Lifetime of a second-life battery: reference value and range (high k_cal -> short, low k_cal -> long) */
export const secondLifeLifetime = (app, soh) => {
  if (soh <= SOH_EOL) {
    return { recycle: true, years: 0, minYears: 0, maxYears: 0, cycles: 0 };
  }
  const years = lifetimeYears(app, soh, 'ref');
  const t1 = lifetimeYears(app, soh, 'min');
  const t2 = lifetimeYears(app, soh, 'max');
  return {
    recycle: false,
    years,
    minYears: Math.min(t1, t2),
    maxYears: Math.max(t1, t2),
    cycles: cyclesPerYear(app) * years, // N = n_app x t_life
  };
};

/** Lifetime of a new (virgin) or recycled-content battery (SOH_start = 1.00); same for both */
export const newBatteryLifetime = (app) => {
  const years = lifetimeYears(app, 1.0, 'ref');
  return {
    years,
    minYears: lifetimeYears(app, 1.0, 'max'),
    maxYears: lifetimeYears(app, 1.0, 'min'),
    cycles: cyclesPerYear(app) * years,
  };
};

/* ------------------------------------------------------------------ */
/* Lifetime usable energy                                              */
/* ------------------------------------------------------------------ */

/** E_life / C0 = eta x f_u x N x (SOH_start + 0.60) / 2   [kWh per kWh of nominal capacity] */
export const lifetimeEnergyPerKwh = (cycles, sohStart) => (ETA * FU * cycles * (sohStart + SOH_EOL)) / 2;

/** E_life = C0 x eta x f_u x N x (SOH_start + 0.60) / 2   [kWh] */
export const lifetimeEnergy = (c0, cycles, sohStart) => c0 * lifetimeEnergyPerKwh(cycles, sohStart);

/* ------------------------------------------------------------------ */
/* Application matching (seller view)                                  */
/* ------------------------------------------------------------------ */

/** Applications with their second-life lifetime at the given SOH (percent), longest first */
export const findMatchingApplications = (applications, sohPercent) => {
  const soh = sohPercent / 100;
  return applications
    .map((app) => ({ ...app, lifetime: secondLifeLifetime(app, soh) }))
    .sort((a, b) => b.lifetime.years - a.lifetime.years);
};

/* ------------------------------------------------------------------ */
/* MCDA: entropy + user hybrid weighting                               */
/* ------------------------------------------------------------------ */

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/** Benefit: r = x / sum(x); cost-type: r = (1/x) / sum(1/x) */
export const normalizeColumn = (values, type) => {
  const x = type === 'cost' ? values.map((v) => 1 / v) : values;
  const total = sum(x);
  return x.map((v) => v / total);
};

/** Entropy weights: E_j = -(1/ln m) sum r ln r ; d_j = 1 - E_j ; w_j = d_j / sum d */
export const entropyWeights = (columns) => {
  const m = columns[0].length;
  const k = 1 / Math.log(m);
  const divergence = columns.map((col) => 1 - -k * sum(col.map((p) => (p > 0 ? p * Math.log(p) : 0))));
  const total = sum(divergence);
  return divergence.map((d) => d / total);
};

/** Hybrid weights: w = alpha x w_entropy + (1 - alpha) x w_user, w_user = s / sum(s) */
export const hybridWeights = (wEntropy, userScores, alpha) => {
  const total = sum(userScores);
  if (total === 0) return wEntropy;
  const wUser = userScores.map((s) => s / total);
  return wEntropy.map((we, i) => alpha * we + (1 - alpha) * wUser[i]);
};

/**
 * Rank options. Each option needs lifetime (E_life / C0), cost ($ kWh^-1) and carbon (kg CO2-eq kWh^-1).
 * priorities = { lifetime, cost, carbon } (0-5). Column order of weights: lifetime, cost, carbon.
 * Options with `rankable === false` (e.g. repurposed at SOH <= 60%) are not ranked.
 */
export const rankOptions = (options, priorities, alpha) => {
  const ranked = options.filter((o) => o.rankable !== false);
  if (ranked.length < 2) {
    return { ranked: ranked.map((o) => ({ ...o, score: 1 })), entropy: null, weights: null, userWeights: null };
  }
  const norm = [
    normalizeColumn(ranked.map((o) => o.lifetime), 'benefit'),
    normalizeColumn(ranked.map((o) => o.cost), 'cost'),
    normalizeColumn(ranked.map((o) => o.carbon), 'cost'),
  ];
  const wEntropy = entropyWeights(norm);
  const userScores = [priorities.lifetime, priorities.cost, priorities.carbon];
  const weights = hybridWeights(wEntropy, userScores, alpha);
  const scored = ranked
    .map((o, i) => ({
      ...o,
      score: weights[0] * norm[0][i] + weights[1] * norm[1][i] + weights[2] * norm[2][i],
      normalized: { lifetime: norm[0][i], cost: norm[1][i], carbon: norm[2][i] },
    }))
    .sort((a, b) => b.score - a.score);
  const totalUser = sum(userScores);
  return {
    ranked: scored,
    entropy: wEntropy,
    weights,
    userWeights: totalUser === 0 ? null : userScores.map((s) => s / totalUser),
    norm,
  };
};

/* ------------------------------------------------------------------ */
/* Buyer view: build the three options for an application              */
/* ------------------------------------------------------------------ */

/**
 * Build the three options (new, recycled-content, repurposed) for the buyer.
 * soh: second-life entry SOH as a fraction (reference 0.80); factor: price factor F.
 */
export const buildBuyerOptions = (app, country, factor, soh = BATTERY_CONSTANTS.SECOND_LIFE_THRESHOLD) => {
  const e = carbonPerKwh(country.emission);
  const second = secondLifeLifetime(app, soh);
  const fresh = newBatteryLifetime(app);
  const capacity = app.capacityKwh;

  const eNew = lifetimeEnergyPerKwh(fresh.cycles, 1.0);
  const eRep = second.recycle ? 0 : lifetimeEnergyPerKwh(second.cycles, soh);

  const make = (key, costUsd, carbon, life, energyPerKwh, rankable = true) => ({
    key,
    cost: costUsd, // $ kWh^-1
    costEur: usdToEur(costUsd),
    totalCostUsd: costUsd * capacity,
    totalCostEur: usdToEur(costUsd) * capacity,
    carbon, // kg CO2-eq kWh^-1
    totalCarbon: carbon * capacity, // kg CO2-eq
    lifetime: energyPerKwh, // E_life / C0 (kWh per kWh), the MCDA lifetime criterion
    years: life.years,
    minYears: life.minYears,
    maxYears: life.maxYears,
    cycles: life.cycles,
    energyTotal: energyPerKwh * capacity, // E_life for the required capacity (kWh)
    costPerDeliveredKwh: energyPerKwh > 0 ? costUsd / energyPerKwh : null,
    carbonPerDeliveredKwh: energyPerKwh > 0 ? carbon / energyPerKwh : null,
    effectiveCapacity: capacity * ETA * FU,
    rankable,
  });

  return [
    make('new', costNew(), e.new, fresh, eNew),
    make('recycled', costRecycled(), e.recycled, fresh, eNew),
    make('repurposed', costRepurposed(soh, factor), e.repurposed, second, eRep, !second.recycle),
  ];
};

/** Price factor F below which a repurposed battery is cheaper than a new one per delivered kWh */
export const breakEvenFactor = (eRepurposedPerKwh, eNewPerKwh) => eRepurposedPerKwh / eNewPerKwh;
