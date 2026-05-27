import axiosClient from "../api/axios";

export const login = async (data: any) => {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
};

export const register = async (data: any) => {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
};

export const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            await axiosClient.post("/auth/logout", { token });
        } catch (error) {
            console.error("Logout failed on server", error);
        }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
};

export const getNewAccessToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if(refresh) {
        try {
            const res = await axiosClient.post('/auth/refresh', {refresh})
            if(res.data){
                localStorage.setItem("token", res.data.accessToken);
            }
        }
        catch (error) {
            console.error(`lỗi ${error}`)
        }
    }
}