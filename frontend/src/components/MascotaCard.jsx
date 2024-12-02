import React from "react";
import { FaPaw } from "react-icons/fa";

const MascotaCard = ({ mascota }) => {
  const estadoMascota = () => {
    switch (mascota.estado) {
      case "Disponible":
        return "Disponible para adopción";
      case "En proceso":
        return "En tránsito de adopción";
      case "Adoptada":
        return "Ya adoptada";
      default:
        return "Estado desconocido";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
        <p className="text-gray-600 mb-4">{mascota.descripcion}</p>
        <div className="flex items-center gap-2">
          <FaPaw className="text-purple-600" />
          <span className="text-gray-700">{estadoMascota()}</span>
        </div>
      </div>
    </div>
  );
};

export default MascotaCard;
