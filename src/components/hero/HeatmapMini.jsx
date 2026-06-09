import { HEAT_COLS, HEAT_MATRIX } from "./constants";

const heatColor = v =>
  v >= 0.9  ? "rgba(212,175,55,0.90)" :
  v >= 0.65 ? "rgba(212,175,55,0.55)" :
  v >= 0.45 ? "rgba(212,175,55,0.28)" :
  v >= 0.25 ? "rgba(212,175,55,0.12)" :
              "rgba(255,255,255,0.04)";

function HeatmapMini() {
  return (
    <div style={{ display: "inline-block" }}>
      <div className="heatmap__header">
        {HEAT_COLS.map(c => (
          <div key={c} className="heatmap__col-label">{c}</div>
        ))}
      </div>
      {HEAT_MATRIX.map((row, i) => (
        <div key={i} className="heatmap__row">
          <div className="heatmap__row-label">{HEAT_COLS[i]}</div>
          {row.map((v, j) => (
            <div
              key={j}
              className="heatmap__cell"
              style={{ background: heatColor(v) }}
            >
              {i === j && <div className="heatmap__cell-dot" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default HeatmapMini;