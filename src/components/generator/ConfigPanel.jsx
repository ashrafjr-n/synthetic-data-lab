import FeatureBuilder from "./FeatureBuilder";

function ConfigPanel({ type, features, setFeatures }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "28px",
      padding: "36px 40px",
      boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
    }}>
      <p style={{
        fontSize: "10px", fontWeight: "700", color: "rgba(212,175,55,0.45)",
        textTransform: "uppercase", letterSpacing: "0.25em",
        margin: "0 0 6px", fontFamily: "monospace",
      }}>
        Dataset Configuration
      </p>
      <p style={{
        fontSize: "11px", color: "rgba(255,255,255,0.2)",
        margin: "0 0 28px", fontFamily: "monospace",
      }}>
        type: <span style={{ color: "rgba(99,179,237,0.7)" }}>{type}</span>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Dataset Name", placeholder: "e.g. employee_data" },
          { label: "Rows",         placeholder: "e.g. 1000",         type: "number" },
          { label: "Seed",         placeholder: "e.g. 42",           type: "number" },
        ].map((f, i) => (
          <div key={i}>
            <label style={{
              fontSize: "11px", color: "rgba(255,255,255,0.28)",
              display: "block", marginBottom: "7px",
              fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>{f.label}</label>
            <input
              className="builder-input"
              placeholder={f.placeholder}
              type={f.type || "text"}
            />
          </div>
        ))}
      </div>

      <FeatureBuilder features={features} setFeatures={setFeatures} />
    </div>
  );
}

export default ConfigPanel;