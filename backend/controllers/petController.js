import Pet from "../models/Pet.js";
import asyncHandler from "express-async-handler";

// Obtener todas las mascotas
const getPets = asyncHandler(async (req, res) => {
  try {
    const { especie, ciudad, urgente } = req.query;
    let query = { estado: "Disponible" };

    if (especie) query.especie = especie;
    if (ciudad) query["ubicacion.ciudad"] = ciudad;
    if (urgente) query.urgente = urgente === "true";

    const pets = await Pet.find(query)
      .populate("propietario", "nombre apellido email")
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      pets,
    });
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({
      message: "Error al obtener las mascotas",
    });
  }
});

// Obtener una mascota por ID
const getPetById = asyncHandler(async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      "propietario",
      "nombre apellido email"
    );

    if (!pet) {
      return res.status(404).json({
        message: "Mascota no encontrada",
      });
    }

    res.json({
      ok: true,
      pet,
    });
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    res.status(500).json({
      message: "Error al obtener la mascota",
    });
  }
});

// Crear nueva mascota
const createPet = asyncHandler(async (req, res) => {
  try {
    const pet = new Pet({
      ...req.body,
      propietario: req.user._id,
    });

    await pet.save();

    res.status(201).json({
      ok: true,
      pet,
    });
  } catch (error) {
    console.error("Error al crear mascota:", error);
    res.status(500).json({
      message: "Error al crear la mascota",
    });
  }
});

// Actualizar mascota
const updatePet = asyncHandler(async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Mascota no encontrada",
      });
    }

    // Verificar que el usuario sea el propietario
    if (pet.propietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar esta mascota",
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      ok: true,
      pet: updatedPet,
    });
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    res.status(500).json({
      message: "Error al actualizar la mascota",
    });
  }
});

// Eliminar mascota
const deletePet = asyncHandler(async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Mascota no encontrada",
      });
    }

    // Verificar que el usuario sea el propietario
    if (pet.propietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar esta mascota",
      });
    }

    await pet.deleteOne();

    res.json({
      ok: true,
      message: "Mascota eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    res.status(500).json({
      message: "Error al eliminar la mascota",
    });
  }
});

// Obtener mascotas del usuario autenticado
const getUserPets = asyncHandler(async (req, res) => {
  try {
    const pets = await Pet.find({ propietario: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      ok: true,
      pets,
    });
  } catch (error) {
    console.error("Error al obtener mascotas del usuario:", error);
    res.status(500).json({
      message: "Error al obtener las mascotas",
    });
  }
});

// @desc    Agregar comentario a mascota
// @route   POST /api/pets/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { texto, comentario } = req.body;
  const textoComentario = texto || comentario;
  const { id } = req.params;

  if (!textoComentario) {
    res.status(400);
    throw new Error("El texto del comentario es requerido");
  }

  const mascota = await Pet.findById(id);

  if (!mascota) {
    res.status(404);
    throw new Error("Mascota no encontrada");
  }

  const nuevoComentario = {
    texto: textoComentario,
    usuario: {
      _id: req.user._id,
      nombre: req.user.nombre,
      email: req.user.email,
    },
    createdAt: new Date(),
  };

  mascota.comentarios.unshift(nuevoComentario);
  await mascota.save();

  res.status(201).json({
    comentario: {
      ...nuevoComentario,
      _id: mascota.comentarios[0]._id,
    },
  });
});

// @desc    Eliminar comentario de mascota
// @route   DELETE /api/pets/:id/comment/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;

  const mascota = await Pet.findById(id);

  if (!mascota) {
    res.status(404);
    throw new Error("Mascota no encontrada");
  }

  const comentario = mascota.comentarios.id(commentId);

  if (!comentario) {
    res.status(404);
    throw new Error("Comentario no encontrado");
  }

  // Verificar que el usuario sea el dueño del comentario o el admin
  if (
    comentario.usuario._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(401);
    throw new Error("No autorizado para eliminar este comentario");
  }

  comentario.remove();
  await mascota.save();

  res.json({ message: "Comentario eliminado" });
});

// @desc    Adoptar mascota
// @route   POST /api/pets/:id/adopt
// @access  Private
const adoptPet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mascota = await Pet.findById(id);

  if (!mascota) {
    res.status(404);
    throw new Error("Mascota no encontrada");
  }

  if (mascota.estado !== "Disponible") {
    res.status(400);
    throw new Error("Esta mascota no está disponible para adopción");
  }

  // Actualizar estado de la mascota
  mascota.estado = "En proceso";
  mascota.adoptante = {
    _id: req.user._id,
    nombre: req.user.nombre,
    email: req.user.email,
  };

  await mascota.save();

  // Aquí podrías agregar lógica adicional como enviar emails, crear notificaciones, etc.

  res.json({
    message: "Solicitud de adopción enviada correctamente",
    mascota,
  });
});

// @desc    Obtener mascotas con solicitudes de adopción
// @route   GET /api/pets/adoption-requests
// @access  Private
const getAdoptionRequests = asyncHandler(async (req, res) => {
  console.log("Usuario autenticado:", req.user); // Para debugging

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no autenticado",
      });
    }

    const mascotas = await Pet.find({
      //   propietario: req.user._id,
      estado: "En proceso",
      adoptante: { $exists: true },
    }).populate("adoptante", "nombre email");

    console.log("Mascotas encontradas:", mascotas); // Para debugging

    res.json({
      ok: true,
      solicitudes: mascotas,
    });
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener las solicitudes de adopción",
    });
  }
});

// @desc    Rechazar solicitud de adopción
// @route   POST /api/pets/:id/reject
// @access  Private
const rejectAdoptionRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mascota = await Pet.findById(id);

  if (!mascota) {
    res.status(404);
    throw new Error("Mascota no encontrada");
  }

  if (mascota.propietario.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("No autorizado para rechazar esta solicitud");
  }

  // Rechazar la solicitud y volver a poner la mascota disponible
  mascota.estado = "Disponible";
  mascota.adoptante = null;
  await mascota.save();

  res.json({
    ok: true,
    message: "Solicitud de adopción rechazada y mascota disponible nuevamente",
  });
});

export {
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
};
