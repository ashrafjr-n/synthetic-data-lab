import { useState } from "react";
import { motion } from "framer-motion";

const TYPE_STYLES = {
  numeric:  { bg: "rgba(99,179,237,0.08)",  color: "rgba(99,179,237,0.85)",  border: "rgba(99,179,237,0.18)",  label: "Numeric"  },
  category: { bg: "rgba(167,139,250,0.08)", color: "rgba(167,139,250,0.85)", border: "rgba(167,139,250,0.18)", label: "Category" },
  binary:   { bg: "rgba(74,222,128,0.08)",  color: "rgba(74,222,128,0.85)",  border: "rgba(74,222,128,0.18)",  label: "Binary"   },
};

const SMALL_LABEL = {
  fontSize: "11px", color: "rgba(255,255,255,0.28)",
  display: "block", marginBottom: "6px",
  fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase",
};

function FeatureCard({ feature, index, removeFeature, updateFeature, hasError, isFlashing }) {
  const [open, setOpen] = useState(feature.open);
  const [errors, setErrors] = useState([]);
  const [newValue, setNewValue] = useState("");

  const validate = (f) => {
    const errs = [];
    if (!f.name || !f.name.trim()) errs.push("Name is required");
    if (f.type === "numeric" && f.distribution !== "sequential") {
      if (Number(f.min) > Number(f.max)) errs.push("Min cannot exceed Max");
    }
    return errs;
  };

  const handleToggle = () => {
    if (!open) { setOpen(true); return; }
    const errs = validate(feature);
    setErrors(errs);
    if (errs.length > 0) return;
    setOpen(false);
    updateFeature(feature.id, "open", false);
  };

  const addCategoryValue = (val) => {
    if (!val.trim()) return;
    const current = feature.values ? feature.values.split(",").map(v => v.trim()) : [];
    updateFeature(feature.id, "values", [...current, val.trim()].join(","));
  };

  const removeCategoryValue = (v) => {
    const updated = (feature.values || "").split(",").map(x => x.trim()).filter(x => x && x !== v);
    updateFeature(feature.id, "values", updated.join(","));
  };

  const isSequential = feature.type === "numeric" && feature.distribution === "sequential";
  const typeStyle = TYPE_STYLES[feature.type] || TYPE_STYLES.numeric;

  const renderSummary = () => {
    if (feature.type === "numeric") {
      if (isSequential) return `Sequential from ${feature.min}`;
      return `${feature.min} → ${feature.max} · ${feature.distribution}`;
    }
    if (feature.type === "category") {
      const items = (feature.values || "").split(",").map(v => v.trim()).filter(Boolean);
      if (!items.length) return "No values set";
      return items.slice(0, 3).join(", ") + (items.length > 3 ? ` +${items.length - 3}` : "");
    }
    if (feature.type === "binary") {
      const map = { "0,1": "0 / 1", "yes,no": "Yes / No", "pass,fail": "Pass / Fail", "true,false": "True / False" };
      return map[(feature.values || "").replace(/\s/g, "")] || "0 / 1";
    }
    return "-";
  };

  return (
    <div style={{
      background: hasError || isFlashing
        ? "rgba(239,68,68,0.04)"
        : "rgba(255,255,255,0.035)",
      border: hasError || isFlashing
        ? "1px solid rgba(239,68,68,0.25)"
        : "1px solid rgba(255,255,255,0.07)",
      borderRadius: "18px",
      padding: "18px 20px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
      transition: "border-color 0.25s, background 0.25s",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: open ? "18px" : 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", fontWeight: "600", fontFamily: "monospace" }}>
              F{index + 1}
            </span>
            <span style={{
              fontSize: "10px", fontWeight: "700", padding: "2px 9px", borderRadius: "100px",
              background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}`,
              letterSpacing: "0.06em",
            }}>
              {typeStyle.label}
            </span>
          </div>
          <h4 style={{
            fontSize: "14px", fontWeight: "600", margin: 0,
            color: feature.name ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.2)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {feature.name || "Untitled Feature"}
          </h4>
          {!open && (
            <p style={{
              fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "3px 0 0",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}>
              {renderSummary()}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "5px", marginLeft: "10px", flexShrink: 0 }}>
          <button
            onClick={handleToggle}
            style={{
              padding: "5px 12px", fontSize: "11px", fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px",
              background: open ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.04)",
              color: open ? "#D4AF37" : "rgba(255,255,255,0.45)",
              cursor: "pointer", transition: "all 0.18s",
            }}
          >
            {open ? "Done" : "Edit"}
          </button>
          <button
            onClick={() => removeFeature(feature.id)}
            style={{
              padding: "5px 9px", fontSize: "11px",
              border: "1px solid rgba(239,68,68,0.2)", borderRadius: "9px",
              background: "rgba(239,68,68,0.06)", color: "rgba(248,113,113,0.7)",
              cursor: "pointer", transition: "all 0.18s",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Inline errors */}
      {errors.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {errors.map((e, i) => (
            <p key={i} style={{ fontSize: "11px", color: "rgba(248,113,113,0.9)", margin: "2px 0", fontWeight: "500" }}>⚠ {e}</p>
          ))}
        </div>
      )}

      {/* Edit mode */}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>

          {/* Name */}
          <div>
            <label style={SMALL_LABEL}>Feature Name</label>
            <input className="builder-input"
              placeholder="e.g. study_hours"
              value={feature.name}
              onChange={(e) => updateFeature(feature.id, "name", e.target.value)}
              style={{ fontSize: "13px" }}
            />
          </div>

          {/* Type */}
          <div>
            <label style={SMALL_LABEL}>Feature Type</label>
            <select className="builder-select"
              value={feature.type}
              onChange={(e) => updateFeature(feature.id, "type", e.target.value)}
              style={{ fontSize: "13px" }}>
              <option value="numeric">Numeric</option>
              <option value="category">Category</option>
              <option value="binary">Binary</option>
            </select>
          </div>

          {/* Numeric */}
          {feature.type === "numeric" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={SMALL_LABEL}>Min</label>
                  <input className="builder-input"
                    placeholder="0" value={feature.min}
                    onChange={(e) => updateFeature(feature.id, "min", e.target.value)}
                    style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={SMALL_LABEL}>Max</label>
                  <input className="builder-input"
                    placeholder="100" value={feature.max}
                    disabled={isSequential}
                    onChange={(e) => updateFeature(feature.id, "max", e.target.value)}
                    style={{ fontSize: "13px", opacity: isSequential ? 0.35 : 1 }} />
                </div>
              </div>
              <div>
                <label style={SMALL_LABEL}>Distribution</label>
                <select className="builder-select"
                  value={feature.distribution}
                  onChange={(e) => updateFeature(feature.id, "distribution", e.target.value)}
                  style={{ fontSize: "13px" }}>
                  <option value="sequential">Sequential (Ordered)</option>
                  <option value="uniform">Uniform (Even spread)</option>
                  <option value="normal">Normal (Bell curve)</option>
                  <option value="skewed to min">Skewed → Min</option>
                  <option value="skewed to max">Skewed → Max</option>
                </select>
              </div>
            </>
          )}

          {/* Category */}
          {feature.type === "category" && (
            <div>
              <label style={SMALL_LABEL}>Values</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {(feature.values || "").split(",").filter(v => v.trim()).map((val, i) => (
                  <span key={i} style={{
                    padding: "3px 10px", borderRadius: "100px",
                    background: "rgba(167,139,250,0.08)", color: "rgba(167,139,250,0.85)",
                    border: "1px solid rgba(167,139,250,0.18)",
                    fontSize: "11px", fontWeight: "600",
                    display: "flex", alignItems: "center", gap: "5px",
                  }}>
                    {val.trim()}
                    <button onClick={() => removeCategoryValue(val.trim())}
                      style={{ background: "none", border: "none", color: "rgba(167,139,250,0.6)", cursor: "pointer", padding: 0, fontSize: "10px" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "7px" }}>
                <input className="builder-input" style={{ flex: 1, fontSize: "13px" }}
                  value={newValue} placeholder="Add value..."
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { addCategoryValue(newValue); setNewValue(""); }}}
                />
                <button
                  onClick={() => { addCategoryValue(newValue); setNewValue(""); }}
                  style={{
                    padding: "0 14px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    fontSize: "12px", cursor: "pointer", fontWeight: "600",
                    color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap",
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Binary */}
          {feature.type === "binary" && (
            <div>
              <label style={SMALL_LABEL}>Values</label>
              <select className="builder-select"
                value={feature.values}
                onChange={(e) => updateFeature(feature.id, "values", e.target.value)}
                style={{ fontSize: "13px" }}>
                <option value="0,1">0 / 1</option>
                <option value="yes,no">Yes / No</option>
                <option value="pass,fail">Pass / Fail</option>
                <option value="true,false">True / False</option>
              </select>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default FeatureCard;