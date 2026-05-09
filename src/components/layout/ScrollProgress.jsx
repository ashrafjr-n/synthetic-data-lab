// src/components/layout/ScrollProgress.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",     label: "Start" },
  { id: "features", label: "Features" },
  { id: "how",      label: "How It Works" },
  { id: "cta",      label: "Get Started" },
];

export function ScrollProgress() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);

      // ← الإصلاح: getBoundingClientRect يعطي الموضع الحقيقي على الشاشة
      let current = "hero";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          current = s.id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // تشغيل مرة عند التحميل
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            right: "28px",
            top: "50vh",
            marginTop: "-52px",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                title={s.label}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexDirection: "row",
                }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#9a7a28",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: "rgba(199,167,74,0.1)",
                        border: "1px solid rgba(199,167,74,0.2)",
                        padding: "3px 10px",
                        borderRadius: "100px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{
                    width:  isActive ? "28px" : "6px",
                    height: "6px",
                    background: isActive ? "#c7a74a" : "#d1d5db",
                    boxShadow: isActive ? "0 0 10px rgba(199,167,74,0.5)" : "none",
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ borderRadius: "6px", flexShrink: 0 }}
                />
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}