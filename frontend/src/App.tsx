import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import AppRoutes from "./AppRoutes";
import LoginPage from "./pages/LoginPage";
import { RouterProvider } from "react-router";
import ProtectRoute from "./components/ProtectRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppRoutes,
    children: [
      { Component: ProtectRoute, children: [{ index: true, Component: Home }] },
      { path: "/login", Component: LoginPage },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
