import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AppShell = ({ children }) => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const location = useLocation();

  useEffect(() => {
    const isAuthPage =
      location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/forgot-password" ||
      location.pathname.startsWith("/reset-password");

    if (isAuthPage) return;

    checkAuth();
  }, [checkAuth, location.pathname]);

  return children;
};

export default AppShell;
