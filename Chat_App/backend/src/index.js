import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js"; // Correct import
import express from "express";
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging

const PORT = process.env.PORT || 5001;
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://extraordinary-pony-6cdd87.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Registering routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  });
}
// Start server
server.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
  connectDB();
});
