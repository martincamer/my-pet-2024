import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  Eye,
  Home,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal/Modal";
import useModal from "../hooks/useModal";
import FormularioComposicion from "../components/clientes/FormularioComposicion";
import { useClientes } from "../context/ClientesContext";
import ModalEliminarCasa from "../components/casas/ModalEliminarCasa";
import FormularioEditarCasa from "../components/casas/FormularioEditarCasa";

const Casas = () => {
  const { casas, loading, getCasas, deleteCasa, updateCasa } = useClientes();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    articulo: "",
    estado: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [casasFiltradas, setCasasFiltradas] = useState([]);
  const [casaEditar, setCasaEditar] = useState(null);
  const [casaEliminar, setCasaEliminar] = useState(null);
  const [casaComposicion, setCasaComposicion] = useState(null);
  const [modalStates, setModalStates] = useState({
    composicion: false,
    detalles: false,
    imagenGrande: false,
  });
  const [casaDetalles, setCasaDetalles] = useState(null);
  const [imagenGrande, setImagenGrande] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'

  const {
    modalStates: modalStatesContext,
    openModal,
    closeModal,
  } = useModal(["createCasa", "editCasa", "deleteCasa", "composicion"]);

  // Cargar casas al montar el componente
  useEffect(() => {
    getCasas();
  }, []);

  // Filtrar casas
  useEffect(() => {
    if (!Array.isArray(casas)) return;

    const filtered = casas?.filter((casa) => {
      if (!casa) return false;

      const matchSearch = casa.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchArticulo =
        !filtros.articulo ||
        casa.composiciones.some((comp) => comp.articulo === filtros.articulo);
      const matchEstado =
        !filtros.estado ||
        (filtros.estado === "active" ? casa.isActive : !casa.isActive);

      return matchSearch && matchArticulo && matchEstado;
    });

    setCasasFiltradas(filtered);
  }, [searchTerm, filtros, casas]);

  const handleEdit = (casa) => {
    setCasaEditar(casa);
    openModal("editCasa");
  };

  const handleCloseEdit = () => {
    setCasaEditar(null);
    closeModal("editCasa");
  };

  const handleDeleteClick = (casa) => {
    setCasaEliminar(casa);
    openModal("deleteCasa");
  };

  const handleConfirmDelete = async (id) => {
    const result = await deleteCasa(id);
    if (result.success) {
      setCasaEliminar(null);
      closeModal("deleteCasa");
    }
  };

  const handleComposicion = (casa) => {
    setCasaComposicion(casa);
    openModal("composicion");
  };

  const handleCloseComposicion = () => {
    setCasaComposicion(null);
    closeModal("composicion");
  };

  const handleDetalles = (casa) => {
    setCasaDetalles(casa);
    setModalStates({ ...modalStates, detalles: true });
  };

  const handleCloseDetalles = () => {
    setModalStates({ ...modalStates, detalles: false });
    setCasaDetalles(null);
  };

  const handleOpenImagenGrande = (imagen) => {
    setImagenGrande(imagen);
    setModalStates({ ...modalStates, imagenGrande: true });
  };

  const handleCloseImagenGrande = () => {
    setModalStates({ ...modalStates, imagenGrande: false });
    setImagenGrande("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 min-h-screen bg-gray-50"
    >
      {/* Header Principal */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="p-3 bg-blue-500/10 rounded-xl"
            >
              <Home className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                Casas
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                {casasFiltradas?.length || 0} modelos disponibles
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex bg-gray-100/80 p-1 rounded-xl"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={20} />
              </motion.button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal("composicion")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Nueva Casa
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Buscador y Filtros */}
      <div className="mt-6 flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Filter size={18} />
          Filtros
          {Object.values(filtros).some(Boolean) && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
        </motion.button>
      </div>

      {/* Vista de Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {casasFiltradas?.map((casa) => (
            <motion.div
              key={casa._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-video">
                <img
                  src={casa.imagen}
                  alt={casa.nombre}
                  className="w-full h-full object-cover"
                  onClick={() => handleOpenImagenGrande(casa.imagen)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {casa.nombre}
                  </h3>
                  <p className="text-sm text-white/90">
                    {casa.totalMetrosCuadrados.toFixed(2)} m²
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      casa.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {casa.isActive ? "Activo" : "Inactivo"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(casa)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(casa)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {casa.composiciones.length} composiciones
                  </div>
                  <button
                    onClick={() => handleDetalles(casa)}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <Eye size={18} />
                    Ver detalles
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* ... tabla existente ... */}
        </div>
      )}

      {/* Modal de Composición */}
      <Modal
        isOpen={modalStatesContext.composicion}
        onClose={handleCloseComposicion}
        title={
          casaComposicion
            ? `Composición - ${casaComposicion.nombre}`
            : "Nueva Casa"
        }
        width="1200px"
      >
        <FormularioComposicion
          casaId={casaComposicion?._id}
          onClose={handleCloseComposicion}
        />
      </Modal>

      {/* Modal de Editar */}
      <Modal
        isOpen={modalStatesContext.editCasa}
        onClose={handleCloseEdit}
        title="Editar Casa"
        width="1200px"
      >
        <FormularioEditarCasa
          casa={casaEditar}
          onClose={handleCloseEdit}
          onSubmit={updateCasa}
        />
      </Modal>

      {/* Modal de Eliminar */}
      <Modal
        isOpen={modalStatesContext.deleteCasa}
        onClose={() => {
          setCasaEliminar(null);
          closeModal("deleteCasa");
        }}
        title="Eliminar Casa"
        width="500px"
      >
        <ModalEliminarCasa
          casa={casaEliminar}
          onClose={() => {
            setCasaEliminar(null);
            closeModal("deleteCasa");
          }}
          onConfirm={handleConfirmDelete}
        />
      </Modal>

      {/* Modal de Detalles de la Casa */}
      <Modal
        isOpen={modalStates.detalles}
        onClose={handleCloseDetalles}
        title={
          casaDetalles
            ? `Detalles de la Casa - ${casaDetalles.nombre}`
            : "Detalles de la Casa"
        }
        width="800px"
      >
        {casaDetalles && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              Información de la Casa
            </h3>
            <img
              src={casaDetalles.imagen}
              alt={casaDetalles.nombre}
              className="w-1/3 h-auto mb-4 rounded-xl border shadow cursor-pointer"
              onClick={() => handleOpenImagenGrande(casaDetalles.imagen)}
            />
            <p>
              <strong>Nombre:</strong> {casaDetalles.nombre}
            </p>
            <p>
              <strong>Total m²:</strong>{" "}
              {casaDetalles.totalMetrosCuadrados.toFixed(2)} m²
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {casaDetalles.isActive ? "Activo" : "Inactivo"}
            </p>

            <h4 className="text-md font-semibold mt-4">Composiciones</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Artículo
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Ancho (m)
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Largo (m)
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-500">
                      m²
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {casaDetalles.composiciones.map((composicion) => (
                    <tr key={composicion._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {composicion.articulo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {composicion.ancho}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {composicion.largo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {composicion.metrosCuadrados.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {composicion.observaciones || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Imagen Grande */}
      <Modal
        isOpen={modalStates.imagenGrande}
        onClose={handleCloseImagenGrande}
        title="Imagen de la Casa"
        width="1000px"
      >
        {imagenGrande && (
          <img
            src={imagenGrande}
            alt="Imagen de la Casa"
            className="w-full h-auto rounded-lg"
          />
        )}
      </Modal>

      {console.log(casaDetalles)}
    </motion.div>
  );
};

export default Casas;
