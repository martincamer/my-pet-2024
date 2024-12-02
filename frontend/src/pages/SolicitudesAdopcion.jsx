import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import clienteAxios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { FaPaw, FaEnvelope, FaClock } from "react-icons/fa";
import RejectModal from "../components/RejectModal";

const SolicitudesAdopcion = () => {
  const { auth } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await clienteAxios.get("/pets/adoption-requests");

        if (data.ok && Array.isArray(data.solicitudes)) {
          setSolicitudes(data.solicitudes);
        } else {
          console.error("Formato de respuesta inesperado:", data);
          setSolicitudes([]);
        }
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        setError(
          error.response?.data?.message || "Error al cargar las solicitudes"
        );
        toast.error("Error al cargar las solicitudes de adopción");
        setSolicitudes([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  const handleOpenModal = (mascotaId) => {
    setSelectedMascotaId(mascotaId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMascotaId(null);
  };

  const handleReject = (mascotaId) => {
    setSolicitudes(solicitudes.filter((mascota) => mascota._id !== mascotaId));
  };

  const isPropietario = (mascota) => {
    return mascota.propietario === auth.user._id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <FaPaw className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar las solicitudes
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FaPaw className="text-purple-600" />
          Solicitudes de Adopción
        </h1>

        {solicitudes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <FaClock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-600">
              Cuando alguien solicite adoptar una de tus mascotas, aparecerá
              aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solicitudes.map((mascota) => (
              <div
                key={mascota._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {mascota.imagenes?.[0] && (
                  <img
                    src={mascota.imagenes[0]}
                    alt={mascota.nombre}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {mascota.nombre}
                  </h2>
                  <div className="space-y-3">
                    <p className="text-gray-600">{mascota.descripcion}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Datos del solicitante:
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Nombre:</span>
                          {mascota.adoptante?.nombre || "No disponible"}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          {mascota.adoptante?.email || "No disponible"}
                        </p>
                      </div>
                    </div>
                    {isPropietario(mascota) && (
                      <button
                        onClick={() => handleOpenModal(mascota._id)}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full"
                      >
                        Rechazar Solicitud
                      </button>
                    )}
                    {!isPropietario(mascota) && (
                      <div className="mt-4 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-center">
                        En proceso de adopción
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RejectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mascotaId={selectedMascotaId}
        onReject={handleReject}
      />
    </div>
  );
};

export default SolicitudesAdopcion;
