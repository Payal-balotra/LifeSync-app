import React, { useState } from "react";
import { useParams } from "react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import useMySpaceRole from "../../app/hooks/useMySpaceRole";
import { getTasks, updateTask,deleteTask } from "../../services/task.service";
import { getSpaceMembers } from "../../services/space.service";
import useAuthStore from "../../store/authStore";

import CreateTaskDialog from "../../components/tasks/CreateTaskDialog";
import TaskList from "../../components/tasks/TaskList";

const TaskPage = () => {
  const { user } = useAuthStore();
  const { spaceId } = useParams();

  const { role, canEdit, isLoading: roleLoading } =
    useMySpaceRole(spaceId);

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {data: tasks = [],isLoading: tasksLoading,error} = useQuery({
    queryKey: ["tasks", spaceId],
    queryFn: () => getTasks(spaceId),
    enabled: !!spaceId,
  });
  const { data: members = [], isLoading } = useQuery({
  queryKey: ["space-members", spaceId],
  queryFn: () => getSpaceMembers(spaceId),
});

const deleteTaskMutation = useMutation({
  mutationFn: (taskId) => deleteTask(spaceId, taskId),

  onSuccess: () => {
    // simplest & safest
    queryClient.invalidateQueries(["tasks", spaceId]);
  },
});

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
    updateTask(spaceId, taskId, { status }),
    onMutate: async ({ taskId, status }) => {
    await queryClient.cancelQueries(["tasks", spaceId]);

    const previousTasks = queryClient.getQueryData(["tasks",spaceId,]);

    queryClient.setQueryData(["tasks", spaceId], (old = []) =>
      old.map((task) =>
        task._id === taskId
          ? { ...task, status }
          : task
      )
    );

    return { previousTasks };
  },

  onError: (err, variables, context) => {
    if (context?.previousTasks) {
      queryClient.setQueryData(
        ["tasks", spaceId],
        context.previousTasks
      );
    }
  },

  //  sync with backend
  onSettled: () => {
    queryClient.invalidateQueries(["tasks", spaceId]);
  },
  });

  if (roleLoading) return <div>Loading space...</div>;
  if (tasksLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Failed to load tasks</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-slate-500">
            Track what needs to be done in this space
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            + Create Task
          </button>
        )}
      </div>

      <TaskList
        tasks={tasks}
        role={role}
        currentUserId={user._id}
        onUpdateStatus={(taskId, status) =>
        updateTaskMutation.mutate({ taskId, status })
        }
         onDelete={(taskId) =>deleteTaskMutation.mutate(taskId)
  }
      />

      <CreateTaskDialog
        open={open}
        members = {members}
        onClose={() => setOpen(false)}
        spaceId={spaceId}
        onCreated={() =>
        queryClient.invalidateQueries(["tasks", spaceId])
        }
      />
    </div>
  );
};

export default TaskPage;
