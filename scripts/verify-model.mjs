// Run with:  node scripts/verify-model.mjs
// Checks the website model against the test values of the revised manuscript (Tables 3, 5, 6, 8, 9).
import { APPLICATIONS, COUNTRIES } from '../src/data/constants.js';
import {
  buildBuyerOptions, rankOptions, secondLifeLifetime, newBatteryLifetime, lifetimeEnergyPerKwh, lifetimeEnergy,
  lifetimeYears, calculateRemainingCapacity, calculateUsableCapacity, calculateRemainingCycles, calculateMetals,
  calculateCarbonSaving, breakEvenFactor, costRepurposed, carbonPerKwh,
} from '../src/utils/calculations.js';

let fail = 0;
const check = (name, got, want, tol) => {
  const ok = typeof want === 'number' ? Math.abs(got - want) <= tol : got === want;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${typeof got === 'number' ? got.toFixed(4) : got}, expected ${want}`);
};
const app = (id) => APPLICATIONS.find((a) => a.id === id);
const fr = COUNTRIES.find((c) => c.code === 'FR');
const res = app('residential-household');

// Table 5: lifetimes (reference and range)
const table5 = {
  'residential-household': [4.0, 3.3, 4.9], 'pv-ev-charging': [2.2, 1.6, 3.6], 'short-range-evs': [2.0, 1.5, 3.0],
  'telecom-backups': [9.4, 6.4, 17.9], 'light-duty-forklifts': [2.1, 1.6, 3.4], 'electric-wheel-loader-drive': [1.5, 1.1, 1.5],
  'frequency-regulation-storage': [5.2, 4.1, 7.1], 'power-regulation-storage': [4.8, 3.9, 6.4], 'microgrids-wind': [2.2, 1.6, 3.6],
  'electric-wheel-chairs': [7.9, 5.7, 13.2], ups: [9.4, 6.4, 17.9], 'industrial-load-following': [2.3, 1.6, 3.8],
  'home-solar-offgrid': [2.0, 1.5, 3.2], 'golf-cart': [2.1, 1.6, 3.4], 'pallet-trucks': [2.2, 1.6, 3.7],
  'microgrids-pv': [2.2, 1.6, 3.6], 'ev-charging-station': [2.0, 1.5, 3.2], 'community-self-sufficiency': [2.1, 1.5, 3.4],
};
Object.entries(table5).forEach(([id, [ref, lo, hi]]) => {
  const l = secondLifeLifetime(app(id), 0.8);
  check(`Table 5 ${id} ref`, +l.years.toFixed(1), ref, 0.001);
  check(`Table 5 ${id} min`, +l.minYears.toFixed(1), lo, 0.001);
  check(`Table 5 ${id} max`, +l.maxYears.toFixed(1), hi, 0.001);
});

// Lifetime checks
const l80 = secondLifeLifetime(res, 0.8);
check('Residential 80% -> 60%: years', l80.years, 4.0, 0.05);
check('Residential cycles N', l80.cycles, 1207, 1);
check('Residential at 61% SOH (p_a = 0.95)', secondLifeLifetime(res, 0.61).years, 0.19, 0.005);
check('Residential at 70% SOH (p_a = 1)', secondLifeLifetime(res, 0.7).years, 2.0, 0.05);
check('SOH <= 60% -> recycling', secondLifeLifetime(res, 0.6).recycle, true);

// Seller outputs, 60 kWh pack at 80% SOH
check('Remaining capacity', calculateRemainingCapacity(0.8), 48, 1e-9);
check('Usable capacity', calculateUsableCapacity(calculateRemainingCapacity(0.8)), 34.56, 1e-9);
check('Remaining cycles', calculateRemainingCycles(0.8), 2000, 0.01);

// Lifetime energy
const eNew = lifetimeEnergyPerKwh(newBatteryLifetime(res).cycles, 1.0);
const eRep = lifetimeEnergyPerKwh(l80.cycles, 0.8);
check('E_life / C0 new (virgin)', eNew, 1390, 1);
check('E_life / C0 repurposed', eRep, 608, 1);
check('E_life repurposed, 60 kWh', lifetimeEnergy(60, l80.cycles, 0.8), 36500, 100);
APPLICATIONS.forEach((a) => {
  const r = lifetimeEnergyPerKwh(secondLifeLifetime(a, 0.8).cycles, 0.8) / lifetimeEnergyPerKwh(newBatteryLifetime(a).cycles, 1.0);
  check(`Repurposed / new energy ratio, ${a.id}`, r, 0.4375, 1e-6);
});

// Cost and carbon
const opts = buildBuyerOptions(res, fr, 0.5);
check('Cost new', opts[0].cost, 96, 1e-9);
check('Cost recycled-content', opts[1].cost, 80.64, 1e-9);
check('Cost repurposed (F = 0.50)', opts[2].cost, 48, 1e-9);
check('Carbon new, France', opts[0].carbon, 53.4, 1e-9);
check('Carbon recycled-content, France', opts[1].carbon, 36.67, 1e-9);
check('Carbon repurposed', opts[2].carbon, 5.0, 1e-9);
check('CO2 saving France 60 kWh', calculateCarbonSaving(fr.emission, 60), 2904, 0.5);
check('Country table: Poland new', carbonPerKwh(39).new, 86.4, 1e-9);
check('Country table: Italy new', carbonPerKwh(20).new, 67.4, 1e-9);
check('Country table: Norway recycled', +carbonPerKwh(2).recycled.toFixed(1), 32.7, 1e-9);

// MCDA - balanced 3:3:3
const bal = rankOptions(opts, { lifetime: 3, cost: 3, carbon: 3 }, 0.5);
const byKey = (r, k) => r.ranked.find((o) => o.key === k).score;
check('Entropy weight lifetime', bal.entropy[0], 0.099, 0.0006);
check('Entropy weight cost', bal.entropy[1], 0.077, 0.0006);
check('Entropy weight carbon', bal.entropy[2], 0.823, 0.0006);
check('Hybrid weight lifetime (3:3:3)', bal.weights[0], 0.216, 0.0006);
check('Hybrid weight cost (3:3:3)', bal.weights[1], 0.205, 0.0006);
check('Hybrid weight carbon (3:3:3)', bal.weights[2], 0.578, 0.0006);
check('Score new (balanced)', byKey(bal, 'new'), 0.182, 0.0006);
check('Score recycled-content (balanced)', byKey(bal, 'recycled'), 0.211, 0.0006);
check('Score repurposed (balanced)', byKey(bal, 'repurposed'), 0.607, 0.0006);
check('Balanced winner', bal.ranked[0].key, 'repurposed');

// Cost-focused 1:5:1
const cf = rankOptions(opts, { lifetime: 1, cost: 5, carbon: 1 }, 0.5);
check('Hybrid weight lifetime (1:5:1)', cf.weights[0], 0.121, 0.0006);
check('Hybrid weight cost (1:5:1)', cf.weights[1], 0.396, 0.0006);
check('Hybrid weight carbon (1:5:1)', cf.weights[2], 0.483, 0.0006);
check('Score new (cost-focused)', byKey(cf, 'new'), 0.181, 0.0006);
check('Score recycled-content (cost-focused)', byKey(cf, 'recycled'), 0.216, 0.0006);
check('Score repurposed (cost-focused)', byKey(cf, 'repurposed'), 0.603, 0.0006);

// F sweep
[[0.3, 0.623], [0.45, 0.609], [0.6, 0.604], [0.75, 0.599]].forEach(([f, want]) => {
  const r = rankOptions(buildBuyerOptions(res, fr, f), { lifetime: 3, cost: 3, carbon: 3 }, 0.5);
  check(`Repurposed score, F = ${f}`, byKey(r, 'repurposed'), want, 0.0006);
});

// 61% SOH: lifetime criterion 25.0; cost and carbon held at the 80% reference values
const l61 = secondLifeLifetime(res, 0.61);
const e61 = lifetimeEnergyPerKwh(l61.cycles, 0.61);
check('Lifetime criterion at 61% SOH', e61, 25.0, 0.1);
const o61 = rankOptions(
  [{ ...opts[0] }, { ...opts[1] }, { ...opts[2], lifetime: e61 }],
  { lifetime: 3, cost: 3, carbon: 3 }, 0.5);
check('Entropy weight lifetime (61%)', o61.entropy[0], 0.402, 0.0006);
check('Entropy weight cost (61%)', o61.entropy[1], 0.051, 0.0006);
check('Entropy weight carbon (61%)', o61.entropy[2], 0.547, 0.0006);
check('Score new (61%)', byKey(o61, 'new'), 0.262, 0.0006);
check('Score recycled-content (61%)', byKey(o61, 'recycled'), 0.286, 0.0006);
check('Score repurposed (61%)', byKey(o61, 'repurposed'), 0.453, 0.0006);

// Lifetime-focused 5:1:1, alpha = 0
const lf = rankOptions(opts, { lifetime: 5, cost: 1, carbon: 1 }, 0);
check('Lifetime-focused 5:1:1, alpha = 0 winner', lf.ranked[0].key, 'recycled');

// Per delivered kWh
check('Cost per delivered kWh, new', opts[0].costPerDeliveredKwh, 0.069, 0.0006);
check('Cost per delivered kWh, recycled-content', opts[1].costPerDeliveredKwh, 0.058, 0.0006);
check('Cost per delivered kWh, repurposed', opts[2].costPerDeliveredKwh, 0.079, 0.0006);
check('Cost per delivered kWh, repurposed F = 0.75', buildBuyerOptions(res, fr, 0.75)[2].costPerDeliveredKwh, 0.118, 0.0006);
check('Carbon per delivered kWh, new', opts[0].carbonPerDeliveredKwh, 0.038, 0.0006);
check('Carbon per delivered kWh, recycled-content', opts[1].carbonPerDeliveredKwh, 0.026, 0.0006);
check('Carbon per delivered kWh, repurposed', opts[2].carbonPerDeliveredKwh, 0.008, 0.0006);
check('Break-even F', breakEvenFactor(eRep, eNew), 0.44, 0.005);

// Critical metals, 60 kWh pack
const m27 = calculateMetals(60, 2027);
check('Contained Ni', m27.contained.nickel, 36.6, 0.05);
check('Contained Co', m27.contained.cobalt, 4.8, 0.05);
check('Contained Mn', m27.contained.manganese, 4.2, 0.05);
check('Contained Li', m27.contained.lithium, 6.0, 0.05);
check('Recovered Ni 2027', m27.recovered.nickel, 32.9, 0.05);
check('Recovered Co 2027', m27.recovered.cobalt, 4.3, 0.05);
check('Recovered Li 2027', m27.recovered.lithium, 3.0, 0.05);
check('Mn has no recovery target', m27.recovered.manganese, null);

// Progressive cost curve
check('Repurposed cost F = 0.75 at 80% SOH', costRepurposed(0.8, 0.75), 72, 1e-9);
check('Repurposed cost F = 0.75 at 60% SOH', costRepurposed(0.6, 0.75), 54, 1e-9);
check('Repurposed cost range min (F = 0.30)', costRepurposed(0.8, 0.3), 28.8, 1e-9);

console.log(fail === 0 ? '\nAll checks passed.' : `\n${fail} check(s) FAILED.`);
process.exit(fail === 0 ? 0 : 1);
