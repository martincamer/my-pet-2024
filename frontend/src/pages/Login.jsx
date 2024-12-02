import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import clienteAxios from "../config/clienteAxios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Gestión Ecommerce";
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Obtener información del usuario de Google
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log(userInfo); // Imprimir para depuración

        // Verificar que se haya obtenido el email
        if (!userInfo.email) {
          setFormError("root", {
            type: "manual",
            message: "No se pudo obtener el email del usuario de Google",
          });
          return;
        }

        // Enviar datos al backend
        const { data } = await clienteAxios.post("/users/login-google", {
          email: userInfo.email,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          sub: userInfo.sub,
        });

        // Si el login fue exitoso
        if (data.token) {
          login({
            token: data.token,
            user: {
              _id: data._id,
              username: data.username,
              nombre: data.nombre,
              apellido: data.apellido,
              email: data.email,
              permisos: data.permisos,
            },
          });

          navigate("/dashboard");
        }
      } catch (error) {
        setFormError("root", {
          type: "manual",
          message:
            error.response?.data?.message ||
            "Error al iniciar sesión con Google",
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

  const onSubmit = async (data) => {
    try {
      const loginSuccessful = await login(data);
      if (loginSuccessful) {
        navigate("/perfil");
      } else {
        setFormError("root", {
          type: "manual",
          message: "Error al iniciar sesión",
        });
      }
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: "Error al conectar con el servidor",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
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
              duration: 1,
            }}
            className="relative"
          >
            <img
              className="mx-auto h-32 w-auto drop-shadow-xl"
              src="/mascota-logo.png"
              alt="Logo Mascota"
            />
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                y: [0, -5, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -top-3 -right-3"
            >
              <span className="text-4xl">🐾</span>
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            ¡Bienvenido de vuelta!
          </motion.h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:text-pink-600 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <div>
              <input
                {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
                type="email"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="🐱 Tu correo electrónico"
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
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                type="password"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-purple-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                placeholder="🔒 Tu contraseña"
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

          {/* Enlaces de ayuda */}
          <div className="flex flex-col space-y-2 text-sm text-center">
            <Link
              to="/registro"
              className="text-purple-600 hover:text-pink-600 transition-colors"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
            <Link
              to="/recuperar-password"
              className="text-purple-600 hover:text-pink-600 transition-colors"
            >
              ¿Has olvidado tu contraseña?
            </Link>
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

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
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
              Continuar con Google
            </motion.button>
          </div>
        </motion.form>

        {/* Decoración adicional */}
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
          🦮
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

export default Login;
