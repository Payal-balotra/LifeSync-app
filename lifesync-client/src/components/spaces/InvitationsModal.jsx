import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Check, XCircle, Loader2 } from "lucide-react";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import { toast } from "react-hot-toast";

const InvitationsModal = ({ isOpen, onClose, onInviteAccepted }) => {
  const queryClient = useQueryClient();

  // 1. Fetch invites
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["my-invites"],
    queryFn: async () => {
      const res = await api.get(API_PATHS.INVITE.GET_INVITES);
      return res.data;
    },
    enabled: isOpen,
  });

  // 2. Accept invite
  const acceptMutation = useMutation({
    mutationFn: async (token) => {
      const res = await api.post(`${API_PATHS.INVITE.ACCEPT}?token=${token}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Joined space successfully!");
      queryClient.invalidateQueries(["my-invites"]);
      queryClient.invalidateQueries(["spaces"]);
      if (onInviteAccepted) onInviteAccepted(data.spaceId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept invite");
    },
  });

  // 3. Reject invite
  const rejectMutation = useMutation({
    mutationFn: async (inviteId) => {
      await api.post(API_PATHS.INVITE.REJECT(inviteId));
    },
    onSuccess: () => {
      toast.success("Invite rejected");
      queryClient.invalidateQueries(["my-invites"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reject invite");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Space Invitations</h2>
            <p className="text-sm text-slate-500">Manage your pending invites</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading invites...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-slate-400" />
              </div>
              <p>No pending invitations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{invite.spaceId.name}</h3>
                      <p className="text-sm text-slate-500">
                        Invited by <span className="text-slate-700 font-medium">{invite.invitedBy?.name}</span>
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium capitalize">
                      {invite.role}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => acceptMutation.mutate(invite.token)}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {acceptMutation.isPending && acceptMutation.variables === invite.token ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(invite._id)}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {rejectMutation.isPending && rejectMutation.variables === invite._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationsModal;
