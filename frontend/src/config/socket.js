import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
});

// Manejadores de eventos por defecto
socket.on("connect", () => {
  console.log("Conectado al servidor de Socket.IO");
});

socket.on("connect_error", (error) => {
  console.error("Error de conexión:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Desconectado del servidor:", reason);
});

export default socket;
