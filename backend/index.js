import { connectDB } from "./config/db.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import nodemailer from "nodemailer";

// Configuraciones
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Configuración de Nodemailer
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración de email
transporter
  .verify()
  .then(() => {
    console.log("✉️ Servidor de correo configurado correctamente");
    console.log(" Email configurado:", process.env.EMAIL_USER);
  })
  .catch((error) => {
    console.error("❌ Error en la configuración del correo:", error);
    console.error("📧 Intentando usar:", process.env.EMAIL_USER);
  });

// Configuración de CORS para web y React Native
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "exp://localhost:19000",
    "http://localhost:8081",
    "http://localhost:4000",
    "http://192.168.1.XX:4000",
    "exp://192.168.1.XX:19000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Socket.io para móvil y web
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("📱 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("📱 Cliente desconectado:", socket.id);
  });
});

// Hacer io accesible en toda la aplicación
app.set("io", io);

// Conectar a MongoDB
connectDB();

// Middleware de logging mejorado para depuración móvil
app.use((req, res, next) => {
  console.log(`📱 ${req.method} ${req.originalUrl}`);
  console.log("📍 Origin:", req.get("origin"));
  console.log("📦 Body:", req.body);
  next();
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "¡API funcionando para Web y Mobile! 🚀" });
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);

// Manejo de errores mejorado para mobile
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("📱 Aceptando conexiones de React Native y Web");
});

export default app;
