import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import clienteAxios from "../config/axios";

const Registro = () => {
  const { login } = useAuth();
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      username: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      rol: "USER",
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        const { data } = await clienteAxios.post("/users/google", {
          email: userInfo.email,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          sub: userInfo.sub,
          rol: "USER",
        });

        if (data.token) {
          login({
            token: data.token,
            user: data,
          });
          navigate("/dashboard");
        }
      } catch (error) {
        setFormError("root", {
          type: "manual",
          message:
            error.response?.data?.message || "Error al registrar con Google",
        });
      }
    },
    onError: () => {
      setFormError("root", {
        type: "manual",
        message: "Error al conectar con Google",
      });
    },
  });

  const onSubmit = async (formData) => {
    try {
      await clienteAxios.post("/users/register", formData);
      navigate("/login");
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: error.response?.data?.message || "Error al registrar usuario",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative overflow-hidden"
      >
        {/* Logo y Encabezado */}
        <div className="text-center relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <img
              className="mx-auto h-28 w-auto drop-shadow-xl"
              src="/mascota-logo.png"
              alt="Logo Mascota"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Crea tu cuenta
          </motion.h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-pink-600 font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("nombre", {
                  required: "El nombre es requerido",
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="👤 Nombre"
              />
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.nombre.message}
                </motion.p>
              )}
            </div>

            <div>
              <input
                {...register("apellido", {
                  required: "El apellido es requerido",
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="👤 Apellido"
              />
              {errors.apellido && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.apellido.message}
                </motion.p>
              )}
            </div>

            <div>
              <input
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="📧 Email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <input
                {...register("username", {
                  required: "El usuario es requerido",
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="🏷️ Nombre de usuario"
              />
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                type="password"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="🔒 Contraseña"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>
          </div>

          {errors.root && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {errors.root.message}
            </motion.p>
          )}

          <div className="space-y-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
            >
              Crear cuenta
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              Registrarse con Google
            </motion.button>
          </div>
        </motion.form>

        {/* Elementos decorativos */}
        <motion.div
          animate={{
            rotate: [0, 360],
            y: [0, -5, 5, -5, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
          }}
          className="absolute -z-10 top-10 -right-10 text-6xl opacity-20"
        >
          🐕
        </motion.div>
        <motion.div
          animate={{
            rotate: [0, -360],
            x: [0, -5, 5, -5, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            x: { duration: 2, repeat: Infinity, repeatType: "reverse" },
          }}
          className="absolute -z-10 bottom-10 -left-10 text-6xl opacity-20"
        >
          🐈
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Registro;
