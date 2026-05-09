import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import PreviewModal from "../live/PreviewModal";

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

const [showSample, setShowSample] = useState(false);

const SAMPLE_DATA = Array.from({ length: 120 }, (_, i) => ({
  employee_id: i + 1,
  age: Math.floor(Math.random() * 35) + 22,
  gender: ["Male", "Female", "Other"][Math.floor(Math.random() * 3)],
  department: ["Engineering", "Sales", "HR", "Marketing", "Finance"][Math.floor(Math.random() * 5)],
  years_experience: Math.floor(Math.random() * 20) + 1,
  education: ["Bachelor's", "Master's", "PhD", "High School"][Math.floor(Math.random() * 4)],
  salary: Math.floor(Math.random() * 80000) + 30000,
  performance_score: +(Math.random() * 4 + 1).toFixed(2),
  remote_work: Math.random() > 0.5 ? 1 : 0,
  churn: Math.random() > 0.65 ? 1 : 0,
}));

const EXAMPLE_CONFIG = {
  datasetName: "employee_churn",
  rows: "500",
  seed: "4821",
  useSeed: true,
  target: { name: "churn", type: "binary", values: "0,1" },
  features: [
    { id: 1, name: "employee_id",       type: "numeric",      min: 1,     max: 1000,  distribution: "sequential", values: "", open: false },
    { id: 2, name: "age",               type: "numeric",      min: 22,    max: 58,    distribution: "normal",     values: "", open: false },
    { id: 3, name: "gender",            type: "categorical",  min: "",    max: "",    distribution: "uniform",    values: "Male,Female,Other", open: false },
    { id: 4, name: "department",        type: "categorical",  min: "",    max: "",    distribution: "uniform",    values: "Engineering,Sales,HR,Marketing,Finance", open: false },
    { id: 5, name: "years_experience",  type: "numeric",      min: 1,     max: 25,    distribution: "right_skewed", values: "", open: false },
    { id: 6, name: "education",         type: "categorical",  min: "",    max: "",    distribution: "uniform",    values: "Bachelor's,Master's,PhD,High School", open: false },
    { id: 7, name: "salary",            type: "numeric",      min: 30000, max: 120000, distribution: "normal",   values: "", open: false },
    { id: 8, name: "performance_score", type: "numeric",      min: 1,     max: 5,     distribution: "normal",    values: "", open: false },
    { id: 9, name: "remote_work",       type: "binary",       min: "",    max: "",    distribution: "uniform",   values: "0,1", open: false },
  ],
};


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[720px] flex flex-col justify-center"
      style={{ overflow: "hidden" }}
    >
      <motion.div
        style={{ y, opacity, padding: "0 56px" }}
        className="relative grid lg:grid-cols-2 gap-20 items-center"
      >
        {/* ── Left: Main copy ── */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "7px 18px", borderRadius: "100px",
              border: "1px solid rgba(199,167,74,0.25)",
              background: "rgba(199,167,74,0.06)", marginBottom: "32px",
            }}
          >
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#c7a74a", display: "inline-block",
              boxShadow: "0 0 6px rgba(199,167,74,0.6)",
            }} />
            <span style={{
              fontSize: "11px", fontWeight: "600", color: "#9a7a28",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              AI-Powered Synthetic Data
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            style={{
              fontSize: "clamp(3rem, 5.2vw, 4.5rem)", fontWeight: "800",
              lineHeight: "1.02", letterSpacing: "-0.04em",
              color: "#0a0a0a", marginBottom: "28px",
            }}
          >
            Design Realistic<br />
            ML Datasets —<br />
            <span style={{ color: "#c7a74a", position: "relative", display: "inline-block" }}>
              Without Code.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                style={{
                  position: "absolute", bottom: "-4px", left: 0, right: 0,
                  height: "2px", background: "rgba(199,167,74,0.4)",
                  borderRadius: "2px", transformOrigin: "left",
                }}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            style={{
              fontSize: "1.05rem", color: "#6b7280", lineHeight: "1.85",
              maxWidth: "460px", marginBottom: "44px",
            }}
          >
            Configure features, distributions, and class relationships — then let the
            AI engine synthesize structured, realistic datasets ready for any ML pipeline.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5 }}
            style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/builder")}
              style={{
                background: "#0a0a0a", color: "white", border: "none",
                borderRadius: "14px", padding: "15px 30px", fontSize: "14px",
                fontWeight: "700", cursor: "pointer",
                boxShadow: "0 8px 28px rgba(0,0,0,0.14)", letterSpacing: "0.01em",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              Start Building
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "22px", height: "22px", borderRadius: "6px",
                background: "rgba(255,255,255,0.15)", fontSize: "13px",
              }}>→</span>
            </motion.button>

            <motion.button
              whileHover={{ borderColor: "#c7a74a", color: "#6b5320" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSample(true)}
              style={{
                background: "transparent", color: "#9ca3af", border: "1px solid #e9eaec",
                borderRadius: "14px", padding: "15px 26px", fontSize: "14px",
                fontWeight: "500", cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <span style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(199,167,74,0.1)", display: "inline-flex",
                alignItems: "center", justifyContent: "center", fontSize: "12px",
              }}>
                ⊞
                </span>
              View Sample Dataset
            </motion.button>
          </motion.div>
{showSample && (
  <PreviewModal
    data={SAMPLE_DATA}
    loading={false}
    datasetName="employee_churn_sample"
    onClose={() => setShowSample(false)}
  />
)}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              display: "flex", gap: "0", marginTop: "52px",
              paddingTop: "28px", borderTop: "1px solid #f1f2f4",
            }}
          >
            {[
              { num: "10+", label: "Feature types" },
              { num: "5", label: "Distributions" },
              { num: "AI", label: "Relationship engine" },
              { num: "CSV", label: "Instant export" },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, paddingRight: "20px",
                borderRight: i < 3 ? "1px solid #f1f2f4" : "none",
                marginRight: i < 3 ? "20px" : "0",
              }}>
                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.03em" }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: "11px", color: "#b0b5bf", marginTop: "3px", letterSpacing: "0.02em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Preview card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          <PreviewCard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */
function Sparkline({ color = "#c7a74a", values }) {
  const w = 120, h = 40;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const yp = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${yp}`;
  }).join(" ");
  const gradId = `sg${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MINI BAR CHART
───────────────────────────────────────────── */
function MiniBarChart() {
  const bars = [
    { label: "age", pct: 72 },
    { label: "salary", pct: 91 },
    { label: "exp", pct: 58 },
    { label: "dept", pct: 44 },
    { label: "score", pct: 83 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      {bars.map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "10px", color: "#9ca3af", width: "34px", flexShrink: 0, letterSpacing: "0.04em" }}>
            {b.label}
          </span>
          <div style={{ flex: 1, height: "5px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${b.pct}%`, background: "#c7a74a", borderRadius: "3px" }} />
          </div>
          <span style={{ fontSize: "10px", color: "#c7a74a", fontWeight: "600", width: "26px", textAlign: "right" }}>
            {b.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIEW A — TABLE
───────────────────────────────────────────── */
function TableView() {
  const rows = [
    { age: 34, salary: 72000, exp: 5, target: 1 },
    { age: 52, salary: 95000, exp: 14, target: 1 },
    { age: 23, salary: 33000, exp: 1, target: 0 },
    { age: 41, salary: 63000, exp: 9, target: 1 },
    { age: 28, salary: 38000, exp: 2, target: 0 },
    { age: 36, salary: 71000, exp: 11, target: 1 },
    { age: 29, salary: 33000, exp: 4, target: 0 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f8f8f6", border: "1px solid #eeeeea",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
          }}>📊</div>
          <div>
            <p style={{ fontSize: "10px", color: "#b0b5bf", textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>
              Generated Dataset
            </p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#0a0a0a", margin: "3px 0 0", letterSpacing: "-0.01em" }}>
              employee_data.csv
            </p>
          </div>
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: "100px",
          background: "rgba(199,167,74,0.09)", border: "1px solid rgba(199,167,74,0.18)",
          fontSize: "11px", color: "#9a7a28", fontWeight: "600", letterSpacing: "0.03em",
        }}>
          ✓ AI Ready
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "2px", background: "#f3f4f6", borderRadius: "2px", marginBottom: "16px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ height: "100%", background: "linear-gradient(90deg, #c7a74a, #e8c76e)", borderRadius: "2px" }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
          <thead>
            <tr style={{ background: "#fafaf9" }}>
              {["age", "salary", "exp", "target"].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "8px 12px",
                  color: "#9ca3af", fontWeight: "600", fontSize: "10px",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  borderBottom: "1px solid #f1f2f4",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td style={{ padding: "10px 12px", color: "#374151", fontWeight: "500" }}>{row.age}</td>
                <td style={{ padding: "10px 12px", color: "#374151" }}>{row.salary.toLocaleString()}</td>
                <td style={{ padding: "10px 12px", color: "#374151" }}>{row.exp} yrs</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "6px",
                    fontSize: "11px", fontWeight: "700", letterSpacing: "0.04em",
                    background: row.target === 1 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                    color: row.target === 1 ? "#059669" : "#dc2626",
                    border: `1px solid ${row.target === 1 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)"}`,
                  }}>
                    {row.target === 1 ? "1" : "0"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "14px", borderTop: "1px solid #f3f4f6",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#b0b5bf" }}>1,000 rows</span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
          <span style={{ fontSize: "11px", color: "#b0b5bf" }}>4 features</span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
          <span style={{ fontSize: "11px", color: "#b0b5bf" }}>Binary target</span>
        </div>
        <motion.span
          whileHover={{ color: "#9a7a28", x: 2 }}
          style={{
            fontSize: "12px", color: "#c7a74a", fontWeight: "600",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.2s",
          }}
        >
          Export CSV <span>↓</span>
        </motion.span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIEW B — DASHBOARD
───────────────────────────────────────────── */
function DashboardView() {
  const sparkData = [22, 38, 31, 55, 48, 62, 58, 74, 69, 83, 78, 91];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "11px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "10px", color: "#b0b5bf", textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>
            Dataset Report
          </p>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#0a0a0a", margin: "3px 0 0", letterSpacing: "-0.02em" }}>
            employee_churn.csv
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
          />
          <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>Live</span>
        </div>
      </div>

      {/* Metric chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {[
          { label: "Rows", value: "1,000", sub: "generated" },
          { label: "Features", value: "8", sub: "columns" },
          { label: "Accuracy", value: "94.2%", sub: "AI model" },
        ].map((m, i) => (
          <div key={i} style={{
            background: "#fafaf8", border: "1px solid #f0f0ec",
            borderRadius: "12px", padding: "10px 12px",
          }}>
            <div style={{ fontSize: "10px", color: "#b0b5bf", letterSpacing: "0.06em", marginBottom: "4px" }}>{m.label}</div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: "10px", color: "#d1d5db", marginTop: "3px" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div style={{ background: "#fafaf8", border: "1px solid #f0f0ec", borderRadius: "14px", padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#374151" }}>Salary Distribution</span>
          <span style={{ fontSize: "10px", color: "#c7a74a", fontWeight: "600" }}>↑ 12.4%</span>
        </div>
        <Sparkline values={sparkData} color="#c7a74a" />
      </div>

      {/* Feature importance */}
      <div style={{ background: "#fafaf8", border: "1px solid #f0f0ec", borderRadius: "14px", padding: "12px 14px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>Feature Importance</div>
        <MiniBarChart />
      </div>

      {/* Class distribution */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#374151" }}>Class Balance</span>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Binary target</span>
        </div>
        <div style={{ display: "flex", gap: "4px", height: "8px", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ flex: 62, background: "#059669", borderRadius: "6px 0 0 6px" }} />
          <div style={{ flex: 38, background: "#f3f4f6", borderRadius: "0 6px 6px 0" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
          <span style={{ fontSize: "10px", color: "#059669", fontWeight: "600" }}>62% — Class 1</span>
          <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: "500" }}>38% — Class 0</span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "12px", borderTop: "1px solid #f3f4f6",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "6px", background: "#0a0a0a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", color: "white",
          }}>✦</div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>AI-generated · seed #4821</span>
        </div>
        <motion.span
          whileHover={{ color: "#9a7a28" }}
          style={{ fontSize: "12px", color: "#c7a74a", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }}
        >
          Export CSV ↓
        </motion.span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOT PROGRESS NAVIGATOR
   نقطتان مع ring يتملى تلقائياً — اضغط لتتنقل
───────────────────────────────────────────── */
const VIEWS = ["table", "dashboard"];
const AUTO_MS = 5500;
const RING_R = 7;
const RING_CIRC = 2 * Math.PI * RING_R;

function DotProgress({ active, progress, onDotClick }) {
  const labels = { table: "TABLE VIEW", dashboard: "REPORT VIEW" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {VIEWS.map((v) => {
        const isActive = active === v;
        const dash = isActive ? RING_CIRC * (1 - progress) : RING_CIRC;
        return (
          <button
            key={v}
            onClick={() => onDotClick(v)}
            title={v === "table" ? "Table" : "Report"}
            style={{
              background: "none", border: "none", padding: 0,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 0,
            }}
          >
            <svg width="22" height="22">
              {/* Track ring */}
              <circle cx="11" cy="11" r={RING_R} fill="none" stroke="#eeeeea" strokeWidth="2" />
              {/* Progress arc — always rendered; on inactive it stays full-dashed (invisible) */}
              <circle
                cx="11" cy="11" r={RING_R}
                fill="none"
                stroke={isActive ? "#c7a74a" : "transparent"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={dash}
                transform="rotate(-90 11 11)"
                style={{ transition: "stroke-dashoffset 0.06s linear" }}
              />
              {/* Inner dot */}
              <circle cx="11" cy="11" r="3" fill={isActive ? "#c7a74a" : "#d1d5db"} />
            </svg>
          </button>
        );
      })}

      {/* Animated label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={active}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: "10px", fontWeight: "600", color: "#b0b5bf",
            letterSpacing: "0.1em", userSelect: "none",
          }}
        >
          {labels[active]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PREVIEW CARD
───────────────────────────────────────────── */
const CARD_H = 436; // fixed height so both views match

function PreviewCard() {
  const [view, setView] = useState("table");
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  // rAF ticker — drives both the arc and the auto-switch
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / AUTO_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setView(v => (v === "table" ? "dashboard" : "table"));
        startRef.current = Date.now();
        setProgress(0);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleDotClick = (v) => {
    if (v === view) return;
    cancelAnimationFrame(rafRef.current);
    setView(v);
    startRef.current = Date.now();
    setProgress(0);
    // restart ticker
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / AUTO_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setView(cur => (cur === "table" ? "dashboard" : "table"));
        startRef.current = Date.now();
        setProgress(0);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div style={{ position: "relative" }}>

      {/* Shadow card behind */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-16px", right: "-16px", left: "16px", bottom: "16px",
          background: "rgba(199,167,74,0.08)",
          border: "1px solid rgba(199,167,74,0.15)",
          borderRadius: "24px", zIndex: 0,
        }}
      />

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "relative", zIndex: 1,
          background: "#ffffff", borderRadius: "24px",
          padding: "22px 24px 20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        {/* Navigator */}
        <div style={{ marginBottom: "16px" }}>
          <DotProgress active={view} progress={progress} onDotClick={handleDotClick} />
        </div>

        {/* Fixed-height content area — crossfade, no gap between exit and enter */}
        <div style={{ position: "relative", height: `${CARD_H}px`, overflow: "hidden" }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.984, filter: "blur(5px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.984, filter: "blur(5px)" }}
              transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: "absolute", inset: 0 }}
            >
              {view === "table" ? <TableView /> : <DashboardView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{
          position: "absolute", bottom: "-18px", left: "24px",
          background: "#0a0a0a", color: "white",
          padding: "8px 16px", borderRadius: "100px",
          fontSize: "12px", fontWeight: "600",
          display: "flex", alignItems: "center", gap: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 2, letterSpacing: "0.01em",
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4ade80", display: "inline-block",
            boxShadow: "0 0 6px rgba(74,222,128,0.7)",
          }}
        />
        AI engine active
      </motion.div>
    </div>
  );
}

export default HeroSection;