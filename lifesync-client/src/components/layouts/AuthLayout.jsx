import React from "react";
import { LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import FeatureShowcase from "../ui/FeatureShowcase";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Ambient Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1200px] min-h-[600px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white/50"
      >
        {/* Left Side - Form Section */}
        <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center bg-white relative">
            {/* Mobile Header Logo */}
            <div className="lg:hidden mb-8 flex justify-center">
                 <div className="inline-flex p-3 bg-indigo-50 rounded-2xl">
                    <LayoutGrid className="w-6 h-6 text-indigo-600" />
                 </div>
            </div>

            <div className="max-w-sm mx-auto w-full">
                <div className="mb-10 text-center lg:text-left">
                    {title && (
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl lg:text-3xl font-semibold text-slate-800 tracking-tight mb-2"
                    >
                        {title}
                    </motion.h2>
                    )}
                    {subtitle && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-base lg:text-lg"
                    >
                        {subtitle}
                    </motion.p>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>

        {/* Right Side - Feature Showcase (Visuals) */}
        <div className="hidden lg:block lg:w-[55%] bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/50" />
            <FeatureShowcase />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
