import React from "react";
import { calculateMetals } from "./calculations";
import { METAL_NAMES } from "@/data/constants";

const labelStyle = { fontFamily: "DM Sans, sans-serif" };
const kgFmt = (v) => (v === null || v === undefined ? "–" : `${Number(v).toFixed(1)} kg`);

/**
 * Critical metals for a battery of the given nominal capacity:
 * contained, recovered by recycling (EU Battery Regulation 2023/1542 targets) and potential virgin material avoided.
 * Table on larger screens, one card per metal on phones.
 */
export default function MetalsTable({ capacityKwh }) {
  const m27 = calculateMetals(capacityKwh, 2027);
  const m31 = calculateMetals(capacityKwh, 2031);
  const metals = Object.keys(METAL_NAMES);

  const rows = [
    { label: "Contained", value: (m) => kgFmt(m27.contained[m]) },
    {
      label: "Recovered by recycling (end-2027 target)",
      value: (m) => (m === "manganese" ? "No target" : kgFmt(m27.recovered[m])),
    },
    {
      label: "Recovered by recycling (end-2031 target)",
      value: (m) => (m === "manganese" ? "No target" : kgFmt(m31.recovered[m])),
    },
    {
      label: "Potential virgin material avoided (scenario estimate)",
      value: (m) => (m === "manganese" ? "–" : kgFmt(m27.recovered[m])),
    },
  ];

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={labelStyle}>
          <thead>
            <tr className="bg-[#F9FAFB] border-b">
              <th className="text-left px-4 py-3 font-semibold">Quantity ({capacityKwh} kWh battery)</th>
              {metals.map((m) => (
                <th key={m} className="text-left px-4 py-3 font-semibold">{METAL_NAMES[m]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{row.label}</td>
                {metals.map((m) => (
                  <td key={m} className="px-4 py-3">{row.value(m)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3" style={labelStyle}>
        {metals.map((m) => (
          <div key={m} className="bg-[#F5F7F5] rounded-lg p-4">
            <div className="text-lg font-bold text-[#0A0A0A] mb-2">
              {METAL_NAMES[m]} <span className="text-xs font-normal text-[#525252]">({capacityKwh} kWh battery)</span>
            </div>
            <dl className="space-y-2 text-sm">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <dt className="text-[#525252]">{row.label}</dt>
                  <dd className="font-medium text-[#0A0A0A] text-right whitespace-nowrap">{row.value(m)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
