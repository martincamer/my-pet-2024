import { useState, useEffect } from "react";
import { useCompras } from "../context/ComprasContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  FileText,
  ShoppingBag,
  Eye,
  Building2,
} from "lucide-react";
import Modal from "../components/Modal/Modal";
import FormularioProveedor from "../components/proveedores/FormularioProveedor";
import useModal from "../hooks/useModal";
import { Link } from "react-router-dom";
import { formatearDinero } from "../utils/formatearDinero";
import { motion } from "framer-motion";

const Proveedores = () => {
  const { proveedores, loading, getProveedores, CONDICIONES_FISCALES } =
    useCompras();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    condicionFiscal: "",
    estado: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [proveedorEditar, setProveedorEditar] = useState(null);

  // Configurar modales
  const { modalStates, openModal, closeModal } = useModal([
    "createSupplier",
    "editSupplier",
    "addInvoice",
    "addPurchaseOrder",
  ]);

  useEffect(() => {
    getProveedores();
  }, []);

  useEffect(() => {
    if (!Array.isArray(proveedores)) return;

    const filtered = proveedores.filter((proveedor) => {
      if (!proveedor) return false;

      const matchSearch =
        proveedor.businessName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        proveedor.cuit.includes(searchTerm);

      const matchCondicion =
        !filtros.condicionFiscal ||
        proveedor.taxCondition === filtros.condicionFiscal;

      const matchEstado =
        !filtros.estado ||
        (filtros.estado === "active"
          ? proveedor.isActive
          : !proveedor.isActive);

      return matchSearch && matchCondicion && matchEstado;
    });

    setProveedoresFiltrados(filtered);
  }, [searchTerm, filtros, proveedores]);

  const handleEdit = (proveedor) => {
    setProveedorEditar(proveedor);
    openModal("editSupplier");
  };

  const handleCloseEdit = () => {
    setProveedorEditar(null);
    closeModal("editSupplier");
  };

  const handleAddInvoice = (proveedor) => {
    setProveedorEditar(proveedor);
    openModal("addInvoice");
  };

  const handleAddPurchaseOrder = (proveedor) => {
    setProveedorEditar(proveedor);
    openModal("addPurchaseOrder");
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
              <Building2 className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                Proveedores
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                Gestiona tus proveedores y sus documentos
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
              onClick={() => openModal("createSupplier")}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Nuevo Proveedor
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
              placeholder="Buscar por nombre o CUIT..."
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
          </button>
        </div>

        {/* Panel de Filtros Mejorado */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Condición Fiscal
              </label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={filtros.condicionFiscal}
                onChange={(e) =>
                  setFiltros({ ...filtros, condicionFiscal: e.target.value })
                }
              >
                <option value="">Todas las condiciones fiscales</option>
                {CONDICIONES_FISCALES.map((condicion) => (
                  <option key={condicion.value} value={condicion.value}>
                    {condicion.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value })
                }
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
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
                Razón Social
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                CUIT
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Condición Fiscal
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Saldo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center">
                  Cargando proveedores...
                </td>
              </tr>
            ) : !Array.isArray(proveedoresFiltrados) ||
              proveedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No se encontraron proveedores
                </td>
              </tr>
            ) : (
              proveedoresFiltrados.map((proveedor) => (
                <tr key={proveedor._id} className="hover:bg-gray-50">
                  {" "}
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                    {proveedor.fantasyName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {proveedor.businessName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {proveedor.cuit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {
                      CONDICIONES_FISCALES.find(
                        (c) => c.value === proveedor.taxCondition
                      )?.label
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatearDinero(proveedor.balance?.current)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 ${
                        proveedor.isActive
                          ? "text-green-800 bg-green-100"
                          : "text-red-800 bg-red-100"
                      }`}
                    >
                      {proveedor.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/compras/proveedores/${proveedor._id}`}
                        className="text-gray-400 hover:text-blue-500"
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        className="text-gray-400 hover:text-blue-500"
                        title="Agregar Factura"
                        onClick={() => handleAddInvoice(proveedor)}
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-blue-500"
                        title="Agregar Orden de Compra"
                        onClick={() => handleAddPurchaseOrder(proveedor)}
                      >
                        <ShoppingBag size={18} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-blue-500"
                        title="Editar"
                        onClick={() => handleEdit(proveedor)}
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalStates.createSupplier}
        onClose={() => closeModal("createSupplier")}
        title="Crear Nuevo Proveedor"
        width="800px"
      >
        <FormularioProveedor onClose={() => closeModal("createSupplier")} />
      </Modal>

      <Modal
        isOpen={modalStates.editSupplier}
        onClose={handleCloseEdit}
        title="Editar Proveedor"
        width="800px"
      >
        <FormularioProveedor
          proveedor={proveedorEditar}
          onClose={handleCloseEdit}
        />
      </Modal>

      {/* Agregar aquí los modales para facturas y órdenes de compra */}
    </div>
  );
};

export default Proveedores;
