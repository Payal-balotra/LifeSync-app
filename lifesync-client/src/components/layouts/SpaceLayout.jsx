import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, CheckSquare, Activity, Settings } from "lucide-react";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore"; // 
import { Skeleton } from "../../components/ui/Skeleton";

const SpaceLayout = () => {
  const { spaceId } = useParams();
  const { user } = useAuthStore(); // current logged-in user

  /* ------------------------------------
     1️⃣ Fetch SPACE details (name, id)
     ------------------------------------ */
  const { data: space, isLoading } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: async () => {
      const res = await api.get(API_PATHS.SPACE.GET_ONE(spaceId));
      return res.data; // { _id, name }
    },
    enabled: !!spaceId,
  });

  /* ------------------------------------
     2️⃣ Fetch SPACE MEMBERS (roles, count)
     ------------------------------------ */
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["space-members", spaceId],
    queryFn: async () => {
      const res = await api.get(API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId));
      return res.data; // [{ userId, role }]
    },
    enabled: !!spaceId,
  });

  /* ------------------------------------
     3️⃣ Derived data (NO API CALL)
     ------------------------------------ */
  const memberCount = members.length;

  // find logged-in user's membership
  const myMembership = members.find((m) => m.userId._id === user?._id);

  const myRole = myMembership?.role || "member";

  /* ------------------------------------
     4️⃣ Loading state (only for space)
     ------------------------------------ */


  /* ------------------------------------
     4️⃣ Loading state (only for space)
     ------------------------------------ */
  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-white overflow-hidden">
         {/* Skeleton Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                 <Skeleton className="w-10 h-10 rounded-lg" />
                 <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                 </div>
             </div>
             <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="flex flex-1 overflow-hidden">
             {/* Skeleton Sidebar */}
            <aside className="w-64 border-r border-slate-100 bg-slate-50 p-4 flex flex-col gap-2">
                 <Skeleton className="h-10 w-full rounded-xl" />
                 <Skeleton className="h-10 w-full rounded-xl" />
                 <Skeleton className="h-10 w-full rounded-xl" />
            </aside>
             {/* Skeleton Main */}
            <main className="flex-1 bg-slate-50/50 p-6">
                 <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                 <Skeleton className="h-64 w-full rounded-xl" />
            </main>
        </div>
      </div>
    );
  }

  // Dynamic gradient based on space name
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const gradientIndex = (space?.name?.length || 0) % gradients.length;
  const gradientClass = gradients[gradientIndex];

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* ================= SPACE HEADER ================= */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100/50`}>
                {space?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{space?.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
                {myRole.charAt(0).toUpperCase() + myRole.slice(1)} • {memberCount}{" "}
                member{memberCount !== 1 ? "s" : ""}
            </p>
            </div>
        </div>

        {/* Space settings */}
        <button className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* -------- Sidebar -------- */}
        <aside className="w-64 border-r border-slate-100 bg-slate-50 p-4 flex flex-col gap-2">
          <NavLink
            to={`/app/spaces/${spaceId}`}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Activity className="w-4 h-4" />
            Activity
          </NavLink>
        </aside>

        {/* -------- Main Content -------- */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
            <div className="h-full w-full overflow-y-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default SpaceLayout;
