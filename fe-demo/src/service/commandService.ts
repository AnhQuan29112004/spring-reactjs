import axiosClient from "../api/axios";

export const getCommandById = async(id: string) =>{
    const res = await axiosClient.get(`/api/commands/${id}`);
    return res.data;
}