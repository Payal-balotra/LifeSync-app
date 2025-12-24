import React, { useState } from "react";
import { Shield, User, MoreVertical, Trash2, UserCog } from "lucide-react";

const MembersRow = ({ member, isOwner, onChangeRole, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200/50">
          {member.userId.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">
            {member.userId.username}
          </p>
          <p className="text-xs text-slate-500">{member.userId.email}</p>
        </div>
      </div>

      {/* Role & Actions */}
      <div className="flex items-center gap-3">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1
            ${
              member.role === "owner"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }
          `}
        >
          {member.role === "owner" ? (
            <Shield className="w-3 h-3" />
          ) : (
            <User className="w-3 h-3" />
          )}
          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
        </span>

        {/* Owner actions */}
        {isOwner && member.role !== "owner" && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
                 <>
                   <div 
                     className="fixed inset-0 z-10" 
                     onClick={() => setShowMenu(false)}
                   />
                   <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden py-1">
                     <button
                       onClick={() => {
                         onChangeRole(member);
                         setShowMenu(false);
                       }}
                       className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                     >
                       <UserCog className="w-3.5 h-3.5" />
                       Change Role
                     </button>
                     <button
                       onClick={() => {
                         onRemove(member);
                         setShowMenu(false);
                       }}
                       className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                     >
                       <Trash2 className="w-3.5 h-3.5" />
                       Remove Member
                     </button>
                   </div>
                 </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersRow;
