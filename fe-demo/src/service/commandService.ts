import axiosClient from "../api/axios";
import type { CommandFilterValues } from "../interfaces/Command";

export interface CommandItem {
  id: number;
  so_van_ban: string;
  ngay_ban_hanh: string | null;
  ngay_nhan: string | null;
  don_vi_gui: string | null;
  noi_dung: string | null;
  file: string | null;
  loai_van_ban?: string | null;
  trang_thai?: string | null;
  user?: {
    id: number;
    username: string;
  } | null;
  lanhDao?: {
    id: number;
    username: string;
  } | null;
}

export interface CommandResponse {
  content: CommandItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface CommandListParams {
  page: number;
  size: number;
  searchValue: string;
  filters: CommandFilterValues;
  trangThai?: string;
}

export interface CreateCommandPayload {
  so_van_ban: string;
  ngay_ban_hanh: string;
  ngay_nhan: string;
  don_vi_gui: string;
  noi_dung: string | null;
  loai_van_ban: string;
  file: string | null;
  lanhDao: {
    id: number;
  };
  trang_thai: string;
}

export interface UpdateCommandPayload {
  so_van_ban?: string;
  ngay_ban_hanh?: string;
  ngay_nhan?: string;
  don_vi_gui?: string;
  noi_dung?: string | null;
  loai_van_ban?: string;
  file?: string | null;
  lanhDao?: {
    id?: number;
  };
  trang_thai?: string;
}

export const commandQueryKeys = {
  all: ["commands"] as const,
  lists: () => [...commandQueryKeys.all, "list"] as const,
  list: (params: CommandListParams) => [...commandQueryKeys.lists(), params] as const,
  details: () => [...commandQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...commandQueryKeys.details(), id] as const,
};

export const getCommands = async ({
  page,
  size,
  searchValue,
  filters,
  trangThai,
}: CommandListParams): Promise<CommandResponse> => {
  const params: {
    page: number;
    size: number;
    sort: string;
    name?: string;
    donViGui?: string;
    ngayNhan?: string;
    loaiVanBan?: string;
    trangThai?: string;
  } = {
    page,
    size,
    sort: "id",
  };

  if (searchValue.trim()) {
    params.name = searchValue.trim();
  }

  if (filters.don_vi_gui.trim()) {
    params.donViGui = filters.don_vi_gui.trim();
  }

  if (filters.ngay_nhan) {
    params.ngayNhan = filters.ngay_nhan;
  }

  if (filters.loai_van_ban) {
    params.loaiVanBan = filters.loai_van_ban;
  }

  if (trangThai) {
    params.trangThai = trangThai;
  }

  const res = await axiosClient.get("/api/commands", { params });
  return res.data;
};

export const getCommandById = async (id: string): Promise<CommandItem> => {
  const res = await axiosClient.get(`/api/commands/${id}`);
  return res.data;
};

export const createCommand = async (payload: CreateCommandPayload) => {
  const res = await axiosClient.post("/api/commands", payload);
  return res.data;
};

export const deleteCommand = async (id: number) => {
  await axiosClient.delete(`/api/commands/${id}`);
};

export const updateCommand = async (id: number, payload: UpdateCommandPayload) => {
  const res = await axiosClient.patch(`/api/commands/${id}`, payload);
  return res.data;
};

export const deleteCommands = async (ids: number[]) => {
  await axiosClient.delete("/api/commands", {
    data: ids,
  });
};
