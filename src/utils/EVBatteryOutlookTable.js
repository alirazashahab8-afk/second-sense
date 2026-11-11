import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function EVBatteryOutlookTable() {
  const [open, setOpen] = useState(false);

  const data = [
    {
      country: "Norway",
      marketShare: "Extremely high (~95% BEV share of new cars)",
      fleet2035: "Very large (world’s highest EV per capita)",
      retirementWave: "Very high (first-generation EV packs ageing out)",
      dominantMarket: "Repurposed (industrial + grid + residential)",
    },
    {
      country: "Denmark",
      marketShare: "High (~69% EV share of new cars)",
      fleet2035: "Large and continuing to grow",
      retirementWave: "High",
      dominantMarket: "Repurposed (residential + commercial)",
    },
    {
      country: "Sweden",
      marketShare: "High (~60% EV share of new cars)",
      fleet2035: "Large and continuing to grow",
      retirementWave: "High",
      dominantMarket: "Repurposed (residential + commercial)",
    },
    {
      country: "Netherlands",
      marketShare: "Strong (~30% EV share of new cars)",
      fleet2035: "Large and dense EV fleet",
      retirementWave: "Medium–High",
      dominantMarket: "Repurposed (home storage + urban micro-grids)",
    },
  ];

  return (
    <Card className="bg-white border border-[#E5E7EB] p-8 shadow-md mb-10">
      <h2 className="text-2xl font-semibold mb-6">
        EV Adoption & Second-Life Battery Outlook (to 2035)
      </h2>

      {/* ---------- TABLE ---------- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F9FAFB] border-b">
              <th className="text-left px-4 py-3 font-semibold">Country</th>
              <th className="text-left px-4 py-3 font-semibold">
                EV Market Share (2024–2025)
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                Projected EV Fleet Size by 2035
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                Expected Battery Retirement Wave (2030–2035)
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                Dominant Second-Life Battery Market by 2035
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b last:border-b-0 hover:bg-[#F9FAFB] transition"
              >
                <td className="px-4 py-3 font-medium">{row.country}</td>
                <td className="px-4 py-3">{row.marketShare}</td>
                <td className="px-4 py-3">{row.fleet2035}</td>
                <td className="px-4 py-3">{row.retirementWave}</td>
                <td className="px-4 py-3 text-green-700 font-medium">
                  {row.dominantMarket}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- SOURCES DROPDOWN ---------- */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-medium text-[#00C853] hover:underline"
        >
          Sources {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {open && (
          <div className="mt-3 space-y-2 text-sm text-[#374151]">
            <a
              href="https://www.iea.org/reports/global-ev-outlook-2024/trends-in-electric-cars"
              target="_blank"
              rel="noreferrer"
              className="block hover:underline"
            >
              • IEA Global EV Outlook (2024) – Trends in Electric Cars
            </a>
            <a
              href="https://www.iea.org/reports/global-ev-outlook-2025"
              target="_blank"
              rel="noreferrer"
              className="block hover:underline"
            >
              • IEA Global EV Outlook (2025) – Expanding Sales in Diverse Markets
            </a>
            <a
              href="https://theicct.org/publication/european-market-monitor-cars-and-vans-nov-2025/"
              target="_blank"
              rel="noreferrer"
              className="block hover:underline"
            >
              • European Market Monitor: Cars and Vans (ICCT, Nov 2025)
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
