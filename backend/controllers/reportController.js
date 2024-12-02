import Report from "../models/Report.js";

// Crear nueva denuncia
const createReport = async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      denunciante: req.user._id,
      seguimiento: [
        {
          estado: "Pendiente",
          comentario: "Denuncia recibida",
          actualizadoPor: req.user._id,
        },
      ],
    });

    await report.save();

    res.status(201).json({
      ok: true,
      report,
    });
  } catch (error) {
    console.error("Error al crear denuncia:", error);
    res.status(500).json({
      message: "Error al crear la denuncia",
    });
  }
};

// Obtener denuncias del usuario
const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ denunciante: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      ok: true,
      reports,
    });
  } catch (error) {
    console.error("Error al obtener denuncias:", error);
    res.status(500).json({
      message: "Error al obtener las denuncias",
    });
  }
};

// Obtener una denuncia específica
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("denunciante", "nombre apellido email")
      .populate("seguimiento.actualizadoPor", "nombre apellido");

    if (!report) {
      return res.status(404).json({
        message: "Denuncia no encontrada",
      });
    }

    // Verificar que sea el denunciante
    if (report.denunciante._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para ver esta denuncia",
      });
    }

    res.json({
      ok: true,
      report,
    });
  } catch (error) {
    console.error("Error al obtener denuncia:", error);
    res.status(500).json({
      message: "Error al obtener la denuncia",
    });
  }
};

// Actualizar denuncia
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Denuncia no encontrada",
      });
    }

    // Solo el denunciante puede actualizar
    if (report.denunciante.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar esta denuncia",
      });
    }

    // Solo permitir actualizar ciertos campos
    const { descripcion, ubicacion, contactoAdicional } = req.body;

    report.descripcion = descripcion || report.descripcion;
    report.ubicacion = ubicacion || report.ubicacion;
    report.contactoAdicional = contactoAdicional || report.contactoAdicional;

    await report.save();

    res.json({
      ok: true,
      report,
    });
  } catch (error) {
    console.error("Error al actualizar denuncia:", error);
    res.status(500).json({
      message: "Error al actualizar la denuncia",
    });
  }
};

// Agregar seguimiento a denuncia
const addFollowUp = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Denuncia no encontrada",
      });
    }

    const { estado, comentario } = req.body;

    report.seguimiento.push({
      estado,
      comentario,
      actualizadoPor: req.user._id,
    });

    report.estado = estado;
    await report.save();

    res.json({
      ok: true,
      report,
    });
  } catch (error) {
    console.error("Error al agregar seguimiento:", error);
    res.status(500).json({
      message: "Error al agregar seguimiento",
    });
  }
};

export {
  createReport,
  getUserReports,
  getReportById,
  updateReport,
  addFollowUp,
};
