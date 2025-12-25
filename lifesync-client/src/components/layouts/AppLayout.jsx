import React from "react";
import { Outlet, Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import UserMenu from "../layout/UserMenu";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <Link
            to="/app/spaces"
            className="text-xl font-bold text-slate-800 tracking-tight hover:text-indigo-600 transition-colors"
          >
            LifeSync
          </Link>
        </div>
        
        <UserMenu />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
