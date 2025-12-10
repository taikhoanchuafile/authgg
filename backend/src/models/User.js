import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hashPassword: { type: String, select: false, default: null },
    googleId: { type: String, index: true, default: null },
    avatar: { type: String, default: null },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("hashPassword")) return;
  this.hashPassword = await bcrypt.hash(this.hashPassword, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.hashPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
