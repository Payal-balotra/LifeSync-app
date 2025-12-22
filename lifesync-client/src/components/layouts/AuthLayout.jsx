import React from "react";
import { motion } from "framer-motion";
import FeatureShowcase from "../ui/FeatureShowcase";

const AuthLayout = ({ children, title = "Welcome Back! ", subtitle = "Enter your credentials to access the workspace." }) => {
  return (  
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-slate-50 text-slate-800 font-['Outfit']">
      
      {/* Main Content Card - Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl min-h-[50vh] md:h-[700px] flex flex-col md:flex-row-reverse bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden m-4"
      >
        
        {/* Right Side (VISUALS) - Hidden on Mobile */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 flex-col items-center justify-center relative p-8 border-l border-white/20">
            <div className="absolute top-10 right-10 md:left-auto md:right-10 z-10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-slate-900 bg-clip-text text-transparent">
                    LifeSync
                </h1>
                <p className="text-sm text-slate-500 font-medium tracking-wide mt-1 text-right">WORKSPACE</p>
            </div>

            {/* Feature Showcase */}
            <div className="w-full h-full">
                <FeatureShowcase />
            </div>
            
            <div className="absolute bottom-8 text-center px-8 z-10">
                <p className="text-slate-500 text-sm font-medium">
                    "Sync your life, master your time."
                </p>
            </div>
        </div>

        {/* Left Side (FORM) - Full width on mobile */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/30">
            <div className="max-w-md w-full mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }} // Slide in from left
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-3xl italic text-slate-700 mb-2 tracking-tight">{title}</h2>
                    <p className="text-slate-500 mb-8">{subtitle}</p>
                </motion.div>

                {children}
                
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
