import React from "react";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";

const COLUMNS = [
  { id: "todo", label: "To Do", bg: "bg-slate-50", border: "border-slate-200" },
  { id: "in_progress", label: "In Progress", bg: "bg-blue-50/50", border: "border-blue-100" },
  { id: "done", label: "Done", bg: "bg-green-50/50", border: "border-green-100" },
];

const TaskList = ({ tasks = [], role, currentUserId, onUpdateStatus, onDelete }) => {
  const visibleTasks = tasks.filter((t) => !t.isArchived);

  // Group tasks by status
  const groupedTasks = {
    todo: visibleTasks.filter((t) => t.status === "todo"),
    in_progress: visibleTasks.filter((t) => t.status === "in_progress"),
    done: visibleTasks.filter((t) => t.status === "done"),
  };

  if (!visibleTasks.length) {
    return (
      <div className="text-sm text-slate-500 text-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
        No tasks yet. Create one to get started! 🚀
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
      {COLUMNS.map((col, colIndex) => (
        <motion.div 
          key={col.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: colIndex * 0.1 }}
          className={`flex flex-col h-full rounded-2xl ${col.bg} border ${col.border} backdrop-blur-sm transition-colors`}
        >
          {/* Column Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-700">{col.label}</h3>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 shadow-sm">
                {groupedTasks[col.id].length}
              </span>
            </div>
          </div>

          {/* Task List Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <AnimatePresence mode="popLayout">
              {groupedTasks[col.id].map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <TaskItem
                    task={task}
                    role={role}
                    currentUserId={currentUserId}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {groupedTasks[col.id].length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                Empty
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
