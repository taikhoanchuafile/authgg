import axios from "axios";
import { useGoogleAuthStore } from "../stores/useGoogleAuthStore";
import { toast } from "react-toastify";

/**
 * =============================================================================================
 *                                      Setup axios
 * =============================================================================================
 */
const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;
console.log(baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true, //luôn gửi kèm cookies
});

/**
 * =============================================================================================
 *                    Gắn accesstoken tự động mỗi lần request
 * =============================================================================================
 */
api.interceptors.request.use((config) => {
  const accessToken = useGoogleAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/**
 * =============================================================================================
 *                   Tự động refreshToken khi gặp res 403
 * =============================================================================================
 */
// Tạo biến đánh dấu trạng thái refresh và chứa request lỗi
let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Lấy request gốc
    if (!err.config) return Promise.reject(err);
    const originalRequest = err.config;

    // Nếu gặp lỗi 403 và chưa thử lại thì thực hiện logic
    // Thêm trường hợp 401 cho F5 reload trang (do mình không lưu token trong localStorage)
    if (
      (err.response?.status === 403 || err.response?.status === 401) &&
      !originalRequest._retry
    ) {
      // request 2 -> cuối sẽ vào hàng chờ
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      // Đánh dấu đang refresh và đã thử lại (true: không cho thử đến lần thứ 2)
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;

        // lưu access mới vào store
        useGoogleAuthStore.getState().setAccessToken(newToken);

        // Giái phóng hàng đợi
        queue.forEach((cb) => cb(newToken));
        queue = [];

        toast.warning("Access token vừa được cấp mới!");

        // trả về request đầu tiên tiếp tục lên be
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        // fail thì cho out
        useGoogleAuthStore.getState().logout();
        queue = [];
        toast.warning("Phiên đăng nhập đã hết hạn ");
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
