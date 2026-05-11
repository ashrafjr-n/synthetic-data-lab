/* ================= GEMINI CALL ================= */
export const getSmartWeights = async (features, target) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!backendUrl) return null;

  /* CACHE */
  const cacheKey = JSON.stringify({
    features: features
      .map(f => ({
        name: f.name,
        type: f.type,
        values: f.values,
        min: f.min,
        max: f.max
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    targetName: target.name
  });

  if (getSmartWeights._cache?.key === cacheKey) {
    console.log("Using cached weights ✅");
    return getSmartWeights._cache.data;
  }

  const featureDescriptions = features.map(f => {
    if (f.type === "numeric")
      return `- Name: "${f.name}" | Type: numeric | Range: ${f.min} to ${f.max}`;
    if (f.type === "category" || f.type === "binary")
      return `- Name: "${f.name}" | Type: ${f.type} | Values: ${f.values}`;
    return `- Name: "${f.name}" | Type: ${f.type}`;
  }).join("\n");

  const prompt = `
You are a data science expert. Your job is to analyze a synthetic dataset structure and return the logical relationship between features and a target column.

FEATURES:
${featureDescriptions}

TARGET:
- Name: "${target.name}"
- Type: ${target.type}
- Values: ${target.values}

INSTRUCTIONS:
1. Read the target name carefully — it is your most important clue.
2. For each feature, determine how strongly it predicts the target based on real-world logic.
3. Assign weights to ALL features, not just numeric ones.

WEIGHT RULES:
- Numeric features: weight from -1.0 to 1.0
  - Positive weight = higher value → higher target class
  - Negative weight = lower value → higher target class
- Category/Binary features: for each possible value, assign a score from -1.0 to 1.0
- Confidence: how certain you are (0.0 to 1.0)
  - Use 0.8-1.0 for clear names like "age", "salary", "score"
  - Use 0.1-0.3 for unclear names like "x1", "col7", "s"

EXAMPLES:
- Target "is_old": age gets weight +0.95, confidence 0.99
- Target "pass_exam": study_hours gets +0.9, sleep_hours gets +0.5
- Target "good_health": sleep_hours +0.7, eat_well yes→+0.8 no→-0.8

Return ONLY this exact JSON, no markdown, no explanation:
{
  "numeric": {
    "featureName": { "weight": 0.8, "confidence": 0.9 }
  },
  "categorical": {
    "featureName": {
      "confidence": 0.85,
      "values": { "value1": 0.8, "value2": -0.8 }
    }
  },
  "direction_note": "brief explanation"
}
Also return a "positive_class" field: which of the target values represents the POSITIVE/GOOD outcome?
`;

  try {
    const res = await fetch(`${backendUrl}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.warn("❌ Invalid JSON from Gemini");
      return null;
    }

    if (!parsed.numeric && !parsed.categorical) {
      console.warn("❌ Missing weights in response");
      return null;
    }

    /* SAVE CACHE */
    getSmartWeights._cache = { key: cacheKey, data: parsed };
    console.log("AI Logic:", parsed.direction_note);

    return parsed;

  } catch (err) {
    console.warn("Gemini failed, using fallback ⚠️", err);
    return null;
  }
};










/* ================= HELPERS ================= */
const getRandomFn = (useSeed, seededRandom) =>
  useSeed ? seededRandom() : Math.random();

const getNormalFn = (getRandom) => {
  let u = 0, v = 0;
  while (u === 0) u = getRandom();
  while (v === 0) v = getRandom();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const generateColumnValue = (feature, rowIndex, getRandom, getNormal) => {
  const min = Number(feature.min);
  const max = Number(feature.max);
  const range = max - min;
  const dist = (feature.distribution || "").toLowerCase();

  if (feature.type === "numeric") {
    let value;
    if (dist === "sequential")          value = min + rowIndex;
    else if (dist === "uniform")        value = min + getRandom() * range;
    else if (dist === "normal")         value = min + ((getNormal() + 3) / 6) * range;
    else if (dist === "skewed to min")  value = min + Math.pow(getRandom(), 2) * range;
    else if (dist === "skewed to max")  value = min + (1 - Math.pow(getRandom(), 2)) * range;
    else                                value = min + getRandom() * range;

    return Math.round(Math.min(max, Math.max(min, value)));
  }

  if (feature.type === "category" || feature.type === "binary") {
    const vals = (feature.values || "").split(",").map(v => v.trim()).filter(Boolean);
    if (vals.length === 0) return null;
    return vals[Math.floor(getRandom() * vals.length)];
  }

  return null;
};


















/* ================= MAIN EXPORT ================= */
export const generatePreview = async (features, rows, useSeed, seed, target) => {
  const data = [];

  /* SEED */
  let currentSeed = Number(seed) || 1;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  const random = () => getRandomFn(useSeed, seededRandom);
  const normal = () => getNormalFn(random);

  /* ================= الأوزان — من الذكاء الاصطناعي أو عشوائية ================= */
  const aiWeights = await getSmartWeights(features, target);

  /* أوزان الأعمدة الرقمية */
  const numericWeights = {};
  features.filter(f => f.type === "numeric").forEach(f => {
    if (aiWeights?.numeric?.[f.name]) {
      const { weight, confidence } = aiWeights.numeric[f.name];
      numericWeights[f.name] = weight * confidence;
    } else {
      numericWeights[f.name] = (random() * 2) - 1;
    }
  });

  /* أوزان الأعمدة الفئوية والثنائية */
  const catWeights = {};
  features.filter(f => f.type === "category" || f.type === "binary").forEach(f => {
    const vals = (f.values || "").split(",").map(v => v.trim()).filter(Boolean);
    catWeights[f.name] = {};

    vals.forEach(v => {
      if (aiWeights?.categorical?.[f.name]?.values?.[v] !== undefined) {
        const score = aiWeights.categorical[f.name].values[v];
        const conf = aiWeights.categorical[f.name].confidence ?? 0.5;
        catWeights[f.name][v] = score * conf;
      } else {
        catWeights[f.name][v] = (random() * 2) - 1;
      }
    });
  });














  /* ================= GENERATE ROWS ================= */
  for (let i = 0; i < Number(rows); i++) {
    const row = {};
    let score = 0;

    features.forEach(feature => {
      const value = generateColumnValue(feature, i, random, normal);
      row[feature.name] = value;

      if (feature.type === "numeric") {
        const min = Number(feature.min);
        const max = Number(feature.max);
        const range = max - min;
        const norm = range > 0 ? ((value - min) / range) * 2 - 1 : 0;
        score += norm * numericWeights[feature.name];
      }

      if (feature.type === "category" || feature.type === "binary") {
        if (catWeights[feature.name]?.[value] !== undefined) {
          score += catWeights[feature.name][value];
        }
      }
    });

    /* TARGET */
    const targetName = target.name || "Target";
    const targetVals = target.values.split(",").map(v => v.trim());

    if (target.type === "binary") {
      row[targetName] = score >= 0 ? targetVals[1] : targetVals[0];
    }

    if (target.type === "multi") {
      const numF = features.length || 1;
      if (score < -numF / 3)      row[targetName] = targetVals[0];
      else if (score < numF / 3)  row[targetName] = targetVals[1];
      else                        row[targetName] = targetVals[2];
    }

    data.push(row);
  }

  return data;
};