import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface PrivateRouteProps {
  children: ReactNode;
  lanhDaoOnly?: boolean;
  thuKhoOnly?:boolean;
  vanThuOnly?:boolean;
}

export default function PrivateRoute({ children, lanhDaoOnly = false, vanThuOnly = false, thuKhoOnly = false }: PrivateRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.user?.role);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const isLanhDao = role === "LANHDAO";
  const isVanThu = role === "VANTHU";
  const isThuKho = role === "THUKHO";

  if ((lanhDaoOnly && !isLanhDao) || (vanThuOnly && !isVanThu) || (thuKhoOnly && !isThuKho)) {
    return <Navigate to="/" />;
  }

  return children;
}
