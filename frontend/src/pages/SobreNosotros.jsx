import { motion } from "framer-motion";
import { Heart, Shield, HandHeart, Mail, Phone, MapPin } from "lucide-react";

const SobreNosotros = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Hero Section con diseño moderno */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Sobre Nosotros
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Conectando corazones peludos con familias amorosas
            </motion.p>
          </div>
        </div>

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
      </motion.section>

      {/* Nuestra Misión con diseño de tarjeta moderna */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-16 h-16 text-purple-600 stroke-2" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            Nuestra Misión
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            En Mi Mascota en Adopción, nos dedicamos a crear conexiones
            significativas entre mascotas necesitadas y familias amorosas.
            Creemos que cada animal merece un hogar donde pueda ser amado y
            cuidado.
          </p>
        </div>
      </motion.section>

      {/* Valores con diseño de tarjetas flotantes */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="w-12 h-12 text-purple-600 stroke-2" />,
              title: "Compromiso",
              description:
                "Trabajamos incansablemente para asegurar que cada mascota encuentre el hogar perfecto.",
            },
            {
              icon: (
                <HandHeart className="w-12 h-12 text-purple-600 stroke-2" />
              ),
              title: "Responsabilidad",
              description:
                "Promovemos la adopción responsable y educamos sobre el cuidado adecuado.",
            },
            {
              icon: <Heart className="w-12 h-12 text-purple-600 stroke-2" />,
              title: "Amor",
              description:
                "Creemos que el amor por los animales puede transformar vidas.",
            },
          ].map((valor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center mb-6">
                {valor.icon}
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                {valor.title}
              </h3>
              <p className="text-gray-600 text-center text-lg">
                {valor.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contacto con diseño de tarjeta moderna */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Contáctanos</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: <Mail className="w-10 h-10" />,
                text: "info@mimascota.com",
              },
              {
                icon: <Phone className="w-10 h-10" />,
                text: "+54 123 456 7890",
              },
              {
                icon: <MapPin className="w-10 h-10" />,
                text: "Buenos Aires, Argentina",
              },
            ].map((contacto, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">{contacto.icon}</div>
                <p className="text-lg">{contacto.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Envíanos un mensaje
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default SobreNosotros;
