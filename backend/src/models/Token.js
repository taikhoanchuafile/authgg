import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    // chứa id của user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // chứa refreshToken
    token: { type: String, required: true, index: true },

    // thời gian sống của token
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, //index: { expires: 0 } token tự hết hạn

    // token dùng cho mục đích gì
    // type: {
    //   type: String,
    //   enum: ["refresh, emailVerify", "resetPassword"],
    //   required: true,
    // },
    // // Để biết token đã được dùng chưa (chỉ dùng 1 lần cho email verify)
    // used: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
