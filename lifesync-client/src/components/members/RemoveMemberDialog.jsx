import React from 'react'

import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";

const RemoveMemberDialog = ({ spaceId, member, onClose, onSuccess }) => {
  const handleRemove = async () => {
    try {
      await api.delete(
        API_PATHS.SPACE.REMOVE_MEMBER(spaceId, member._id)
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Remove member</h2>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to remove{" "}
          <strong>{member.userId.email}</strong> from this space?
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveMemberDialog;
