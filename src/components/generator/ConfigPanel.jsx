import FeatureBuilder from "./FeatureBuilder";

function ConfigPanel({ type, features, setFeatures }) {
  return (
    <div className="glass-card rounded-[28px] p-10">

      <p className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em] mb-6">
        Dataset Configuration ({type})
      </p>

      <div className="space-y-4">

        <input className="input" placeholder="Dataset Name" />

        <input className="input" placeholder="Rows" type="number" />

        <input className="input" placeholder="Seed" type="number" />

      </div>

      <FeatureBuilder
        features={features}
        setFeatures={setFeatures}
      />

    </div>
  );
}

export default ConfigPanel;