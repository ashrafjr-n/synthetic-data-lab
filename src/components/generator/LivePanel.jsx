function LivePanel({ features = [], type }) {

  const total = features.length;

  const numeric = features.filter(f => f.type === "numeric").length;
  const category = features.filter(f => f.type === "category").length;
  const binary = features.filter(f => f.type === "binary").length;

  const missingNames = features.filter(
    f => !f.name || f.name.trim() === ""
  ).length;

  const invalidNumeric = features.filter(f => {
    if (f.type !== "numeric") return false;

    return Number(f.min) >= Number(f.max);
  }).length;

  const isReady =
    total > 0 &&
    missingNames === 0 &&
    invalidNumeric === 0;

  /* ================= EMPTY ================= */
  if (total === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 sticky top-6">

        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">
          Workspace Status
        </p>

        <h3 className="text-xl font-semibold mb-3">
          Start Building
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          Add your first feature to begin designing a synthetic dataset.
        </p>

      </div>
    );
  }

  /* ================= WARNING ================= */
  if (!isReady) {
    return (
      <div className="glass-card rounded-3xl p-8 sticky top-6">

        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">
          Dataset Intelligence
        </p>

        <div className="space-y-3 text-sm">

          <div>📦 Features: {total}</div>

          {missingNames > 0 && (
            <div className="text-red-600">
              ⚠ Missing Names: {missingNames}
            </div>
          )}

          {invalidNumeric > 0 && (
            <div className="text-yellow-600">
              ⚠ Numeric Config Issues: {invalidNumeric}
            </div>
          )}

          <div className="text-gray-500">
            Complete setup to unlock generation.
          </div>

        </div>

      </div>
    );
  }

  /* ================= READY ================= */
  return (
    <div className="glass-card rounded-3xl p-8 sticky top-6">

      <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">
        Dataset Intelligence
      </p>

      <div className="space-y-3 text-sm">

        <div>✅ Ready to Generate</div>
        <div>📦 Total Features: {total}</div>
        <div>🔢 Numeric: {numeric}</div>
        <div>🏷 Category: {category}</div>
        <div>⚫ Binary: {binary}</div>
        <div>🎯 Type: {type}</div>

      </div>

    </div>
  );
}

export default LivePanel;