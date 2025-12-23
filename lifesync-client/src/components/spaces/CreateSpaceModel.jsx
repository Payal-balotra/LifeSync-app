import React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpace } from "../../services/space.service";

const CreateSpaceModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: createSpace,
    onSuccess: (space) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      onCreated(space._id);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Create a new space
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            A space is where your team collaborates in real time.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Space name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flatmates, Project Alpha"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {isError && (
            <p className="text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create space"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
