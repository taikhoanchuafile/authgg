import api from "../api/axios";

export const useGoogleAuthService = {
  googleLogin: async (credential: string) => {
    return await api.post("/auth/google", { credential });
  },
  logOut: async () => {
    return await api.post("/auth/logout");
  },
  me: async () => {
    return await api.get("/users/me");
  },
  // refreshToken: async () => {
  //   return await api.post("/auth/refresh-token");
  // },
};
