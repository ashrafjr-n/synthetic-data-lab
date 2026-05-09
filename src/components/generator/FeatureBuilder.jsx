import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeatureCard from "./FeatureCard";

// ── Spring config for the section expand/collapse ──
const SPRING = { type: "spring", stiffness: 340, damping: 32, mass: 0.9 };

function FeatureBuilder({
  features, setFeatures,
  target, setTarget,
  onGenerate,
  featureErrors = {},
  featureCountError = null,
  clearFeatureError,
  flashFields = new Set(),
}) {

  const addFeature = () => {
    setFeatures([...features, {
      id: Date.now(), name: "", type: "numeric",
      min: 0, max: 100, distribution: "uniform", values: "", open: true,
    }]);
  };

  const removeFeature = (id) => setFeatures(features.filter(f => f.id !== id));
  const updateFeature = (id, key, value) =>
    setFeatures(features.map(f => f.id === id ? { ...f, [key]: value } : f));
  const updateTargetType = (type) =>
    setTarget({ ...target, type, values: type === "binary" ? "0,1" : "0,1,2" });

  const total    = features.length;
  const numeric  = features.filter(f => f.type === "numeric").length;
  const category = features.filter(f => f.type === "category").length;
  const binary   = features.filter(f => f.type === "binary").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Target Configuration ── */}
      <div style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: "24px",
        padding: "28px 32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>
            Step 02
          </p>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0a0a0a", margin: 0 }}>
            Target Configuration
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>Target Name</label>
            {/* ── ملاحظة ثالثة: إزالة القيمة الافتراضية "Target" ── */}
            <input
              className="input"
              maxLength={20}
              placeholder="e.g. approved"
              value={target.name}
              onChange={(e) => setTarget({ ...target, name: e.target.value })}
              style={{ fontFamily: "monospace", fontSize: "14px" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>Target Type</label>
            <select className="input" value={target.type} onChange={(e) => updateTargetType(e.target.value)} style={{ fontSize: "14px" }}>
              <option value="binary">Binary (2 classes)</option>
              <option value="multi">Multi-Class (3 classes)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "8px", fontWeight: "500" }}>Output Values</label>
            {target.type === "binary" ? (
              <select className="input" value={target.values}
                onChange={(e) => setTarget({ ...target, values: e.target.value })} style={{ fontSize: "14px" }}>
                <option value="0,1">0 / 1</option>
                <option value="yes,no">Yes / No</option>
                <option value="true,false">True / False</option>
              </select>
            ) : (
              <select className="input" value={target.values}
                onChange={(e) => setTarget({ ...target, values: e.target.value })} style={{ fontSize: "14px" }}>
                <option value="0,1,2">0 / 1 / 2</option>
                <option value="low,medium,high">Low / Medium / High</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ── Feature Builder ── */}
      {/*
        ملاحظة ثانية: توسع/تضيق احترافي
        - الـ grid يستخدم motion مع layoutRoot لتنسيق smooth للكارتات
        - كل FeatureCard يدخل ويخرج بـ spring حقيقي
        - ارتفاع الـ container يتمدد تلقائياً بـ framer layout animation
      */}
      <motion.div
        layout
        transition={SPRING}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: "24px",
          padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <motion.div layout="position" transition={SPRING} style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          marginBottom: "24px", flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>
              Step 03
            </p>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0a0a0a", margin: "0 0 4px" }}>
              Feature Builder
            </h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
              Use clear, descriptive names — the AI reads them to build relationships
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "Total",    val: total,    color: "#0a0a0a" },
                { label: "Numeric",  val: numeric,  color: "#3b82f6" },
                { label: "Category", val: category, color: "#8b5cf6" },
                { label: "Binary",   val: binary,   color: "#10b981" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "6px 12px", borderRadius: "10px",
                  background: "rgba(0,0,0,0.04)", fontSize: "12px",
                  fontWeight: "500", color: s.color,
                }}>
                  {s.label}: {s.val}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={addFeature}
              style={{
                background: "#0a0a0a", color: "white", border: "none",
                borderRadius: "12px", padding: "10px 20px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}
            >
              + Add Feature
            </motion.button>
          </div>
        </motion.div>

        {/* ── ملاحظة رابعة: رسالة خطأ عدد الـ features ── */}
        <AnimatePresence>
          {featureCountError && (
            <motion.div
              id="section-featureCount"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px", padding: "10px 16px", overflow: "hidden",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚠️</span>
              <span style={{ fontSize: "12.5px", color: "#dc2626", fontWeight: "500" }}>
                {featureCountError}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {features.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 20px", color: "#d1d5db" }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>◈</div>
              <p style={{ fontSize: "15px", fontWeight: "500", color: "#9ca3af", margin: "0 0 8px" }}>No features yet</p>
              <p style={{ fontSize: "13px", color: "#d1d5db", margin: 0 }}>Add your first feature to start building</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/*
          ── ملاحظة ثانية: الـ Grid بـ layoutRoot ──
          كل بطاقة تدخل/تخرج بـ spring ناعم، والـ grid يعيد ترتيب نفسه
          بشكل animated بدون أي jump مفاجئ
        */}
        <motion.div
          layout
          transition={SPRING}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <AnimatePresence mode="popLayout">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{
                  opacity: 0,
                  scale: 0.88,
                  y: -12,
                  transition: { duration: 0.22, ease: [0.4, 0, 0.6, 1] }
                }}
                transition={SPRING}
              >
                <FeatureCard
                  feature={feature}
                  index={index}
                  removeFeature={removeFeature}
                  updateFeature={(id, key, val) => {
                    updateFeature(id, key, val);
                    if (key === "name") clearFeatureError(id);
                  }}
                  hasError={!!featureErrors[feature.id]}
                  isFlashing={flashFields.has(`feature-${feature.id}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Generate button */}
        <AnimatePresence>
          {features.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                {features.length} feature{features.length !== 1 ? "s" : ""} configured · ready to generate
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGenerate}
                style={{
                  background: "#0a0a0a", color: "white", border: "none",
                  borderRadius: "16px", padding: "14px 32px",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                <span style={{ color: "#c7a74a" }}>✦</span> Generate Dataset
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default FeatureBuilder;