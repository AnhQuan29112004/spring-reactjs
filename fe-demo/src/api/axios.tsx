import axios from "axios";
import { saveToken, removeToken } from "../util/token";
import { useAuthStore } from "../store/authStore";

let isRefreshing = false;
let failedQueue:any[] = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient = axios.create({
  baseURL: "http://localhost:8081"
});

axiosClient.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.startsWith("/auth/login") || config.url?.startsWith("/auth/register");
  const token = useAuthStore.getState().accessToken;

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 và chưa retry
    if ((error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh rồi thì queue lại
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => reject(err)
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        const res = await axios.post(
          "http://localhost:8081/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // lưu token mới
        useAuthStore.getState().setAccessToken(newAccessToken);

        // update header global
        axiosClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // retry request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // logout nếu refresh fail
        useAuthStore.getState().logout();

        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
