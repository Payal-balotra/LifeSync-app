import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "../layout/UserMenu";

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="h-full bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation - Glassmorphism */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between sticky top-0 z-50 rounded-b-xl mx-4 mt-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <Link
            to="/app/spaces"
            className="text-2xl font-bold text-slate-800 tracking-tight hover:text-indigo-600 transition-colors font-serif"
          >
            LifeSync
          </Link>
        </div>
        
        <UserMenu />
      </header>

      {/* Main Content Area - Animated */}
      <main className="flex-1 w-full overflow-y-auto flex flex-col h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;
