import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken, isLanhDao, isThuKho, isVanThu } from "../util/token";

interface PrivateRouteProps {
  children: ReactNode;
  lanhDaoOnly?: boolean;
  thuKhoOnly?:boolean;
  vanThuOnly?:boolean;
}

export default function PrivateRoute({ children, lanhDaoOnly = false, vanThuOnly = false, thuKhoOnly = false }: PrivateRouteProps) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if ((lanhDaoOnly && !isLanhDao()) || (vanThuOnly && !isVanThu()) || (thuKhoOnly && !isThuKho())) {
    return <Navigate to="/" />;
  }

  return children;
}
