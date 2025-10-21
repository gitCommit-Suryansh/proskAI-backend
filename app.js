import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from './routes/userRoutes.js'


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

// routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use('/api/user',userRoutes)


export default app;
