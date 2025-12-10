import type { User } from "./User";

export interface googleAuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;

  fetchMe: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  // refreshToken: () => Promise<void>;
}
