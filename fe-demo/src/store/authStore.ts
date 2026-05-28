import { create } from "zustand";
import { parseJwtPayload } from "../util/token";

type User = {
  username: string;
  role: string;
};

const initialToken = localStorage.getItem("token");
let initialUser: User | null = null;
if (initialToken) {
  const payload = parseJwtPayload(initialToken);
  if (payload) {
    initialUser = {
      username: payload.sub || "",
      role: payload.role || "",
    };
  }
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setAccessToken: (token: any) => void;

  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initialToken,
  refreshToken: localStorage.getItem("refreshToken"),
  user: initialUser,

  setAccessToken: (token) => {
    localStorage.setItem("token", token);

    set({
      accessToken: token,
    });
  },

  setAuth: ({ accessToken, refreshToken, user=null }) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    set({
      accessToken,
      refreshToken,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },
}));