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
    console.log("check user data: ", initialUser);
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

  setAuth: ({ accessToken, refreshToken }) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    let newUser = null;
    const payload = parseJwtPayload(accessToken);
    if (payload) {
      newUser = {
        username: payload.sub || "",
        role: payload.role || "",
      };
    }

    set({
      accessToken,
      refreshToken,
      user: newUser,
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