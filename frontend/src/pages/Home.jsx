import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import { FaPaw, FaMapMarkerAlt } from "react-icons/fa";

const Home = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("todas");

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const { data } = await clienteAxios.get("/pets");
        setMascotas(data.pets);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMascotas();
  }, []);

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
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8"
          >
            Encuentra tu compañero perfecto
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Dale un hogar a una mascota
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Miles de mascotas están esperando encontrar una familia amorosa
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/mascotas"
              className="px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Adoptar ahora
            </Link>
            <Link
              to="/dar-en-adopcion"
              className="px-8 py-3 text-base font-medium rounded-xl text-purple-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Dar en adopción
            </Link>
          </motion.div>
        </motion.div>

        {/* Elementos decorativos animados */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-20 right-10 text-8xl opacity-20"
        >
          🐕
        </motion.div>
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-20 left-10 text-8xl opacity-20"
        >
          🐈
        </motion.div>
      </section>

      {/* Sección de Mascotas en Riesgo */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Mascotas que necesitan ayuda urgente 🆘
          </motion.h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mascotas
                .filter((mascota) => mascota.estado === "Urgente")
                .slice(0, 6)
                .map((mascota) => (
                  <motion.div
                    key={mascota._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={mascota.imagenes[0]}
                        alt={mascota.nombre}
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Urgente
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {mascota.nombre}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaPaw className="text-purple-500" />
                          {mascota.especie} • {mascota.edad} años •{" "}
                          {mascota.tamanio}
                        </p>
                        <p className="text-gray-600">
                          {mascota.ubicacion.ciudad},{" "}
                          {mascota.ubicacion.provincia}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/mascota/${mascota._id}`}
                          className="inline-flex items-center text-purple-600 hover:text-pink-600 font-medium transition-colors duration-300"
                        >
                          Ver más <span className="ml-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          {!loading &&
            mascotas.filter((mascota) => mascota.estado === "Urgente")
              .length === 0 && (
              <div className="text-center py-12">
                <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay mascotas urgentes en este momento
                </h3>
                <p className="text-gray-600">
                  ¡Pero hay muchas otras mascotas esperando un hogar!
                </p>
                <Link
                  to="/mascotas"
                  className="inline-block mt-4 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Ver todas las mascotas
                </Link>
              </div>
            )}
        </div>
      </section>

      {/* Sección de Búsqueda por Ciudad */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Mascotas recién llegadas
          </motion.h2>

          <div className="flex justify-center mb-8">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="todas">Todas las ciudades</option>
              {[...new Set(mascotas.map((m) => m.ubicacion.ciudad))].map(
                (ciudad) => (
                  <option key={ciudad} value={ciudad.toLowerCase()}>
                    {ciudad}
                  </option>
                )
              )}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mascotas
                .filter(
                  (mascota) =>
                    selectedCity === "todas" ||
                    mascota.ubicacion.ciudad.toLowerCase() === selectedCity
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 8)
                .map((mascota) => (
                  <motion.div
                    key={mascota._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={mascota.imagenes[0]}
                        alt={mascota.nombre}
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          Nuevo
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {mascota.nombre}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaPaw className="text-purple-500" />
                          {mascota.especie} • {mascota.edad} años •{" "}
                          {mascota.tamanio}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-purple-500" />
                          {mascota.ubicacion.ciudad}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(mascota.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "long",
                            }
                          )}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/mascota/${mascota._id}`}
                          className="inline-flex items-center text-purple-600 hover:text-pink-600 font-medium transition-colors duration-300"
                        >
                          Ver más <span className="ml-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          {!loading &&
            mascotas.filter(
              (mascota) =>
                selectedCity === "todas" ||
                mascota.ubicacion.ciudad.toLowerCase() === selectedCity
            ).length === 0 && (
              <div className="text-center py-12">
                <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay mascotas en esta ciudad
                </h3>
                <p className="text-gray-600">
                  ¡Prueba con otra ciudad o mira todas las mascotas disponibles!
                </p>
                <button
                  onClick={() => setSelectedCity("todas")}
                  className="inline-block mt-4 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Ver todas las mascotas
                </button>
              </div>
            )}

          <div className="text-center mt-8">
            <Link
              to="/mascotas"
              className="inline-block px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver todas las mascotas
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Estadísticas */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <p className="text-4xl font-bold text-purple-600">1,234</p>
              <p className="text-gray-600">Mascotas adoptadas</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <p className="text-4xl font-bold text-purple-600">567</p>
              <p className="text-gray-600">Familias felices</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6"
            >
              <p className="text-4xl font-bold text-purple-600">89</p>
              <p className="text-gray-600">Ciudades activas</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para cambiar una vida?
            </h2>
            <p className="text-lg mb-8">
              Adopta una mascota y llena tu hogar de amor incondicional
            </p>
            <Link
              to="/mascotas"
              className="inline-block px-8 py-3 text-base font-medium rounded-xl bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Encuentra tu compañero ideal
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
