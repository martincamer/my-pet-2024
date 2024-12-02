import { useState, useEffect } from "react";
import { useProductos } from "../context/ProductosContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  ChevronDown,
  AlertCircle,
  Package,
} from "lucide-react";
import Modal from "../components/Modal/Modal";
import FormularioProducto from "../components/productos/FormularioProducto";
import useModal from "../hooks/useModal";
import ModalEliminarProducto from "../components/productos/ModalEliminarProducto";
import { formatearDinero } from "../utils/formatearDinero";
import { motion } from "framer-motion";

const Productos = () => {
  const {
    productos,
    loading,
    getProductos,
    deleteProducto,
    TIPOS_PRODUCTO,
    UNIDADES_MEDIDA,
  } = useProductos();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    tipo: "",
    unidad: "",
    estado: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);

  // Configurar modales
  const { modalStates, openModal, closeModal } = useModal([
    "createProduct",
    "editProduct",
    "deleteProduct",
  ]);

  useEffect(() => {
    getProductos();
  }, []);

  useEffect(() => {
    if (!Array.isArray(productos)) return;

    const filtered = productos.filter((producto) => {
      if (!producto) return false;

      const matchSearch = producto.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchTipo = !filtros.tipo || producto.type === filtros.tipo;
      const matchUnidad = !filtros.unidad || producto.unit === filtros.unidad;
      const matchEstado =
        !filtros.estado ||
        (filtros.estado === "active" ? producto.isActive : !producto.isActive);

      return matchSearch && matchTipo && matchUnidad && matchEstado;
    });

    setProductosFiltrados(filtered);
  }, [searchTerm, filtros, productos]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await deleteProducto(id);
    }
  };

  const handleEdit = (producto) => {
    setProductoEditar(producto);
    openModal("editProduct");
  };

  const handleCloseEdit = () => {
    setProductoEditar(null);
    closeModal("editProduct");
  };

  const handleDeleteClick = (producto) => {
    setProductoEliminar(producto);
    openModal("deleteProduct");
  };

  const handleConfirmDelete = async (id) => {
    const result = await deleteProducto(id);
    if (result.success) {
      setProductoEliminar(null);
      closeModal("deleteProduct");
    }
  };

  const handleCancelDelete = () => {
    setProductoEliminar(null);
    closeModal("deleteProduct");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header con gradiente y sombra */}
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
              <Package className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                Productos
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                Gestiona tu catálogo de productos y servicios
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Nuevo Producto
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Download size={18} />
                Exportar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Upload size={18} />
                Importar
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Buscador y Filtros con diseño mejorado */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              showFilters
                ? "bg-gray-100 text-gray-900"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={18} />
            Filtros
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Panel de Filtros Mejorado */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={filtros.tipo}
                onChange={(e) =>
                  setFiltros({ ...filtros, tipo: e.target.value })
                }
              >
                <option value="">Todos los tipos</option>
                {TIPOS_PRODUCTO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            {/* ... otros selects con el mismo estilo ... */}
          </div>
        )}
      </div>

      {/* Tabla Mejorada */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Unidad
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-3"></div>
                    Cargando productos...
                  </div>
                </td>
              </tr>
            ) : !productosFiltrados.length ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle size={24} className="mb-2" />
                    <p>No se encontraron productos</p>
                  </div>
                </td>
              </tr>
            ) : (
              productosFiltrados.map((producto) => (
                <tr
                  key={producto._id}
                  className="hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {producto.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {
                      TIPOS_PRODUCTO.find((t) => t.value === producto.type)
                        ?.label
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {
                      UNIDADES_MEDIDA.find((u) => u.value === producto.unit)
                        ?.label
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {formatearDinero(producto.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        producto.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {producto.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => handleEdit(producto)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        onClick={() => handleDeleteClick(producto)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Producto */}
      <Modal
        isOpen={modalStates.createProduct}
        onClose={() => closeModal("createProduct")}
        title="Crear Nuevo Producto"
        width="600px"
      >
        <FormularioProducto onClose={() => closeModal("createProduct")} />
      </Modal>

      {/* Modal Editar Producto */}
      <Modal
        isOpen={modalStates.editProduct}
        onClose={handleCloseEdit}
        title="Editar Producto"
        width="600px"
      >
        <FormularioProducto
          producto={productoEditar}
          onClose={handleCloseEdit}
        />
      </Modal>

      {/* Modal Eliminar Producto */}
      <Modal
        isOpen={modalStates.deleteProduct}
        onClose={handleCancelDelete}
        title=""
        width="400px"
      >
        <ModalEliminarProducto
          producto={productoEliminar}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Modal>
    </div>
  );
};

export default Productos;
