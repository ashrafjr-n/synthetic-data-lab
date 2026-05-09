export function analyzeDataset(features = []) {

  let score = 100;
  let warnings = [];

  const numericCount = features.filter(f => f.type === "numeric").length;
  const categoryCount = features.filter(f => f.type === "category").length;

  // 1. Feature balance
  if (features.length === 0) {
    return {
      score: 0,
      complexity: "none",
      risk: "high",
      warnings: ["No features defined"]
    };
  }

  if (features.length < 2) {
    score -= 20;
    warnings.push("Too few features");
  }

  if (numericCount > features.length * 0.8) {
    score -= 10;
    warnings.push("Too many numeric features (low diversity)");
  }

  // 2. Complexity estimation
  let complexity = "low";

  if (features.length > 3) complexity = "medium";
  if (features.length > 6) complexity = "high";

  // 3. Risk estimation (simple rule-based)
  let risk = "low";

  if (features.length < 2) risk = "high";
  if (features.length >= 2 && features.length <= 3) risk = "medium";

  // clamp score
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    complexity,
    risk,
    warnings
  };
}