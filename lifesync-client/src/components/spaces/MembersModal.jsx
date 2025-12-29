import React from "react";
import { X, Shield, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import { Skeleton } from "../ui/Skeleton";
import MembersList from "../members/MembersList";
import useAuthStore from "../../store/authStore";
import RemoveMemberDialog from "../members/RemoveMemberDialog";
import ChangeRoleDialog from "../members/ChangeRoleDialog";
import InviteDialog from "../members/InviteDialog";
import { useState } from "react";
import useMySpaceRole from "../../app/hooks/useMySpaceRole";

const MembersModal = ({ isOpen, onClose, spaceId }) => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["space-members", spaceId],
    queryFn: async () => {
      const res = await api.get(API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId));
      return res.data; 
    },
    enabled: !!spaceId && isOpen,
  });
  const { isOwner, isLoading: roleLoading } =  useMySpaceRole(spaceId);
  const { user } = useAuthStore();
  
  
  const [removeMember, setRemoveMember] = useState(null);
  const [changeRoleMember, setChangeRoleMember] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  
  if (!isOpen || roleLoading) return null;
  const handleRemove = (member) => {
      setRemoveMember(member);
  };

  const handleChangeRole = (member) => {
      setChangeRoleMember(member);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Space Members</h2>
                <p className="text-sm text-slate-500">
                  Manage and view people in this space
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
             {/* Invite Button */}
             {isOwner && (
                <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex justify-end">
                    <button
                        onClick={() => setInviteOpen(true)}
                        className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
                    >
                        + Invite Member
                    </button>
                </div>
            )}

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <MembersList 
                  members={members}
                  isOwner={isOwner}
                  onRemove={handleRemove}
                  onChangeRole={handleChangeRole}
                />
              )}
            </div>

            {/* Dialogs */}
            {removeMember && (
                <RemoveMemberDialog
                    spaceId={spaceId}
                    member={removeMember}
                    onClose={() => setRemoveMember(null)}
                    onSuccess={() => {/* Query invalidation happens automatically via parent if needed, or we can refetch here but React Query cache should update */}}
                />
            )}

            {changeRoleMember && (
                <ChangeRoleDialog
                    spaceId={spaceId}
                    member={changeRoleMember}
                    onClose={() => setChangeRoleMember(null)}
                    onSuccess={() => {/* Same here */}}
                />
            )}

            {inviteOpen && (
                <InviteDialog
                  spaceId={spaceId}
                  onClose={() => setInviteOpen(false)}
                  onSuccess={() => {/* data updates via cache */}}
                />
            )}

             {/* Footer */}
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
                {members.length} member{members.length !== 1 && 's'} in this space
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MembersModal;
