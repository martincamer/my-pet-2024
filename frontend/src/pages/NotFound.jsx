import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Número 404 con efecto de mascota */}
          <h1 className="text-9xl font-bold text-purple-600 opacity-20">404</h1>

          {/* Emoji de mascota animado */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl"
          >
            🐕
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            ¡Ups! Parece que esta página se perdió
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Como un cachorro travieso, la página que buscas se ha extraviado.
            ¡Pero no te preocupes! Puedes volver a casa haciendo click abajo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <motion.span
              animate={{
                x: [0, -4, 4, -4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mr-2"
            >
              🏠
            </motion.span>
            Volver al Inicio
          </Link>
        </motion.div>

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
          className="absolute top-20 right-20 text-6xl opacity-20"
        >
          🐾
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
          className="absolute bottom-20 left-20 text-6xl opacity-20"
        >
          🐈
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
