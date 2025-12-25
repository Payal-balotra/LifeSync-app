
import React ,{ useState } from "react";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";

const InviteDialog = ({ spaceId, onClose, onSuccess }) => {
  const [inviteOpen, setInviteOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email) return alert("Email required");

    try {
      setLoading(true);
      await api.post(API_PATHS.INVITE.SEND(spaceId), {
        email,
        role,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Invite member</h2>

        <input
          type="email"
          placeholder="Email address"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm cursor-pointer"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteDialog;
