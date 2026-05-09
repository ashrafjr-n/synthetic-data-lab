import { motion } from "framer-motion";

function TypeSelector({ type, setType }) {
  return (
    <motion.div className="glass-card rounded-[28px] p-10 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

      <div className="mb-10">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em] mb-3">
          Start Building
        </p>

        <h3 className="text-3xl font-semibold tracking-tight mb-3">
          Choose Classification Type
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed">
          Select structure to unlock intelligent dataset generator.
        </p>
      </div>

      <div className="space-y-4">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setType("binary")}
          className={`w-full rounded-2xl py-5 px-6 text-left ${
            type === "binary"
              ? "bg-black text-white shadow-lg"
              : "border border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-semibold">Binary Target</div>
          <div className="text-xs opacity-60 mt-1">
            Two-class classification system
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setType("multi")}
          className={`w-full rounded-2xl py-5 px-6 text-left ${
            type === "multi"
              ? "bg-black text-white shadow-lg"
              : "border border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-semibold">Multi-Class Target</div>
          <div className="text-xs opacity-60 mt-1">
            Multi-label classification system
          </div>
        </motion.button>

      </div>
    </motion.div>
  );
}

export default TypeSelector;