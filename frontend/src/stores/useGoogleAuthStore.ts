import { create } from "zustand";
import type { googleAuthState } from "../types/googleAuth";
import { useGoogleAuthService } from "../services/googleAuthService";
import { toast } from "react-toastify";

export const useGoogleAuthStore = create<googleAuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearState: () => set({ accessToken: null, user: null, loading: false }),

  fetchMe: async () => {
    try {
      set({ loading: true });
      const res = await useGoogleAuthService.me();
      get().setUser(res.data.user);
    } catch (error) {
      set({ accessToken: null, user: null });
      console.error("Lỗi khi gọi fetchMe", error);
    } finally {
      set({ loading: false });
    }
  },

  googleLogin: async (credential: string) => {
    try {
      set({ loading: true });
      const { setAccessToken, fetchMe } = get();

      const res = await useGoogleAuthService.googleLogin(credential);
      setAccessToken(res.data.accessToken);
      await fetchMe();
      toast.success("Login thành công!");
    } catch (error) {
      console.error("Lỗi khi gọi googleLogin", error);
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await useGoogleAuthService.logOut();
      get().clearState();
    } catch (error) {
      console.error("Lỗi khi gọi logout", error);
    }
  },
  // refreshToken: async () => {
  //   try {
  //     const { setAccessToken, user, fetchMe } = get();
  //     const res = await useGoogleAuthService.refreshToken();
  //     setAccessToken(res.data.accessToken);

  //     if (!user) {
  //       await fetchMe();
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi gọi refreshToken", error);
  //     get().clearState();
  //   }
  // },
}));
