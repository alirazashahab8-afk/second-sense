# Second Sense

Web tool that compares new (virgin), recycled-content and repurposed lithium-ion batteries on cost, carbon emissions and usable energy lifetime. It accompanies the manuscript "Comparative Evaluation Model for New (Virgin), Repurposed, and Recycled Lithium-Ion Batteries Based on Cost, Carbon Emissions, and Usable Energy Lifetime" (Journal of Energy Storage, under review).

Live site: https://secondsense.vercel.app/

## Contents

- `src/utils/calculations.js` – model functions (lifetime, cost, carbon, metals, entropy-hybrid MCDA ranking).
- `src/data/constants.js` – all model constants, the 18 applications and 13 countries.
- `scripts/verify-model.mjs` – 140 automated checks of the model against the manuscript values.
- `data/` – CSV tables generated from the model code (manuscript Tables 3, 5, 8, 10, 11 and 13).
- `src/` – React user interface.

## Run

    yarn install
    yarn start

## Verify the calculations

    node scripts/verify-model.mjs

The script needs only Node.js (v18 or later) and prints "All checks passed." when every value matches.

## Cite

Please cite the archived version using the DOI shown on the Zenodo record and in `CITATION.cff`, and the accompanying paper once published.

## Licence

MIT, see `LICENSE`.
