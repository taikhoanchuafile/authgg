import Token from "../models/Token.js";
import {
  googleLoginService,
  logoutService,
} from "../services/googleAuthService.js";
import { hashString, randomString } from "../utils/crypto.js";
import { signAccessToken } from "../utils/jwt.js";

export const googleLoginController = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const { accessToken, refreshToken } = await googleLoginService(credential);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(201).json({ message: "Đăng nhập thành công!", accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi googleLoginController", error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    // lấy token từ cookies và kiểm tra token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    // xóa token ở db và xóa cookie ở client
    await logoutService(refreshToken);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi logoutController", error);
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    // Kiểm tra refresh token từ cookies mà fe gửi lên
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Không phát hiện token tồn tại!" });
    }

    // Lấy token từ db lên kiểm tra
    const token = await Token.findOne({ token: hashString(refreshToken) });
    if (!token) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn rồi!" });
    }

    // Kiểm tra toekn hến hạn
    if (token.expiresAt < new Date()) {
      await logoutService(refreshToken);
      return res
        .status(403)
        .json({ message: "Token hết hạn hoặc không hợp lệ!" });
    }

    // Tạo new accessToken
    const newAccessToken = signAccessToken(token.userId);

    // rotate refreshToken - thay token và ngày sống
    const newRefreshToken = randomString();
    token.token = hashString(newRefreshToken);
    token.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await token.save();

    // set lại refreshToken mới vào cookies
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshTokenController", error);
    next(error);
  }
};
