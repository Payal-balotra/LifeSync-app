import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AppShell = ({ children }) => {
  const { checkAuth, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const isAuthPage =
      location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/forgot-password" ||
      location.pathname.startsWith("/reset-password");

    if (!isAuthPage) {
      checkAuth();
    }
  }, [location.pathname, checkAuth]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return children;
};

export default AppShell;
