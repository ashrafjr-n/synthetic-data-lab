import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldCheck, Activity, BrainCircuit,
  ChartColumn, Target, TriangleAlert, History,
  ChevronDown, Download, X,
} from "lucide-react";

const calcHealthScore = (features, target) => {
  let score = 0;
  const hints = [];
  if (features.length === 0) return { score: 0, hints: ["Add at least one feature"] };
  if (features.length >= 2) score += 20; else hints.push("Add more features");
  if (target.name && target.name !== "Target") score += 20; else hints.push("Name your target clearly");
  const unclearNames = features.filter((f) => {
    const n = (f.name || "").toLowerCase();
    return !n || n.match(/^(x\d+|col\d+|var\d+|f\d+|feature\d*)$/);
  });
  if (unclearNames.length === 0) score += 20; else hints.push(`${unclearNames.length} unclear feature name(s)`);
  const types = new Set(features.map((f) => f.type));
  if (types.size >= 2) score += 20; else hints.push("Mix feature types");
  if (features.some((f) => f.type === "numeric")) score += 20; else hints.push("Add at least one numeric feature");
  return { score, hints };
};

const calcAIReadiness = (features, target) => {
  const KEYWORDS = [
    "age","salary","income","score","grade","hours","sleep","study","work",
    "height","weight","price","cost","rate","level","count","time","days",
    "health","stress","exercise","diet","exp","year","month","size",
    "pass","fail","loan","fraud","churn","risk","approved","rejected","gender",
    "city","country","category","type","status","class","label","group",
  ];
  let ready = 0;
  const unclear = [];
  features.forEach((f) => {
    const n = (f.name || "").toLowerCase().replace(/[-_]/g, "");
    if (KEYWORDS.some((k) => n.includes(k))) ready++;
    else unclear.push(f.name || "unnamed");
  });
  const targetKnown = KEYWORDS.some((k) => (target.name || "").toLowerCase().includes(k));
  const total = features.length + 1;
  const pct = total > 0 ? Math.round(((ready + (targetKnown ? 1 : 0)) / total) * 100) : 0;
  return { pct, unclear: unclear.slice(0, 3), targetKnown };
};

const calcWarnings = (features, target, rows) => {
  const warnings = [];
  if (Number(rows) > 5000) warnings.push({ icon: "⏳", text: "Large dataset — generation may take a moment" });
  if (features.length > 1 && features.every((f) => f.type === "numeric")) warnings.push({ icon: "⚠", text: "All features are numeric — add category variety" });
  if (!target.name || target.name === "Target") warnings.push({ icon: "⚠", text: "Target name unclear" });
  const emptyValues = features.filter((f) => (f.type === "category" || f.type === "binary") && !f.values);
  if (emptyValues.length > 0) warnings.push({ icon: "⚠", text: `${emptyValues.length} feature(s) missing values` });
  return warnings;
};

const calcSmartWarnings = (features, target, rows) => {
  const items = [];
  if (features.length === 0) items.push({ level: "error", text: "No features added yet — add at least 1 to start." });
  else if (features.length < 3) items.push({ level: "warn", text: `Only ${features.length} feature(s). Aim for at least 6 for a realistic dataset.` });
  else if (features.length < 6) items.push({ level: "warn", text: `${features.length} features. Adding more improves dataset quality.` });
  else items.push({ level: "ok", text: `${features.length} features — good variety.` });
  const unclearNames = features.filter((f) => { const n = (f.name || "").toLowerCase(); return !n || n.match(/^(x\d+|col\d+|var\d+|f\d+|feature\d*)$/); });
  if (unclearNames.length > 0) items.push({ level: "warn", text: `${unclearNames.length} feature name(s) are unclear. Use descriptive names.` });
  else if (features.length > 0) items.push({ level: "ok", text: "All feature names are clear." });
  if (!target.name || target.name === "Target") items.push({ level: "warn", text: 'Target is unnamed or set to "Target". Give it a meaningful name.' });
  else items.push({ level: "ok", text: `Target "${target.name}" is clearly named.` });
  if (features.length > 1) {
    const types = new Set(features.map((f) => f.type));
    if (types.size === 1) items.push({ level: "warn", text: `All features are ${[...types][0]}. Mix types for richer data.` });
    else items.push({ level: "ok", text: "Feature types are varied — great." });
  }
  const emptyValues = features.filter((f) => (f.type === "category" || f.type === "binary") && !f.values);
  if (emptyValues.length > 0) items.push({ level: "warn", text: `${emptyValues.length} category/binary feature(s) have no values defined.` });
  if (Number(rows) > 5000) items.push({ level: "info", text: "Large dataset (>5000 rows) — generation may be slower." });
  return items;
};

const HISTORY_KEY = "sdl_dataset_history";
const ONBOARDING_KEY = "sdl_onboarding_done";

export const saveToHistory = (entry) => {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing].slice(0, 8)));
    window.dispatchEvent(new Event("sdl_history_updated"));
  } catch {}
};

const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
};

const deleteFromHistory = (id) => {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.filter((e) => e.id !== id)));
    window.dispatchEvent(new Event("sdl_history_updated"));
  } catch {}
};

const actionBtn = (dark = false) => ({
  flex: 1, padding: "8px 0", borderRadius: "10px",
  border: dark ? "none" : "1px solid #e5e7eb",
  background: dark ? "#0a0a0a" : "white",
  color: dark ? "white" : "#374151",
  fontSize: "12px", fontWeight: "600", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
});

function SmartWarningItem({ item }) {
  const colors = {
    ok:    { bg: "rgba(16,185,129,0.08)",  text: "#065f46", dot: "#10b981" },
    warn:  { bg: "rgba(245,158,11,0.08)",  text: "#92400e", dot: "#f59e0b" },
    error: { bg: "rgba(239,68,68,0.08)",   text: "#7f1d1d", dot: "#ef4444" },
    info:  { bg: "rgba(59,130,246,0.08)",  text: "#1e3a5f", dot: "#3b82f6" },
  };
  const c = colors[item.level] || colors.info;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "7px", padding: "7px 8px", borderRadius: "8px", background: c.bg, marginBottom: "5px" }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.dot, marginTop: "4px", flexShrink: 0 }} />
      <span style={{ fontSize: "11px", color: c.text, lineHeight: 1.55 }}>{item.text}</span>
    </div>
  );
}

function Section({ icon, title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 20px",
        background: "none", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon}
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151" }}>{title}</span>
        </div>
        <ChevronDown size={13} color="#9ca3af" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 20px 16px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tooltip({ visible, children, width = 240 }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.96 }}
          transition={{ duration: 0.16 }}
          style={{
            position: "absolute", left: "calc(100% + 16px)", top: "50%",
            transform: "translateY(-50%)", width,
            background: "rgba(255,255,255,0.98)", backdropFilter: "blur(22px)",
            border: "1px solid rgba(255,255,255,0.8)", borderRadius: "20px",
            padding: "16px", boxShadow: "0 16px 50px rgba(0,0,0,0.12)",
            zIndex: 100, pointerEvents: "none",
          }}
        >
          <div style={{
            position: "absolute", left: "-6px", top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
            width: "12px", height: "12px", background: "white",
            borderLeft: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)",
          }} />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingPanel({ anchorRef, open, onClose, width = 300, children }) {
  const [top, setTop] = useState(98);
  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const panelHeight = 420;
      const viewportHeight = window.innerHeight;
      let t = rect.top;
      if (t + panelHeight > viewportHeight - 20) t = viewportHeight - panelHeight - 20;
      setTop(Math.max(20, t));
    }
  }, [open, anchorRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -12, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -12, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed", top: `${top}px`, left: "110px",
            width: `${width}px`, maxHeight: "calc(100vh - 130px)", overflowY: "auto",
            background: "rgba(255,255,255,0.98)", backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.75)", borderRadius: "28px",
            boxShadow: "0 16px 50px rgba(0,0,0,0.12)", zIndex: 50,
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px 14px", borderBottom: "1px solid rgba(0,0,0,0.05)",
            position: "sticky", top: 0,
            background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)",
            borderRadius: "28px 28px 0 0",
          }}>
            {children[0]}
            <button onClick={onClose} style={{
              background: "rgba(0,0,0,0.04)", border: "none", borderRadius: "8px",
              width: "28px", height: "28px", cursor: "pointer", color: "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={14} />
            </button>
          </div>
          {children[1]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RailBlock({ icon, label, value, valueColor, bg, border, tooltip, tooltipWidth, onClick, active }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.045, y: -1 }}
        transition={{ duration: 0.15 }}
        onClick={onClick}
        style={{
          width: "100%", borderRadius: "20px", padding: "12px 0",
          background: active ? (bg || "rgba(199,167,74,0.15)") : (bg || "rgba(255,255,255,0.7)"),
          border: active ? "1px solid rgba(199,167,74,0.4)" : (border || "1px solid rgba(0,0,0,0.05)"),
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "4px",
          cursor: onClick ? "pointer" : "default",
          boxShadow: hovered ? "0 10px 28px rgba(0,0,0,0.08)" : "none",
          transition: "border 0.2s, background 0.2s",
        }}
      >
        <div style={{ color: valueColor || "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        {value !== undefined && (
          <span style={{ fontSize: "11px", fontWeight: "700", color: valueColor || "#0a0a0a", lineHeight: 1 }}>
            {value}
          </span>
        )}
        <span style={{ fontSize: "9px", color: "#b4bcc8", letterSpacing: "0.04em", fontWeight: "600", lineHeight: 1 }}>
          {label}
        </span>
      </motion.div>
      {!onClick && (
        <Tooltip visible={hovered} width={tooltipWidth || 240}>{tooltip}</Tooltip>
      )}
      {onClick && !active && (
        <Tooltip visible={hovered} width={tooltipWidth || 240}>{tooltip}</Tooltip>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      width: "34px", height: "1px",
      background: "linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)",
      margin: "2px auto",
    }} />
  );
}

/* ── Pulse ring — CSS keyframe injected once ── */
const PULSE_STYLE = `
@keyframes sdl-pulse {
  0%   { box-shadow: 0 0 0 0px rgba(199,167,74,0.35), 0 8px 24px rgba(0,0,0,0.18); }
  70%  { box-shadow: 0 0 0 8px rgba(199,167,74,0),    0 8px 24px rgba(0,0,0,0.18); }
  100% { box-shadow: 0 0 0 0px rgba(199,167,74,0),    0 8px 24px rgba(0,0,0,0.18); }
}
@keyframes sdl-pulse-history {
  0%   { outline-color: rgba(139,92,246,0.35); }
  70%  { outline-color: rgba(139,92,246,0);    }
  100% { outline-color: rgba(139,92,246,0.35); }
}
`;

function InsightRail({ features = [], target = {}, rows = "", onLoad }) {
  const [history, setHistory] = useState(loadHistory());
  const [showHint, setShowHint] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const insightIconRef = useRef(null);
  const historyIconRef = useRef(null);

  /* inject pulse CSS once */
  useEffect(() => {
    if (!document.getElementById("sdl-pulse-style")) {
      const s = document.createElement("style");
      s.id = "sdl-pulse-style";
      s.textContent = PULSE_STYLE;
      document.head.appendChild(s);
    }
  }, []);

  /* onboarding — check AFTER mount so localStorage is always available */
  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setShowHint(true);
      setPulse(true);
      const t = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem(ONBOARDING_KEY, "1");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    setPulse(false);
    localStorage.setItem(ONBOARDING_KEY, "1");
  };

  useEffect(() => {
    const handler = () => setHistory(loadHistory());
    window.addEventListener("sdl_history_updated", handler);
    return () => window.removeEventListener("sdl_history_updated", handler);
  }, []);

  const { score, hints } = calcHealthScore(features, target);
  const { pct: aiPct, unclear, targetKnown } = calcAIReadiness(features, target);
  const warnings = calcWarnings(features, target, rows);
  const smartWarnings = calcSmartWarnings(features, target, rows);

  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const aiColor = aiPct >= 80 ? "#10b981" : aiPct >= 50 ? "#f59e0b" : "#ef4444";

  const total    = features.length;
  const numeric  = features.filter((f) => f.type === "numeric").length;
  const category = features.filter((f) => f.type === "category").length;
  const binary   = features.filter((f) => f.type === "binary").length;
  const missingNames = features.filter((f) => !f.name || !f.name.trim()).length;
  const isReady  = total > 0 && missingNames === 0;
  const warnCount = smartWarnings.filter((w) => w.level === "warn" || w.level === "error").length;
  const warnColor = warnCount > 0 ? "#f59e0b" : "#10b981";

  return (
    <>
      {/* ===== RAIL ===== */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed", top: "98px", left: "16px", width: "78px",
          maxHeight: "calc(100vh - 120px)", overflowY: "auto", overflowX: "visible",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "7px",
          padding: "16px 10px",
          background: "rgba(255,255,255,0.84)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.7)", borderRadius: "30px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          zIndex: 10,
        }}
      >
        {/* LOGO */}
        <div ref={insightIconRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <motion.div
            whileHover={{ rotate: 8, scale: 1.06 }}
            onClick={() => { dismissHint(); setPanelOpen((p) => !p); setHistoryOpen(false); }}
            style={{
              width: "48px", height: "48px", borderRadius: "18px",
              background: panelOpen
                ? "linear-gradient(135deg, #c7a74a 0%, #8b6b16 100%)"
                : "linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: panelOpen ? "white" : "#c7a74a",
              cursor: "pointer",
              animation: pulse ? "sdl-pulse 1.6s ease-out infinite" : "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              transition: "background 0.25s",
            }}
          >
            <Sparkles size={18} strokeWidth={2.2} />
          </motion.div>
        </div>

        <Divider />

        {/* STATUS */}
        <RailBlock
          icon={<ShieldCheck size={18} strokeWidth={2.2} />}
          label={isReady ? "ready" : "setup"}
          bg={isReady ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)"}
          border={isReady ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(245,158,11,0.2)"}
          valueColor={isReady ? "#10b981" : "#f59e0b"}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px", color: isReady ? "#10b981" : "#f59e0b" }}>
                {isReady ? "Ready to Generate" : "Setup Incomplete"}
              </p>
              <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
                {isReady ? "Everything looks configured correctly." : `You still have ${missingNames} missing feature name(s).`}
              </p>
            </>
          }
        />

        {/* HEALTH */}
        <RailBlock
          icon={<Activity size={18} strokeWidth={2.2} />}
          label="health" value={score} valueColor={scoreColor}
          bg={`${scoreColor}10`} border={`1px solid ${scoreColor}25`} tooltipWidth={260}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 4px", color: scoreColor }}>
                Dataset Health · {score}/100
              </p>
              <div style={{ height: "5px", borderRadius: "10px", background: "rgba(0,0,0,0.07)", marginBottom: "10px" }}>
                <div style={{ height: "100%", width: `${score}%`, borderRadius: "10px", background: scoreColor, transition: "width 0.3s" }} />
              </div>
              {hints.length > 0
                ? hints.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", marginBottom: "4px" }}>
                    <span style={{ color: "#f59e0b", flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))
                : <p style={{ fontSize: "11px", color: "#10b981", margin: 0 }}>✓ All checks passed</p>
              }
            </>
          }
        />

        {/* AI READINESS */}
        <RailBlock
          icon={<BrainCircuit size={18} strokeWidth={2.2} />}
          label="ai" value={`${aiPct}%`} valueColor={aiColor}
          bg={`${aiColor}10`} border={`1px solid ${aiColor}25`} tooltipWidth={260}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 4px", color: aiColor }}>
                AI Readiness · {aiPct}%
              </p>
              <div style={{ height: "5px", borderRadius: "10px", background: "rgba(0,0,0,0.07)", marginBottom: "10px" }}>
                <div style={{ height: "100%", width: `${aiPct}%`, borderRadius: "10px", background: aiColor, transition: "width 0.3s" }} />
              </div>
              <div style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: targetKnown ? "#10b981" : "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "#374151" }}>
                    Target: <strong>{target.name || "unnamed"}</strong> — {targetKnown ? "recognized" : "not recognized"}
                  </span>
                </div>
              </div>
              {unclear.length > 0
                ? unclear.map((u, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                    <span style={{ color: "#ef4444", flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontFamily: "monospace" }}>{u}</span>
                  </div>
                ))
                : total > 0 && <p style={{ fontSize: "11px", color: "#10b981", margin: 0 }}>✓ All names are ML-friendly</p>
              }
            </>
          }
        />

        <Divider />

        {/* FEATURES */}
        <RailBlock
          icon={<ChartColumn size={18} strokeWidth={2.2} />}
          label="features" value={total} valueColor="#3b82f6"
          bg="rgba(59,130,246,0.07)" border="1px solid rgba(59,130,246,0.18)" tooltipWidth={220}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 8px", color: "#3b82f6" }}>Features · {total}</p>
              {[
                { label: "Numeric",  count: numeric,  color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
                { label: "Category", count: category, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
                { label: "Binary",   count: binary,   color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{t.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "1px 8px", borderRadius: "100px", background: t.bg, color: t.color }}>{t.count}</span>
                </div>
              ))}
            </>
          }
        />

        {/* TARGET */}
        <RailBlock
          icon={<Target size={18} strokeWidth={2.2} />}
          label="target" valueColor="#c7a74a"
          bg={target.name && target.name !== "Target" ? "rgba(199,167,74,0.08)" : "rgba(0,0,0,0.03)"}
          border={target.name && target.name !== "Target" ? "1px solid rgba(199,167,74,0.2)" : "1px solid rgba(0,0,0,0.05)"}
          tooltipWidth={220}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px", color: "#c7a74a" }}>Target Variable</p>
              {target.name && target.name !== "Target" ? (
                <>
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#0a0a0a", fontWeight: "700" }}>{target.name}</span>
                  <br />
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: "rgba(199,167,74,0.1)", color: "#92400e", marginTop: "6px", display: "inline-block" }}>
                    {target.type} · {target.values}
                  </span>
                </>
              ) : (
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>No target defined yet. Give it a meaningful name.</p>
              )}
            </>
          }
        />

        {/* WARNINGS */}
        <RailBlock
          icon={<TriangleAlert size={18} strokeWidth={2.2} />}
          label="warnings"
          value={warnCount > 0 ? warnCount : undefined}
          valueColor={warnColor}
          bg={warnCount > 0 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)"}
          border={warnCount > 0 ? "1px solid rgba(245,158,11,0.22)" : "1px solid rgba(16,185,129,0.2)"}
          tooltipWidth={280}
          tooltip={
            <>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 10px", color: warnCount > 0 ? "#f59e0b" : "#10b981" }}>
                {warnCount > 0 ? `${warnCount} issue(s) detected` : "Everything looks good"}
              </p>
              {smartWarnings.map((item, i) => <SmartWarningItem key={i} item={item} />)}
            </>
          }
        />

        <Divider />

        {/* HISTORY */}
        <div
          ref={historyIconRef}
          style={{
            width: "100%", borderRadius: "20px",
            outline: pulse ? "2px solid rgba(139,92,246,0.35)" : "2px solid transparent",
            animation: pulse ? "sdl-pulse-history 1.6s ease-out infinite" : "none",
            transition: "outline 0.4s",
          }}
        >
          <RailBlock
            icon={<History size={18} strokeWidth={2.2} />}
            label="history"
            value={history.length > 0 ? history.length : undefined}
            valueColor="#8b5cf6"
            bg="rgba(139,92,246,0.08)"
            border="1px solid rgba(139,92,246,0.18)"
            active={historyOpen}
            onClick={() => { dismissHint(); setHistoryOpen((p) => !p); setPanelOpen(false); }}
            tooltipWidth={200}
            tooltip={
              <>
                <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, color: "#7c3aed" }}>Dataset History</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>
                  {history.length > 0 ? `${history.length} saved dataset(s). Click to browse.` : "No datasets saved yet."}
                </p>
              </>
            }
          />
        </div>

      </motion.div>

      {/* ===== ONBOARDING HINT ===== */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: "calc(98px + 64px)",
              left: "16px",
              width: "78px",
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 999,
            }}
          >
            <div style={{
              position: "relative",
              background: "rgba(10,10,10,0.88)",
              backdropFilter: "blur(12px)",
              color: "white",
              fontSize: "11px",
              fontWeight: "600",
              padding: "8px 14px",
              borderRadius: "100px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
            }}>
              ✦ Click for details
              <div style={{
                position: "absolute",
                top: "-5px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "10px",
                height: "10px",
                background: "rgba(10,10,10,0.88)",
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== INSIGHTS PANEL ===== */}
      <FloatingPanel anchorRef={insightIconRef} open={panelOpen} onClose={() => setPanelOpen(false)} width={300}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={14} color="#c7a74a" />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#0a0a0a" }}>Insights Panel</span>
        </div>
        <div>
          <Section title="Dataset Health" icon={<Activity size={14} color={scoreColor} />}>
            <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dashoffset 0.5s" }}
                />
                <text x="40" y="37" textAnchor="middle" fontSize="16" fontWeight="700" fill={scoreColor}>{score}</text>
                <text x="40" y="51" textAnchor="middle" fontSize="10" fill="#9ca3af">/100</text>
              </svg>
              <div style={{
                display: "inline-block", marginTop: "4px", padding: "3px 12px",
                borderRadius: "100px", background: `${scoreColor}15`,
                fontSize: "12px", fontWeight: "600", color: scoreColor,
              }}>
                {score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work"}
              </div>
            </div>
            {hints.length === 0
              ? <p style={{ fontSize: "11px", color: "#10b981", margin: 0 }}>✓ All checks passed</p>
              : hints.map((h, i) => (
                <div key={i} style={{ fontSize: "11px", color: "#6b7280", padding: "6px 8px", borderRadius: "8px", background: "rgba(0,0,0,0.03)", marginBottom: "4px", display: "flex", gap: "6px" }}>
                  <span style={{ color: "#f59e0b", flexShrink: 0 }}>→</span>{h}
                </div>
              ))
            }
          </Section>
          <Section title="AI Readiness" icon={<BrainCircuit size={14} color={aiColor} />}>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Name clarity</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: aiColor }}>{aiPct}%</span>
              </div>
              <div style={{ height: "6px", borderRadius: "100px", background: "#f3f4f6", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${aiPct}%` }} transition={{ duration: 0.5 }}
                  style={{ height: "100%", borderRadius: "100px", background: aiColor }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: "8px", background: targetKnown ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)" }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Target name</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: targetKnown ? "#10b981" : "#ef4444" }}>
                {targetKnown ? "✓ Clear" : "✗ Unclear"}
              </span>
            </div>
          </Section>
          {warnings.length > 0 && (
            <Section title={`Warnings (${warnings.length})`} icon={<TriangleAlert size={14} color="#f59e0b" />}>
              {warnings.map((w, i) => (
                <div key={i} style={{ fontSize: "11px", color: "#92400e", padding: "7px 8px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", marginBottom: "4px", lineHeight: 1.5, display: "flex", gap: "6px" }}>
                  <span style={{ flexShrink: 0 }}>{w.icon}</span>{w.text}
                </div>
              ))}
            </Section>
          )}
        </div>
      </FloatingPanel>

      {/* ===== HISTORY PANEL ===== */}
      <FloatingPanel anchorRef={historyIconRef} open={historyOpen} onClose={() => setHistoryOpen(false)} width={300}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <History size={14} color="#8b5cf6" />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#0a0a0a" }}>Dataset History</span>
        </div>
        <div>
          <Section title={`Saved Datasets (${history.length})`} icon={<History size={14} color="#8b5cf6" />}>
            <div style={{ maxHeight: "274px", overflowY: "auto", paddingRight: "4px" }}>
              {history.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", gap: "10px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(139,92,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <History size={20} color="#c4b5fd" strokeWidth={1.5} />
                  </div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", margin: 0 }}>No datasets yet</p>
                  <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
                    Generate your first dataset and it'll appear here.
                  </p>
                </div>
              ) : (
                history.map((entry) => (
                  <div key={entry.id} style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0a0a0a", fontFamily: "monospace" }}>{entry.name}</span>
                      <button onClick={() => { deleteFromHistory(entry.id); setHistory(loadHistory()); }}
                        style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <X size={12} />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
                      {[
                        { text: `${entry.rows} rows`, color: "#6b7280", bg: "rgba(0,0,0,0.05)" },
                        { text: entry.type, color: entry.type === "binary" ? "#047857" : "#7c3aed", bg: entry.type === "binary" ? "rgba(16,185,129,0.1)" : "rgba(139,92,246,0.1)" },
                        { text: `${entry.features} cols`, color: "#9ca3af", bg: "rgba(0,0,0,0.04)" },
                      ].map((t, i) => (
                        <span key={i} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: t.bg, color: t.color }}>{t.text}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: "10px", color: "#d1d5db", margin: "0 0 8px" }}>{new Date(entry.createdAt).toLocaleDateString()}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {onLoad && (
                        <button onClick={() => { onLoad(entry); setHistoryOpen(false); }} style={actionBtn(false)}>Load</button>
                      )}
                      <button
                        onClick={() => {
                          if (!entry.csv) return;
                          const blob = new Blob([entry.csv], { type: "text/csv" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = `${entry.name}.csv`;
                          a.click(); URL.revokeObjectURL(url);
                        }}
                        style={{ ...actionBtn(true), opacity: entry.csv ? 1 : 0.4, cursor: entry.csv ? "pointer" : "not-allowed" }}
                      >
                        <Download size={12} /> CSV
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>
        </div>
      </FloatingPanel>
    </>
  );
}

export default InsightRail;