import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Calendar, 
  Bell, 
  ShieldCheck,
  Zap
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

        {/* Floating Dashboard Card (Central) */}
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-80 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xl p-6"
        >
            {/* Header Mockup */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <div className="h-2 w-24 bg-slate-800/10 rounded mb-1" />
                        <div className="h-2 w-16 bg-slate-800/10 rounded" />
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Active Task Box */}
            <div className="bg-white/50 p-3 rounded-xl border border-white/50 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">Current Task</span>
                    <span className="text-[10px] text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded border-2 border-slate-300" />
                     <div className="h-2 w-32 bg-slate-800/10 rounded" />
                </div>
            </div>

            {/* Poll Box */}
            <div className="bg-white/50 p-3 rounded-xl border border-white/50 mb-6">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-600">Quick Poll</span>
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-6 relative">
                        <div className="absolute top-0 left-0 h-full w-[75%] bg-indigo-100" />
                        <span className="absolute top-1 left-2 text-[10px] font-medium text-indigo-700">Design Review (75%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-6 relative">
                        <div className="absolute top-0 left-0 h-full w-[25%] bg-slate-200" />
                         <span className="absolute top-1 left-2 text-[10px] font-medium text-slate-600">Testing (25%)</span>
                    </div>
                </div>
            </div>

            {/* List Items */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <div className="flex-1 h-2 bg-slate-800/5 rounded" />
                    </motion.div>
                ))}
            </div>
        </motion.div>

        {/* Floating Notification Pills */}
        <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 md:right-0 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-20"
        >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-slate-700">All Systems Operational</span>
        </motion.div>

        <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 left-0 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-20"
        >
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold text-slate-700">Encrypted Connection</span>
        </motion.div>

         <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 z-20"
        >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-slate-700">Meeting in 10m</span>
        </motion.div>
    </div>
  );
};

export default FeatureShowcase;
