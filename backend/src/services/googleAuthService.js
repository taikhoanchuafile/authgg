import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { signAccessToken } from "../utils/jwt.js";
import { hashString, randomString } from "../utils/crypto.js";
import Token from "../models/Token.js";

// Khởi tạo đối tượng xác mình của GG
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (credential) => {
  // xác minh token bằng GG
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // Lấy payload(thông tin user từ tài khoản gg)
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Token google không hợp lệ!");
  }
  const { name, email, picture, sub, email_verified } = payload;

  //Kiểm tra user
  let user = await User.findOne({ email });
  //   không có thì tạo mới user gg và lưu db
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: sub,
      avatar: picture,
      provider: "google",
      emailVerified: true,
    });
  } else if (!user.googleId) {
    // trùng thì nâng cấp user e/pass => user gg và lưu
    if (!email_verified) {
      throw new Error("Google chưa xác minh email này!");
    }
    user.googleId = sub;
    user.provider = "google";
    user.emailVerified = true;
    await user.save();
  }

  //Tạo accessToken và refeshToken
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = randomString();

  // Xóa token của user này trước khi lưu token mới
  await Token.deleteMany({ userId: user._id });
  // Lưu token vào db
  await Token.create({
    userId: user._id,
    token: hashString(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const logoutService = async (refreshToken) => {
  return await Token.deleteOne({ token: hashString(refreshToken) });
};
