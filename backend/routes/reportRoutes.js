import express from "express";
import {
  createReport,
  getUserReports,
  getReportById,
  updateReport,
  addFollowUp,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post("/", createReport);
router.get("/", getUserReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.post("/:id/seguimiento", addFollowUp);

export default router;
