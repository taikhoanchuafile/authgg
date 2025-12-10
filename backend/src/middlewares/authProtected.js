import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const AuthProtected = async (req, res, next) => {
  try {
    // Lấy header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Không có token!" });
    }

    // lấy token từ header
    const [type, token] = header.split(" ");
    if (type !== "Bearer") {
      return res
        .status(400)
        .json({ message: "Sai định dạng authorization header!" });
    }
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    // kiểm tra token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    //lấy user thông qua payload(decoded)
    const user = await User.findById(decoded.userId).select("-hashPassword");
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" }); //401 để an toàn tránh dò user
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Lỗi khi gọi AuthProtected", error);
    return res.status(500).json("Lỗi hệ thống");
  }
};
