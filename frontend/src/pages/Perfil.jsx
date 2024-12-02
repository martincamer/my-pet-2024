import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Perfil = () => {
  const { auth } = useAuth();
  const { user } = auth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Encabezado del perfil */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-16">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="h-12 w-12 text-purple-600" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">
                {user?.nombre} {user?.apellido}
              </h1>
              <p className="mt-2 text-purple-100">@{user?.username}</p>
            </div>
          </div>

          {/* Información del perfil */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <FaEnvelope className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
              </div>

              {/* Estado de verificación */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  {user?.verificado ? (
                    <FaCheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <FaTimesCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Estado de la cuenta
                  </p>
                  <p className="text-lg text-gray-900">
                    {user?.verificado ? "Verificada" : "No verificada"}
                  </p>
                </div>
              </div>

              {/* ID de usuario */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <FaUser className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ID de usuario
                  </p>
                  <p className="text-lg text-gray-900">{user?._id}</p>
                </div>
              </div>
            </div>

            {/* Botón de editar perfil */}
            <div className="mt-8 flex justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Editar Perfil
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Perfil;
