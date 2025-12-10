import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Kết nối CSDL thành công!");
  } catch (error) {
    console.error("Kết nối CSDL thất bại");
  }
};

export default connectDB;
