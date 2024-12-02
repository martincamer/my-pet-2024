import Favorite from "../models/Favorite.js";
import Pet from "../models/Pet.js";

// Agregar mascota a favoritos
const addFavorite = async (req, res) => {
  try {
    const { mascotaId } = req.body;

    // Verificar que la mascota existe
    const pet = await Pet.findById(mascotaId);
    if (!pet) {
      return res.status(404).json({
        message: "Mascota no encontrada",
      });
    }

    // Verificar que no sea propietario
    if (pet.propietario.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "No puedes agregar tu propia mascota a favoritos",
      });
    }

    // Crear favorito
    const favorite = await Favorite.create({
      usuario: req.user._id,
      mascota: mascotaId,
    });

    res.status(201).json({
      ok: true,
      favorite,
    });
  } catch (error) {
    // Si es error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Esta mascota ya está en tus favoritos",
      });
    }

    console.error("Error al agregar favorito:", error);
    res.status(500).json({
      message: "Error al agregar a favoritos",
    });
  }
};

// Eliminar mascota de favoritos
const removeFavorite = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      usuario: req.user._id,
      mascota: mascotaId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "Mascota no encontrada en favoritos",
      });
    }

    res.json({
      ok: true,
      message: "Mascota eliminada de favoritos",
    });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({
      message: "Error al eliminar de favoritos",
    });
  }
};

// Obtener favoritos del usuario
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ usuario: req.user._id })
      .populate({
        path: "mascota",
        populate: {
          path: "propietario",
          select: "nombre apellido email",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      favorites: favorites.map((fav) => fav.mascota),
    });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({
      message: "Error al obtener favoritos",
    });
  }
};

// Verificar si una mascota está en favoritos
const checkFavorite = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    const favorite = await Favorite.findOne({
      usuario: req.user._id,
      mascota: mascotaId,
    });

    res.json({
      ok: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    res.status(500).json({
      message: "Error al verificar favorito",
    });
  }
};

export { addFavorite, removeFavorite, getFavorites, checkFavorite };
