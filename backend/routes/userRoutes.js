import express from "express";
import {
  register,
  login,
  profile,
  registerWithGoogle,
  loginWithGoogle,
  solicitarCambioPassword,
  verificarCodigoYCambiarPassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/google/register", registerWithGoogle);
router.post("/google/login", loginWithGoogle);

// Rutas protegidas
router.get("/profile", protect, profile);
router.post("/olvide-password", solicitarCambioPassword);
router.post("/olvide-password/:token", verificarCodigoYCambiarPassword);

export default router;
