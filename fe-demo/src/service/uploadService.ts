import axiosClient from "../api/axios";

export interface UploadedFile {
  fileName: string;
  originalName: string;
  contentType: string;
  size: number;
  path: string;
}

const upload = async (url: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post<UploadedFile>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadImage = (file: File) => upload("/api/uploads/images", file);

export const uploadFile = (file: File) => upload("/api/uploads/files", file);
