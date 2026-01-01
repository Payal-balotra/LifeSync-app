import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Users,
} from "lucide-react";

import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore";
import { Skeleton } from "../../components/ui/Skeleton";
import MembersModal from "../spaces/MembersModal";
import ActivityFeed from "../../pages/activity/ActivityFeed";

const SpaceLayout = () => {
  const { spaceId } = useParams();
  const { user } = useAuthStore();

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  /* ------------------------------
     1 Fetch space details
     ------------------------------ */
  const { data: space, isLoading } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: () =>
      api.get(API_PATHS.SPACE.GET_ONE(spaceId)).then((res) => res.data),
    enabled: !!spaceId && spaceId !== "my-invites",
  });

  /* ------------------------------
     2 Fetch members
     ------------------------------ */
  const { data: members = [] } = useQuery({
    queryKey: ["space-members", spaceId],
    queryFn: () =>
      api
        .get(API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId))
        .then((res) => res.data),
    enabled: !!spaceId && spaceId !== "my-invites",
  });

  const memberCount = members.length;
  const myMembership = members.find(
    (m) => m.userId?._id === user?._id
  );
  const myRole = myMembership?.role || "member";

  /* ------------------------------
     ESC key closes activity
     ------------------------------ */
  useEffect(() => {
    if (!isActivityOpen) return;
    const handler = (e) => e.key === "Escape" && setIsActivityOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActivityOpen]);

  /* ------------------------------
     Loading state
     ------------------------------ */
  if (isLoading) {
    return (
      <div className="flex h-full">
        <aside className="w-64 p-4 border-r">
          <Skeleton className="h-10 mb-3" />
          <Skeleton className="h-10 mb-3" />
        </aside>
        <main className="flex-1 p-6">
          <Skeleton className="h-40" />
        </main>
      </div>
    );
  }

  /* ------------------------------
     Gradient avatar
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
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r bg-slate-50 flex flex-col">
        {/* Space Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold`}
            >
              {space?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="truncate">
              <h1 className="font-semibold truncate">{space?.name}</h1>
              <p className="text-xs text-slate-500">
                {myRole} • {memberCount} member{memberCount !== 1 && "s"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
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

          <button
            onClick={() => setIsMembersModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
          >
            <Users className="w-4 h-4" />
            Members
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
        {/* TOP ACTION BAR */}
        <div className="flex justify-end px-4 py-2 border-b bg-white">
          <button
            onClick={() => setIsActivityOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-slate-50 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        <Outlet />
      </main>

      {/* ACTIVITY OVERLAY PANEL */}
      {isActivityOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-96 h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">Activity</h3>
              <button
                onClick={() => setIsActivityOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ActivityFeed />
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS MODAL */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        spaceId={spaceId}
      />
    </div>
  );
};

export default SpaceLayout;
