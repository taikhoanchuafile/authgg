import crypto from "crypto";

export const randomString = () => crypto.randomBytes(64).toString("hex");
export const hashString = (string) => {
  if (!string || typeof string !== "string") return;
  return crypto.createHash("sha256").update(string).digest("hex");
};
