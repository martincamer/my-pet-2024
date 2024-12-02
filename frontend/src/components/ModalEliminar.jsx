import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const ModalEliminar = ({ isOpen, onClose, onConfirm, mascotaNombre }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-lg"
          >
            {/* Contenido del modal */}
            <div className="p-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  ¿Eliminar mascota?
                </h3>
                <p className="text-gray-500">
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <span className="font-semibold text-gray-700">
                    {mascotaNombre}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onConfirm}
                className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEliminar;
