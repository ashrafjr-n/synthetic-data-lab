import { useMemo } from "react";

/* ================= RANDOM HELPERS ================= */
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

/* ================= GENERATOR ================= */
const generateValue = (feature) => {
  if (feature.type === "numeric") {
    const min = Number(feature.min || 0);
    const max = Number(feature.max || 100);

    const value = randInt(min, max);

    return value;
  }

  if (feature.type === "category") {
    const values = (feature.values || "")
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);

    return values.length ? pick(values) : "-";
  }

  if (feature.type === "binary") {
    const map = {
      "0,1": [0, 1],
      "yes,no": ["yes", "no"],
      "pass,fail": ["pass", "fail"],
      "true,false": [true, false]
    };

    const options = map[feature.values] || [0, 1];
    return pick(options);
  }

  return "-";
};

/* ================= MAIN COMPONENT ================= */
function LivePreviewTable({ features = [], rows = 10 }) {

  const data = useMemo(() => {
    return Array.from({ length: rows }).map(() => {
      const row = {};

      features.forEach((f) => {
        row[f.name || "feature"] = generateValue(f);
      });

      return row;
    });
  }, [features, rows]);

  if (!features.length) {
    return (
      <div className="glass-card rounded-2xl p-6 text-sm text-gray-500">
        No features yet — build your dataset to see live preview
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-5 overflow-auto">

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Live Preview Engine
        </p>
        <h3 className="text-lg font-semibold">
          Real-time Synthetic Dataset
        </h3>
      </div>

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">

          {/* HEADER ROW */}
          <thead>
            <tr className="text-left border-b border-gray-200">
              {features.map((f, i) => (
                <th key={i} className="py-2 pr-4 font-medium">
                  {f.name || `F${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">

                {Object.values(row).map((val, j) => (
                  <td key={j} className="py-2 pr-4 text-gray-700">
                    {String(val)}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default LivePreviewTable;