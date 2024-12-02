import { connectDB } from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";

// Configuraciones
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL del frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  //cajas

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Hacer io accesible en toda la aplicación
app.set("io", io);

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Añade esto justo después de los middlewares de cors y express.json
app.use((req, res, next) => {
  console.log("🔍 Request URL:", req.method, req.originalUrl);
  console.log("🔑 Headers:", req.headers);
  console.log("📦 Body:", req.body);
  next();
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Algo salió mal!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
