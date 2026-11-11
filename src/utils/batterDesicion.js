import React, { useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { DollarSign, Leaf, Battery, Clock, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EVBatteryOutlookTable from "./EVBatteryOutlookTable";
import MetalsTable from "./MetalsTable";
import {
  buildBuyerOptions,
  rankOptions,
  breakEvenFactor,
} from "./calculations";
import {
  OPTION_LABELS,
  OPTION_TOOLTIPS,
  DEFAULT_PRIORITIES,
  DEFAULT_ALPHA,
  COST_CONSTANTS,
  BATTERY_CONSTANTS,
} from "@/data/constants";

/* ---------------------- CONFIG ---------------------- */

const colorMap = {
  new: "red",
  recycled: "yellow",
  repurposed: "green",
};

const fmt = (v, d = 1) => (v === null || v === undefined || Number.isNaN(v) ? "–" : Number(v).toFixed(d));
const fmtInt = (v) => (v === null || v === undefined || Number.isNaN(v) ? "–" : Math.round(v).toLocaleString("en-US"));

const labelStyle = { fontFamily: "DM Sans, sans-serif" };
const headStyle = { fontFamily: "Outfit, sans-serif" };

/* ---------------------- COMPONENT ---------------------- */

export default function BatteryNetworkGraph({ application, country }) {
  const [life, setLife] = useState(DEFAULT_PRIORITIES.lifetime);
  const [cost, setCost] = useState(DEFAULT_PRIORITIES.cost);
  const [carbon, setCarbon] = useState(DEFAULT_PRIORITIES.carbon);
  const [alpha, setAlpha] = useState(DEFAULT_ALPHA);
  const [factor, setFactor] = useState(COST_CONSTANTS.REPURPOSED_FACTOR_DEFAULT);
  const [displayCaculation, setDisplayCalculation] = useState(false);

  const priorities = { lifetime: life, cost, carbon };

  /* options for the selected application, country and price factor F */
  const options = useMemo(
    () => buildBuyerOptions(application, country, factor),
    [application, country, factor]
  );
  const ranking = useMemo(() => rankOptions(options, priorities, alpha), [options, life, cost, carbon, alpha]); // eslint-disable-line react-hooks/exhaustive-deps
  const winner = ranking.ranked[0];
  const optionByKey = (k) => options.find((o) => o.key === k);
  const newOption = optionByKey("new");
  const repOption = optionByKey("repurposed");

  const capacity = application.capacityKwh;
  const breakEven = breakEvenFactor(repOption.lifetime, newOption.lifetime);

  /* ---------------------- 3D GRAPH DATA ---------------------- */

  const nodes3D = useMemo(() => {
    const levels = [0, 1, 2, 3, 4, 5];
    const nodes = [];
    for (const l of levels) {
      for (const c of levels) {
        for (const co of levels) {
          const r = rankOptions(options, { lifetime: l, cost: c, carbon: co }, alpha);
          nodes.push({ x: l, y: c, z: co, battery: r.ranked[0].key });
        }
      }
    }
    return nodes;
  }, [alpha, options]);

  const alphaSlider = (
    <div className="mb-6">
      <label className="block mb-2">
        Weighting balance α (share of objective entropy weighting): {alpha.toFixed(2)}
      </label>
      <Slider
        aria-label="Weighting balance alpha"
        min={0}
        max={1}
        step={0.05}
        value={[alpha]}
        onValueChange={([val]) => setAlpha(val)}
      />
      <p className="text-xs text-[#525252] mt-1" style={labelStyle}>
        α = 0 uses only your priorities; α = 1 uses only the entropy weights.
      </p>
    </div>
  );

  const remark = (key) => {
    const co2New = newOption.carbon;
    const co2Opt = optionByKey(key).carbon;
    if (key === "new")
      return `This option ranks first for the selected application, country, priorities and assumptions. Its CO₂ emissions are ${fmt(co2Opt)} kg CO₂-eq kWh⁻¹, compared with ${fmt(optionByKey("recycled").carbon)} for recycled-content and ${fmt(repOption.carbon)} for repurposed batteries in the selected country.`;
    if (key === "recycled")
      return `This option ranks first for the selected application, country, priorities and assumptions. Its CO₂ emissions are ${fmt(co2Opt)} kg CO₂-eq kWh⁻¹ (${fmt(co2New - co2Opt)} below a new (virgin) battery); the recycling credit used is an optimistic upper bound.`;
    return `This option ranks first for the selected application, country, priorities and assumptions. Repurposed-battery emissions (${fmt(co2Opt)} kg CO₂-eq kWh⁻¹) include only the second-life preparation processes; its lifetime energy is lower than that of a new battery (${fmtInt(repOption.lifetime)} versus ${fmtInt(newOption.lifetime)} kWh per kWh).`;
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <div className="py-6 md:p-6 font-sans">
      {/* ---------------- SLIDERS ---------------- */}

      <div className="mb-4">
        <label className="block mb-2">Lifetime importance: {life}</label>
        <Slider aria-label="Lifetime importance" min={0} max={5} step={1} value={[life]} onValueChange={([val]) => setLife(val)} />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Cost importance: {cost}</label>
        <Slider aria-label="Cost importance" min={0} max={5} step={1} value={[cost]} onValueChange={([val]) => setCost(val)} />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Carbon importance: {carbon}</label>
        <Slider aria-label="Carbon importance" min={0} max={5} step={1} value={[carbon]} onValueChange={([val]) => setCarbon(val)} />
      </div>

      {alphaSlider}

      <div className="mb-6">
        <label className="block mb-2">
          Repurposed price factor F (share of the new-battery price): {factor.toFixed(2)}
        </label>
        <Slider
          aria-label="Repurposed price factor F"
          min={COST_CONSTANTS.REPURPOSED_FACTOR_MIN}
          max={COST_CONSTANTS.REPURPOSED_FACTOR_MAX}
          step={0.05}
          value={[factor]}
          onValueChange={([val]) => setFactor(Number(val.toFixed(2)))}
        />
        <p className="text-xs text-[#525252] mt-1" style={labelStyle}>
          F = 0.30–0.75; reference F = 0.50 ({fmt(COST_CONSTANTS.NEW_USD * 0.5, 1)} $ kWh⁻¹ at 80% SOH).
        </p>
      </div>

      {/* ---------------- RESULTS CARD ---------------- */}

      <Button
        data-testid="step1-next-btn"
        onClick={() => setDisplayCalculation(true)}
        className="bg-[#00C853] text-white hover:bg-[#009624] h-12 px-8 rounded-full disabled:opacity-50"
      >
        Calculate
      </Button>
      {displayCaculation && (
        <>
          <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md mb-6 mt-6">
            <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
              <Battery className="w-7 h-7 mr-2 text-[#00C853]" />
              Highest-ranked Option
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                <div className="text-3xl font-bold text-[#00C853]" style={headStyle} title={OPTION_TOOLTIPS[winner.key]}>
                  {OPTION_LABELS[winner.key]}
                </div>
                <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                  Score {fmt(winner.score, 3)} · {OPTION_TOOLTIPS[winner.key]}
                </div>
                <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                  {winner.key === "repurposed" && "Optimal sizing of the battery is required."}
                </div>
              </div>

              <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                  Lifetime (scenario-based estimate)
                </div>
                <div className="text-3xl font-bold text-[#00C853] mb-2" style={headStyle}>
                  {fmt(winner.years)} years
                </div>
                <p className="text-sm text-[#525252]" style={labelStyle}>
                  Range {fmt(winner.minYears)}–{fmt(winner.maxYears)} years (calendar-ageing limits) ·{" "}
                  ≈ {fmtInt(winner.cycles)} cycles
                </p>
                <p className="text-sm text-[#525252] mb-2" style={labelStyle}>
                  Typical DOD of this application (shown for information): {application.dod}
                </p>
              </div>
            </div>
          </Card>

          {/* ---------------- COMPARISON ---------------- */}

          <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-2 flex items-center" style={headStyle}>
              <DollarSign className="w-7 h-7 mr-2 text-[#00C853]" />
              Ranking and Comparison
            </h2>
            <p className="text-sm text-[#525252] mb-6" style={labelStyle}>
              {application.name} · {country.name} · required capacity {capacity} kWh · effective (usable) capacity{" "}
              {fmt(winner.effectiveCapacity, 1)} kWh
            </p>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm" style={labelStyle}>
                <thead>
                  <tr className="bg-[#F9FAFB] border-b">
                    <th className="text-left px-4 py-3 font-semibold">Option</th>
                    <th className="text-left px-4 py-3 font-semibold">Rank (score)</th>
                    <th className="text-left px-4 py-3 font-semibold">Battery cost ($ kWh⁻¹)</th>
                    <th className="text-left px-4 py-3 font-semibold">Total cost</th>
                    <th className="text-left px-4 py-3 font-semibold">Lifetime, scenario-based estimate (years)</th>
                    <th className="text-left px-4 py-3 font-semibold">Lifetime energy (kWh per kWh)</th>
                    <th className="text-left px-4 py-3 font-semibold">CO₂ (kg CO₂-eq kWh⁻¹)</th>
                    <th className="text-left px-4 py-3 font-semibold">CO₂ total / difference vs new (kg CO₂-eq)</th>
                    <th className="text-left px-4 py-3 font-semibold">Cost per delivered kWh ($)</th>
                    <th className="text-left px-4 py-3 font-semibold">CO₂ per delivered kWh (kg CO₂-eq)</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((o) => {
                    const rankIdx = ranking.ranked.findIndex((r) => r.key === o.key);
                    const sc = rankIdx >= 0 ? ranking.ranked[rankIdx].score : null;
                    return (
                      <tr key={o.key} className="border-b last:border-b-0 hover:bg-[#F9FAFB]" data-testid={`result-row-${o.key}`}>
                        <td className="px-4 py-3 font-medium" title={OPTION_TOOLTIPS[o.key]}>{OPTION_LABELS[o.key]}</td>
                        <td className="px-4 py-3">
                          {rankIdx >= 0 ? `${rankIdx + 1} (${fmt(sc, 3)})` : "Recycling recommended"}
                        </td>
                        <td className="px-4 py-3">
                          {fmt(o.cost, 2)} (€{fmt(o.costEur, 2)})
                        </td>
                        <td className="px-4 py-3">
                          ${fmtInt(o.totalCostUsd)} (€{fmtInt(o.totalCostEur)})
                        </td>
                        <td className="px-4 py-3">
                          {fmt(o.years)} ({fmt(o.minYears)}–{fmt(o.maxYears)})
                        </td>
                        <td className="px-4 py-3">{fmtInt(o.lifetime)}</td>
                        <td className="px-4 py-3">{fmt(o.carbon)}</td>
                        <td className="px-4 py-3">
                          {fmtInt(o.totalCarbon)}
                          {o.key !== "new" && ` / −${fmtInt(newOption.totalCarbon - o.totalCarbon)}`}
                        </td>
                        <td className="px-4 py-3">{fmt(o.costPerDeliveredKwh, 3)}</td>
                        <td className="px-4 py-3">{fmt(o.carbonPerDeliveredKwh, 3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4" style={labelStyle}>
              {options.map((o) => {
                const rankIdx = ranking.ranked.findIndex((r) => r.key === o.key);
                const sc = rankIdx >= 0 ? ranking.ranked[rankIdx].score : null;
                const items = [
                  ["Battery cost ($ kWh⁻¹)", `${fmt(o.cost, 2)} (€${fmt(o.costEur, 2)})`],
                  ["Total cost", `$${fmtInt(o.totalCostUsd)} (€${fmtInt(o.totalCostEur)})`],
                  ["Lifetime, scenario-based estimate (years)", `${fmt(o.years)} (${fmt(o.minYears)}–${fmt(o.maxYears)})`],
                  ["Lifetime energy (kWh per kWh)", fmtInt(o.lifetime)],
                  ["CO₂ (kg CO₂-eq kWh⁻¹)", fmt(o.carbon)],
                  ["CO₂ total (kg CO₂-eq)", fmtInt(o.totalCarbon)],
                  ...(o.key !== "new" ? [["CO₂ difference vs new (kg CO₂-eq)", `−${fmtInt(newOption.totalCarbon - o.totalCarbon)}`]] : []),
                  ["Cost per delivered kWh ($)", fmt(o.costPerDeliveredKwh, 3)],
                  ["CO₂ per delivered kWh (kg CO₂-eq)", fmt(o.carbonPerDeliveredKwh, 3)],
                ];
                return (
                  <div key={o.key} data-testid={`result-card-${o.key}`} className="border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex justify-between items-baseline gap-2 mb-3">
                      <div className="text-lg font-bold text-[#0A0A0A]" title={OPTION_TOOLTIPS[o.key]}>{OPTION_LABELS[o.key]}</div>
                      <div className="text-sm text-[#525252] text-right">
                        {rankIdx >= 0 ? `Rank ${rankIdx + 1} (score ${fmt(sc, 3)})` : "Recycling recommended"}
                      </div>
                    </div>
                    <dl className="space-y-2 text-sm">
                      {items.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3">
                          <dt className="text-[#525252]">{k}</dt>
                          <dd className="font-medium text-[#0A0A0A] text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 text-sm text-[#525252] italic" style={labelStyle}>
              <p>
                * Repurposed-battery cost is reported as a range corresponding to 30–75% of the new-battery cost; the
                actual market value depends on battery condition, refurbishment requirements and regional market
                conditions. Selected F = {factor.toFixed(2)}: {fmt(repOption.cost, 2)} $ kWh⁻¹ (range{" "}
                {fmt(COST_CONSTANTS.NEW_USD * COST_CONSTANTS.REPURPOSED_FACTOR_MIN, 1)}–
                {fmt(COST_CONSTANTS.NEW_USD * COST_CONSTANTS.REPURPOSED_FACTOR_MAX, 1)} $ kWh⁻¹ at 80% SOH).
              </p>
              <p>
                * Per delivered kWh, the repurposed battery is cheaper than a new one only when F is below about{" "}
                {fmt(breakEven, 2)}. These per-delivered values are shown for information and do not enter the ranking.
              </p>
              <p>
                * Close to the 60% SOH threshold the repurposed option can still rank first because of its low carbon
                value, although its remaining life is very short. Use the ranking together with the 60% recycling rule
                and a minimum remaining-life requirement.
              </p>
              <p>
                * The typical DOD of each application is shown for information; the energy calculation uses a usable
                fraction of {BATTERY_CONSTANTS.USABLE_FRACTION_PER_CYCLE}, and the direct effect of DOD on degradation
                is not modelled.
              </p>
              <p>
                * Repurposed-battery emissions include only the second-life preparation processes (dismantling,
                electrical testing, sorting, repackaging); the original manufacturing burden is allocated to the first
                automotive life. The recycling credit (4.55 kg CO₂-eq per kg of battery) used for the recycled-content
                battery is an optimistic upper bound.
              </p>
              <p>
                * Qualitative considerations that are not part of the numerical ranking: cell heterogeneity,
                first-life history, safety and certification requirements, and uncertainty about battery condition.
              </p>
            </div>
          </Card>

          {/* ---------------- ENVIRONMENT CARD ---------------- */}

          <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6 flex items-center" style={headStyle}>
              <Leaf className="w-7 h-7 mr-2 text-[#00C853]" />
              Environmental Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                <div className="text-sm text-[#A3A3A3] uppercase tracking-wider mb-2" style={labelStyle}>
                  CO₂ Emissions · {OPTION_LABELS[winner.key]}
                </div>
                <div className="text-3xl font-bold text-[#00C853]" style={headStyle}>
                  {fmtInt(winner.totalCarbon)} kg CO₂-eq
                </div>
                <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                  {fmt(winner.carbon)} kg CO₂-eq kWh⁻¹ × {capacity} kWh
                </div>
                <div className="text-sm text-[#525252] mt-2" style={labelStyle}>
                  Emission factors follow Table 3 of the accompanying paper.
                </div>
              </div>

              <div className="bg-[#00C853]/5 p-4 md:p-6 rounded-lg border-l-4 border-[#00C853]">
                <div className="text-3xl font-bold text-[#00C853] mb-2" style={labelStyle}>
                  Remarks
                </div>
                <div className="text-sm text-[#525252]" style={headStyle}>
                  {remark(winner.key)}
                </div>
              </div>
            </div>
          </Card>

          {/* ---------------- MATERIAL RECOVERY ---------------- */}

          <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-md mb-10">
            <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-2 flex items-center" style={headStyle}>
              <Recycle className="w-7 h-7 mr-2 text-[#00C853]" />
              Critical Metals (information only)
            </h2>
            <p className="text-sm text-[#525252] mb-6" style={labelStyle}>
              {capacity} kWh NMC811 battery · inventory per kWh (Ni 0.61, Co 0.08, Mn 0.07, Li 0.10 kg; Beermann et al.,
              IEA HEV Task 40, 2024). Metals do not enter the ranking.
            </p>

            <MetalsTable capacityKwh={capacity} />
            <p className="text-sm text-[#525252] mt-4 italic" style={labelStyle}>
              * Recovered = contained × recovery rate (EU Battery Regulation 2023/1542: Ni and Co 90%, Li 50% by end-2027;
              Ni and Co 95%, Li 80% by end-2031; no target for Mn). 100% recovery is never assumed. The avoided-material row
              assumes that recovered metals replace virgin metals one-for-one (end-2027 rates) and is a scenario estimate.
            </p>
            <p className="text-sm text-[#525252] mt-2 italic" style={labelStyle}>
              * Repurposed battery: metals stay in use; second-life use may avoid or delay the manufacture of a new battery.
            </p>
          </Card>

          {/* ---------------- 3D CLOUD GRAPH ---------------- */}

          <Plot
            data={[
              {
                x: nodes3D.map((n) => n.x),
                y: nodes3D.map((n) => n.y),
                z: nodes3D.map((n) => n.z),
                mode: "markers",
                type: "scatter3d",
                marker: {
                  size: 5,
                  color: nodes3D.map((n) => colorMap[n.battery]),
                  opacity: 0.9,
                },
                customdata: nodes3D.map((n) => OPTION_LABELS[n.battery]),
                hovertemplate:
                  "Lifetime: %{x}<br>" +
                  "Cost: %{y}<br>" +
                  "Carbon: %{z}<br>" +
                  "Highest-ranked: %{customdata}<extra></extra>",
              },
            ]}
            layout={{
              autosize: true,
              scene: {
                xaxis: { title: { text: "Lifetime importance" }, showaxeslabels: true },
                yaxis: { title: { text: "Cost importance" }, showaxeslabels: true },
                zaxis: { title: { text: "Carbon importance" }, showaxeslabels: true },
              },
              margin: { l: 0, r: 30, t: 20, b: 0 },
              annotations: [
                {
                  xref: "paper",
                  yref: "paper",
                  x: 1.02,
                  y: 1,
                  showarrow: false,
                  align: "left",
                  text:
                    `<span style='color:green'>●</span> ${OPTION_LABELS.repurposed}<br>` +
                    `<span style='color:yellow'>●</span> ${OPTION_LABELS.recycled}<br>` +
                    `<span style='color:red'>●</span> ${OPTION_LABELS.new}`,
                  font: { size: 12 },
                },
              ],
            }}
            style={{ width: "100%", height: "700px" }}
          />
          {alphaSlider}
          <EVBatteryOutlookTable />
        </>
      )}
    </div>
  );
}
