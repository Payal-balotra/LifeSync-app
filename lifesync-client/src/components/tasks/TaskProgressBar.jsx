import React from "react";
const STEPS = ["todo", "in_progress", "done"];

const TaskProgressBar = ({ status, canUpdate, onChange }) => {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-3 mt-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex; 
        const isActive = index === currentIndex;
        const isClickable = canUpdate && index === currentIndex + 1;

        return (
          <React.Fragment key={step}>
            {/* Dot */}
            <button
              disabled={!isClickable}
              onClick={() => onChange(step)}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                border text-xs font-medium
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-slate-300 text-slate-400"
                }
                ${isClickable ? "cursor-pointer" : "cursor-default"}
              `}
            >
              {isCompleted ? "✓" : index + 1}
            </button>

            {/* Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-10 ${
                  index < currentIndex ? "bg-green-500" : "bg-slate-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default TaskProgressBar;
