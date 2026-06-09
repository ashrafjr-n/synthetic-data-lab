/* ─────────────────────────────────────────────
   CSV ANALYZER — Pure JavaScript
   No AI, no external calls, frontend only.
───────────────────────────────────────────── */

/* ══════════════════════════════════════════
   MAIN ENTRY POINT
══════════════════════════════════════════ */
export function analyzeDataset(data, columns, target) {
  const columnRoles     = detectColumnRoles(data, columns, target);
  const identifierCols  = columns.filter(c => columnRoles[c] === "identifier");
  const numericCols     = columns.filter(c => columnRoles[c] === "numeric");
  const categoricalCols = columns.filter(c => columnRoles[c] === "categorical" || columnRoles[c] === "binary");

  const meta           = getMeta(data, columns, target, numericCols, categoricalCols, identifierCols, columnRoles);
  const quality        = getQuality(data, columns, identifierCols);
  const statistics     = getStatistics(data, numericCols);
  const visualizations = getVisualizations(data, columns, numericCols, categoricalCols);
  const relationships  = getRelationships(data, numericCols);
  const classBalance   = getClassBalance(data, target);
  const snapshot       = getDatasetSnapshot(data, columns);
  const insights       = getInsights({ meta, quality, statistics, relationships, classBalance });

  return { meta, quality, statistics, visualizations, relationships, classBalance, snapshot, insights };
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

function isNumeric(val) {
  if (val === null || val === undefined || val === "") return false;
  return !isNaN(parseFloat(val)) && isFinite(val);
}

function getValues(data, col) {
  return data.map(r => r[col]).filter(v => v !== "" && v != null);
}

function getNumericValues(data, col) {
  return getValues(data, col).map(v => parseFloat(v)).filter(v => !isNaN(v));
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid    = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m  = mean(arr);
  const sq = arr.map(v => (v - m) ** 2);
  return Math.sqrt(mean(sq));
}

function quantile(arr, q) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos    = (sorted.length - 1) * q;
  const base   = Math.floor(pos);
  const rest   = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

/* ── FIX #1: Pearson uses paired rows to handle missing values correctly ── */
function pearson(data, colA, colB) {
  const pairs = [];
  data.forEach(row => {
    const a = parseFloat(row[colA]);
    const b = parseFloat(row[colB]);
    if (!isNaN(a) && !isNaN(b)) pairs.push([a, b]);
  });

  const n = pairs.length;
  if (n < 3) return 0;

  const mx = mean(pairs.map(p => p[0]));
  const my = mean(pairs.map(p => p[1]));

  let num = 0, dx2 = 0, dy2 = 0;
  for (const [a, b] of pairs) {
    const dx = a - mx;
    const dy = b - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }

  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : Math.round((num / denom) * 100) / 100;
}

/* ── FIX #8: isIdentifierCol — guard against year-like sequential features ── */
function isIdentifierCol(data, col) {
  const nameLower = col.toLowerCase();

  // Name heuristic — must contain id/uuid/key/index at a word boundary
  const idNamePattern = /(\b|_)(id|uuid|key|index|ref)(\b|_|$)/i;
  if (idNamePattern.test(nameLower)) {
    const vals   = getValues(data, col);
    const unique = new Set(vals.map(String)).size;
    if (unique / data.length > 0.9) return true;
  }

  // Uniqueness + sequential heuristic
  // Excluded: "no", "num", "number", "code" — too likely to be real features (year, score, code)
  const vals = data.slice(0, 200).map(r => r[col]).filter(v => v !== "" && v != null);

  // FIX: guard against all-missing column
  if (vals.length === 0) return false;

  const unique = new Set(vals.map(String)).size;

  if (unique / vals.length > 0.95 && vals.length > 10) {
    const nums = vals.map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (nums.length / vals.length > 0.95) {
      const sorted = [...nums].sort((a, b) => a - b);
      const diffs  = sorted.slice(1).map((v, i) => v - sorted[i]);
      const allOne = diffs.every(d => d === 1);
      // Extra guard: sequential integers starting from 1 or 0 only
      // Prevents year columns (2000, 2001...) from being flagged
      const startsAtOrigin = sorted[0] === 0 || sorted[0] === 1;
      if (allOne && startsAtOrigin) return true;
    }
  }

  return false;
}

/* ── FIX #1 (detectColumnRoles): guard against empty sample (all missing) ── */
export function detectColumnRoles(data, columns, target) {
  const roles = {};
  columns.forEach(col => {
    if (col === target) {
      roles[col] = "target";
      return;
    }

    if (isIdentifierCol(data, col)) {
      roles[col] = "identifier";
      return;
    }

    const sample = data.slice(0, 100)
      .map(r => r[col])
      .filter(v => v !== "" && v != null);

    // FIX: empty sample (all missing) → treat as categorical, avoid NaN
    if (sample.length === 0) {
      roles[col] = "categorical";
      return;
    }

    const numericCount = sample.filter(v => isNumeric(v)).length;
    if (numericCount / sample.length >= 0.8) {
      roles[col] = "numeric";
      return;
    }

    const unique = new Set(sample.map(v => String(v).toLowerCase().trim())).size;
    roles[col] = unique === 2 ? "binary" : "categorical";
  });
  return roles;
}

/* ══════════════════════════════════════════
   META
   FIX #2: Smarter ML Task Type detection
══════════════════════════════════════════ */
function getMeta(data, columns, target, numericCols, categoricalCols, identifierCols, columnRoles) {
  let datasetType = "N/A";

  if (target) {
    // FIX #2: Use column role as primary signal — more reliable than unique count
    const targetRole = columnRoles[target];

    if (targetRole === "numeric") {
      // Numeric role means values are continuous measurements → Regression
      datasetType = "Regression";
    } else if (targetRole === "binary") {
      // Exactly 2 values (0/1, yes/no) → Binary Classification
      datasetType = "Classification";
    } else if (targetRole === "categorical") {
      // Multiple text/category values → Multi-class Classification
      datasetType = "Classification";
    } else {
      // target role = "target" (assigned by detectColumnRoles as fallback)
      // Fall back to unique count heuristic
      const vals   = getValues(data, target);
      const unique = [...new Set(vals)];
      datasetType  = unique.length <= 10 ? "Classification" : "Regression";
    }
  }

  return {
    rows:            data.length,
    columns:         columns.length,
    numericCols,
    categoricalCols,
    identifierCols,
    columnRoles,
    target,
    datasetType,
  };
}

/* ══════════════════════════════════════════
   QUALITY
   FIX #3: Report both missing AND constant independently
   FIX #4: Stable JSON.stringify for duplicate detection
══════════════════════════════════════════ */
function getQuality(data, columns, identifierCols = []) {
  let missingCells = 0;
  const columnsWithIssues = [];

  columns.forEach(col => {
    const vals    = data.map(r => r[col]);
    const missing = vals.filter(v => v === "" || v == null).length;
    const nonEmpty = vals.filter(v => v !== "" && v != null);
    const unique  = [...new Set(nonEmpty)];

    missingCells += missing;

    // FIX #3: Check missing and constant independently (not mutually exclusive)
    if (missing > 0) {
      columnsWithIssues.push({
        col,
        issue:  "missing",
        detail: `${missing} missing value${missing > 1 ? "s" : ""}`,
      });
    }

    // Only check constant/cardinality on non-empty values
    if (nonEmpty.length > 0) {
      if (unique.length === 1) {
        columnsWithIssues.push({
          col,
          issue:  "constant",
          detail: `All non-empty values are identical ("${unique[0]}")`,
        });
      // FIX: compare against nonEmpty.length so missing rows don't mask full uniqueness
      } else if (
        !identifierCols.includes(col) &&
        unique.length === nonEmpty.length &&
        nonEmpty.length > 10
      ) {
        columnsWithIssues.push({
          col,
          issue:  "high_cardinality",
          detail: "High uniqueness — likely an ID column",
        });
      }
    }
  });

  // FIX #4: Stable stringify — sort keys so key-order differences don't affect dedup
  const serialized    = data.map(r =>
    JSON.stringify(r, Object.keys(r).sort())
  );
  const duplicateRows = serialized.length - new Set(serialized).size;
  const missingPct    = (missingCells / (data.length * columns.length)) * 100;

  // Score breakdown
  const penalties = [];

  const missingPenalty = Math.round(missingPct * 2);
  if (missingPenalty > 0) {
    penalties.push({
      label:   "Missing values",
      detail:  `${missingPct.toFixed(1)}% of cells are empty`,
      penalty: missingPenalty,
    });
  }

  const dupPenalty = Math.round((duplicateRows / data.length) * 50);
  if (dupPenalty > 0) {
    penalties.push({
      label:   "Duplicate rows",
      detail:  `${duplicateRows} duplicate row${duplicateRows > 1 ? "s" : ""} found`,
      penalty: dupPenalty,
    });
  }

  const issuePenalty = columnsWithIssues.length * 3;
  if (issuePenalty > 0) {
    penalties.push({
      label:   "Column issues",
      detail:  `${columnsWithIssues.length} column${columnsWithIssues.length > 1 ? "s" : ""} with structural issues`,
      penalty: issuePenalty,
    });
  }

  const score = Math.max(0, Math.round(100 - penalties.reduce((s, p) => s + p.penalty, 0)));

  return {
    missingCells,
    missingPct:     Math.round(missingPct * 10) / 10,
    duplicateRows,
    columnsWithIssues,
    qualityScore:   score,
    scorePenalties: penalties,
    scoreBase:      100,
  };
}

/* ══════════════════════════════════════════
   STATISTICS
   FIX #5: Constant column histogram — show single bar with label
══════════════════════════════════════════ */
function getStatistics(data, numericCols) {
  return numericCols.map(col => {
    const vals = getNumericValues(data, col);
    if (!vals.length) return { col, empty: true };

    const sorted = [...vals].sort((a, b) => a - b);
    const q1     = quantile(vals, 0.25);
    const q3     = quantile(vals, 0.75);
    const iqr    = q3 - q1;
    const m      = mean(vals);
    const med    = median(vals);
    const std    = stdDev(vals);

    const skewness = std === 0 ? 0 : Math.round(((m - med) / std) * 3 * 100) / 100;
    const skewnessLabel =
      skewness >  0.5 ? "right-skewed" :
      skewness < -0.5 ? "left-skewed"  : "approximately symmetric";

    const lowerFence  = q1 - 1.5 * iqr;
    const upperFence  = q3 + 1.5 * iqr;
    const outliers    = vals.filter(v => v < lowerFence || v > upperFence);

    const min     = sorted[0];
    const max     = sorted[sorted.length - 1];

    // FIX #5: constant column — all values identical, binSize would be 0
    let bins;
    if (min === max) {
      bins = [{ bin: `${min}`, count: vals.length }];
    } else {
      const binSize = (max - min) / 10;
      bins = Array.from({ length: 10 }, (_, i) => ({
        bin:   `${Math.round((min + i * binSize) * 100) / 100}–${Math.round((min + (i + 1) * binSize) * 100) / 100}`,
        count: 0,
      }));
      vals.forEach(v => {
        const idx = Math.min(Math.floor((v - min) / binSize), 9);
        bins[idx].count++;
      });
    }

    return {
      col,
      mean:         Math.round(m * 100) / 100,
      median:       Math.round(med * 100) / 100,
      min:          Math.round(min * 100) / 100,
      max:          Math.round(max * 100) / 100,
      std:          Math.round(std * 100) / 100,
      q1:           Math.round(q1 * 100) / 100,
      q3:           Math.round(q3 * 100) / 100,
      iqr:          Math.round(iqr * 100) / 100,
      skewness,
      skewnessLabel,
      outlierCount: outliers.length,
      lowerFence:   Math.round(lowerFence * 100) / 100,
      upperFence:   Math.round(upperFence * 100) / 100,
      count:        vals.length,
      histogram:    bins,
      isConstant:   min === max,
    };
  });
}

/* ══════════════════════════════════════════
   VISUALIZATIONS
   FIX #5: Same constant column guard
══════════════════════════════════════════ */
function getVisualizations(data, columns, numericCols, categoricalCols) {
  const result = [];

  numericCols.forEach(col => {
    const vals = getNumericValues(data, col);
    if (!vals.length) return;

    const min = Math.min(...vals);
    const max = Math.max(...vals);

    let bins;
    if (min === max) {
      bins = [{ bin: `${min}`, count: vals.length }];
    } else {
      const binSize = (max - min) / 10;
      bins = Array.from({ length: 10 }, (_, i) => {
        const binMin = min + i * binSize;
        const binMax = binMin + binSize;
        return {
          bin:   `${Math.round(binMin * 100) / 100}–${Math.round(binMax * 100) / 100}`,
          count: vals.filter(v => v >= binMin && (i === 9 ? v <= binMax : v < binMax)).length,
        };
      });
    }

    const q1         = quantile(vals, 0.25);
    const q3         = quantile(vals, 0.75);
    const iqr        = q3 - q1;
    const med        = median(vals);
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers   = vals.filter(v => v < lowerFence || v > upperFence);
    const m          = mean(vals);
    const skewness   = (m - med) / (stdDev(vals) || 1) * 3;

    const skewLabel =
      min === max                ? "constant — all values are identical" :
      skewness >  0.5            ? "right-skewed (tail toward higher values)" :
      skewness < -0.5            ? "left-skewed (tail toward lower values)" :
                                   "approximately symmetric";

    result.push({
      col,
      type:      "numeric",
      histogram: bins,
      isConstant: min === max,
      boxplot: {
        min:          Math.round(min * 100) / 100,
        max:          Math.round(max * 100) / 100,
        q1:           Math.round(q1 * 100) / 100,
        q3:           Math.round(q3 * 100) / 100,
        median:       Math.round(med * 100) / 100,
        lowerFence:   Math.round(lowerFence * 100) / 100,
        upperFence:   Math.round(upperFence * 100) / 100,
        outlierCount: outliers.length,
      },
      insight: `Distribution is ${skewLabel}.${outliers.length > 0 ? ` ${outliers.length} outlier${outliers.length > 1 ? "s" : ""} detected.` : " No outliers detected."}`,
    });
  });

  categoricalCols.forEach(col => {
    const freq = {};
    data.forEach(r => {
      const v = r[col];
      if (v !== "" && v != null) freq[String(v)] = (freq[String(v)] || 0) + 1;
    });

    const total       = Object.values(freq).reduce((a, b) => a + b, 0);
    const uniqueCount = Object.keys(freq).length;
    const sorted      = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([value, count]) => ({
        value,
        count,
        pct: Math.round((count / total) * 1000) / 10,
      }));

    const topValue = sorted[0];
    const insight  = topValue
      ? `"${topValue.value}" is the most frequent value at ${topValue.pct}%. ${uniqueCount} unique categories total.`
      : "No data available.";

    result.push({ col, type: "categorical", data: sorted, insight });
  });

  return result;
}

/* ══════════════════════════════════════════
   RELATIONSHIPS
══════════════════════════════════════════ */
function getRelationships(data, numericCols) {
  // FIX #3: Select top 8 by variance — avoids missing important cols at the end
  const cols = numericCols
    .map(col => {
      const vals = getNumericValues(data, col);
      if (vals.length < 2) return { col, variance: 0 };
      const m        = mean(vals);
      const variance = mean(vals.map(v => (v - m) ** 2));
      return { col, variance };
    })
    .sort((a, b) => b.variance - a.variance)
    .slice(0, 8)
    .map(c => c.col);
  const matrix = {};
  const strongRelationships = [];

  for (let i = 0; i < cols.length; i++) {
    for (let j = i; j < cols.length; j++) {
      const a   = cols[i];
      const b   = cols[j];
      const key = `${a}||${b}`;

      if (i === j) { matrix[key] = 1; continue; }

      const r = pearson(data, a, b);
      matrix[key]           = r;
      matrix[`${b}||${a}`] = r;

      const abs = Math.abs(r);
      if (abs > 0.4) {
        strongRelationships.push({
          col1:        a,
          col2:        b,
          correlation: r,
          strength:    abs > 0.6 ? "strong" : "moderate",
        });
      }
    }
  }

  strongRelationships.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  return { cols, correlationMatrix: matrix, strongRelationships };
}

/* ══════════════════════════════════════════
   CLASS BALANCE
   FIX #6: Report missing separately so percentages are over total rows
══════════════════════════════════════════ */
function getClassBalance(data, target) {
  if (!target) return null;

  const allVals     = data.map(r => r[target]);
  const totalRows   = allVals.length;
  const missingCount = allVals.filter(v => v === "" || v == null).length;

  const freq = {};
  allVals.forEach(v => {
    if (v !== "" && v != null) freq[String(v)] = (freq[String(v)] || 0) + 1;
  });

  // FIX: pct over totalRows (not just non-missing), so numbers add up to ≤100%
  const classes = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({
      value,
      count,
      pct: Math.round((count / totalRows) * 1000) / 10,
    }));

  if (missingCount > 0) {
    classes.push({
      value:   "(missing)",
      count:   missingCount,
      pct:     Math.round((missingCount / totalRows) * 1000) / 10,
      missing: true,
    });
  }

  const maxPct      = classes.filter(c => !c.missing)[0]?.pct ?? 0;
  const isImbalanced = maxPct > 70;

  return { classes, isImbalanced, totalRows, missingCount };
}

/* ══════════════════════════════════════════
   TARGET DETECTION
   FIX #7: Prefer name-matched targets over binary columns
══════════════════════════════════════════ */
export function detectTarget(columns, data) {
  const targetNames = [
    "target", "label", "class", "outcome", "churn",
    "purchased", "survived", "default", "fraud",
    "status", "result", "y", "output",
  ];

  // 1. Name match — highest priority
  const byName = columns.find(c =>
    targetNames.includes(c.toLowerCase().trim())
  );
  if (byName) return byName;

  // 2. Binary values — but skip columns that look like feature flags
  //    Prefer the LAST binary column found (more likely to be target)
  const binaryCols = columns.filter(col => {
    const vals   = getValues(data, col);
    const unique = [...new Set(vals.map(v => String(v).toLowerCase().trim()))];
    return unique.length === 2 && (
      (unique.includes("0") && unique.includes("1")) ||
      (unique.includes("yes") && unique.includes("no")) ||
      (unique.includes("true") && unique.includes("false"))
    );
  });
  if (binaryCols.length > 0) return binaryCols[binaryCols.length - 1];

  // 3. Low cardinality (≤ 5% unique)
  const byCardinality = columns.find(col => {
    const vals   = getValues(data, col);
    const unique = new Set(vals).size;
    return unique / data.length <= 0.05 && unique >= 2;
  });
  if (byCardinality) return byCardinality;

  // 4. Last column fallback
  return columns[columns.length - 1];
}

/* ══════════════════════════════════════════
   SAMPLE DATA — employee_churn
══════════════════════════════════════════ */
export function generateSampleData() {
  const departments = ["Engineering", "Sales", "HR", "Marketing", "Finance"];
  const educations  = ["Bachelor's", "Master's", "PhD", "High School"];
  const genders     = ["Male", "Female", "Other"];

  const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
  const gauss = (mu, sigma) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const rows = Array.from({ length: 500 }, (_, i) => {
    const age        = Math.round(Math.max(22, Math.min(58, gauss(38, 8))));
    const experience = Math.round(Math.max(1,  Math.min(25, gauss(8, 5))));
    const salary     = Math.round(Math.max(30000, Math.min(120000, gauss(65000, 18000))));
    const score      = Math.round(Math.max(1, Math.min(5, gauss(3.2, 0.8))));
    const churn      = (salary < 45000 || score < 2 || experience < 2) && Math.random() > 0.4 ? 1 : 0;

    return {
      employee_id:       i + 1,
      age,
      gender:            pick(genders),
      department:        pick(departments),
      years_experience:  experience,
      education:         pick(educations),
      salary,
      performance_score: score,
      remote_work:       rand(0, 1),
      churn,
    };
  });

  [10, 55, 120, 200, 310].forEach(idx => { rows[idx].salary = ""; });
  [30, 90].forEach(idx => { rows[idx].performance_score = ""; });

  const columns = Object.keys(rows[0]);
  return { data: rows, columns };
}

/* ══════════════════════════════════════════
   DATASET SNAPSHOT — first 10 rows preview
══════════════════════════════════════════ */
export function getDatasetSnapshot(data, columns) {
  const rows = data.slice(0, 10).map(row => {
    const clean = {};
    columns.forEach(col => {
      const val = row[col];
      clean[col] = val === "" || val == null ? null : val;
    });
    return clean;
  });

  return { columns, rows };
}

/* ══════════════════════════════════════════
   TOP INSIGHTS — column-aware, cross-signal
══════════════════════════════════════════ */
export function getInsights({ meta, quality, statistics, relationships, classBalance }) {
  const insights = [];

  /* ── Step 1: build per-column signal map ──
     Collect all signals for each column so we can
     combine them into a single contextual insight.   */
  const colSignals = {};

  const addSignal = (col, type, signal) => {
    if (!colSignals[col]) colSignals[col] = [];
    colSignals[col].push({ type, signal });
  };

  // Missing values
  quality.columnsWithIssues
    .filter(c => c.issue === "missing")
    .forEach(c => {
      const count = parseInt(c.detail);
      const pct   = Math.round((count / meta.rows) * 100);
      addSignal(c.col, "missing", { count, pct });
    });

  // Outliers
  statistics
    .filter(s => !s.empty && s.outlierCount > 0)
    .forEach(s => addSignal(s.col, "outliers", { count: s.outlierCount }));

  // High skewness
  statistics
    .filter(s => !s.empty && Math.abs(s.skewness) > 1)
    .forEach(s => addSignal(s.col, "skewed", { skewness: s.skewness, label: s.skewnessLabel }));

  /* ── Step 2: generate combined per-column insights ── */
  const colEntries = Object.entries(colSignals)
    .sort((a, b) => b[1].length - a[1].length) // most signals first
    .slice(0, 3);

  colEntries.forEach(([col, signals]) => {
    const missing  = signals.find(s => s.type === "missing");
    const outliers = signals.find(s => s.type === "outliers");
    const skewed   = signals.find(s => s.type === "skewed");

    const issues = [];
    if (missing)  issues.push(`${missing.signal.pct}% missing values`);
    if (outliers) issues.push(`${outliers.signal.count} outlier${outliers.signal.count > 1 ? "s" : ""}`);
    if (skewed)   issues.push(`${skewed.signal.label}`);

    if (issues.length === 0) return;

    const severity = (missing?.signal.pct > 20 || outliers?.signal.count > 10) ? "warning" : "info";

    const text = issues.length === 1
      ? `"${col}" has ${issues[0]}.`
      : `"${col}" appears problematic: ${issues.slice(0, -1).join(", ")} and ${issues[issues.length - 1]}.`;

    insights.push({ type: severity, text });
  });

  /* ── Step 3: dataset-level insights ── */

  // Duplicate rows
  if (quality.duplicateRows > 0) {
    insights.push({
      type: "warning",
      text: `${quality.duplicateRows} duplicate row${quality.duplicateRows > 1 ? "s" : ""} detected — remove before training.`,
    });
  }

  // Clean dataset
  if (quality.missingCells === 0 && quality.duplicateRows === 0) {
    insights.push({ type: "success", text: "Dataset is clean — no missing values or duplicate rows." });
  }

  // Correlations — group by direction
  const strongPos = relationships.strongRelationships.filter(r => r.strength === "strong" && r.correlation > 0);
  const strongNeg = relationships.strongRelationships.filter(r => r.strength === "strong" && r.correlation < 0);

  if (strongPos.length > 0 || strongNeg.length > 0) {
    const parts = [];
    if (strongPos.length > 0) {
      const top = strongPos[0];
      parts.push(`"${top.col1}" ↔ "${top.col2}" (r = ${top.correlation})`);
    }
    if (strongNeg.length > 0) {
      const top = strongNeg[0];
      parts.push(`"${top.col1}" ↔ "${top.col2}" (r = ${top.correlation})`);
    }
    insights.push({
      type: "info",
      text: `Strong correlation${parts.length > 1 ? "s" : ""} found: ${parts.join("; ")}.`,
    });
  } else if (relationships.cols.length >= 2) {
    insights.push({
      type: "success",
      text: "No strong correlations between features — low multicollinearity.",
    });
  }

  // Class balance
  if (classBalance) {
    if (classBalance.isImbalanced) {
      const majority = classBalance.classes.filter(c => !c.missing)[0];
      insights.push({
        type: "warning",
        text: `Class imbalance detected — "${majority?.value}" dominates at ${majority?.pct}% of rows.`,
      });
    } else {
      insights.push({ type: "success", text: "Target classes are balanced." });
    }
  }

  // Quality score — only mention if notable
  if (quality.qualityScore < 60) {
    insights.push({
      type: "warning",
      text: `Quality score is low (${quality.qualityScore}/100) — clean the dataset before training.`,
    });
  }

  return insights.slice(0, 6);
}