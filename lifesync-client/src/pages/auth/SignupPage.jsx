import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  CheckCircle2,
} from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore";
 


const SignupPage = () => {
  const { setUser } = useAuthStore.getState();

  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(API_PATHS.AUTH.SIGNUP, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setUser(res.data.user);
    const inviteId = new URLSearchParams(location.search).get("invite");

    if (inviteId) {
      navigate(`/accept-invite/${inviteId}`);
    } else {
      navigate("/app/spaces");
    }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the workspace in seconds."
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Full Name
          </label>
          <div
            className={`
                group flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                ${
                  focusedField === "name"
                    ? "border-indigo-400 shadow-lg shadow-indigo-100"
                    : "border-slate-200 hover:border-slate-300"
                }
            `}
          >
            <User
              className={`w-5 h-5 transition-colors ${
                focusedField === "name" ? "text-indigo-500" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="John Doe"
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Email
          </label>
          <div
            className={`
                group flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm
                ${
                  focusedField === "email"
                    ? "border-blue-400 shadow-lg shadow-blue-100"
                    : "border-slate-200 hover:border-slate-300"
                }
            `}
          >
            <Mail
              className={`w-5 h-5 transition-colors ${
                focusedField === "email" ? "text-blue-500" : "text-slate-400"
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
              className="w-full bg-transparent border-none outline-none ml-3 text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
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
              className={`w-5 h-5 transition-colors  ${
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
              placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
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
            <CheckCircle2
              className={`w-5 h-5 transition-colors ${
                focusedField === "confirmPassword"
                  ? "text-purple-500"
                  : "text-slate-400"
              }`}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              placeholder="Confirm password"
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
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating...</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
