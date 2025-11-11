import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { prisma } from "./db/prisma.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Your backend is running"
    })
})

// Get all users (protected route)
app.get("/api/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error!" });
    }
});

export default app;
