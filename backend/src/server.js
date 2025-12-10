import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import googleAuthRoutes from "./routes/googleAuthRoute.js";
import connectDB from "./config/db.js";
import { errorHandle } from "./middlewares/errorHandle.js";
import meRoute from "./routes/userRoute.js";
import { AuthProtected } from "./middlewares/authProtected.js";

dotenv.config();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

//public
app.use("/api/auth", googleAuthRoutes);

//private
app.use(AuthProtected);
app.use("/api/users", meRoute);

app.use(errorHandle);

await connectDB();
app.listen(PORT, () => {
  console.log("Server chạy thành công ở cổng", PORT);
});
