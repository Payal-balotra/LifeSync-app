import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
     Real-time Member Removal
     ------------------------------ */
    useEffect(() => {
        if (!spaceId || !user) return;
        
        // Join the space room
        import("../../services/socket").then(({ socket }) => {
            socket.emit("join-space", { spaceId });

            const handleMemberRemoved = ({ userId, spaceId: eventSpaceId }) => {
                 // Check if it's me and I'm in this space
                if (eventSpaceId === spaceId && userId === user._id) {
                    // Redirect to spaces dashboard
                    import("react-hot-toast").then(({ toast }) => {
                         toast.error("You have been removed from this space.");
                    });
                    // Force navigation
                    window.location.href = "/app/spaces";
                }
            };

            socket.on("member:removed", handleMemberRemoved);

            return () => {
                socket.off("member:removed", handleMemberRemoved);
            }
        });

    }, [spaceId, user]);

  /* ------------------------------
     Loading state
     ------------------------------ */
  if (isLoading) {
    return (
      <div className="flex h-full p-4 gap-4">
        <aside className="w-64 glass-panel rounded-xl p-4 flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </aside>
        <main className="flex-1 glass-panel rounded-xl p-6">
          <Skeleton className="h-40 w-full rounded-xl" />
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

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex h-full w-full bg-slate-50/50 overflow-hidden gap-4 p-4 pt-0">
      {/* LEFT SIDEBAR - Glassmorphism */}
      <motion.aside 
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="w-64 glass-panel rounded-xl flex flex-col"
      >
        {/* Space Header */}
        <div className="p-6 border-b border-indigo-50/20">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20`}
            >
              {space?.name?.charAt(0)?.toUpperCase()}
            </motion.div>
            <div className="truncate flex-1">
              <h1 className="font-serif font-bold text-lg truncate text-slate-800">{space?.name}</h1>
              <p className="text-xs font-sans text-slate-500 flex items-center gap-1">
                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">{myRole}</span>
                <span>• {memberCount} member{memberCount !== 1 && "s"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 font-sans">
          <NavLink
            to={`/app/spaces/${spaceId}`}
            end
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive
                  ? "bg-indigo-50/50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"
                  />
                )}
                <LayoutDashboard className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="relative z-10">Notes</span>
              </>
            )}
          </NavLink>

          <NavLink
            to={`/app/spaces/${spaceId}/tasks`}
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive
                  ? "bg-indigo-50/50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                 {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"
                  />
                )}
                <CheckSquare className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="relative z-10">Tasks</span>
              </>
            )}
          </NavLink>

           <div className="my-2 border-t border-slate-100/50 mx-4"></div>

           <NavLink
            to={`/app/spaces/${spaceId}/flow`}
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive
                  ? "bg-indigo-50/50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                 {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"
                  />
                )}
                <Activity className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="relative z-10">Flow</span>
              </>
            )}
          </NavLink>

          <button
            onClick={() => setIsMembersModalOpen(true)}
            className="w-full relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40 hover:text-slate-900 transition-all duration-200"
          >
            <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span className="relative z-10">Members</span>
          </button>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4">
           {/* Placeholder for future footer items */}
        </div>
      </motion.aside>
      

      {/* MAIN CONTENT - Wrapped in motion for uniformity */}
      <main className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden shadow-sm relative">
        {/* TOP ACTION BAR - More minimal */}
        <div className="flex justify-end px-6 py-3 border-b border-slate-100/50 bg-white/40 backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActivityOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border border-slate-200 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            Activity
          </motion.button>
        </div>

        <div className="flex-1 overflow-hidden relative">
           <Outlet />
        </div>
      </main>

      {/* ACTIVITY OVERLAY PANEL */}
      <AnimatePresence>
        {isActivityOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm"
            onClick={() => setIsActivityOpen(false)}
          >
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="w-96 h-full bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col border-l border-white/40 ring-1 ring-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-100/50 bg-white/50">
                <div className="flex items-center gap-2">
                   <Activity className="w-4 h-4 text-indigo-500" />
                   <h3 className="font-serif font-bold text-lg text-slate-800 tracking-tight">Activity Log</h3>
                </div>
                <button
                  onClick={() => setIsActivityOpen(false)}
                  className="rounded-full w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white text-slate-400 hover:text-slate-800 transition-all shadow-sm ring-1 ring-slate-200/50"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <ActivityFeed />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
