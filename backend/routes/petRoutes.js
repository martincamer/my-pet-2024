import express from "express";
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getUserPets,
  addComment,
  deleteComment,
  adoptPet,
  getAdoptionRequests,
  rejectAdoptionRequest,
} from "../controllers/petController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getPets);

// Rutas protegidas
router.use(protect);

// Rutas específicas primero
router.get("/user/pets", getUserPets);
router.get("/adoption-requests", getAdoptionRequests);

// Rutas con parámetros después
router.post("/", createPet);
router.get("/:id", getPetById);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);
router.post("/:id/adopt", adoptPet);
router.post("/:id/reject", protect, rejectAdoptionRequest);

export default router;
