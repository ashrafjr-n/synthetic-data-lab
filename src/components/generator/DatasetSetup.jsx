import { motion } from "framer-motion";

/* Flash animation injected once */
const FLASH_STYLE_ID = "input-flash-style-dark";
if (typeof document !== "undefined" && !document.getElementById(FLASH_STYLE_ID)) {
  const s = document.createElement("style");
  s.id = FLASH_STYLE_ID;
  s.textContent = `
    @keyframes inputFlashDark {
      0%   { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
      60%  { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
      100% { border-color: rgba(255,255,255,0.08); box-shadow: none; }
    }
    .input-flash-dark { animation: inputFlashDark 0.9s ease forwards; }

    .builder-input {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-family: 'Courier New', monospace;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .builder-input::placeholder { color: rgba(255,255,255,0.2); }
    .builder-input:focus {
      border-color: rgba(212,175,55,0.35);
      box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
      background: rgba(255,255,255,0.055);
    }
    .builder-input:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .builder-select {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }
    .builder-select:focus {
      border-color: rgba(212,175,55,0.35);
      box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
    }
    .builder-select option {
      background: #141414;
      color: rgba(255,255,255,0.85);
    }
  `;
  document.head.appendChild(s);
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{ fontSize: "11px", color: "rgba(248,113,113,0.9)", margin: "5px 0 0 4px", fontWeight: "500" }}
    >
      {msg}
    </motion.p>
  );
}

const LABEL_STYLE = {
  fontSize: "11px", color: "rgba(255,255,255,0.3)",
  display: "block", marginBottom: "8px",
  fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase",
};

function DatasetSetup({
  datasetName, setDatasetName,
  rows, setRows,
  seed, setSeed,
  useSeed, setUseSeed,
  errors = {},
  flashFields = new Set(),
}) {
  const flashClass = (key) => flashFields.has(key) ? "input-flash-dark" : "";

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "24px",
      padding: "28px 32px",
      boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px",
          background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", color: "#D4AF37", flexShrink: 0,
        }}>01</div>
        <div>
          <p style={{ fontSize: "10px", color: "rgba(212,175,55,0.5)", textTransform: "uppercase", letterSpacing: "0.22em", margin: "0 0 2px", fontFamily: "monospace" }}>
            Step 01
          </p>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.88)", margin: 0, letterSpacing: "-0.02em" }}>
            Dataset Configuration
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "start" }}>

        {/* Dataset Name */}
        <div id="section-datasetName">
          <label style={LABEL_STYLE}>Dataset Name</label>
          <input
            className={`builder-input ${flashClass("datasetName")}`}
            placeholder="e.g. employee_data"
            value={datasetName}
            maxLength={20}
            onChange={(e) => setDatasetName(e.target.value.slice(0, 20))}
            style={{ borderColor: errors.datasetName && !flashFields.has("datasetName") ? "rgba(239,68,68,0.5)" : undefined }}
          />
          <FieldError msg={errors.datasetName} />
        </div>

        {/* Rows */}
        <div id="section-rows">
          <label style={LABEL_STYLE}>Number of Rows</label>
          <input
            className={`builder-input ${flashClass("rows")}`}
            placeholder="e.g. 1000"
            value={rows}
            type="text"
            onChange={(e) => setRows(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ borderColor: errors.rows && !flashFields.has("rows") ? "rgba(239,68,68,0.5)" : undefined }}
          />
          <FieldError msg={errors.rows} />
        </div>

        {/* Seed Toggle */}
        <div>
          <label style={LABEL_STYLE}>Reproducible Seed</label>
          <div
            onClick={() => setUseSeed(!useSeed)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              height: "48px", padding: "0 16px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: useSeed ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.04)",
              cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s",
              borderColor: useSeed ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", flex: 1 }}>
              {useSeed ? "Fixed seed enabled" : "Random each time"}
            </span>
            <div style={{
              width: "40px", height: "22px", borderRadius: "100px",
              background: useSeed ? "rgba(212,175,55,0.8)" : "rgba(255,255,255,0.1)",
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}>
              <motion.div
                layout
                style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: "white", position: "absolute",
                  top: "3px", left: useSeed ? "21px" : "3px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Seed Number */}
        <div>
          <label style={LABEL_STYLE}>Seed Number</label>
          {useSeed ? (
            <>
              <input
                className={`builder-input ${flashClass("seed")}`}
                placeholder="e.g. 42"
                value={seed}
                type="text"
                onChange={(e) => setSeed(e.target.value.replace(/\D/g, "").slice(0, 4))}
                style={{ borderColor: errors.seed && !flashFields.has("seed") ? "rgba(239,68,68,0.5)" : undefined }}
              />
              <FieldError msg={errors.seed} />
            </>
          ) : (
            <div style={{
              height: "48px", borderRadius: "12px",
              border: "1px dashed rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", color: "rgba(255,255,255,0.15)",
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