import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import clienteAxios from "../config/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaPencilAlt, FaTrash, FaPaw } from "react-icons/fa";
import { motion } from "framer-motion";
import ModalEliminar from "../components/ModalEliminar";

const MisMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const [modalEliminar, setModalEliminar] = useState({
    isOpen: false,
    mascotaId: null,
    mascotaNombre: "",
  });

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const { data } = await clienteAxios.get("/pets/user/pets");
        setMascotas(data.pets);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        toast.error("Error al cargar tus mascotas");
      } finally {
        setLoading(false);
      }
    };

    obtenerMascotas();
  }, []);

  const handleDeleteClick = (mascota) => {
    setModalEliminar({
      isOpen: true,
      mascotaId: mascota._id,
      mascotaNombre: mascota.nombre,
    });
  };

  const handleDelete = async () => {
    try {
      await clienteAxios.delete(`/pets/${modalEliminar.mascotaId}`);
      setMascotas(
        mascotas.filter((mascota) => mascota._id !== modalEliminar.mascotaId)
      );
      toast.success("Mascota eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      toast.error("Error al eliminar la mascota");
    } finally {
      setModalEliminar({ isOpen: false, mascotaId: null, mascotaNombre: "" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4"
          >
            Mis Mascotas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              en Adopción
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Gestiona las mascotas que has puesto en adopción
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/nueva-mascota"
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaPlus /> Nueva Mascota
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {mascotas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <FaPaw className="text-6xl text-purple-600 opacity-50 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No tienes mascotas registradas
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Comienza registrando tu primera mascota en adopción
              </p>
              <Link
                to="/nueva-mascota"
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaPlus /> Registrar Mascota
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mascotas.map((mascota, index) => (
                <motion.div
                  key={mascota._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={mascota.imagenes[0] || "/placeholder-pet.jpg"}
                      alt={mascota.nombre}
                      className="w-full h-64 object-cover"
                    />
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        mascota.estado === "Disponible"
                          ? "bg-green-100 text-green-800"
                          : mascota.estado === "Adoptado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {mascota.estado}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {mascota.nombre}
                    </h2>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Especie:</span>{" "}
                        {mascota.especie}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Raza:</span>{" "}
                        {mascota.raza}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Ubicación:</span>{" "}
                        {mascota.ubicacion.ciudad}, {mascota.ubicacion.pais}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Link
                        to={`/editar-mascota/${mascota._id}`}
                        className="flex items-center gap-2 text-purple-600 hover:text-pink-600 transition-colors duration-300"
                      >
                        <FaPencilAlt /> Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(mascota)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ModalEliminar
        isOpen={modalEliminar.isOpen}
        onClose={() =>
          setModalEliminar({
            isOpen: false,
            mascotaId: null,
            mascotaNombre: "",
          })
        }
        onConfirm={handleDelete}
        mascotaNombre={modalEliminar.mascotaNombre}
      />
    </div>
  );
};

export default MisMascotas;
