import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import "./hero.css";
import CanvasParticles from "./CanvasParticles";

const TRUST = ["No account required", "No data stored", "Works in your browser"];

function HeroSection() {
  const navigate = useNavigate();
  const ref      = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hero-root"
    >
      <CanvasParticles />

      <motion.div
        style={{ y, opacity: fadeOut }}
        className="hero-center"
      >
        {/* Eyebrow */}
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="hero-eyebrow__dot" />
          Data Analysis Platform
        </motion.div>

        {/* Headline */}
        <motion.h1 className="hero-headline-v2">
          <motion.span
            className="hero-headline-v2__line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
          >
            Understand your dataset
          </motion.span>
          <motion.span
            className="hero-headline-v2__line hero-headline-v2__line--gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55 }}
          >
            Before you build anything
          </motion.span>
          <motion.span
            className="hero-headline-v2__line hero-headline-v2__line--gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.55 }}
          >
            instantly
          </motion.span>
        </motion.h1>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.48 }}
          className="hero-cta-wrap"
        >
          <button className="hero-btn-primary" onClick={() => navigate("/analyze")}>
            Analyze Dataset
            <span className="hero-btn-arrow">→</span>
          </button>
        </motion.div>

        {/* Trust */}
        <motion.div
          className="hero-trust-v2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.88, duration: 0.45 }}
        >
          {TRUST.map((t, i) => (
            <div key={i} className="hero-trust-v2__item">
              {i > 0 && <div className="hero-trust-v2__sep" />}
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HeroSection;