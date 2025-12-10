export interface User {
  _id: string;
  name: string;
  email: string;
  googleId?: string;
  avatar?: string;
  provider?: "local" | "google";
  emailVerified: boolean;
}
