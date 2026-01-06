import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CreatePollModal = ({ open, onClose, onCreate }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? value : opt))
    );
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    if (options.filter((o) => o.trim()).length < 2) return;

    try {
      setLoading(true);

      await onCreate({
        question,
        options: options
          .filter((o) => o.trim())
          .map((text, idx) => ({
            id: `opt-${idx + 1}`,
            text,
          })),
        allowMultiple,
      });

      setQuestion("");
      setOptions(["", ""]);
      setAllowMultiple(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg glass-panel rounded-2xl p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-slate-800">
              Create Poll
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/50"
            >
              ✕
            </button>
          </div>

          {/* Question */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase">
              Question
            </label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What should we decide?"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600 uppercase">
              Options
            </label>

            {options.map((opt, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addOption}
              className="text-sm text-indigo-600 hover:underline"
            >
              + Add option
            </button>
          </div>

          {/* Settings */}
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="rounded border-slate-300"
            />
            Allow multiple selections
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePollModal;
