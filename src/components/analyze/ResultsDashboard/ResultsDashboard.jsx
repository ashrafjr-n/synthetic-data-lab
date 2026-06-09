import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./dashboard.css";
import OverviewTab       from "./tabs/OverviewTab";
import QualityTab        from "./tabs/QualityTab";
import StatisticsTab     from "./tabs/StatisticsTab";
import VisualizationsTab from "./tabs/VisualizationsTab";
import RelationshipsTab  from "./tabs/RelationshipsTab";
import ClassBalanceTab   from "./tabs/ClassBalanceTab";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const BASE_TABS = [
  { id: "overview",       label: "Overview"                           },
  { id: "quality",        label: "Quality"                            },
  { id: "statistics",     label: "Statistics"                         },
  { id: "visualizations", label: "Visualizations"                     },
  { id: "relationships",  label: "Relationships"                      },
  { id: "classbalance",   label: "Class Balance", requiresTarget: true },
];

const INSIGHT_ICONS = {
  success: "✓",
  warning: "⚠",
  info:    "◈",
};

/* ─────────────────────────────────────────────
   TOP INSIGHTS
───────────────────────────────────────────── */
function InsightsStrip({ insights }) {
  if (!insights?.length) return null;

  return (
    <motion.div
      className="dashboard-insights"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <div className="dashboard-insights__title">Top Insights</div>
      <div className="dashboard-insights__list">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            className="dashboard-insight-row"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.42 + i * 0.06, duration: 0.28 }}
          >
            <div className={`dashboard-insight-row__icon dashboard-insight-row__icon--${insight.type}`}>
              {INSIGHT_ICONS[insight.type]}
            </div>
            <span className={`dashboard-insight-row__text--${insight.type}`}>
              {insight.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   RESULTS DASHBOARD
───────────────────────────────────────────── */
function ResultsDashboard({ result, onReset }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!result) return null;

  const { meta, quality, insights } = result;
  const tabs = BASE_TABS.filter(t => !t.requiresTarget || !!meta.target);

  return (
    <div className="dashboard-page">

      {/* ── Hero Bar ── */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__inner">

          {/* Top row */}
          <div className="dashboard-hero__top">
            <div className="dashboard-hero__title-wrap">
              <div className="dashboard-hero__badge">✓</div>
              <div>
                <div className="dashboard-hero__title">Dataset Analysis Complete</div>
                <div className="dashboard-hero__subtitle">
                  Target: <strong style={{ color: "var(--gold)" }}>{meta.target}</strong>
                  &nbsp;·&nbsp;{meta.datasetType}
                </div>
              </div>
            </div>

            <button className="dashboard-hero__reset" onClick={onReset}>
              ↩ New Analysis
            </button>
          </div>

          {/* KPI strip */}
          <motion.div
            className="dashboard-kpi-strip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {[
              { label: "Rows",       value: meta.rows.toLocaleString()              },
              { label: "Columns",    value: meta.columns                            },
              { label: "Missing",    value: quality.missingCells.toLocaleString()   },
              { label: "Duplicates", value: quality.duplicateRows                   },
              { label: "Quality Score", value: quality.qualityScore, suffix: "/100", quality: true },
            ].map((k, i) => (
              <motion.div
                key={i}
                className={`dashboard-kpi-card${k.quality ? " dashboard-kpi-card--quality" : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.35 }}
              >
                <div className="dashboard-kpi-card__label">{k.label}</div>
                <div className="dashboard-kpi-card__value">
                  {k.value}
                  {k.suffix && <span className="dashboard-kpi-card__suffix">{k.suffix}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Top Insights */}
          <InsightsStrip insights={insights} />

        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="dashboard-tabs">
        <div className="dashboard-tabs__inner">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`dashboard-tab${activeTab === tab.id ? " dashboard-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="dashboard-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="dashboard-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {activeTab === "overview"       && <OverviewTab       result={result} />}
            {activeTab === "quality"        && <QualityTab        result={result} />}
            {activeTab === "statistics"     && <StatisticsTab     result={result} />}
            {activeTab === "visualizations" && <VisualizationsTab result={result} />}
            {activeTab === "relationships"  && <RelationshipsTab  result={result} />}
            {activeTab === "classbalance"   && <ClassBalanceTab   result={result} />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

export default ResultsDashboard;