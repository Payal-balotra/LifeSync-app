import React, { useMemo } from "react";
import { motion } from "framer-motion";

const PollCard = ({ poll, onVote }) => {
  const totalVotes = useMemo(() => {
    return Object.values(poll.results || {}).reduce((a, b) => a + b, 0);
  }, [poll.results]);

  const votedOptionIds = poll.myVotes || [];
  const hasVoted = votedOptionIds.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-5 space-y-4"
    >
      {/* Question */}
      <div className="space-y-1">
        <h3 className="font-serif font-semibold text-slate-800">
          {poll.question}
        </h3>
        <p className="text-xs text-slate-500">
          {totalVotes} vote{totalVotes !== 1 && "s"}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const count = poll.results?.[option.id] || 0;
          const percent =
            totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

          const isSelected = votedOptionIds.includes(option.id);

          return (
            <button
              key={option.id}
              disabled={hasVoted}
              onClick={() => onVote(poll._id, option.id)}
              className={`relative w-full text-left px-4 py-3 rounded-lg border text-sm transition-all overflow-hidden cursor-pointer disabled:cursor-not-allowed
                ${
                  hasVoted
                    ? isSelected
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-200"
                    : "hover:border-indigo-400 hover:bg-indigo-50/40"
                }`}
            >
              {/* Progress bar */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-100/60"
                  style={{ width: `${percent}%` }}
                />
              )}

              <div className="relative flex justify-between items-center gap-4">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  {option.text}
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      You voted
                    </span>
                  )}
                </span>

                {hasVoted && (
                  <span className="text-xs font-semibold text-slate-600">
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/*  ALREADY VOTED MESSAGE — CORRECT PLACE */}
      {hasVoted && (
        <p className="text-xs font-medium text-indigo-600">
          You have already voted in this poll
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {poll.allowMultiple ? "Multiple choice" : "Single choice"}
        </span>
        <span>
          Created {new Date(poll.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default PollCard;
