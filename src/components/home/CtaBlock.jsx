// src/components/home/CtaBlock.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";


function CtaBlock() {
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });



const navigate = useNavigate();

const EXAMPLE_CONFIG = {
  datasetName: "employee_churn",
  rows: "500",
  seed: "4821",
  useSeed: true,
  target: { name: "churn", type: "binary", values: "0,1" },
  features: [
    { id: 1, name: "employee_id",       type: "numeric",     min: 1,     max: 1000,   distribution: "sequential",  values: "", open: false },
    { id: 2, name: "age",               type: "numeric",     min: 22,    max: 58,     distribution: "normal",      values: "", open: false },
    { id: 3, name: "gender",            type: "categorical", min: "",    max: "",     distribution: "uniform",     values: "Male,Female,Other", open: false },
    { id: 4, name: "department",        type: "categorical", min: "",    max: "",     distribution: "uniform",     values: "Engineering,Sales,HR,Marketing,Finance", open: false },
    { id: 5, name: "years_experience",  type: "numeric",     min: 1,     max: 25,     distribution: "right_skewed", values: "", open: false },
    { id: 6, name: "education",         type: "categorical", min: "",    max: "",     distribution: "uniform",     values: "Bachelor's,Master's,PhD,High School", open: false },
    { id: 7, name: "salary",            type: "numeric",     min: 30000, max: 120000, distribution: "normal",      values: "", open: false },
    { id: 8, name: "performance_score", type: "numeric",     min: 1,     max: 5,      distribution: "normal",      values: "", open: false },
    { id: 9, name: "remote_work",       type: "binary",      min: "",    max: "",     distribution: "uniform",     values: "0,1", open: false },
  ],
};



  return (
    <motion.div
      ref={ctaRef}
      initial={{ opacity: 0, y: 32 }}
      animate={ctaInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "56px 48px",
        background: "#0a0a0a",
        borderRadius: "28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(199,167,74,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(199,167,74,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Gold glow */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%",
        transform: "translateX(-50%)",
        width: "400px", height: "300px",
        background: "radial-gradient(ellipse, rgba(199,167,74,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: "10px", color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: "20px",
        }}>
          Ready?
        </p>

        <h2 style={{
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: "800",
          color: "white", letterSpacing: "-0.035em",
          marginBottom: "14px", lineHeight: "1.1",
        }}>
          Start building your dataset now.
        </h2>

        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.4)",
          marginBottom: "36px", letterSpacing: "0.01em",
        }}>
          Free. No account needed. Powered by AI.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.04, y: -2, boxShadow: "0 16px 40px rgba(199,167,74,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/builder")}
            style={{
              background: "#c7a74a", color: "white", border: "none",
              borderRadius: "14px", padding: "16px 36px",
              fontSize: "14px", fontWeight: "700", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(199,167,74,0.3)",
              letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            Open Builder
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "22px", height: "22px", borderRadius: "6px",
              background: "rgba(255,255,255,0.2)", fontSize: "13px",
            }}>→</span>
          </motion.button>

          <motion.button
            whileHover={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/builder", { state: { exampleConfig: EXAMPLE_CONFIG } })}
            style={{
              background: "transparent", color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px",
              padding: "16px 28px", fontSize: "14px", fontWeight: "500",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            Load Example Config
          </motion.button>
        </div>

        <div style={{
          display: "flex", gap: "24px", justifyContent: "center",
          marginTop: "36px", paddingTop: "28px",
          borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap",
        }}>
          {[
            { icon: "⚡", text: "Generates in seconds" },
            { icon: "🔒", text: "No data stored" },
            { icon: "♾", text: "Unlimited datasets" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: "500",
            }}>
              <span style={{ fontSize: "14px" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default CtaBlock;