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
  const canUpdateStatus = role === "owner" || isAssigned;

  const nextStatus = 
    task.status === "todo" ? "in_progress" : 
    task.status === "in_progress" ? "done" : null;

  return (
    <div
      className={`relative group bg-white/80 hover:bg-white backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-white/50 ring-1 ring-black/5 ${
        task.status === "done" ? "opacity-60 grayscale hover:grayscale-0 hover:opacity-100" : ""
      }`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header / Title */}
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-medium text-slate-800 leading-tight ${task.status === 'done' ? 'line-through decoration-slate-400' : ''}`}>
          {task.title}
        </h4>
        
        {role === "owner" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="Delete task"
          >
            ✕
          </button>
        )}
      </div>

      {/* Meta Grid */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        {task.dueDate && (
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
             {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
        
        {task.assignedTo?.length > 0 && (
          <div className="flex -space-x-2">
             {task.assignedTo.map(u => (
               <div key={u._id} className="w-5 h-5 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[9px] font-bold text-indigo-600" title={u.name}>
                 {u.name[0]}
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && task.description && (
        <p className="text-sm text-slate-600 mb-4 pb-2 border-b border-slate-100 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Quick Move Action */}
      {canUpdateStatus && nextStatus && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(task._id, nextStatus);
          }}
          className="w-full mt-1 text-xs font-semibold py-1.5 rounded bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-slate-100"
        >
          Move to {nextStatus.replace('_', ' ')} →
        </button>
      )}
    </div>
  );
};

export default TaskItem;
