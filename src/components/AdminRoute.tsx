import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function AdminRoute() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
