import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactions";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";  
import cronRoutes from "./routes/cron";
import { verifyToken } from "./utils/jwtHelper";  

dotenv.config();

const app = express();
const origin = ['http://localhost:3000', "https://transaction-dashboard-frontend-p74811n9s.vercel.app"]
// Middleware
app.use(cors({ origin}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/transactionDB")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Authentication Middleware (Protect API Routes)
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token); 
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", authRoutes);
app.use("/api/transactions", authenticate, transactionRoutes); 
app.use('/api/user',authenticate,userRoutes);
app.use('/api/cron',authenticate,cronRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the Transaction API!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
