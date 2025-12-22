import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import api from "../services/axios";
import { API_PATHS } from "../services/apiPaths";

const AppShell = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get(API_PATHS.AUTH.ME);
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return children;
};

export default AppShell;
