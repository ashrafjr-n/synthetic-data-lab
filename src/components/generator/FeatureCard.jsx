import { useState } from "react";
import { motion } from "framer-motion";

const TYPE_COLORS = {
  numeric: { bg: "rgba(59,130,246,0.08)", color: "#1d4ed8", label: "Numeric" },
  category: { bg: "rgba(139,92,246,0.08)", color: "#7c3aed", label: "Category" },
  binary: { bg: "rgba(16,185,129,0.08)", color: "#047857", label: "Binary" },
};

function FeatureCard({ feature, index, removeFeature, updateFeature }) {
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
  const typeStyle = TYPE_COLORS[feature.type] || TYPE_COLORS.numeric;

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
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: open ? "20px" : "0" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "#d1d5db", fontWeight: "500" }}>
              F{index + 1}
            </span>
            <span style={{
              fontSize: "11px",
              fontWeight: "600",
              padding: "2px 10px",
              borderRadius: "100px",
              background: typeStyle.bg,
              color: typeStyle.color,
            }}>
              {typeStyle.label}
            </span>
          </div>
          <h4 style={{
            fontSize: "15px",
            fontWeight: "600",
            color: feature.name ? "#0a0a0a" : "#d1d5db",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {feature.name || "Untitled Feature"}
          </h4>
          {!open && (
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {renderSummary()}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "6px", marginLeft: "12px", flexShrink: 0 }}>
          <button
            onClick={handleToggle}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "500",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              background: "white",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            {open ? "Done" : "Edit"}
          </button>
          <button
            onClick={() => removeFeature(feature.id)}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              border: "1px solid #fee2e2",
              borderRadius: "10px",
              background: "white",
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {errors.map((e, i) => (
            <p key={i} style={{ fontSize: "12px", color: "#dc2626", margin: "2px 0" }}>⚠ {e}</p>
          ))}
        </div>
      )}

      {/* Edit Mode */}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Name */}
          <div>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Feature Name
            </label>
            <input
              className="input"
              placeholder="e.g. study_hours"
              value={feature.name}
              onChange={(e) => updateFeature(feature.id, "name", e.target.value)}
              style={{ fontFamily: "monospace", fontSize: "13px" }}
            />
          </div>

          {/* Type */}
          <div>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Feature Type
            </label>
            <select className="input" value={feature.type}
              onChange={(e) => updateFeature(feature.id, "type", e.target.value)}
              style={{ fontSize: "13px" }}>
              <option value="numeric">Numeric</option>
              <option value="category">Category</option>
              <option value="binary">Binary</option>
            </select>
          </div>

          {/* Numeric Settings */}
          {feature.type === "numeric" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>Min</label>
                  <input className="input" placeholder="0" value={feature.min}
                    onChange={(e) => updateFeature(feature.id, "min", e.target.value)}
                    style={{ fontFamily: "monospace", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>Max</label>
                  <input className="input" placeholder="100" value={feature.max}
                    disabled={isSequential}
                    onChange={(e) => updateFeature(feature.id, "max", e.target.value)}
                    style={{ fontFamily: "monospace", fontSize: "13px", opacity: isSequential ? 0.4 : 1 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>Distribution</label>
                <select className="input" value={feature.distribution}
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

          {/* Category Settings */}
          {feature.type === "category" && (
            <div>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>Values</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {(feature.values || "").split(",").filter(v => v.trim()).map((val, i) => (
                  <span key={i} style={{
                    padding: "4px 12px",
                    borderRadius: "100px",
                    background: "rgba(139,92,246,0.08)",
                    color: "#7c3aed",
                    fontSize: "12px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    {val.trim()}
                    <button onClick={() => removeCategoryValue(val.trim())}
                      style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", padding: "0", fontSize: "11px" }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input className="input" style={{ flex: 1, fontSize: "13px" }}
                  value={newValue} placeholder="Add value..."
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { addCategoryValue(newValue); setNewValue(""); } }}
                />
                <button
                  onClick={() => { addCategoryValue(newValue); setNewValue(""); }}
                  style={{
                    padding: "0 16px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    background: "white",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Binary Settings */}
          {feature.type === "binary" && (
            <div>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "6px", fontWeight: "500" }}>Values</label>
              <select className="input" value={feature.values}
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
