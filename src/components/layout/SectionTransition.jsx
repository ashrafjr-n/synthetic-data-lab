// src/components/layout/SectionTransition.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SectionTransition({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  const variants = {
    up:    { hidden: { opacity: 0, y: 60, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
    left:  { hidden: { opacity: 0, x: -40, filter: "blur(6px)" }, visible: { opacity: 1, x: 0, filter: "blur(0px)" } },
    right: { hidden: { opacity: 0, x: 40,  filter: "blur(6px)" }, visible: { opacity: 1, x: 0, filter: "blur(0px)" } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },

  };

  const chosen = variants[direction];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={chosen}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}