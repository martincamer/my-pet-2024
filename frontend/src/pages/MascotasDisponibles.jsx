import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import MascotaCard from "../components/MascotaCard";

const MascotasDisponibles = () => {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const { data } = await clienteAxios.get("/pets");
        setMascotas(data);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    obtenerMascotas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mascotas Disponibles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mascotas.map((mascota) => (
            <MascotaCard key={mascota._id} mascota={mascota} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MascotasDisponibles;
