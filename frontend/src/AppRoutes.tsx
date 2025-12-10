import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const AppRoutes = () => {
  return (
    <div>
      <ToastContainer />
      <Outlet />
    </div>
  );
};

export default AppRoutes;
