import { useState } from "react";
import { motion }    from "framer-motion";

function StatisticsTab({ result }) {
  const { statistics } = result;
  const [selected, setSelected] = useState(statistics[0]?.col || "");

  const stat = statistics.find(s => s.col === selected);

  if (!statistics.length) {
    return (
      <div className="dash-card" style={{ textAlign: "center", padding: "40px" }}>
        <div className="dash-stat-label">No numeric columns found.</div>
      </div>
    );
  }

  const statRows = stat && !stat.empty ? [
    { label: "Mean",           value: stat.mean.toLocaleString()   },
    { label: "Median",         value: stat.median.toLocaleString() },
    { label: "Minimum",        value: stat.min.toLocaleString()    },
    { label: "Maximum",        value: stat.max.toLocaleString()    },
    { label: "Std Deviation",  value: stat.std.toLocaleString()    },
    { label: "Q1 (25%)",       value: stat.q1.toLocaleString()     },
    { label: "Q3 (75%)",       value: stat.q3.toLocaleString()     },
    { label: "Count",          value: stat.count.toLocaleString()  },
  ] : [];

  return (
    <div>
      {/* Column selector — pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>
        {statistics.map(s => (
          <button
            key={s.col}
            onClick={() => setSelected(s.col)}
            style={{
              background:   selected === s.col ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
              border:       `1px solid ${selected === s.col ? "rgba(212,175,55,0.30)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "8px",
              padding:      "6px 14px",
              fontSize:     "12px",
              fontWeight:   selected === s.col ? "600" : "400",
              color:        selected === s.col ? "var(--gold)" : "rgba(255,255,255,0.45)",
              cursor:       "pointer",
              transition:   "all 0.18s ease",
              fontFamily:   "Inter, sans-serif",
            }}
          >
            {s.col}
          </button>
        ))}
      </div>

      {/* Stats */}
      {stat && !stat.empty ? (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="dash-section-title">{selected}</div>
          <div className="dash-card">
            {statRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "center",
                  padding:        "10px 0",
                  borderBottom:   i < statRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span className="dash-stat-label" style={{ marginBottom: 0 }}>{row.label}</span>
                <span className="dash-stat-value">{row.value}</span>
              </div>
            ))}
          </div>

        </motion.div>
      ) : (
        <div className="dash-card" style={{ textAlign: "center", padding: "32px" }}>
          <div className="dash-stat-label">No data available for this column.</div>
        </div>
      )}
    </div>
  );
}

export default StatisticsTab;