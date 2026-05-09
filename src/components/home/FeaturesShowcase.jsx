import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const features = [
  {
    icon: "⚙",
    title: "Feature Engineering",
    desc: "Define numeric, categorical, and binary columns with full control over value ranges, null rates, and cardinality.",
    tag: "Core",
    gold: true,
  },
  {
    icon: "◎",
    title: "Statistical Distributions",
    desc: "Shape your data precisely — normal, uniform, sequential, or right-skewed. Each feature gets its own distribution curve.",
    tag: "Math",
    gold: false,
  },
  {
    icon: "✦",
    title: "AI Relationship Engine",
    desc: "The AI reads your feature names and target label to infer realistic causal patterns — no manual formula writing needed.",
    tag: "AI",
    gold: true,
  },
  {
    icon: "▦",
    title: "Live Preview Table",
    desc: "Inspect your dataset row-by-row before exporting. Spot anomalies, verify distributions, and iterate in seconds.",
    tag: "UX",
    gold: false,
  },
  {
    icon: "↓",
    title: "One-Click CSV Export",
    desc: "Download a clean, header-labelled CSV the moment generation completes. Drop it straight into Pandas, sklearn, or R.",
    tag: "Export",
    gold: true,
  },
  {
    icon: "◈",
    title: "Reproducible Seeding",
    desc: "Pin a seed integer to lock in your dataset. Share the seed with teammates and they reproduce your exact data.",
    tag: "Science",
    gold: false,
  },
];

/* ── Slow aurora-like horizontal shimmer ── */
function AuroraLayer() {
  return (
    <>
      {/* Base warm-dark background — slightly warm, not pure black */}
      {/* handled by parent */}

      {/* Slow drifting gold band — left */}
      <motion.div
        animate={{ x: ["0%", "6%", "0%"], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-60px",
          left: "-10%",
          width: "55%",
          height: "340px",
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(199,167,74,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Slow drifting gold band — right */}
      <motion.div
        animate={{ x: ["0%", "-5%", "0%"], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-8%",
          width: "50%",
          height: "300px",
          background:
            "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(199,167,74,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle horizontal lines — like data rows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(199,167,74,0.028) 0px, rgba(199,167,74,0.028) 1px, transparent 1px, transparent 64px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top-center vignette fade to blend with page above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          background:
            "linear-gradient(to bottom, rgba(15,12,8,0) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Bottom vignette fade to blend with page below */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background:
            "linear-gradient(to top, rgba(15,12,8,0) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}

/* ── Feature card — unchanged from previous version ── */
function FeatureCard({ f, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "22px",
        padding: "28px",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Hover shimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute",
          inset: 0,
          background: f.gold
            ? "radial-gradient(ellipse at 20% 0%, rgba(199,167,74,0.09) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          borderRadius: "22px",
          pointerEvents: "none",
        }}
      />

      {/* Icon + Tag */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "22px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          width: "46px",
          height: "46px",
          borderRadius: "13px",
          background: f.gold ? "#c7a74a" : "rgba(255,255,255,0.08)",
          border: f.gold ? "none" : "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          flexShrink: 0,
        }}>
          {f.icon}
        </div>

        <span style={{
          fontSize: "10px",
          fontWeight: "700",
          color: f.gold ? "#e8c76e" : "rgba(255,255,255,0.35)",
          background: f.gold ? "rgba(199,167,74,0.14)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${f.gold ? "rgba(199,167,74,0.28)" : "rgba(255,255,255,0.09)"}`,
          padding: "4px 12px",
          borderRadius: "100px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          {f.tag}
        </span>
      </div>

      <h3 style={{
        fontSize: "15px",
        fontWeight: "700",
        color: "rgba(255,255,255,0.9)",
        marginBottom: "10px",
        letterSpacing: "-0.01em",
        position: "relative",
        zIndex: 1,
      }}>
        {f.title}
      </h3>
      <p style={{
        fontSize: "13.5px",
        color: "rgba(255,255,255,0.36)",
        lineHeight: "1.75",
        margin: 0,
        position: "relative",
        zIndex: 1,
      }}>
        {f.desc}
      </p>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: i * 0.07 + 0.3, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: "28px",
          right: "28px",
          height: "1px",
          background: f.gold
            ? "linear-gradient(90deg, rgba(199,167,74,0.5), rgba(199,167,74,0))"
            : "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
          borderRadius: "2px",
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

/* ── Main section ── */
function FeaturesShowcase() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    /*
      Full-bleed wrapper: breaks out of container-app with negative horizontal
      margins. Adjust the magic numbers to match your container's padding
      (container-app is typically px-6 → 24px, or px-8 → 32px on large screens).
      Using a large safe value of 9999px clamps with min so it always reaches edge.
    */
    <div
      style={{
        position: "relative",
        /* Pull out to full viewport width */
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        /* Warm near-black — not pure #000, has a hint of amber warmth */
        background: "#1a1510",
        overflow: "hidden",
      }}
    >
      {/* Aurora background effects */}
      <AuroraLayer />

      {/* Inner content — re-apply the container padding */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 48px",
        }}
      >
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "52px" }}
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
              color: "rgba(199,167,74,0.65)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              margin: 0,
            }}>
              Capabilities
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}>
            <h2 style={{
              fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
              fontWeight: "800",
              letterSpacing: "-0.035em",
              color: "rgba(255,255,255,0.92)",
              lineHeight: "1.12",
              maxWidth: "440px",
              margin: 0,
            }}>
              Every tool you need to build{" "}
              <span style={{ color: "#c7a74a" }}>intelligent</span> datasets.
            </h2>
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.28)",
              maxWidth: "280px",
              lineHeight: "1.7",
              margin: 0,
              paddingBottom: "4px",
            }}>
              Six focused primitives that combine into a complete synthetic data workflow.
            </p>
          </div>
        </motion.div>

        {/* Cards grid — identical to before */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}>
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturesShowcase;