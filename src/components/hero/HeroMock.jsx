import { motion } from "framer-motion";
import CountUp from "./CountUp";
import HeatmapMini from "./HeatmapMini";
import { BARS } from "./constants";

function HeroMock() {
  return (
    <div style={{ position: "relative" }}>
      {/* Back shadow card */}
      <div className="hero-mock__shadow" />

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="hero-mock__card"
      >
        {/* Window titlebar */}
        <div className="hero-mock__titlebar">
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} className="hero-mock__dot" style={{ background: c }} />
          ))}
          <span className="hero-mock__filename">employee_churn.csv</span>
          <div className="hero-mock__status">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hero-mock__status-dot"
            />
            <span className="hero-mock__status-text">analyzing</span>
          </div>
        </div>

        <div className="hero-mock__body">
          {/* KPI row */}
          <div className="hero-kpi-row">
            {[
              {
                label: "Quality Score",
                val: <><CountUp to={91} /><span className="hero-kpi-card__suffix">/100</span></>,
                color: "var(--gold)",
              },
              { label: "Missing",    val: "2.1%", color: "var(--warning)" },
              { label: "Duplicates", val: "0.4%", color: "var(--success)" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.36 }}
                className="hero-kpi-card"
              >
                <div className="hero-kpi-card__label">{m.label}</div>
                <div className="hero-kpi-card__value" style={{ color: m.color }}>
                  {m.val}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature distribution bars */}
          <div className="hero-bars-panel">
            <div className="hero-panel__title">Feature Distributions</div>
            {BARS.map((b, i) => (
              <div key={i} className="hero-bar-row">
                <span className="hero-bar-row__label">{b.label}</span>
                <div className="hero-bar-row__track">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                    className="hero-bar-row__fill"
                    style={{ background: b.warn ? "var(--warning)" : "var(--gold)" }}
                  />
                </div>
                <span
                  className="hero-bar-row__pct"
                  style={{ color: b.warn ? "var(--warning)" : "var(--text-muted)" }}
                >
                  {b.pct}%
                </span>
                {b.warn && <span className="hero-bar-row__warn-badge">⚠</span>}
              </div>
            ))}
          </div>

          {/* Correlation heatmap */}
          <div className="hero-heatmap-panel">
            <div className="hero-panel__title">Correlation Heatmap</div>
            <HeatmapMini />
          </div>

          {/* Target column row */}
          <div className="hero-target-row">
            <div className="hero-target-row__left">
              <div className="hero-target-row__dot" />
              <span className="hero-target-row__label">Target column</span>
            </div>
            <span className="hero-target-row__value">Purchased</span>
          </div>
        </div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="hero-chip"
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="hero-chip__dot"
        />
        Analysis complete
      </motion.div>
    </div>
  );
}

export default HeroMock;