import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Settings,
  Users,
} from "lucide-react";

import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore";
import { Skeleton } from "../../components/ui/Skeleton";
import MembersModal from "../spaces/MembersModal";
import { useState } from "react";

const SpaceLayout = () => {
  const { spaceId } = useParams();
  const { user } = useAuthStore();
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  /* ------------------------------
     1️⃣ Fetch space details
     ------------------------------ */
  const { data: space, isLoading } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: () =>
      api.get(API_PATHS.SPACE.GET_ONE(spaceId)).then((res) => res.data),
    enabled: !!spaceId,
  });

  /* ------------------------------
     2️⃣ Fetch members (for role + count)
     ------------------------------ */
  const { data: members = [] } = useQuery({
    queryKey: ["space-members", spaceId],
    queryFn: () =>
      api
        .get(API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId))
        .then((res) => res.data),
    enabled: !!spaceId,
  });

  /* ------------------------------
     3️⃣ Derived data
     ------------------------------ */
  const memberCount = members.length;
  const myMembership = members.find(
    (m) => m.userId._id === user?._id
  );
  const myRole = myMembership?.role || "member";

  /* ------------------------------
     4️⃣ Loading skeleton
     ------------------------------ */
  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex flex-1">
          <aside className="w-64 p-4">
            <Skeleton className="h-10 mb-2" />
            <Skeleton className="h-10 mb-2" />
            <Skeleton className="h-10 mb-2" />
          </aside>
          <main className="flex-1 p-6">
            <Skeleton className="h-40 w-full" />
          </main>
        </div>
      </div>
    );
  }

  /* ------------------------------
     5️⃣ Gradient avatar
     ------------------------------ */
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const gradientClass =
    gradients[(space?.name?.length || 0) % gradients.length];

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* ===== Header ===== */}
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold`}
          >
            {space?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-semibold">{space?.name}</h1>
            <p className="text-xs text-slate-500">
              {myRole} • {memberCount} member{memberCount !== 1 && "s"}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* ===== Body ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-slate-50 p-4 space-y-2">
          <NavLink
            to={`/app/spaces/${spaceId}`}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Notes
          </NavLink>

          <NavLink
            to={`/app/spaces/${spaceId}/tasks`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <CheckSquare className="w-4 h-4" />
            Tasks
          </NavLink>

          <NavLink
            to={`/app/spaces/${spaceId}/activity`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Activity className="w-4 h-4" />
            Activity
          </NavLink>

          <button
            onClick={() => setIsMembersModalOpen(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-600 hover:bg-slate-100`}
          >
            <Users className="w-4 h-4" />
            Members
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
      
      {/* Members Modal */}
      <MembersModal 
        isOpen={isMembersModalOpen} 
        onClose={() => setIsMembersModalOpen(false)} 
        spaceId={spaceId} 
      />
    </div>
  );
};

export default SpaceLayout;
