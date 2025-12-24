import React,{ useState } from "react";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";

const ChangeRoleDialog = ({ spaceId, member, onClose, onSuccess }) => {
  const [role, setRole] = useState(member.role);
  const [loading, setLoading] = useState(false);

  const handleChangeRole = async () => {
    try {
      setLoading(true);
      await api.patch(
        API_PATHS.SPACE.CHANGE_ROLE(spaceId, member._id),
        { role }
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Change role</h2>

        <p className="text-sm text-slate-600 mb-3">
          Change role for <strong>{member.userId.email}</strong>
        </p>

        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="owner">Owner</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleChangeRole}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleDialog;
