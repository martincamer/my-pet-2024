import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaPaw, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import clienteAxios from "../config/axios";
import { toast } from "react-hot-toast";

const Mascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    especie: "",
    tamanio: "",
    sexo: "",
    ciudad: "",
  });

  const especieOpciones = ["Todas", "Perro", "Gato", "Otro"];
  const tamanioOpciones = ["Todos", "Pequeño", "Mediano", "Grande"];
  const sexoOpciones = ["Todos", "Macho", "Hembra"];

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const { data } = await clienteAxios.get("/pets");
        setMascotas(data.pets);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        toast.error("Error al cargar las mascotas");
      } finally {
        setLoading(false);
      }
    };

    obtenerMascotas();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mascotasFiltradas = mascotas.filter((mascota) => {
    return (
      (filtros.especie === "" ||
        filtros.especie === "Todas" ||
        mascota.especie === filtros.especie) &&
      (filtros.tamanio === "" ||
        filtros.tamanio === "Todos" ||
        mascota.tamanio === filtros.tamanio) &&
      (filtros.sexo === "" ||
        filtros.sexo === "Todos" ||
        mascota.sexo === filtros.sexo) &&
      (filtros.ciudad === "" ||
        mascota.ubicacion.ciudad
          .toLowerCase()
          .includes(filtros.ciudad.toLowerCase()))
    );
  });

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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Encuentra tu compañero ideal
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Estas mascotas están esperando un hogar lleno de amor
            </p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Filtrar Mascotas
              </h3>
              <button
                onClick={() =>
                  setFiltros({
                    especie: "Todas",
                    tamanio: "Todos",
                    sexo: "Todos",
                    ciudad: "",
                  })
                }
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300 flex items-center gap-1"
              >
                <FaTimes className="w-3 h-3" />
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Especie
                </label>
                <div className="relative">
                  <select
                    name="especie"
                    value={filtros.especie}
                    onChange={handleFiltroChange}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  >
                    {especieOpciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tamaño
                </label>
                <div className="relative">
                  <select
                    name="tamanio"
                    value={filtros.tamanio}
                    onChange={handleFiltroChange}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  >
                    {tamanioOpciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <div className="relative">
                  <select
                    name="sexo"
                    value={filtros.sexo}
                    onChange={handleFiltroChange}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  >
                    {sexoOpciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="ciudad"
                    value={filtros.ciudad}
                    onChange={handleFiltroChange}
                    placeholder="Buscar por ciudad..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pl-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 text-sm text-gray-600">
              {mascotasFiltradas.length} mascotas encontradas
            </div>
          </motion.div>

          {/* Grid de mascotas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotasFiltradas.map((mascota) => (
              <motion.div
                key={mascota._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={mascota.imagenes[0]}
                    alt={mascota.nombre}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {mascota.especie}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {mascota.nombre}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaPaw className="text-purple-500" />
                      {mascota.edad} • {mascota.tamanio} • {mascota.sexo}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-500" />
                      {mascota.ubicacion.ciudad}, {mascota.ubicacion.provincia}
                    </p>
                  </div>

                  <Link
                    to={`/mascota/${mascota._id}`}
                    className="block w-full text-center px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Conocer más
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {mascotasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Mascotas;
