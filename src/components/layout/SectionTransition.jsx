import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VARIANTS = {
  up: {
    hidden:  { opacity: 0, y: 36, filter: "blur(5px)"  },
    visible: { opacity: 1, y: 0,  filter: "blur(0px)"  },
  },
  left: {
    hidden:  { opacity: 0, x: -28, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0,   filter: "blur(0px)" },
  },
  right: {
    hidden:  { opacity: 0, x: 28,  filter: "blur(4px)" },
    visible: { opacity: 1, x: 0,   filter: "blur(0px)" },
  },
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function SectionTransition({
  children,
  delay     = 0,
  direction = "up",
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={VARIANTS[direction] ?? VARIANTS.fade}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ width: "100%", display: "block" }}
    >
      {children}
    </motion.div>
  );
}