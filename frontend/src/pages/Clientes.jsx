import React, { useState, useEffect, Fragment } from "react";
import { useClientes } from "../context/ClientesContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  Eye,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCajaBanco } from "../context/CajaBancoContext";
import Modal from "../components/Modal/Modal";
import FormularioCliente from "../components/clientes/FormularioCliente";
import useModal from "../hooks/useModal";
import ModalEliminarCliente from "../components/clientes/ModalEliminarCliente";
import { motion } from "framer-motion";

const Clientes = () => {
  const {
    clientes,
    loading,
    getClientes,
    deleteCliente,
    TIPOS_DOCUMENTO,
    CONDICIONES_FISCALES,
  } = useClientes();

  const { sucursales } = useCajaBanco();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    documentType: "",
    taxCondition: "",
    estado: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteEliminar, setClienteEliminar] = useState(null);

  const { modalStates, openModal, closeModal } = useModal([
    "createClient",
    "editClient",
    "deleteClient",
  ]);

  const COLUMN_CONFIG = [
    {
      id: "cliente",
      label: "Cliente",
      defaultVisible: true,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
          {cliente.fantasyName} ({cliente.contractNumber})
        </td>
      ),
    },
    {
      id: "documento",
      label: "Documento",
      defaultVisible: false,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-gray-500">
          {cliente.documentType}: {cliente.documentNumber}
        </td>
      ),
    },
    {
      id: "condicionFiscal",
      label: "Condición Fiscal",
      defaultVisible: false,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-gray-500">
          {
            CONDICIONES_FISCALES.find((c) => c.value === cliente.taxCondition)
              ?.label
          }
        </td>
      ),
    },
    {
      id: "telefono",
      label: "Teléfono",
      defaultVisible: true,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-gray-500">
          {cliente.contact?.phone || "-"}
        </td>
      ),
    },
    {
      id: "sucursal",
      label: "Sucursal",
      defaultVisible: true,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-gray-500">
          {getSucursalNombre(cliente.sucursal)}
        </td>
      ),
    },
    {
      id: "estado",
      label: "Estado",
      defaultVisible: true,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm">
          <span
            className={`inline-flex px-2 text-xs font-semibold leading-5 ${
              cliente.isActive
                ? "text-green-800 bg-green-100"
                : "text-red-800 bg-red-100"
            }`}
          >
            {cliente.isActive ? "Activo" : "Inactivo"}
          </span>
        </td>
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      defaultVisible: true,
      render: (cliente) => (
        <td className="px-4 py-3 text-sm text-right">
          <div className="flex justify-end gap-2">
            <Link
              className="text-gray-400 hover:text-blue-500"
              to={`/ventas/clientes/${cliente._id}`}
            >
              <Eye size={18} />
            </Link>
            <button
              className="text-gray-400 hover:text-blue-500"
              title="Editar"
              onClick={() => handleEdit(cliente)}
            >
              <Edit2 size={18} />
            </button>
            <button
              className="text-gray-400 hover:text-red-500"
              title="Eliminar"
              onClick={() => handleDeleteClick(cliente)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    COLUMN_CONFIG.filter((col) => col.defaultVisible).map((col) => col.id)
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const toggleColumn = (columnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      }
      return [...prev, columnId];
    });
  };

  useEffect(() => {
    getClientes();
  }, []);

  useEffect(() => {
    if (!Array.isArray(clientes)) return;

    const filtered = clientes.filter((cliente) => {
      if (!cliente) return false;

      const matchSearch =
        cliente.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.contractNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cliente.documentNumber.includes(searchTerm);
      const matchTipo =
        !filtros.documentType || cliente.documentType === filtros.documentType;
      const matchCondicion =
        !filtros.taxCondition || cliente.taxCondition === filtros.taxCondition;
      const matchEstado =
        !filtros.estado ||
        (filtros.estado === "active" ? cliente.isActive : !cliente.isActive);

      return matchSearch && matchTipo && matchCondicion && matchEstado;
    });

    setClientesFiltrados(filtered);
  }, [searchTerm, filtros, clientes]);

  const handleEdit = (cliente) => {
    setClienteEditar(cliente);
    openModal("editClient");
  };

  const handleCloseEdit = () => {
    setClienteEditar(null);
    closeModal("editClient");
  };

  const handleDeleteClick = (cliente) => {
    setClienteEliminar(cliente);
    openModal("deleteClient");
  };

  const handleConfirmDelete = async (id) => {
    const result = await deleteCliente(id);
    if (result.success) {
      setClienteEliminar(null);
      closeModal("deleteClient");
    }
  };

  const handleCancelDelete = () => {
    setClienteEliminar(null);
    closeModal("deleteClient");
  };

  // Función helper para obtener el nombre de la sucursal
  const getSucursalNombre = (sucursalId) => {
    if (!sucursalId) return "-";

    const sucursal = sucursales.find((suc) => suc._id === sucursalId);
    return sucursal ? sucursal.nombre : "-";
  };

  console.log("sucursales", sucursales);

  useEffect(() => {
    const savedColumns = localStorage.getItem("clientesTableColumns");
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "clientesTableColumns",
      JSON.stringify(visibleColumns)
    );
  }, [visibleColumns]);

  const resetColumns = () => {
    setVisibleColumns(
      COLUMN_CONFIG.filter((col) => col.defaultVisible).map((col) => col.id)
    );
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
              <Users className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                Clientes
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                Gestiona tus clientes y sus documentos
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
              onClick={() => openModal("createClient")}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Nuevo Cliente
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
              placeholder="Buscar por nombre o documento..."
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
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={filtros.documentType}
                onChange={(e) =>
                  setFiltros({ ...filtros, documentType: e.target.value })
                }
              >
                <option value="">Todos los tipos</option>
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Condición Fiscal
              </label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                value={filtros.taxCondition}
                onChange={(e) =>
                  setFiltros({ ...filtros, taxCondition: e.target.value })
                }
              >
                <option value="">Todas las condiciones</option>
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
              {COLUMN_CONFIG.filter((col) =>
                visibleColumns.includes(col.id)
              ).map((column) => (
                <th
                  key={column.id}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Cargando clientes...
                </td>
              </tr>
            ) : !clientesFiltrados.length ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente._id} className="hover:bg-gray-50">
                  {COLUMN_CONFIG.filter((col) =>
                    visibleColumns.includes(col.id)
                  ).map((column) => (
                    <Fragment key={column.id}>
                      {column.render(cliente)}
                    </Fragment>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalStates.createClient}
        onClose={() => closeModal("createClient")}
        title="Crear Nuevo Cliente"
        width="800px"
      >
        <FormularioCliente onClose={() => closeModal("createClient")} />
      </Modal>

      <Modal
        isOpen={modalStates.editClient}
        onClose={handleCloseEdit}
        title="Editar Cliente"
        width="800px"
      >
        <FormularioCliente cliente={clienteEditar} onClose={handleCloseEdit} />
      </Modal>

      <Modal
        isOpen={modalStates.deleteClient}
        onClose={handleCancelDelete}
        title=""
        width="400px"
      >
        <ModalEliminarCliente
          cliente={clienteEliminar}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Modal>
    </div>
  );
};

const ColumnToggleMenu = ({ visibleColumns, onToggleColumn, columns }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-50">
      <div className="">
        {columns.map((column) => (
          <label
            key={column.id}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={visibleColumns.includes(column.id)}
              onChange={() => onToggleColumn(column.id)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Clientes;
