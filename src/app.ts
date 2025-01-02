import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import lotteryRoutes from "./routes/lotteryRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/lottery", lotteryRoutes);

export default app;
