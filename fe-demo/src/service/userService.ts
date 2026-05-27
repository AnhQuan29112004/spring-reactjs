import axiosClient from "../api/axios";

export type UserRole = "LANHDAO" | "THUKHO" | "VANTHU";

export interface UserAdmin {
  id: number;
  username: string;
  role: UserRole;
}

export interface UserPage {
  content: UserAdmin[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

export interface UserPayload {
  username: string;
  password?: string;
  role: UserRole;
}

export const getUsers = async (page = 0, size = 10, search = "") => {
  const res = await axiosClient.get<UserPage>("/api/users", {
    params: { page, size, search },
  });
  return res.data;
};

export const getLeaderUsers = async () => {
  const res = await axiosClient.get<UserAdmin[]>("/api/leaders");
  return res.data;
};

export const createUser = async (data: UserPayload) => {
  const res = await axiosClient.post<UserAdmin>("/api/users", data);
  return res.data;
};

export const updateUser = async (id: number, data: UserPayload) => {
  const res = await axiosClient.put<UserAdmin>(`/api/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  await axiosClient.delete(`/api/users/${id}`);
};
