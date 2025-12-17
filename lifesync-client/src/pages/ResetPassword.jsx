import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import api from "../servcies/axios";
import { API_PATHS } from "../servcies/apiPaths";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        `${API_PATHS.AUTH.RESET_PASSWORD}/${token}`,
        { password }
      );

      setSuccess(res.data.message || "Password reset successful");
      setTimeout(() => navigate("/"), 2000); // Redirect to login
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            New Password
          </label>
          <div
            className={`
                group flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                ${
                  focusedField === "password"
                    ? "border-purple-400 shadow-lg shadow-purple-100"
                    : "border-slate-200 hover:border-slate-300"
                }
            `}
          >
            <Lock
              className={`w-5 h-5 transition-colors ${
                focusedField === "password" ? "text-purple-500" : "text-slate-400"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Confirm Password
          </label>
          <div
            className={`
                group flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                ${
                  focusedField === "confirmPassword"
                    ? "border-purple-400 shadow-lg shadow-purple-100"
                    : "border-slate-200 hover:border-slate-300"
                }
            `}
          >
            <Lock
              className={`w-5 h-5 transition-colors ${
                focusedField === "confirmPassword" ? "text-purple-500" : "text-slate-400"
              }`}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
                <span>🎉</span> {success}
            </motion.div>
        )}

        {/* Error Message */}
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg"
            >
                {error}
            </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
        >
          {loading ? (
             <div className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Updating...</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ) : (
             <>
                <span>Reset Password</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
