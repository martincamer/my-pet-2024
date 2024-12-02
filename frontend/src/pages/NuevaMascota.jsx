import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUpload, FaPaw } from "react-icons/fa";
import clienteAxios from "../config/axios";
import axios from "axios";

const NuevaMascota = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    tamanio: "",
    sexo: "",
    descripcion: "",
    estado: "Disponible",
    ubicacion: {
      direccion: "",
      ciudad: "",
      provincia: "",
      pais: "",
    },
    imagenes: [],
    caracteristicas: {
      vacunado: false,
      desparasitado: false,
      esterilizado: false,
      microchip: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("ubicacion.")) {
      const ubicacionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          [ubicacionField]: value,
        },
      }));
    } else if (name.includes("caracteristicas.")) {
      const caracteristicaField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        caracteristicas: {
          ...prev.caracteristicas,
          [caracteristicaField]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes");
        continue;
      }

      try {
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "imagenes");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/de4aqqalo/image/upload",
          data
        );

        setImageUrls((prev) => [...prev, res.data.secure_url]);
        setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);

        setFormData((prev) => ({
          ...prev,
          imagenes: [...prev.imagenes, res.data.secure_url],
        }));

        toast.success("Imagen subida correctamente");
      } catch (error) {
        console.error("Error al subir imagen:", error);
        toast.error("Error al subir la imagen");
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mascotaData = {
        ...formData,
        imagenes: imageUrls,
      };

      await clienteAxios.post("/pets", mascotaData);
      toast.success("Mascota registrada correctamente");
      navigate("/mis-mascotas");
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      toast.error("Error al registrar la mascota");
    } finally {
      setLoading(false);
    }
  };

  const especieOpciones = ["Perro", "Gato", "Otro"];
  const tamanioOpciones = ["Pequeño", "Mediano", "Grande"];
  const sexoOpciones = ["Macho", "Hembra"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <FaPaw className="text-5xl text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">
              Registrar Nueva Mascota
            </h1>
            <p className="text-gray-600 mt-2">
              Completa los datos de la mascota que deseas dar en adopción
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Especie
                </label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecciona una especie</option>
                  {especieOpciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tamaño
                </label>
                <select
                  name="tamanio"
                  value={formData.tamanio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecciona un tamaño</option>
                  {tamanioOpciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecciona el sexo</option>
                  {sexoOpciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Raza
                </label>
                <input
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  min="0"
                  placeholder="Edad en años"
                />
              </div>
            </div>

            {/* Más campos... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Edad
                </label>
                <input
                  type="text"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="Ej: 2 años"
                />
              </div>
            </div>

            {/* Características */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Características
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.caracteristicas).map(
                  ([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`caracteristicas.${key}`}
                        checked={value}
                        onChange={handleInputChange}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700 capitalize">{key}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.ubicacion).map(([key]) => (
                  <div key={key}>
                    <label className="block text-gray-700 font-medium mb-2 capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      name={`ubicacion.${key}`}
                      value={formData.ubicacion[key]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Imágenes
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl">
                <div className="space-y-2 text-center">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
                  ) : (
                    <>
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                          <span>Sube archivos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            disabled={uploading}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Solo imágenes (PNG, JPG, GIF)
                      </p>
                    </>
                  )}
                </div>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              ></textarea>
            </div>

            {/* Botón submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar Mascota"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NuevaMascota;
