import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./processing.css";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STEPS = [
  { label: "Reading dataset"         },
  { label: "Detecting data types"    },
  { label: "Checking missing values" },
  { label: "Generating statistics"   },
  { label: "Building visualizations" },
  { label: "Finding relationships"   },
];

const STEP_INTERVAL = 400; // ms per step
const DONE_DELAY    = 2800; // ms before navigating to results

/* ─────────────────────────────────────────────
   PROCESSING STEP
───────────────────────────────────────────── */
function ProcessingStep({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  /* Advance steps on interval, then call onComplete */
  useEffect(() => {
    const timers = [];

    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setCurrentStep(i + 1), (i + 1) * STEP_INTERVAL)
      );
    });

    timers.push(setTimeout(onComplete, DONE_DELAY));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const pct = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="processing-page">
      <div className="processing-card">

        {/* Icon */}
        <motion.div
          className="processing-card__icon"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ⚡
        </motion.div>

        {/* Title */}
        <h2 className="processing-card__title">Analyzing Dataset</h2>
        <p className="processing-card__subtitle">
          Running full analysis — this takes just a moment.
        </p>

        {/* Steps list */}
        <div className="processing-steps">
          {STEPS.map((step, i) => {
            const isDone   = currentStep > i;
            const isActive = currentStep === i;
            const status   = isDone ? "done" : isActive ? "active" : "pending";

            return (
              <AnimatePresence key={i}>
                {currentStep >= i && (
                  <motion.div
                    className="processing-step-row"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Check icon */}
                    <div className={`processing-step-row__check processing-step-row__check--${status}`}>
                      {isDone && "✓"}
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          style={{
                            width: "5px", height: "5px",
                            borderRadius: "50%",
                            background: "var(--gold)",
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <span className={`processing-step-row__label processing-step-row__label--${status}`}>
                      {step.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="processing-progress">
          <div className="processing-progress__track">
            <div
              className="processing-progress__fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="processing-progress__label">
            <span>Analyzing...</span>
            <span className="processing-progress__pct">{pct}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProcessingStep;