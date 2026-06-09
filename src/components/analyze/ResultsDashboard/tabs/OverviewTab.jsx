import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   COLUMN ROLE PILL
───────────────────────────────────────────── */
const ROLE_PILL = {
  numeric:     { label: "#",  cls: "dash-pill--neutral" },
  categorical: { label: "Aa", cls: "dash-pill--neutral" },
  binary:      { label: "01", cls: "dash-pill--success" },
  identifier:  { label: "ID", cls: "dash-pill--warning" },
  target:      { label: "▶",  cls: "dash-pill--gold"    },
};

/* ─────────────────────────────────────────────
   NULL BADGE
───────────────────────────────────────────── */
function NullBadge() {
  return (
    <span style={{
      display:      "inline-flex",
      alignItems:   "center",
      fontSize:     "9px",
      fontWeight:   "600",
      fontFamily:   "monospace",
      color:        "rgba(245,158,11,0.85)",
      background:   "rgba(245,158,11,0.08)",
      border:       "1px solid rgba(245,158,11,0.18)",
      borderRadius: "4px",
      padding:      "1px 6px",
      letterSpacing: "0.04em",
    }}>
      null
    </span>
  );
}

/* ─────────────────────────────────────────────
   DATASET SNAPSHOT TABLE
───────────────────────────────────────────── */
function DatasetSnapshot({ snapshot }) {
  if (!snapshot?.rows?.length) return null;

  const { columns, rows } = snapshot;
  const visibleCols = columns.slice(0, 7);
  const hiddenCount = columns.length - visibleCols.length;

  return (
    <motion.div
      className="dash-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      style={{ marginBottom: "14px", padding: "0", overflow: "hidden" }}
    >
      {/* Card header */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "16px 20px",
        borderBottom:   "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="dash-section-title" style={{ marginBottom: 0 }}>
          Dataset Preview
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {hiddenCount > 0 && (
            <span className="dash-pill dash-pill--neutral">+{hiddenCount} cols hidden</span>
          )}
          <span className="dash-pill dash-pill--neutral">First {rows.length} rows</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              {/* Row number header */}
              <th style={{
                padding:      "9px 14px",
                textAlign:    "right",
                fontSize:     "9px",
                fontWeight:   "600",
                color:        "rgba(255,255,255,0.18)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                borderRight:  "1px solid rgba(255,255,255,0.06)",
                whiteSpace:   "nowrap",
                width:        "36px",
                userSelect:   "none",
              }}>
                #
              </th>
              {visibleCols.map(col => (
                <th key={col} style={{
                  padding:       "9px 14px",
                  textAlign:     "left",
                  fontSize:      "10px",
                  fontWeight:    "600",
                  color:         "rgba(255,255,255,0.45)",
                  borderBottom:  "1px solid rgba(255,255,255,0.08)",
                  borderRight:   "1px solid rgba(255,255,255,0.04)",
                  whiteSpace:    "nowrap",
                  letterSpacing: "0.04em",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 + i * 0.025, duration: 0.2 }}
                style={{
                  background: i % 2 === 0
                    ? "transparent"
                    : "rgba(255,255,255,0.012)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)"; }}
              >
                {/* Row number */}
                <td style={{
                  padding:     "7px 14px",
                  fontSize:    "10px",
                  color:       "rgba(255,255,255,0.18)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  borderRight:  "1px solid rgba(255,255,255,0.06)",
                  textAlign:   "right",
                  userSelect:  "none",
                  fontFamily:  "monospace",
                }}>
                  {i + 1}
                </td>

                {visibleCols.map(col => {
                  const val    = row[col];
                  const isNull = val === null || val === undefined;
                  const str    = isNull ? "" : String(val);

                  return (
                    <td key={col} style={{
                      padding:      "7px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      borderRight:  "1px solid rgba(255,255,255,0.03)",
                      whiteSpace:   "nowrap",
                      maxWidth:     "160px",
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {isNull
                        ? <NullBadge />
                        : <span style={{
                            color:      /^-?\d+(\.\d+)?$/.test(str)
                              ? "rgba(99,179,237,0.85)"
                              : "rgba(255,255,255,0.62)",
                            fontFamily: /^-?\d+(\.\d+)?$/.test(str) ? "monospace" : "inherit",
                            fontSize:   "12px",
                          }}>
                            {str.length > 20 ? str.slice(0, 20) + "…" : str}
                          </span>
                      }
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NUMERIC SUMMARY CARD
───────────────────────────────────────────── */
function NumericSummaryCard({ meta }) {
  const items = [
    { label: "Total Rows",           value: meta.rows.toLocaleString()  },
    { label: "Total Columns",        value: meta.columns                },
    { label: "Numeric Features",     value: meta.numericCols.length     },
    { label: "Categorical Features", value: meta.categoricalCols.length },
    { label: "Identifier Columns",   value: meta.identifierCols.length  },
    // Only show ML Task Type and Target Column when a target is set
    ...(meta.target ? [
      { label: "ML Task Type",   value: meta.datasetType, gold: true },
      { label: "Target Column",  value: meta.target,      gold: true },
    ] : []),
  ];

  return (
    <motion.div
      className="dash-card dash-card--gold"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      style={{ marginBottom: "14px" }}
    >
      <div className="dash-section-title">Dataset Summary</div>
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap:                 "16px",
      }}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.05, duration: 0.26 }}
          >
            <div className="dash-stat-label">{item.label}</div>
            <div className={`dash-stat-value${item.gold ? " dash-stat-value--gold" : ""}`}>
              {item.value ?? "—"}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COLUMN ROLE LIST
───────────────────────────────────────────── */
function ColumnRoleList({ meta }) {
  const allCols = [
    ...(meta.target ? [{ col: meta.target, role: "target" }] : []),
    ...meta.numericCols.map(c     => ({ col: c, role: "numeric"     })),
    ...meta.categoricalCols.map(c => ({ col: c, role: "categorical" })),
    ...meta.identifierCols.map(c  => ({ col: c, role: "identifier"  })),
  ];

  const groups = [
    { role: "target",      label: "Target",      cols: allCols.filter(c => c.role === "target")      },
    { role: "numeric",     label: "Numeric",      cols: allCols.filter(c => c.role === "numeric")     },
    { role: "categorical", label: "Categorical",  cols: allCols.filter(c => c.role === "categorical") },
    { role: "identifier",  label: "Identifier",   cols: allCols.filter(c => c.role === "identifier")  },
  ].filter(g => g.cols.length > 0);

  return (
    <motion.div
      className="dash-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.35 }}
    >
      <div className="dash-section-title">Column Roles</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {groups.map((group, gi) => {
          const pill = ROLE_PILL[group.role] || ROLE_PILL.categorical;
          return (
            <div key={gi}>
              {/* Group label */}
              <div style={{
                fontSize:      "10px",
                fontWeight:    "600",
                color:         "rgba(255,255,255,0.22)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom:  "8px",
              }}>
                {group.label} ({group.cols.length})
              </div>
              {/* Columns grid */}
              <div style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap:                 "4px",
              }}>
                {group.cols.map((item, i) => (
                  <div key={i} style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    padding:      "6px 8px",
                    borderRadius: "7px",
                    background:   "rgba(255,255,255,0.02)",
                    border:       "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span className={`dash-pill ${pill.cls}`} style={{ fontSize: "9px", padding: "2px 7px" }}>
                      {pill.label}
                    </span>
                    <span style={{
                      fontSize:     "12px",
                      color:        "rgba(255,255,255,0.60)",
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace:   "nowrap",
                    }}>
                      {item.col}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW TAB
───────────────────────────────────────────── */
function OverviewTab({ result }) {
  const { meta, snapshot } = result;

  return (
    <div>
      <DatasetSnapshot snapshot={snapshot} />
      <NumericSummaryCard meta={meta} />
      <ColumnRoleList meta={meta} />
    </div>
  );
}

export default OverviewTab;