import { useState } from "react";
import { toast } from "react-hot-toast";
import clienteAxios from "../config/axios";

const RejectModal = ({ isOpen, onClose, mascotaId, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      const { data } = await clienteAxios.post(`/pets/${mascotaId}/reject`);
      toast.success(data.message);
      onReject(mascotaId);
      onClose();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      toast.error(
        error.response?.data?.message || "Error al rechazar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Rechazar Solicitud
        </h2>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas rechazar esta solicitud de adopción? La
          mascota volverá a estar disponible.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {loading ? "Rechazando..." : "Rechazar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
