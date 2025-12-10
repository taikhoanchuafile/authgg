import { Navigate, Outlet } from "react-router";
import { useGoogleAuthStore } from "../stores/useGoogleAuthStore";
import { useEffect, useState } from "react";

const ProtectRoute = () => {
  const loading = useGoogleAuthStore((state) => state.loading);
  const user = useGoogleAuthStore((state) => state.user);
  const fetchMe = useGoogleAuthStore((state) => state.fetchMe);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!user) await fetchMe();
    };
    init();
    setIsStarting(false);
  }, []);

  if (isStarting || loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace></Navigate>;
  }

  return <Outlet />;
};

export default ProtectRoute;
