import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../util/token";

interface UpdateStoreProps {
  children: ReactNode;
}

export default function UpdateStore({ children }: UpdateStoreProps) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
