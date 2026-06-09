import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence }        from "framer-motion";
import Papa                               from "papaparse";

import "./upload.css";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const MAX_SIZE_MB = 40;
const MAX_SIZE_B  = MAX_SIZE_MB * 1024 * 1024;

const PROGRESS_STEPS = [
  { label: "Reading dataset...",   pct: 33  },
  { label: "Checking structure...", pct: 66  },
  { label: "Detecting columns...", pct: 100 },
];

const ERRORS = {
  format: {
    title: "Unsupported file format.",
    desc:  "Only CSV files are supported.",
  },
  size: {
    title: "File size exceeds the limit.",
    desc:  `Maximum allowed file size: ${MAX_SIZE_MB}MB. Please upload a smaller file.`,
  },
  parse: {
    title: "Unable to read this file.",
    desc:  "The CSV structure appears invalid.",
  },
};

const FOOTER_ITEMS = [
  "No data stored",
  "Runs in your browser",
  "Up to 40MB",
];

/* ─────────────────────────────────────────────
   UPLOAD STEP
───────────────────────────────────────────── */
function UploadStep({ onComplete }) {
  const [isDragOver,    setIsDragOver]    = useState(false);
  const [error,         setError]         = useState(null);   // keyof ERRORS | null
  const [progressStep,  setProgressStep]  = useState(null);   // 0 | 1 | 2 | null
  const inputRef = useRef(null);

  /* ── Validate file ── */
  const validate = (file) => {
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      return "format";
    }
    if (file.size > MAX_SIZE_B) {
      return "size";
    }
    return null;
  };

  /* ── Animate progress then parse ── */
  const runProgress = useCallback((file) => {
    setError(null);
    setProgressStep(0);

    setTimeout(() => setProgressStep(1), 400);
    setTimeout(() => setProgressStep(2), 800);

    setTimeout(() => {
      Papa.parse(file, {
        header:         true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          const cols = results.meta.fields;

          if (!cols || cols.length === 0 || data.length === 0) {
            setProgressStep(null);
            setError("parse");
            return;
          }

          onComplete(data, cols);
        },
        error: () => {
          setProgressStep(null);
          setError("parse");
        },
      });
    }, 1200);
  }, [onComplete]);

  /* ── Handle file selection ── */
  const handleFile = useCallback((file) => {
    if (!file) return;
    const err = validate(file);
    if (err) {
      setError(err);
      setProgressStep(null);
      return;
    }
    runProgress(file);
  }, [runProgress]);

  /* ── Drag events ── */
  const onDragOver  = (e) => { e.preventDefault(); setIsDragOver(true);  };
  const onDragLeave = ()  => setIsDragOver(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const isLoading = progressStep !== null;

  return (
    <div className="upload-page">
      <div className="upload-card">

        {/* Eyebrow */}
        <div className="upload-card__eyebrow">
          <div className="upload-card__eyebrow-dot" />
          Step 1 of 4
        </div>

        {/* Title */}
        <h1 className="upload-card__title">Analyze Your Dataset</h1>
        <p className="upload-card__subtitle">
          Upload your CSV file and discover insights, statistics,
          and quality reports — instantly.
        </p>

        {/* Drop Zone */}
        <div
          className={`upload-zone${isDragOver ? " upload-zone--dragover" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="upload-zone__input"
            onChange={e => handleFile(e.target.files[0])}
          />

          {!isLoading ? (
            <>
              <div className="upload-zone__icon">📄</div>
              <div className="upload-zone__title">
                {isDragOver ? "Drop to upload" : "Drag & Drop your CSV here"}
              </div>
              <div className="upload-zone__or">or</div>
              <button
                className="upload-zone__btn"
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                Choose File
              </button>
              <div className="upload-zone__hint">Maximum size: {MAX_SIZE_MB}MB</div>
            </>
          ) : (
            /* Progress */
            <div className="upload-progress" onClick={e => e.stopPropagation()}>
              {PROGRESS_STEPS.map((s, i) => {
                const done    = progressStep > i;
                const active  = progressStep === i;
                const fillPct = done ? 100 : active ? 60 : 0;

                return (
                  <AnimatePresence key={i}>
                    {progressStep >= i && (
                      <motion.div
                        className="upload-progress__step"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className={`upload-progress__label${done ? " upload-progress__label--done" : ""}`}>
                          {s.label}
                        </span>
                        <div className="upload-progress__track">
                          <div
                            className="upload-progress__fill"
                            style={{ width: `${done ? 100 : fillPct}%` }}
                          />
                        </div>
                        <span className={`upload-progress__pct${done ? " upload-progress__pct--done" : ""}`}>
                          {done ? "✓" : `${s.pct}%`}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="upload-error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28 }}
            >
              <span className="upload-error__icon">⚠</span>
              <div>
                <div className="upload-error__title">{ERRORS[error].title}</div>
                <div className="upload-error__desc">{ERRORS[error].desc}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!isLoading && (
          <div className="upload-footer">
            {FOOTER_ITEMS.map((item, i) => (
              <div key={i} className="upload-footer__item">
                {i > 0 && <div className="upload-footer__dot" />}
                {item}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default UploadStep;