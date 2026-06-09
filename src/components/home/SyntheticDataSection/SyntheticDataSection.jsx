import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  "Controlled distributions — normal, skewed, uniform",
  "Seed-based reproducibility",
  "Configurable missing value injection",
  "Binary, numeric, and categorical columns",
  "AI-inferred feature relationships",
];

const EXAMPLE_COLS = [
  { name: "age",              type: "numeric",     dist: "normal"      },
  { name: "salary",           type: "numeric",     dist: "right_skewed"},
  { name: "department",       type: "categorical", dist: "uniform"     },
  { name: "years_experience", type: "numeric",     dist: "right_skewed"},
  { name: "churn",            type: "binary",      dist: "—"           },
];

function SyntheticDataSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  return (
    <section className="synth-section" ref={ref}>
      <div className="synth-inner">

        {/* Left — content */}
        <motion.div
          className="synth-content"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="synth-content__eyebrow">
            <span className="synth-content__eyebrow-dot" />
            Synthetic Data Generator
          </div>

          <h2 className="synth-content__headline">
            Don't have data yet?
            <br />
            <span className="synth-content__headline--gold">Build it.</span>
          </h2>

          <p className="synth-content__sub">
            Generate structured datasets with realistic distributions and
            feature relationships — ready to analyze immediately.
          </p>

          <ul className="synth-features">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                className="synth-features__item"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.38 }}
              >
                <span className="synth-features__check">✓</span>
                {f}
              </motion.li>
            ))}
          </ul>

          <div className="synth-actions">
            <button
              className="hero-btn-primary"
              style={{ fontFamily: "Inter, sans-serif" }}
              onClick={() => navigate("/builder")}
            >
              Open Builder
              <span className="hero-btn-arrow">→</span>
            </button>
            <button
              className="hero-btn-secondary"
              style={{ fontFamily: "Inter, sans-serif" }}
              onClick={() => navigate("/builder", { state: { exampleConfig: true } })}
            >
              Load example dataset
            </button>
          </div>
        </motion.div>

        {/* Right — visual preview */}
        <motion.div
          className="synth-visual"
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.14, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dataset config card */}
          <div className="synth-card">
            <div className="synth-card__titlebar">
              {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.72 }} />
              ))}
              <span className="synth-card__filename">employee_churn.csv</span>
              <div className="synth-card__rows-badge">500 rows</div>
            </div>

            <div className="synth-card__body">
              <div className="synth-card__section-label">Columns</div>
              {EXAMPLE_COLS.map((col, i) => (
                <motion.div
                  key={i}
                  className="synth-col-row"
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.32 }}
                >
                  <span className="synth-col-row__name">{col.name}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span className={`synth-col-row__type synth-col-row__type--${col.type}`}>
                      {col.type}
                    </span>
                    {col.dist !== "—" && (
                      <span className="synth-col-row__dist">{col.dist}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="synth-card__divider" />

              <div className="synth-card__target-row">
                <span className="synth-card__target-label">Target column</span>
                <span className="synth-card__target-value">churn</span>
              </div>
            </div>
          </div>

          {/* Floating stat chip */}
          <motion.div
            className="synth-chip"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65, duration: 0.4 }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="synth-chip__dot"
            />
            Dataset ready to analyze
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default SyntheticDataSection;