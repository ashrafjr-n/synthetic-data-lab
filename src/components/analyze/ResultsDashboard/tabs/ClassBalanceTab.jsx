import { motion } from "framer-motion";

function ClassBalanceTab({ result }) {
  const { classBalance, meta } = result;

  if (!classBalance || !classBalance.classes.length) {
    return (
      <div className="dash-card" style={{ textAlign: "center", padding: "40px" }}>
        <div className="dash-stat-label">No target column selected or no class data available.</div>
      </div>
    );
  }

  const { classes, isImbalanced } = classBalance;
  const maxPct = Math.max(...classes.map(c => c.pct));

  return (
    <div>
      {/* Header card */}
      <motion.div
        className="dash-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        style={{ marginBottom: "14px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <div className="dash-section-title" style={{ marginBottom: "4px" }}>Target Column</div>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--gold)" }}>
              {meta.target}
            </span>
          </div>
          <span className={`dash-pill ${isImbalanced ? "dash-pill--warning" : "dash-pill--success"}`}>
            {isImbalanced ? "Imbalanced" : "Balanced"}
          </span>
        </div>

        {/* Class bars */}
        {classes.map((cls, i) => {
          const isMax = cls.pct === maxPct;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
              style={{
                marginBottom: i < classes.length - 1 ? "16px" : 0,
              }}
            >
              <div style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                marginBottom:   "7px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.75)" }}>
                    {String(cls.value)}
                  </span>
                  {isMax && (
                    <span className="dash-pill dash-pill--neutral" style={{ fontSize: "9px" }}>
                      majority
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                    {cls.count.toLocaleString()} rows
                  </span>
                  <span style={{
                    fontSize:   "13px",
                    fontWeight: "700",
                    color:      isMax ? "var(--gold)" : "rgba(255,255,255,0.50)",
                    minWidth:   "40px",
                    textAlign:  "right",
                  }}>
                    {cls.pct}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div style={{
                height:     "6px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "3px",
                overflow:   "hidden",
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cls.pct}%` }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.65, ease: "easeOut" }}
                  style={{
                    height:     "100%",
                    borderRadius: "3px",
                    background: isMax
                      ? "linear-gradient(90deg, var(--gold), var(--gold-warm))"
                      : "rgba(255,255,255,0.22)",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Imbalance warning */}
      {isImbalanced && (
        <motion.div
          className="dash-card dash-card--warning"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.32 }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--warning)", marginBottom: "5px" }}>
                Uneven class distribution detected.
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: "1.6" }}>
                The majority class represents {maxPct}% of the data.
                Consider oversampling the minority class (e.g. SMOTE) or
                using class-weighted models to avoid biased predictions.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ClassBalanceTab;