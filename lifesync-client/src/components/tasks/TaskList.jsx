import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({tasks = [],role,currentUserId,onUpdateStatus,onDelete}) => {
  const visibleTasks = tasks.filter((t) => !t.isArchived);

  const openTasks = visibleTasks.filter(
    (t) => t.status !== "done"
  );

  const completedTasks = visibleTasks.filter(
    (t) => t.status === "done"
  );

  if (!visibleTasks.length) {
    return (
      <div className="text-sm text-slate-500 text-center py-10">
        No tasks yet. Create your first one 👆
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* OPEN TASKS */}
      <div className="space-y-2">
        {openTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            role={role}
            currentUserId={currentUserId}
            onUpdateStatus={onUpdateStatus}
            onDelete = {onDelete}
          />
        ))}
      </div>

      {/* COMPLETED TASKS */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-xs font-medium text-slate-500 mb-2">
            COMPLETED
          </p>

          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                role={role}
                currentUserId={currentUserId}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
