import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Configure your dataset",
    desc: "Name your dataset, set the row count, and optionally lock a seed for reproducible generation across runs.",
    detail: "Rows · Seed · Name",
  },
  {
    num: "02",
    title: "Define your features",
    desc: "Add columns with custom names, data types, value ranges, and statistical distributions — binary, numeric, or categorical.",
    detail: "Types · Ranges · Distributions",
  },
  {
    num: "03",
    title: "Set the target label",
    desc: "Name your classification target. The AI reads all column names together and builds coherent causal relationships automatically.",
    detail: "Binary · Multi-class",
  },
  {
    num: "04",
    title: "Generate & download",
    desc: "Hit generate — preview the full dataset in a live modal, inspect every row, and export a clean CSV when you're satisfied.",
    detail: "Preview · CSV Export",
  },
];

function StepItem({ step, i, total }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Connector line between steps */}
      {i < total - 1 && (
        <div style={{
          position: "absolute",
          top: "32px",
          left: "calc(50% + 36px)",
          right: "calc(-50% + 36px)",
          height: "1px",
          background: "repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 6px, transparent 6px, transparent 14px)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
      )}

      {/* Step number badge */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "18px",
          background: i === 0 ? "#0a0a0a" : "#ffffff",
          border: i === 0 ? "none" : "1px solid #eeeeec",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          position: "relative",
          zIndex: 1,
          boxShadow: i === 0 ? "0 10px 28px rgba(0,0,0,0.18)" : "0 2px 12px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.2s",
          flexShrink: 0,
        }}
      >
        <span style={{
          fontSize: "14px",
          fontWeight: "800",
          color: i === 0 ? "white" : "#c4c8cf",
          letterSpacing: "-0.02em",
        }}>
          {step.num}
        </span>
        {/* Active dot for step 0 */}
        {i === 0 && (
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "22px",
              border: "1px solid rgba(10,10,10,0.15)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>

      {/* Text */}
      <h3 style={{
        fontSize: "15px",
        fontWeight: "700",
        color: "#0a0a0a",
        marginBottom: "10px",
        letterSpacing: "-0.01em",
      }}>
        {step.title}
      </h3>
      <p style={{
        fontSize: "13.5px",
        color: "#6b7280",
        lineHeight: "1.75",
        maxWidth: "220px",
        margin: "0 auto 14px",
      }}>
        {step.desc}
      </p>

      {/* Detail pill */}
      <div style={{
        fontSize: "10px",
        fontWeight: "600",
        color: "#b0b5bf",
        background: "#f8f8f6",
        border: "1px solid #eeeeec",
        padding: "4px 12px",
        borderRadius: "100px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        {step.detail}
      </div>
    </motion.div>
  );
}

function HowItWorks() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div style={{ paddingBottom: "60px" }}>

      {/* Section header */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "64px", textAlign: "center" }}
      >
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}>
          <div style={{ width: "20px", height: "1px", background: "#c7a74a" }} />
          <p style={{
            fontSize: "11px",
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            margin: 0,
          }}>
            How It Works
          </p>
          <div style={{ width: "20px", height: "1px", background: "#c7a74a" }} />
        </div>

        <h2 style={{
          fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
          fontWeight: "800",
          letterSpacing: "-0.035em",
          color: "#0a0a0a",
          lineHeight: "1.12",
          margin: "0 auto",
          maxWidth: "480px",
        }}>
          From blank canvas to<br />
          <span style={{ color: "#c7a74a" }}>export-ready</span> dataset<br />
          in four steps.
        </h2>
      </motion.div>

      {/* Steps grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        position: "relative",
      }}>
        {steps.map((step, i) => (
          <StepItem key={i} step={step} i={i} total={steps.length} />
        ))}
      </div>


    </div>
  );
}

export default HowItWorks;