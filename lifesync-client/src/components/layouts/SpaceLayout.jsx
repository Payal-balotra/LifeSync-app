import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, CheckSquare, Activity, Settings } from "lucide-react";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";

const SpaceLayout = () => {
  const { spaceId } = useParams();

  // Fetch Space Details to get the name
  const { data: space, isLoading } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: async () => {
      const res = await api.get(API_PATHS.SPACE.GET_ALL(spaceId));
      console.log(res.data)
      return res.data;
    },
    enabled: !!spaceId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Space Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {space?.name || "Loading Space..."}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Workspace Environment
          </p>
        </div>
        <div className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors text-slate-400 hover:text-slate-600">
            <Settings className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-100 bg-slate-50/30 p-4 flex flex-col gap-2">
          <NavLink
            to={`/app/spaces/${spaceId}`}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Activity className="w-4 h-4" />
            Activity
          </NavLink>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SpaceLayout;
