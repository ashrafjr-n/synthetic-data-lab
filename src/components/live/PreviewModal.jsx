import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateCSV } from "../utils/csvGenerator.js";
import { downloadCSV } from "../utils/downloadCSV.js";
import { createPortal } from "react-dom";

// Icons
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.27"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function PreviewModal({ data, loading, datasetName, onClose }) {

  const [isEditing, setIsEditing] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Sync tableData when data prop changes
  useEffect(() => {
    if (data) {
      const deep = data.map(row => ({ ...row }));
      setTableData(deep);
      setOriginalData(deep.map(row => ({ ...row })));
    }
  }, [data]);

  const headers = tableData?.length ? Object.keys(tableData[0]) : [];

  const handleCellChange = (rowIndex, header, value) => {
    setTableData(prev => {
      const updated = prev.map((row, i) =>
        i === rowIndex ? { ...row, [header]: value } : row
      );
      return updated;
    });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setOriginalData(tableData.map(row => ({ ...row })));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTableData(originalData.map(row => ({ ...row })));
    setIsEditing(false);
  };

  const handleReset = () => {
    setTableData(data.map(row => ({ ...row })));
  };

  const handleDownload = () => {
    if (!tableData?.length) return;
    const csv = [
      headers.join(","),
      ...tableData.map(row => headers.map(h => row[h]).join(","))
    ].join("\n");
    downloadCSV(csv, datasetName || "dataset");
  };

  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "10px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.18s ease",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(10,10,10,0.6)",
          backdropFilter: "blur(12px)",
          padding: "0px",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "100%",
            maxWidth: "900px",
            maxHeight: "85vh",
            background: "rgba(15,15,15,0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "28px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
        >

          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>
                Generated Dataset
              </p>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "white", margin: 0 }}>
                {datasetName || "dataset"}.csv
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {!loading && tableData?.length > 0 && (
                <div style={{
                  padding: "6px 14px",
                  borderRadius: "100px",
                  background: "rgba(199,167,74,0.15)",
                  border: "1px solid rgba(199,167,74,0.25)",
                  fontSize: "12px",
                  color: "#c7a74a",
                  fontWeight: "500",
                }}>
                  ✦ {tableData.length} rows · {headers.length} columns
                </div>
              )}
              <button
                onClick={onClose}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Edit mode banner */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  overflow: "hidden",
                  background: "rgba(199,167,74,0.06)",
                  borderBottom: "1px solid rgba(199,167,74,0.15)",
                  padding: "10px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#c7a74a",
                  boxShadow: "0 0 8px #c7a74a",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                <p style={{ fontSize: "12px", color: "rgba(199,167,74,0.8)", margin: 0, letterSpacing: "0.02em" }}>
                  Edit mode — click any cell to modify its value
                </p>
                <style>{`
                  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                  .editable-cell:focus {
                    outline: none !important;
                    background: rgba(199,167,74,0.08) !important;
                    border-radius: 4px;
                  }
                  .editable-cell { border-radius: 4px; padding: 2px 4px; margin: -2px -4px; }
                  .editable-cell:hover { background: rgba(255,255,255,0.05); border-radius: 4px; }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: "0" }}>

            {/* Loading */}
            {loading && (
              <div style={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid rgba(255,255,255,0.1)",
                  borderTop: "2px solid #c7a74a",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", margin: "0 0 4px" }}>
                    Generating your dataset...
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0 }}>
                    AI is analyzing feature relationships
                  </p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Table */}
            {!loading && tableData?.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead style={{ position: "sticky", top: 0, background: "rgba(15,15,15,0.98)" }}>
                  <tr>
                    {headers.map(h => (
                      <th key={h} style={{
                        textAlign: "left",
                        padding: "14px 20px",
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "500",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}>
                      {headers.map(h => (
                        <td key={h} style={{
                          padding: "12px 20px",
                          color: h.toLowerCase().includes("target") || h.toLowerCase().includes("label")
                            ? "#c7a74a"
                            : "rgba(255,255,255,0.75)",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                        }}>
                          {isEditing ? (
                            <span
                              className="editable-cell"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleCellChange(i, h, e.currentTarget.textContent)}
                              style={{
                                display: "inline-block",
                                minWidth: "40px",
                                color: "inherit",
                                cursor: "text",
                                transition: "background 0.15s",
                              }}
                            >
                              {row[h]}
                            </span>
                          ) : (
                            row[h]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>

          {/* Footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 28px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            gap: "12px",
          }}>

            {/* Left side — edit controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  /* Edit button */
                  <motion.button
                    key="edit"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEdit}
                    disabled={loading || !tableData?.length}
                    style={{
                      ...btnBase,
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: loading || !tableData?.length ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.65)",
                      cursor: loading || !tableData?.length ? "not-allowed" : "pointer",
                    }}
                  >
                    <EditIcon /> Edit
                  </motion.button>
                ) : (
                  /* Save + Cancel + Reset */
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    {/* Save */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSave}
                      style={{
                        ...btnBase,
                        background: "rgba(199,167,74,0.12)",
                        borderColor: "rgba(199,167,74,0.3)",
                        color: "#c7a74a",
                        boxShadow: "0 2px 12px rgba(199,167,74,0.1)",
                      }}
                    >
                      <SaveIcon /> Save
                    </motion.button>

                    {/* Cancel */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCancel}
                      style={{
                        ...btnBase,
                        background: "transparent",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      <CancelIcon /> Cancel
                    </motion.button>

                    {/* Divider */}
                    <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.08)" }} />

                    {/* Reset */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleReset}
                      style={{
                        ...btnBase,
                        background: "transparent",
                        borderColor: "rgba(255,80,80,0.2)",
                        color: "rgba(255,100,100,0.6)",
                      }}
                    >
                      <ResetIcon /> Reset
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side — download */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={loading || !tableData?.length}
              style={{
                background: loading || !tableData?.length ? "rgba(255,255,255,0.05)" : "#c7a74a",
                color: loading || !tableData?.length ? "rgba(255,255,255,0.2)" : "white",
                border: "none",
                borderRadius: "14px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading || !tableData?.length ? "not-allowed" : "pointer",
                boxShadow: loading || !tableData?.length ? "none" : "0 4px 16px rgba(199,167,74,0.3)",
                transition: "all 0.2s",
              }}
            >
              ↓ Download CSV
            </motion.button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default PreviewModal;