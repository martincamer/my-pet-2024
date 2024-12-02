import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, X, Save, Search } from "lucide-react";
import toast from "react-hot-toast";
import clienteAxios from "../config/axios";

const Permisos = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const modules = [
    { id: "compras", label: "Compras" },
    { id: "productos", label: "Productos" },
    { id: "ventas", label: "Ventas" },
    { id: "clientes", label: "Clientes" },
    { id: "proveedores", label: "Proveedores" },
    { id: "usuarios", label: "Usuarios" },
    { id: "bancos", label: "Bancos" },
    { id: "cajas", label: "Cajas" },
    { id: "configuracion", label: "Configuración" },
  ];

  const actions = [
    { id: "ver", label: "Ver" },
    { id: "acceso", label: "Acceso" },
    { id: "crear", label: "Crear" },
    { id: "editar", label: "Editar" },
    { id: "eliminar", label: "Eliminar" },
  ];

  const fetchUsers = async () => {
    try {
      const { data } = await clienteAxios.get("/users/permissions");
      setUsers(data.users);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePermissionChange = (module, action, value) => {
    if (!selectedUser) return;

    setSelectedUser((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [module]: {
          ...prev.permisos[module],
          [action]: value,
        },
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      console.log("Datos a enviar:", {
        permisos: selectedUser.permisos,
        rol: selectedUser.rol,
      });
      await clienteAxios.put(`/users/permissions/${selectedUser._id}`, {
        permisos: selectedUser.permisos,
        rol: selectedUser.rol,
      });
      toast.success("Permisos actualizados correctamente");
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
      toast.error("Error al actualizar permisos");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="p-3 bg-blue-500/10 rounded-xl"
            >
              <Shield className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800"
              >
                Gestión de Permisos
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 mt-1"
              >
                Administra los roles y permisos de los usuarios del sistema
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-gray-500">
              Total usuarios: {users?.length || 0}
            </span>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <span className="text-sm text-gray-500">Roles activos: 3</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
        {/* Panel de Usuarios */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-[calc(100vh-200px)] flex flex-col"
        >
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {users
                .filter(
                  (user) =>
                    user.username
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedUser?._id === user._id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {user.rol}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Panel de Permisos */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedUser.username}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <select
                  value={selectedUser.rol}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({
                      ...prev,
                      rol: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="VENDEDOR">Vendedor</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Módulo
                      </th>
                      {actions.map((action) => (
                        <th
                          key={action.id}
                          className="text-left py-3 px-4 font-medium text-gray-600"
                        >
                          {action.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <motion.tr
                        key={module.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3 px-4 font-medium text-gray-700">
                          {module.label}
                        </td>
                        {actions.map((action) => (
                          <td key={action.id} className="py-3 px-4">
                            <motion.input
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="checkbox"
                              checked={
                                selectedUser.permisos?.[module.id]?.[
                                  action.id
                                ] || false
                              }
                              onChange={(e) =>
                                handlePermissionChange(
                                  module.id,
                                  action.id,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedUser(null)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePermissions}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Save size={16} />
                  Guardar Cambios
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Permisos;
