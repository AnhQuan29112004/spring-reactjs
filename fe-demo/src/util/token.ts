let cachedPayload: any = null;
let cachedToken: string | null = null;

export const saveToken = (tokens: { accessToken: string, refreshToken: string }) => {
  localStorage.setItem("token", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  // reset cache khi login mới
  cachedPayload = null;
  cachedToken = null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  // reset cache khi login mới
  cachedPayload = null;
  cachedToken = null;
};

export const parseJwtPayload = (token: string) => {
  const payload = token.split(".")[1];
  if (!payload) return null;
  if (cachedToken === token && cachedPayload) {
    return cachedPayload;
  }
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
    const decoded = JSON.parse(atob(padded));

    cachedToken = token;
    cachedPayload = decoded;
    return decoded;
  } catch {
    return null;
  }
};

export const getCurrentUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwtPayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
};

export const isLanhDao = () => getCurrentUserRole() === "LANHDAO";
export const isVanThu = () => getCurrentUserRole() === "VANTHU";
export const isThuKho = () => getCurrentUserRole() === "THUKHO";
