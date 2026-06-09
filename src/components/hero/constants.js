/* ─────────────────────────────────────────────
   HERO CONSTANTS
───────────────────────────────────────────── */

export const BARS = [
  { label: "Age",        pct: 74, warn: false },
  { label: "Salary",     pct: 91, warn: false },
  { label: "Experience", pct: 58, warn: true  },
  { label: "Score",      pct: 83, warn: false },
];

export const HEAT_COLS = ["age", "sal", "exp", "scr", "churn"];

export const HEAT_MATRIX = [
  [1.0,  0.72, 0.58, 0.31, 0.45],
  [0.72, 1.0,  0.61, 0.28, 0.52],
  [0.58, 0.61, 1.0,  0.44, 0.38],
  [0.31, 0.28, 0.44, 1.0,  0.22],
  [0.45, 0.52, 0.38, 0.22, 1.0 ],
];

export const KPI_CARDS = [
  { label: "Quality Score", val: "countup-91", color: "var(--gold)" },
  { label: "Missing",       val: "2.1%",       color: "var(--warning)" },
  { label: "Duplicates",    val: "0.4%",       color: "var(--success)" },
];

export const TRUST_ITEMS = [
  "No setup required",
  "No data stored",
  "Runs instantly in your browser",
];