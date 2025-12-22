import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setMessage(res.data.message || "Reset link sent!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email to reset it."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Email
          </label>
          <div
            className={`
                group flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                ${
                  focusedField === "email"
                    ? "border-indigo-400 shadow-lg shadow-indigo-100"
                    : "border-slate-200 hover:border-slate-300"
                }
            `}
          >
            <Mail
              className={`w-5 h-5 transition-colors ${
                focusedField === "email" ? "text-indigo-500" : "text-slate-400"
              }`}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="name@company.com"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <span>🚀</span> {message}
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
              <span>Sending...</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
