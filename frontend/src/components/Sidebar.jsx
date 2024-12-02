import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  ArrowRightLeft,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const MenuItem = ({
  icon: Icon,
  label,
  to,
  isOpen,
  children,
  active = false,
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <motion.button
        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className={`${active ? "text-blue-600" : "text-gray-400"}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <span className="flex-1 text-left text-sm font-medium">{label}</span>
        {children && (
          <motion.div
            animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className={`${active ? "text-blue-600" : "text-gray-400"}`}
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isSubmenuOpen && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-1 space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SubMenuItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <Link
        to={to}
        className={`block py-2.5 px-8 text-sm rounded-lg ${
          isActive
            ? "text-blue-600 font-medium bg-blue-50"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
};

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 280 : 0 }}
      className="h-screen bg-white border-r border-gray-100 shadow-sm overflow-hidden relative"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col h-full"
      >
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-white"
          >
            <h2 className="text-xl font-bold">Tecno Opp Gestión</h2>
            <p className="text-sm text-blue-100 mt-1">
              Sistema de Administración
            </p>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          <MenuItem
            icon={LayoutDashboard}
            label="Panel Principal"
            isOpen={isOpen}
            active={location.pathname === "/dashboard"}
          >
            <SubMenuItem to="/dashboard">Inicio</SubMenuItem>
          </MenuItem>

          <MenuItem
            icon={Package}
            label="Inventario"
            isOpen={isOpen}
            active={location.pathname.includes("/inventario")}
          >
            <SubMenuItem to="/inventario/productos">Productos</SubMenuItem>
          </MenuItem>

          <MenuItem
            icon={ShoppingCart}
            label="Compras"
            isOpen={isOpen}
            active={location.pathname.includes("/compras")}
          >
            <SubMenuItem to="/compras/proveedores">Proveedores</SubMenuItem>
          </MenuItem>

          <MenuItem
            icon={Store}
            label="Ventas"
            isOpen={isOpen}
            active={location.pathname.includes("/ventas")}
          >
            <SubMenuItem to="/ventas/clientes">Clientes</SubMenuItem>
            <SubMenuItem to="/ventas/casas">Casas</SubMenuItem>
          </MenuItem>

          <MenuItem
            icon={ArrowRightLeft}
            label="Transacciones"
            isOpen={isOpen}
            active={location.pathname.includes("/transacciones")}
          >
            <SubMenuItem to="/transacciones/bancos">Bancos</SubMenuItem>
            <SubMenuItem to="/transacciones/cajas">Caja</SubMenuItem>
            <SubMenuItem to="/transacciones/all-cajas">
              Todas las cajas
            </SubMenuItem>
          </MenuItem>

          <MenuItem
            icon={BarChart3}
            label="Reportes"
            isOpen={isOpen}
            active={location.pathname.includes("/reportes")}
          >
            <SubMenuItem to="/reportes/ventas">Ventas</SubMenuItem>
            <SubMenuItem to="/reportes/inventario">Inventario</SubMenuItem>
          </MenuItem>
        </div>

        <div className="p-4 mt-auto">
          <MenuItem
            icon={Settings}
            label="Configuración"
            isOpen={isOpen}
            active={location.pathname.includes("/configuracion")}
          >
            <SubMenuItem to="/profile">Perfil</SubMenuItem>
            <SubMenuItem to="/configuracion/permisos">Usuarios</SubMenuItem>
          </MenuItem>

          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#FEE2E2" }}
            whileTap={{ scale: 0.99 }}
            onClick={logout}
            className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl transition-all duration-200 hover:bg-red-50"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
