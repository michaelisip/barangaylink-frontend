import axios from "axios";

const api = axios.create({
    baseURL: "https://barangaylink.test/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = error.config?.url ?? "";
            const isAuthAttempt =
                path.includes("/login") ||
                path.includes("/register") ||
                path.includes("/admin/login");
            if (!isAuthAttempt) {
                const wasAdmin = localStorage.getItem("admin");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("admin");
                window.location.href =
                    wasAdmin && wasAdmin !== "null" && wasAdmin !== "undefined"
                        ? "/admin/login"
                        : "/login";
            }
        }
        return Promise.reject(error);
    },
);

export default api;
