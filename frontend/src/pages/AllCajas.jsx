import { useEffect, useState } from "react";
import { useCajaBanco } from "../context/CajaBancoContext";
import { Link } from "react-router-dom";
import {
  Eye,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const AllCajas = () => {
  const { cajas, loading, obtenerAllCajas, sucursales, obtenerSucursales } =
    useCajaBanco(); // Obtener todas las cajas y sucursales
  const [error, setError] = useState(null);
  const [dataPorSucursal, setDataPorSucursal] = useState([]);
  const [startDate, setStartDate] = useState("2024-11-01"); // Fecha de inicio por defecto
  const [endDate, setEndDate] = useState("2024-11-30"); // Fecha de fin por defecto
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSalidas, setTotalSalidas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await obtenerAllCajas(); // Llama a la función para obtener todas las cajas
      await obtenerSucursales(); // Llama a la función para obtener todas las sucursales
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cajas.length > 0 && sucursales.length > 0) {
      const data = sucursales.map((sucursal) => {
        const cajasSucursal = cajas.filter(
          (caja) => caja.sucursal === sucursal._id
        );
        const totalBalance = cajasSucursal.reduce(
          (acc, caja) => acc + caja.balance,
          0
        );
        return { nombre: sucursal.nombre, totalBalance };
      });
      setDataPorSucursal(data);
    }
  }, [cajas, sucursales]);

  useEffect(() => {
    // Calcular total de entradas y salidas
    const calcularTotales = () => {
      let entradas = 0;
      let salidas = 0;

      cajas.forEach((caja) => {
        caja.transactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          if (
            transactionDate >= new Date(startDate) &&
            transactionDate <= new Date(endDate)
          ) {
            if (transaction.type === "INGRESO") {
              entradas += transaction.amount;
            } else if (transaction.type === "EGRESO") {
              salidas += transaction.amount;
            }
          }
        });
      });

      setTotalEntradas(entradas);
      setTotalSalidas(salidas);
    };

    calcularTotales();
  }, [cajas, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin text-blue-600">
          <Wallet size={48} />
        </div>
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    );
  }

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
              <Wallet className="text-blue-500" size={24} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                Lista de Cajas
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                Gestión de cajas por sucursal
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 bg-white p-4 rounded-xl border border-gray-200 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Desde:
                </span>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 
                             focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                             outline-none transition-all hover:border-blue-500/50"
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "24px" }}
              transition={{ delay: 0.7 }}
              className="w-px bg-gray-200"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Hasta:
                </span>
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 
                             focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                             outline-none transition-all hover:border-blue-500/50"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Cards de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-900">
              Total en Cajas
            </h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Wallet size={20} className="text-blue-600" />
            </div>
          </div>
          <p
            className={`text-3xl font-semibold ${
              totalEntradas - totalSalidas > 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalEntradas - totalSalidas)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-green-900">Entradas</h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowUpRight size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-green-700">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalEntradas)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-red-900">Salidas</h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowDownLeft size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-red-700">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalSalidas)}
          </p>
        </motion.div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cajas.map((caja) => {
                const sucursal = sucursales.find(
                  (s) => s._id === caja.sucursal
                );
                return (
                  <motion.tr
                    key={caja._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caja._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sucursal ? sucursal.nombre : "Sucursal no encontrada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${
                          caja.balance < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(caja.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link to={`/transacciones/caja/${caja._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Eye size={18} />
                        </motion.button>
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AllCajas;
