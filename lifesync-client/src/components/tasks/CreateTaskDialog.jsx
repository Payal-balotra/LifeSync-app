import React, { useState } from "react";
import { createTask } from "../../services/task.service";
const CreateTaskDialog = ({ open, members, onClose, spaceId, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAssignDropdown,setShowAssignDropdown] = useState(false);
  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setLoading(true);
      setError("");

      await createTask(spaceId, {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });

      onCreated?.(); // refresh task list later
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="text-sm font-medium">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Task title"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Assigned To */}
          {/* Assigned To */}
          <div className="relative">
            <label className="text-sm font-medium">Assign to</label>

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setShowAssignDropdown((v) => !v)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm text-left bg-white"
            >
              {form.assignedTo.length > 0
                ? members
                    .filter((m) => form.assignedTo.includes(m.userId._id))
                    .map((m) => m.userId.name)
                    .join(", ")
                : "Select users"}
            </button>

            {/* Dropdown */}
            {showAssignDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-40 overflow-auto">
                {members.map((member) => {
                  const id = member.userId._id;
                  const checked = form.assignedTo.includes(id);

                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setForm({
                            ...form,
                            assignedTo: checked
                              ? form.assignedTo.filter((x) => x !== id)
                              : [...form.assignedTo, id],
                          });
                        }}
                      />
                      {member.userId.name}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium">Due date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskDialog;
