import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
import { toast } from "react-hot-toast";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await clienteAxios.post("/users/olvide-password", {
        email,
      });
      toast.success(data.message);
      setEnviado(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al enviar el código");
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await clienteAxios.post(
        `/users/olvide-password/${codigo}`,
        {
          password: nuevaPassword,
        }
      );
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al cambiar la contraseña"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Recuperar Contraseña
        </h2>

        {!enviado ? (
          <form onSubmit={handleSolicitarCodigo}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Enviar Código
            </button>
          </form>
        ) : (
          <form onSubmit={handleCambiarPassword}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Código de Recuperación
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OlvidePassword;
