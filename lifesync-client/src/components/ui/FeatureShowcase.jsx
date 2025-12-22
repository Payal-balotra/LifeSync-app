import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Home,
  MessageSquare,
  Plus
} from "lucide-react";

const FeatureShowcase = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* Abstract Background Elements */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div 
            animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -60, 0],
                opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
        />

        {/* Main Floating Card - Spaces List */}
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-96 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xl p-5"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-700">My Spaces</h3>
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Plus className="w-4 h-4 text-indigo-600" />
                </div>
            </div>

            {/* Space Items */}
            <div className="space-y-3">
                {/* Office Space */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">Office Projects</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex -space-x-2">
                                <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white" />
                                <div className="w-5 h-5 rounded-full bg-slate-300 border-2 border-white" />
                                <div className="w-5 h-5 rounded-full bg-slate-400 border-2 border-white" />
                            </div>
                            <span className="text-[10px] text-slate-500">8 tasks pending</span>
                        </div>
                    </div>
                </motion.div>

                {/* College Space */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-slate-100/50"
                >
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">Final Year Group</p>
                        <p className="text-[10px] text-slate-500">Active now</p>
                    </div>
                </motion.div>

                {/* Flat Space */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-slate-100/50"
                >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <Home className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">Flat 302</p>
                        <p className="text-[10px] text-slate-500">Groceries updated</p>
                    </div>
                </motion.div>
            </div>

            {/* --- Floating Elements (Now relative to this card) --- */}

            {/* Floating Activity Card */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -right-24 bottom-8 w-60 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white p-3 z-30 hidden md:block"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Live Activity</span>
                </div>
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-700 leading-tight"><span className="font-bold">Sarah</span> completed a task</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Just now</p>
                    </div>
                </div>
            </motion.div>

            {/* Floating Notification 1 (Top Left) */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-12 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-30 whitespace-nowrap"
            >
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-semibold text-slate-700">New comment</span>
            </motion.div>

            {/* Floating Notification 2 (Bottom Left) */}
            <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-8 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-30 whitespace-nowrap"
            >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-semibold text-slate-700">Task Done</span>
            </motion.div>

            {/* Floating Notification 3 (Top Right) */}
            <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-10 -right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-30 whitespace-nowrap"
            >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">New Member</span>
            </motion.div>
        </motion.div>
    </div>
  );
};

export default FeatureShowcase;
