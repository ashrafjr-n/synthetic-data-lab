import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Header from "../components/layout/Header.jsx";
import DatasetSetup from "../components/generator/DatasetSetup.jsx";
import FeatureBuilder from "../components/generator/FeatureBuilder.jsx";
import InsightRail, { saveToHistory } from "../components/builder/InsightRail.jsx";
import PreviewModal from "../components/live/PreviewModal.jsx";
import { generatePreview } from "../components/utils/generatePreview.js";

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Dataset Config", desc: "Name & rows" },
  { id: 2, label: "Target",         desc: "Output variable" },
  { id: 3, label: "Features",       desc: "Input columns" },
];

function BuilderStepper({ activeStep, completedSteps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        padding: "0 40px 0 80px",
        boxSizing: "border-box",
        marginBottom: "4px",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: "20px",
        padding: "14px 28px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>
        {STEPS.map((step, i) => {
          const done     = completedSteps.includes(step.id);
          const active   = activeStep === step.id;

          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <motion.div
                  animate={{
                    background: done ? "#0a0a0a" : active ? "#c7a74a" : "#e5e7eb",
                    scale: active ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700",
                    color: done || active ? "white" : "#9ca3af",
                    boxShadow: active ? "0 0 0 4px rgba(199,167,74,0.2)" : "none",
                    transition: "box-shadow 0.25s",
                  }}
                >
                  {done ? "✓" : step.id}
                </motion.div>
                <div>
                  <div style={{
                    fontSize: "12px", fontWeight: "600",
                    color: done ? "#0a0a0a" : active ? "#c7a74a" : "#9ca3af",
                    transition: "color 0.25s", lineHeight: 1.2,
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#d1d5db", lineHeight: 1.2 }}>
                    {step.desc}
                  </div>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", margin: "0 16px", borderRadius: "2px", background: "#f3f4f6", overflow: "hidden" }}>
                  <motion.div
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ height: "100%", background: "#0a0a0a", borderRadius: "2px" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Builder ──────────────────────────────────────────────────────────────────
function Builder() {
  const [previewData, setPreviewData]       = useState([]);
  const [target, setTarget]                 = useState({ name: "", type: "binary", values: "0,1" });
  const [showPreview, setShowPreview]       = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [datasetName, setDatasetName]       = useState("");
  const [rows, setRows]                     = useState("");
  const [seed, setSeed]                     = useState("");
  const [useSeed, setUseSeed]               = useState(false);
  const [toast, setToast]                   = useState({ message: "", type: "error" });
  const [features, setFeatures]             = useState([
    { id: 1, name: "ID", type: "numeric", min: 1, max: 1000, distribution: "sequential", values: "", open: false }
  ]);

  const [errors, setErrors]     = useState({});
  // flashFields: set of field keys currently flashing red border
  const [flashFields, setFlashFields] = useState(new Set());

  // Trigger a brief red-border flash on given field keys
  const triggerFlash = (keys) => {
    setFlashFields(new Set(keys));
    setTimeout(() => setFlashFields(new Set()), 900);
  };






const location = useLocation();

useEffect(() => {
  const config = location.state?.exampleConfig;
  if (!config) return;
  
  setDatasetName(config.datasetName || "");
  setRows(String(config.rows || ""));
  setSeed(String(config.seed || ""));
  setUseSeed(config.useSeed || false);
  setTarget(config.target || { name: "", type: "binary", values: "0,1" });
  setFeatures(config.features || [
    { id: 1, name: "ID", type: "numeric", min: 1, max: 1000, distribution: "sequential", values: "", open: false }
  ]);


  window.history.replaceState({}, document.title);
}, []);







  // ── Derived: completed steps ──
  const completedSteps = (() => {
    const c = [];
    if (datasetName.trim() && rows.trim() && Number(rows) > 0) c.push(1);
    if (target.name.trim()) c.push(2);
    if (features.length > 1 && features.every(f => f.name.trim())) c.push(3);
    return c;
  })();
  const activeStep = completedSteps.includes(1)
    ? completedSteps.includes(2) ? 3 : 2
    : 1;

  // ── Build inline errors ──
  const buildErrors = () => {
    const errs = {};
    if (!datasetName.trim()) errs.datasetName = "Dataset name is required";
    if (!rows.trim() || Number(rows) <= 0) errs.rows = "Enter a valid number of rows";
    if (useSeed && seed && isNaN(Number(seed))) errs.seed = "Seed must be a number";

    // Rule: only ID feature → not enough
    const nonIdFeatures = features.filter(f => f.name.trim().toUpperCase() !== "ID" || features.indexOf(f) !== 0);
    if (features.length === 1 && features[0].name.trim().toUpperCase() === "ID") {
      errs.featureCount = "You need at least one feature besides ID";
    }

    const featureErrs = {};
    features.forEach(f => {
      if (!f.name.trim()) featureErrs[f.id] = "Feature name is required";
    });
    if (Object.keys(featureErrs).length) errs.features = featureErrs;

    return errs;
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 3000);
  };

  const handleGenerate = async () => {
    const errs = buildErrors();
    if (Object.keys(errs).length) {
      setErrors(errs);

      // Collect fields to flash
      const toFlash = [];
      if (errs.datasetName) toFlash.push("datasetName");
      if (errs.rows)        toFlash.push("rows");
      if (errs.seed)        toFlash.push("seed");
      if (errs.features)    Object.keys(errs.features).forEach(id => toFlash.push(`feature-${id}`));
      triggerFlash(toFlash);

      // Scroll to first error — prefer datasetName/rows, then features section
      const firstKey = errs.datasetName ? "section-datasetName"
        : errs.rows             ? "section-rows"
        : errs.featureCount     ? "section-featureCount"
        : errs.features         ? `section-features`
        : null;
      if (firstKey) {
        const el = document.getElementById(firstKey);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setShowPreview(true);
    setLoadingPreview(true);

    try {
      const data = await generatePreview(features, rows, useSeed, seed, target);
      setPreviewData(data);
      const headers = data.length ? Object.keys(data[0]) : [];
      const csv = [
        headers.join(","),
        ...data.map(row => headers.map(h => row[h]).join(","))
      ].join("\n");
      saveToHistory({
        id: Date.now(), name: datasetName, rows: Number(rows),
        type: target.type, features: features.length, targetName: target.name,
        createdAt: new Date().toISOString(), csv,
        config: { features, target, rows, seed, useSeed, datasetName },
      });
    } catch (err) {
      console.error("Generate failed:", err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const clearError = (key) => {
    if (!errors[key]) return;
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };
  const clearFeatureError = (id) => {
    if (!errors.features?.[id]) return;
    setErrors(prev => {
      const fe = { ...prev.features }; delete fe[id];
      const n  = { ...prev };
      Object.keys(fe).length ? n.features = fe : delete n.features;
      return n;
    });
  };

  const handleLoad = (entry) => {
    if (!entry.config) return;
    const { features: f, target: t, rows: r, seed: s, useSeed: u, datasetName: n } = entry.config;
    setFeatures(f); setTarget(t); setRows(String(r));
    setSeed(s || ""); setUseSeed(u || false); setDatasetName(n || "");
    setErrors({});
    showToast(`Loaded: ${entry.name}`, "success");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#edeef0" }}>
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ maxWidth: "1400px", margin: "0 auto", width: "100%", padding: "28px 40px 16px 80px", boxSizing: "border-box" }}
      >
        <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: "700", letterSpacing: "-0.03em", color: "#0a0a0a", margin: 0, lineHeight: "1.15" }}>
          Dataset Builder
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "6px 0 0" }}>
          Design, configure, and generate AI-powered synthetic datasets
        </p>
      </motion.div>

      <BuilderStepper activeStep={activeStep} completedSteps={completedSteps} />

      <main style={{ flex: 1, padding: "20px 40px 40px", maxWidth: "1550px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ position: "relative" }}>
          <InsightRail features={features} target={target} rows={rows} onLoad={handleLoad} />

          <div style={{ paddingLeft: "100px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DatasetSetup
                datasetName={datasetName}
                setDatasetName={(v) => { setDatasetName(v); clearError("datasetName"); }}
                rows={rows}
                setRows={(v) => { setRows(v); clearError("rows"); }}
                seed={seed}
                setSeed={(v) => { setSeed(v); clearError("seed"); }}
                useSeed={useSeed}
                setUseSeed={setUseSeed}
                errors={errors}
                flashFields={flashFields}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FeatureBuilder
                features={features}
                setFeatures={setFeatures}
                target={target}
                setTarget={setTarget}
                onGenerate={handleGenerate}
                featureErrors={errors.features || {}}
                featureCountError={errors.featureCount || null}
                clearFeatureCountError={() => clearError("featureCount")}
                clearFeatureError={clearFeatureError}
                flashFields={flashFields}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {showPreview && (
        <PreviewModal
          data={previewData} loading={loadingPreview}
          datasetName={datasetName} onClose={() => setShowPreview(false)}
        />
      )}

      <AnimatePresence>
        {toast.message && (
          <motion.div
            key={toast.message + toast.type}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed", bottom: "28px", left: "50%",
              transform: "translateX(-50%)", zIndex: 100,
              borderRadius: "16px", overflow: "hidden",
              boxShadow: toast.type === "error"
                ? "0 12px 32px rgba(220,38,38,0.25)"
                : "0 12px 32px rgba(199,167,74,0.3)",
            }}
          >
            <div style={{ height: "3px", background: toast.type === "error" ? "#dc2626" : "#c7a74a" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 22px", background: "rgba(10,10,10,0.93)", backdropFilter: "blur(16px)" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "700", flexShrink: 0,
                background: toast.type === "error" ? "rgba(220,38,38,0.2)" : "rgba(199,167,74,0.15)",
                color: toast.type === "error" ? "#f87171" : "#c7a74a",
              }}>
                {toast.type === "error" ? "✕" : "✓"}
              </div>
              <span style={{ fontSize: "13.5px", fontWeight: "500", color: "white", whiteSpace: "nowrap" }}>
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Builder;