import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { ArrowLeft, Battery, DollarSign, Leaf, TrendingUp, AlertCircle, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MetalsTable from '@/utils/MetalsTable';
import {
  calculateRemainingCapacity,
  calculateUsableCapacity,
  calculateRemainingCycles,
  calculateRepurposedCostRange,
  calculateCarbonSaving,
  carbonPerKwh,
  costRepurposed,
  findMatchingApplications,
  usdToEur,
} from '@/utils/calculations';
import {
  COUNTRIES,
  APPLICATIONS,
  BATTERY_CONSTANTS,
  COST_CONSTANTS,
} from '@/data/constants';

const labelStyle = { fontFamily: 'DM Sans, sans-serif' };
const headStyle = { fontFamily: 'Outfit, sans-serif' };
const money = (v) => Math.round(v).toLocaleString('en-US');

export default function SellFlow() {
  const [soh, setSoh] = useState(80);
  const [country, setCountry] = useState('DE');
  const [factor, setFactor] = useState(COST_CONSTANTS.REPURPOSED_FACTOR_DEFAULT);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const c0 = BATTERY_CONSTANTS.BASE_CAPACITY_KWH;
  const selectedCountry = COUNTRIES.find((c) => c.code === country);
  const sohFraction = soh / 100;
  const remainingCapacity = calculateRemainingCapacity(sohFraction, c0);
  const usableCapacity = calculateUsableCapacity(remainingCapacity);
  const remainingCycles = calculateRemainingCycles(sohFraction);
  const costRange = calculateRepurposedCostRange(sohFraction, remainingCapacity, factor);
  const matchingApps = findMatchingApplications(APPLICATIONS, soh);
  const emissions = carbonPerKwh(selectedCountry.emission);
  const carbonSaving = calculateCarbonSaving(selectedCountry.emission, c0);

  // Recycling is recommended when SOH is at or below the 60% end-of-life threshold
  const canRepurpose = sohFraction > BATTERY_CONSTANTS.END_OF_LIFE_THRESHOLD;

  // Chart data
  const sohAxis = [];
  for (let s = 100; s >= 60; s -= 2) sohAxis.push(s);
  const costAxis = [];
  for (let s = 80; s >= 60; s -= 2) costAxis.push(s);
  const factorsShown = Array.from(new Set([COST_CONSTANTS.REPURPOSED_FACTOR_MIN, factor, COST_CONSTANTS.REPURPOSED_FACTOR_MAX]))
    .sort((a, b) => a - b);

  const metalsNotes = (
    <p className="text-sm text-[#525252] mt-4 italic" style={labelStyle}>
        * Inventory per kWh of NMC811 battery: Ni 0.61, Co 0.08, Mn 0.07, Li 0.10 kg (Beermann et al., IEA HEV Task 40,
        2024). Recovered = contained × recovery rate (EU Battery Regulation 2023/1542: Ni and Co 90%, Li 50% by end-2027;
        Ni and Co 95%, Li 80% by end-2031; no target for Mn). 100% recovery is never assumed. Metals are shown for
        information only.
    </p>
  );

  const repurposedMetalsNote = (
    <p className="text-sm text-[#525252] mt-2 italic" style={labelStyle}>
      * Repurposed battery: metals stay in use; second-life use may avoid or delay the manufacture of a new battery.
    </p>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <Link to="/" className="inline-flex items-center text-[#525252] hover:text-[#00C853] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span style={labelStyle}>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] mb-4" style={headStyle}>
              Sell / Reuse Battery
            </h1>
            <p className="text-lg text-[#525252]" style={labelStyle}>
              Calculate your battery's remaining value and matching applications
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-white border border-[#E5E7EB] p-5 md:p-10 shadow-lg mb-8">
            <div className="space-y-8">
              {/* SOH Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-[#0A0A0A]" style={labelStyle}>
                    Battery State of Health (SOH)
                  </label>
                  <span className="text-3xl font-bold text-[#00C853]" style={headStyle}>
                    {soh}%
                  </span>
                </div>
                <Slider
                  aria-label="Battery state of health"
                  data-testid="soh-slider"
                  value={[soh]}
                  onValueChange={(value) => {
                    setSoh(value[0]);
                    setShowResults(false);
                  }}
                  min={55}
                  max={80}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[#A3A3A3] mt-2" style={labelStyle}>
                  <span>55%</span>
                  <span>80%</span>
                </div>
                <p className="text-sm text-[#525252] mt-3" style={labelStyle}>
                  SOH represents the current health of your battery compared to its original capacity ({c0} kWh
                  nominal). At or below 60% SOH, recycling is recommended.
                </p>
              </div>

              {/* Price factor */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-medium text-[#0A0A0A]" style={labelStyle}>
                    Price factor F (share of the new-battery price)
                  </label>
                  <span className="text-3xl font-bold text-[#00C853]" style={headStyle}>
                    {factor.toFixed(2)}
                  </span>
                </div>
                <Slider
                  aria-label="Price factor F"
                  data-testid="factor-slider"
                  value={[factor]}
                  onValueChange={(value) => {
                    setFactor(Number(value[0].toFixed(2)));
                    setShowResults(false);
                  }}
                  min={COST_CONSTANTS.REPURPOSED_FACTOR_MIN}
                  max={COST_CONSTANTS.REPURPOSED_FACTOR_MAX}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[#A3A3A3] mt-2" style={labelStyle}>
                  <span>0.30</span>
                  <span>0.75</span>
                </div>
                <p className="text-sm text-[#525252] mt-3" style={labelStyle}>
                  Reference F = 0.50 (48.0 $ kWh⁻¹ at 80% SOH). The actual market value depends on battery condition,
                  refurbishment requirements and regional market conditions.
                </p>
              </div>

              {/* Country Selection */}
              <div>
                <label className="text-lg font-medium text-[#0A0A0A] mb-3 block" style={labelStyle}>
                  Select Country
                </label>
                <Select value={country} onValueChange={(value) => { setCountry(value); setShowResults(false); }}>
                  <SelectTrigger data-testid="country-select" className="w-full h-12 bg-[#F5F7F5] border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-[#525252] mt-3" style={labelStyle}>
                  Electricity emissions vary by country and affect environmental impact calculations
                </p>
              </div>

              {/* Calculate Button */}
              <Button
                data-testid="calculate-btn"
                onClick={handleCalculate}
                className="w-full bg-[#00C853] text-white hover:bg-[#009624] h-14 text-lg font-medium rounded-full"
              >
                Calculate Results
              </Button>
            </div>
          </Card>

          {/* Recycling recommended for SOH <= 60% */}
          {showResults && !canRepurpose && (
            <>
              <Alert className="mb-8 border-[#FF3D00] bg-[#FF3D00]/5">
                <AlertCircle className="h-5 w-5 text-[#FF3D00]" />
                <AlertDescription className="text-[#FF3D00] font-medium" style={labelStyle}>
                  Recycling recommended. At or below the 60% SOH end-of-life threshold no second-life application is
                  recommended.
                </AlertDescription>
              </Alert>
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
                  <Recycle className="w-7 h-7 mr-2 text-[#00C853]" />
                  Critical Metals and Recycling Recovery Potential
                </h2>
                <MetalsTable capacityKwh={c0} />
                {metalsNotes}
              </Card>
            </>
          )}

          {/* Results */}
          {showResults && canRepurpose && (
            <div className="space-y-8">
              {/* Capacity Info */}
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6" style={headStyle}>
                  Battery Condition
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#F5F7F5] p-4 md:p-6 rounded-lg">
                    <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                      Remaining Capacity
                    </div>
                    <div className="text-3xl font-bold text-[#0A0A0A]" style={headStyle}>
                      {remainingCapacity.toFixed(1)} kWh
                    </div>
                    <div className="text-xs text-[#525252] mt-2" style={labelStyle}>
                      C<sub>r</sub> = C<sub>0</sub> × SOH
                    </div>
                  </div>
                  <div className="bg-[#F5F7F5] p-4 md:p-6 rounded-lg">
                    <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                      Usable Capacity per Cycle
                    </div>
                    <div className="text-3xl font-bold text-[#00C853]" style={headStyle}>
                      {usableCapacity.toFixed(2)} kWh
                    </div>
                    <div className="text-xs text-[#525252] mt-2" style={labelStyle}>
                      C<sub>r</sub> × η (0.9) × f<sub>u</sub> (0.8)
                    </div>
                  </div>
                  <div className="bg-[#F5F7F5] p-4 md:p-6 rounded-lg">
                    <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                      Remaining Cycle Life
                    </div>
                    <div className="text-3xl font-bold text-[#0A0A0A]" style={headStyle}>
                      {Math.round(remainingCycles).toLocaleString('en-US')} cycles
                    </div>
                    <div className="text-xs text-[#525252] mt-2" style={labelStyle}>
                      (SOH − 0.60) / d, cycle ageing only (d = 0.0001 per cycle)
                    </div>
                  </div>
                </div>

                {/* Remaining capacity chart */}
                <div className="mt-8">
                  <Plot
                    data={[
                      {
                        x: sohAxis,
                        y: sohAxis.map((s) => calculateRemainingCapacity(s / 100, c0)),
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Remaining capacity',
                        line: { color: '#00C853' },
                      },
                      {
                        x: [soh],
                        y: [remainingCapacity],
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Your battery',
                        marker: { color: '#0A0A0A', size: 10 },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 340,
                      margin: { l: 60, r: 20, t: 20, b: 90 },
                      xaxis: { title: { text: 'State of health (SOH, %)' }, autorange: 'reversed' },
                      yaxis: { title: { text: 'Remaining capacity (kWh)' } },
                      legend: { orientation: 'h', y: -0.35, yanchor: 'top' },
                    }}
                    config={{ displayModeBar: false }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>
              </Card>

              {/* Resale Cost */}
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
                  <DollarSign className="w-7 h-7 mr-2 text-[#00C853]" />
                  Economic Value (Repurposed Battery)
                </h2>
                <div className="bg-gradient-to-r from-[#F5F7F5] to-white p-4 md:p-8 rounded-lg border-l-4 border-[#00C853]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-[#A3A3A3] tracking-wider mb-2" style={labelStyle}>
                        Cost per kWh (F = {factor.toFixed(2)})
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-[#0A0A0A]" style={headStyle}>
                        ${costRange.perKwh.selected.toFixed(1)} <span className="text-lg md:text-xl font-medium">kWh⁻¹</span>
                      </div>
                      <div className="text-sm text-[#525252] mt-1" style={labelStyle}>
                        (€{usdToEur(costRange.perKwh.selected).toFixed(1)} kWh⁻¹) · range ${costRange.perKwh.min.toFixed(1)}–${costRange.perKwh.max.toFixed(1)} kWh⁻¹ (F = 0.30–0.75)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[#A3A3A3] tracking-wider mb-2" style={labelStyle}>
                        Total value ({remainingCapacity.toFixed(1)} kWh)
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-[#0A0A0A]" style={headStyle}>
                        ${money(costRange.total.selected)}
                      </div>
                      <div className="text-sm text-[#525252] mt-1" style={labelStyle}>
                        (€{money(usdToEur(costRange.total.selected))}) · range ${money(costRange.total.min)}–${money(costRange.total.max)} (€{money(usdToEur(costRange.total.min))}–€{money(usdToEur(costRange.total.max))})
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#525252] mt-6 italic" style={labelStyle}>
                    * Repurposed-battery cost is reported as a range corresponding to 30–75% of the new-battery cost;
                    the actual market value depends on battery condition, refurbishment requirements and regional
                    market conditions.
                  </p>
                </div>

                {/* Progressive second-life cost chart */}
                <div className="mt-8">
                  <Plot
                    data={factorsShown.map((f) => ({
                      x: costAxis,
                      y: costAxis.map((s) => costRepurposed(s / 100, f)),
                      type: 'scatter',
                      mode: 'lines',
                      name: `F = ${f.toFixed(2)}${f === factor ? ' (selected)' : ''}`,
                      line: { width: f === factor ? 4 : 2, dash: f === factor ? 'solid' : 'dot' },
                    }))}
                    layout={{
                      autosize: true,
                      height: 340,
                      margin: { l: 60, r: 20, t: 20, b: 100 },
                      xaxis: { title: { text: 'SOH during second life (%)' }, autorange: 'reversed' },
                      yaxis: { title: { text: 'Repurposed cost ($ kWh⁻¹)' } },
                      legend: { orientation: 'h', y: -0.35, yanchor: 'top' },
                    }}
                    config={{ displayModeBar: false }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>
              </Card>

              {/* Environmental Impact */}
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
                  <Leaf className="w-7 h-7 mr-2 text-[#00C853]" />
                  Environmental Impact (Repurposed vs New)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                    <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                      CO₂ Emissions Avoided Compared with a New Battery
                    </div>
                    <div className="text-3xl font-bold text-[#00C853]" style={headStyle}>
                      {carbonSaving.toLocaleString('en-US', { maximumFractionDigits: 0 })} kg CO₂-eq
                    </div>
                    <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                      ({emissions.new.toFixed(1)} − {emissions.repurposed.toFixed(1)}) kg CO₂-eq kWh⁻¹ × {c0} kWh nominal capacity, {selectedCountry.name}
                    </div>
                    <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                      Emission factors follow Table 3 of the accompanying paper.
                    </div>
                  </div>
                  <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                    <div className="text-sm text-[#A3A3A3] tracking-wider mb-2" style={labelStyle}>
                      Emission factors (kg CO₂-eq kWh⁻¹)
                    </div>
                    <div className="text-sm text-[#525252]" style={labelStyle}>
                      New (virgin): {emissions.new.toFixed(1)}<br />
                      Recycled-content: {emissions.recycled.toFixed(1)}<br />
                      Repurposed: {emissions.repurposed.toFixed(1)}
                    </div>
                    <p className="text-xs text-[#525252] mt-3 italic" style={labelStyle}>
                      Repurposed-battery emissions include only the second-life preparation processes (dismantling,
                      electrical testing, sorting, repackaging); the original manufacturing burden is allocated to the
                      first automotive life.
                    </p>
                  </div>
                  <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853] md:col-span-2">
                    <div className="text-sm text-[#525252]" style={labelStyle}>
                      Scenario: for 100 batteries of this size, the model gives a CO₂ difference of about{' '}
                      {((carbonSaving * 100) / 1000).toFixed(0)} t CO₂-eq compared with new batteries (cut-off allocation).
                    </div>
                  </div>
                </div>
              </Card>

              {/* Critical Metals */}
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
                  <Recycle className="w-7 h-7 mr-2 text-[#00C853]" />
                  Critical Metals and Recycling Recovery Potential
                </h2>
                <MetalsTable capacityKwh={c0} />
                {metalsNotes}
                {repurposedMetalsNote}
              </Card>

              {/* Matching Applications */}
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
                  <TrendingUp className="w-7 h-7 mr-2 text-[#00C853]" />
                  Matching Second-Life Applications
                </h2>
                {matchingApps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchingApps.map((app) => (
                      <div
                        key={app.id}
                        data-testid={`app-${app.id}`}
                        className="bg-[#F5F7F5] p-4 md:p-6 rounded-lg hover:shadow-lg transition-shadow border-l-4 border-[#00C853]"
                      >
                        <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2" style={headStyle}>
                          {app.name}
                        </h3>
                        <p className="text-sm text-[#525252] mb-4" style={labelStyle}>
                          Typical DOD (information only): {app.dod}
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs text-[#A3A3A3] uppercase tracking-wider" style={labelStyle}>
                              Lifetime, scenario-based estimate
                            </div>
                            <div className="text-2xl font-bold text-[#00C853]" style={headStyle}>
                              {app.lifetime.years.toFixed(1)} years
                            </div>
                            <div className="text-xs text-[#525252] mt-1" style={labelStyle}>
                              Range {app.lifetime.minYears.toFixed(1)}–{app.lifetime.maxYears.toFixed(1)} years ·
                              ≈ {Math.round(app.lifetime.cycles).toLocaleString('en-US')} cycles
                            </div>
                          </div>
                          <Battery className="w-10 h-10 text-[#00C853]/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#525252]" style={labelStyle}>
                    No matching applications found for this battery.
                  </p>
                )}
                <p className="text-sm text-[#525252] mt-6 italic" style={labelStyle}>
                  * Lifetime is the time from the selected SOH to 60% SOH, combining cycle and calendar ageing; it is a
                  scenario-based estimate, not a predicted service life. Below 70% SOH the low-SOH coefficient p<sub>a</sub> of the
                  application is applied. The typical DOD of each application is shown for information; the energy
                  calculation uses a usable fraction of 0.8, and the direct effect of DOD on degradation is not
                  modelled.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
