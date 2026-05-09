import { motion } from "framer-motion";

// Flash keyframe injected once
const FLASH_STYLE_ID = "input-flash-style";
if (!document.getElementById(FLASH_STYLE_ID)) {
  const s = document.createElement("style");
  s.id = FLASH_STYLE_ID;
  s.textContent = `
    @keyframes inputFlash {
      0%   { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(239,68,68,0.18); }
      60%  { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(239,68,68,0.18); }
      100% { border-color: #e5e7eb; box-shadow: none; }
    }
    .input-flash { animation: inputFlash 0.9s ease forwards; }
  `;
  document.head.appendChild(s);
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      style={{ fontSize: "11px", color: "#dc2626", margin: "5px 0 0 4px", fontWeight: "500" }}
    >
      {msg}
    </motion.p>
  );
}

function DatasetSetup({
  datasetName, setDatasetName,
  rows, setRows,
  seed, setSeed,
  useSeed, setUseSeed,
  errors = {},
  flashFields = new Set(),
}) {
  const flashClass = (key) => flashFields.has(key) ? "input-flash" : "";

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.7)",
      borderRadius: "24px",
      padding: "28px 32px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    }}>
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>
          Step 01
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0a0a0a", margin: 0 }}>
          Dataset Configuration
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "start" }}>

        {/* Dataset Name */}
        <div id="section-datasetName">
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Dataset Name
          </label>
          <input
            className={`input ${flashClass("datasetName")}`}
            placeholder="e.g. employee_data"
            value={datasetName}
            maxLength={20}
            onChange={(e) => setDatasetName(e.target.value.slice(0, 20))}
            style={{
              fontFamily: "monospace", fontSize: "14px",
              borderColor: errors.datasetName && !flashFields.has("datasetName") ? "#dc2626" : undefined,
            }}
          />
          <FieldError msg={errors.datasetName} />
        </div>

        {/* Number of Rows */}
        <div id="section-rows">
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Number of Rows
          </label>
          <input
            className={`input ${flashClass("rows")}`}
            placeholder="e.g. 1000"
            value={rows}
            type="text"
            onChange={(e) => setRows(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{
              fontFamily: "monospace", fontSize: "14px",
              borderColor: errors.rows && !flashFields.has("rows") ? "#dc2626" : undefined,
            }}
          />
          <FieldError msg={errors.rows} />
        </div>

        {/* Reproducible Seed Toggle */}
        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Reproducible Seed
          </label>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            height: "50px", padding: "0 16px", borderRadius: "14px",
            border: "1px solid #e5e7eb", background: "rgba(255,255,255,0.85)", cursor: "pointer",
          }}
            onClick={() => setUseSeed(!useSeed)}
          >
            <span style={{ fontSize: "13px", color: "#6b7280", flex: 1 }}>
              {useSeed ? "Fixed seed enabled" : "Random each time"}
            </span>
            <div style={{
              width: "44px", height: "26px", borderRadius: "100px",
              background: useSeed ? "#0a0a0a" : "#e5e7eb",
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}>
              <motion.div
                layout
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", background: "white",
                  position: "absolute", top: "3px", left: useSeed ? "21px" : "3px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transition: "left 0.2s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Seed Number */}
        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Seed Number
          </label>
          {useSeed ? (
            <>
              <input
                className={`input ${flashClass("seed")}`}
                placeholder="e.g. 42"
                value={seed}
                type="text"
                onChange={(e) => setSeed(e.target.value.replace(/\D/g, "").slice(0, 4))}
                style={{
                  fontFamily: "monospace", fontSize: "14px",
                  borderColor: errors.seed && !flashFields.has("seed") ? "#dc2626" : undefined,
                }}
              />
              <FieldError msg={errors.seed} />
            </>
          ) : (
            <div style={{
              height: "50px", borderRadius: "14px", border: "1px dashed #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", color: "#d1d5db",
            }}>
              Enable seed first
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DatasetSetup;