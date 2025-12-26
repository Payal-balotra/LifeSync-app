import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "../../components/layouts/AuthLayout";
import { API_PATHS } from "../../services/apiPaths";
import api from "../../services/axios";
import useAuthStore from "../../store/authStore";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      const inviteId = new URLSearchParams(location.search).get("invite");

      if (inviteId) {
        navigate(`/accept-invite/${inviteId}`);
      } else {
        navigate("/app/spaces");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Access your spaces for work, study, or home."
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="name@company.com"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-400 placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Password
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
                focusedField === "password"
                  ? "text-purple-500"
                  : "text-slate-400"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-400 placeholder:text-slate-400  "
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
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Logging in...</span>
              {/* Skeleton Shine Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Don't have an account?{" "}
          <Link
            to={
              new URLSearchParams(location.search).get("invite")
                ? `/signup?invite=${new URLSearchParams(location.search).get(
                    "invite"
                  )}`
                : "/signup"
            }
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
