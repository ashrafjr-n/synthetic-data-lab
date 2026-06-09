import { motion } from "framer-motion";

function TypeSelector({ type, setType }) {
  const OPTIONS = [
    {
      id: "binary",
      label: "Binary Target",
      desc: "Two-class classification system",
      icon: "⊕",
    },
    {
      id: "multi",
      label: "Multi-Class Target",
      desc: "Multi-label classification system",
      icon: "⊞",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "28px",
        padding: "36px 40px",
        boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <p style={{
          fontSize: "10px", fontWeight: "700", color: "rgba(212,175,55,0.45)",
          textTransform: "uppercase", letterSpacing: "0.25em",
          margin: "0 0 14px", fontFamily: "monospace",
        }}>
          Start Building
        </p>
        <h3 style={{
          fontSize: "clamp(1.4rem,2.2vw,1.9rem)", fontWeight: "700",
          letterSpacing: "-0.04em", color: "rgba(255,255,255,0.9)",
          margin: "0 0 10px", lineHeight: 1.1,
        }}>
          Choose Classification Type
        </h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", lineHeight: 1.65, margin: 0 }}>
          Select structure to unlock intelligent dataset generator.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {OPTIONS.map((opt) => {
          const active = type === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setType(opt.id)}
              style={{
                width: "100%", borderRadius: "18px",
                padding: "18px 22px", textAlign: "left",
                border: active
                  ? "1px solid rgba(212,175,55,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: active
                  ? "rgba(212,175,55,0.07)"
                  : "rgba(255,255,255,0.025)",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
                display: "flex", alignItems: "center", gap: "16px",
                boxShadow: active ? "0 0 0 1px rgba(212,175,55,0.15), 0 8px 24px rgba(212,175,55,0.06)" : "none",
              }}
            >
              <span style={{
                fontSize: "22px", opacity: active ? 1 : 0.3,
                color: active ? "#D4AF37" : "white",
                transition: "color 0.2s, opacity 0.2s",
                flexShrink: 0,
              }}>
                {opt.icon}
              </span>
              <div>
                <div style={{
                  fontSize: "14px", fontWeight: "600",
                  color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)",
                  letterSpacing: "-0.02em", marginBottom: "3px",
                  transition: "color 0.2s",
                }}>
                  {opt.label}
                </div>
                <div style={{
                  fontSize: "11.5px",
                  color: active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.18)",
                  transition: "color 0.2s",
                }}>
                  {opt.desc}
                </div>
              </div>
              {active && (
                <div style={{
                  marginLeft: "auto", width: "20px", height: "20px", borderRadius: "50%",
                  background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "#D4AF37", flexShrink: 0,
                }}>
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default TypeSelector;