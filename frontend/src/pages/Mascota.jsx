import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaPaw,
  FaMapMarkerAlt,
  FaHeart,
  FaCheck,
  FaTimes,
  FaComment,
} from "react-icons/fa";
import clienteAxios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

const Mascota = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const obtenerMascota = async () => {
      try {
        const { data } = await clienteAxios.get(`/pets/${id}`);
        setMascota(data.pet);
        setComentarios(data.pet.comentarios || []);
      } catch (error) {
        console.error("Error al obtener mascota:", error);
        toast.error("Error al cargar la información de la mascota");
      } finally {
        setLoading(false);
      }
    };

    obtenerMascota();
  }, [id]);

  const handleAdoptar = async () => {
    if (!auth.user) {
      toast.error("Debes iniciar sesión para adoptar");
      return;
    }

    try {
      await clienteAxios.post(`/pets/${id}/adopt`);
      toast.success("Solicitud de adopción enviada correctamente");
      setMascota((prev) => ({ ...prev, estado: "En proceso" }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al solicitar adopción:", error);
      toast.error("Error al enviar la solicitud de adopción");
    }
  };

  const handleComentario = async (e) => {
    e.preventDefault();

    if (!auth.user) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    if (comentario.trim().length < 3) {
      toast.error("El comentario debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { data } = await clienteAxios.post(`/pets/${id}/comment`, {
        texto: comentario,
      });

      setComentarios([data.comentario, ...comentarios]);
      setComentario("");
      toast.success("Comentario agregado correctamente");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      toast.error(
        error.response?.data?.message || "Error al agregar el comentario"
      );
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Galería de imágenes */}
          <div className="relative h-96">
            <img
              src={mascota?.imagenes[currentImage]}
              alt={mascota?.nombre}
              className="w-full h-full object-cover"
            />
            {mascota?.imagenes?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {mascota?.imagenes?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentImage === index
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información de la mascota */}
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {mascota?.nombre}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 text-lg">
                  <FaPaw className="text-purple-500" />
                  {mascota?.especie} • {mascota?.edad} años • {mascota?.tamanio}{" "}
                  • {mascota?.sexo}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <FaMapMarkerAlt className="text-purple-500" />
                  {mascota?.ubicacion?.ciudad}, {mascota?.ubicacion?.provincia}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    mascota?.estado === "Disponible"
                      ? "bg-green-100 text-green-800"
                      : mascota?.estado === "Urgente"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {mascota?.estado}
                </span>
              </div>
            </div>

            {/* Características */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(mascota?.caracteristicas || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {value ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                    <span className="capitalize">{key}</span>
                  </div>
                )
              )}
            </div>

            {/* Descripción */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sobre {mascota.nombre}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {mascota.descripcion}
              </p>
            </div>

            {/* Botón de adopción */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={mascota.estado !== "Disponible"}
                className="px-8 py-3 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaHeart /> Adoptar a {mascota.nombre}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sección de comentarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaComment className="text-purple-500" />
            Comentarios
          </h2>

          {/* Formulario de comentarios */}
          <form onSubmit={handleComentario} className="mb-8">
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows="3"
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Comentar
              </button>
            </div>
          </form>

          {/* Lista de comentarios */}
          <div className="space-y-6">
            {comentarios?.map((com) => (
              <div key={com._id} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {com.usuario.nombre[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {com.usuario.nombre}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(com.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{com.texto}</p>
              </div>
            ))}

            {comentarios?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal de adopción */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Confirmar Adopción
          </h3>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas adoptar a{" "}
            <span className="font-bold">{mascota.nombre}</span>? Esta acción
            enviará una solicitud de adopción.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdoptar}
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Mascota;
