import express from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post("/", addFavorite);
router.delete("/:mascotaId", removeFavorite);
router.get("/", getFavorites);
router.get("/check/:mascotaId", checkFavorite);

export default router;
