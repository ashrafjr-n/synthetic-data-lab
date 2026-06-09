function LivePanel({ features = [], type }) {
  const total    = features.length;
  const numeric  = features.filter(f => f.type === "numeric").length;
  const category = features.filter(f => f.type === "category").length;
  const binary   = features.filter(f => f.type === "binary").length;
  const missingNames   = features.filter(f => !f.name || f.name.trim() === "").length;
  const invalidNumeric = features.filter(f => f.type === "numeric" && Number(f.min) >= Number(f.max)).length;
  const isReady = total > 0 && missingNames === 0 && invalidNumeric === 0;

  const PANEL_STYLE = {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "24px",
    padding: "28px",
    position: "sticky",
    top: "90px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
  };

  const ROW = ({ icon, label, value, color }) => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{ opacity: 0.6 }}>{icon}</span> {label}
      </span>
      <span style={{ fontSize: "12px", fontWeight: "700", color: color || "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>
        {value}
      </span>
    </div>
  );

  if (total === 0) return (
    <div style={PANEL_STYLE}>
      <p style={{ fontSize: "10px", color: "rgba(212,175,55,0.45)", textTransform: "uppercase", letterSpacing: "0.22em", margin: "0 0 16px", fontFamily: "monospace" }}>
        Workspace Status
      </p>
      <h3 style={{ fontSize: "17px", fontWeight: "600", color: "rgba(255,255,255,0.75)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        Start Building
      </h3>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", lineHeight: 1.65, margin: 0 }}>
        Add your first feature to begin designing a synthetic dataset.
      </p>
    </div>
  );

  return (
    <div style={PANEL_STYLE}>
      <p style={{ fontSize: "10px", color: "rgba(212,175,55,0.45)", textTransform: "uppercase", letterSpacing: "0.22em", margin: "0 0 16px", fontFamily: "monospace" }}>
        Dataset Intelligence
      </p>

      {/* Status badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        padding: "6px 12px", borderRadius: "100px", marginBottom: "18px",
        background: isReady ? "rgba(74,222,128,0.07)" : "rgba(245,158,11,0.07)",
        border: isReady ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(245,158,11,0.2)",
      }}>
        <span style={{ fontSize: "8px", color: isReady ? "rgba(74,222,128,0.9)" : "rgba(245,158,11,0.9)" }}>●</span>
        <span style={{ fontSize: "11px", fontWeight: "600", color: isReady ? "rgba(74,222,128,0.9)" : "rgba(245,158,11,0.85)" }}>
          {isReady ? "Ready to Generate" : "Setup Incomplete"}
        </span>
      </div>

      <div>
        <ROW icon="◈" label="Total Features" value={total} />
        <ROW icon="▸" label="Numeric"         value={numeric}  color="rgba(99,179,237,0.7)"  />
        <ROW icon="▸" label="Category"        value={category} color="rgba(167,139,250,0.7)" />
        <ROW icon="▸" label="Binary"          value={binary}   color="rgba(74,222,128,0.7)"  />
        <ROW icon="◎" label="Target Type"     value={type}     color="rgba(212,175,55,0.7)"  />
      </div>

      {!isReady && (
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "7px" }}>
          {missingNames > 0 && (
            <div style={{
              fontSize: "11.5px", color: "rgba(248,113,113,0.85)", fontWeight: "500",
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "9px", padding: "8px 12px",
            }}>
              ⚠ {missingNames} feature{missingNames > 1 ? "s" : ""} missing name
            </div>
          )}
          {invalidNumeric > 0 && (
            <div style={{
              fontSize: "11.5px", color: "rgba(251,191,36,0.85)", fontWeight: "500",
              background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: "9px", padding: "8px 12px",
            }}>
              ⚠ {invalidNumeric} numeric config issue{invalidNumeric > 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LivePanel;