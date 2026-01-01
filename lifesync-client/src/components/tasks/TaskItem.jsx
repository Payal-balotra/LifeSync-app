import React, { useState } from "react";
import { format } from "date-fns";
/**
 * MUST match backend exactly
 */
const STEPS = ["todo", "in_progress", "done"];

const TaskItem = ({ task, role, currentUserId, onUpdateStatus, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // multi assigned user check
  const isAssigned = task.assignedTo?.some((u) => u._id === currentUserId);
  // ONLY owner or assigned user
  const canUpdateStatus = role === "owner" || isAssigned;

  const currentIndex = STEPS.indexOf(task.status);

  return (
    <div
      className="border rounded-lg px-4 py-3 bg-white hover:bg-slate-50 transition"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              task.status === "done"
                ? "line-through text-slate-400"
                : "text-slate-800"
            }`}
          >
            {task.title}
          </p>

          {/* META LINE */}
          <p className="text-xs text-slate-500 mt-0.5">
            {task.assignedTo?.length > 0 && (
              <>
                Assigned to{" "}
                <span className="font-medium">
                  {task.assignedTo.map((u) => u.name).join(", ")}
                  {task.assignedTo.some((u) => u._id === currentUserId) &&
                    " (You)"}
                </span>
              </>
            )}

            {task.assignedTo && task.dueDate && " · "}

            {task.dueDate && (
              <>Due {format(new Date(task.dueDate), "dd MMM")}</>
            )}
          </p>
        </div>

        {/* STATUS BADGE */}
       <span
  className={`flex items-center gap-2 text-xs px-2 py-0.5 rounded-full whitespace-nowrap capitalize ${
    task.status === "todo"
      ? "bg-slate-100 text-slate-600"
      : task.status === "in_progress"
      ? "bg-blue-100 text-blue-600"
      : "bg-green-100 text-green-600"
  }`}
>
  {/* STATUS TEXT */}
  {task.status.replace("_", " ")}

  {/* DELETE (OWNER ONLY) */}
  {role === "owner" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(task._id);
      }}
      className="ml-1 text-red-600 text-xs hover:underline cursor-pointer"
    >
      Delete
    </button>
  )}
</span>

      </div>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <>
          {/* DESCRIPTION */}
          {task.description && (
            <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          {/* PROGRESS STEPS */}
          <div
            className="mt-4 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {STEPS.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;
              const isClickable = canUpdateStatus && index === currentIndex + 1;

              return (
                <React.Fragment key={step}>
                  {/* DOT */}
                  <button
                    disabled={!isClickable}
                    onClick={() =>
                      isClickable && onUpdateStatus(task._id, step)
                    }
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center
                      border text-xs font-medium transition
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }
                      ${
                        isClickable
                          ? "cursor-pointer hover:scale-105"
                          : "cursor-not-allowed opacity-50"
                      }
                    `}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </button>

                  {/* CONNECTOR */}
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

          {/* INFO NOTE */}
          {!canUpdateStatus && (
            <p className="mt-2 text-xs text-slate-400">
              Only the assigned user can update task status
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TaskItem;
