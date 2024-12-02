import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado
import { useCajaBanco } from "../context/CajaBancoContext"; // Asegúrate de tener este contexto
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import styled from "styled-components";
import CajaMovimientoPDF from "../components/clientes/documentos/CajaMovimientoPDF"; // Asegúrate de importar el nuevo componente
import ComprobanteMovimientoPDF from "../components/clientes/documentos/ComprobanteMovimientoPDF"; // Asegúrate de importar el nuevo componente
import { Download } from "lucide-react"; // Asegúrate de importar el ícono
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Calendar,
} from "lucide-react"; // Asegúrate de importar los íconos
import { motion } from "framer-motion"; // Asegúrate de importar Framer Motion

const Container = styled.div`
  padding: 2rem;
  background-color: #ffff;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 1rem; /* Espacio debajo del título */
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  margin-top: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.89rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6; /* Color de fondo más claro para el encabezado */
  border-bottom: 2px solid #e5e7eb; /* Línea más gruesa para el borde inferior */
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
`;

const Description = styled.p`
  cursor: pointer;
  text-decoration: underline; /* Subrayado para indicar que es clickeable */
`;

const BalanceContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Espacio entre las tarjetas */
  margin-bottom: 1rem;
`;

const BalanceCard = styled.div`
  flex: 1; /* Ocupa el mismo espacio */
  margin: 0 0.5rem; /* Espacio entre tarjetas */
  padding: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb; /* Borde */
  text-align: center; /* Centrar texto */
`;

const BalanceItem = styled.div`
  font-size: 1.25rem; /* Tamaño de fuente más grande */
  font-weight: 600;
`;

const DateFilterContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const CajaUnica = () => {
  const { id } = useParams(); // Obtener el ID de la caja desde la URL
  const { cajas, loading, obtenerAllCajas, sucursales } = useCajaBanco(); // Obtener todas las cajas
  const [caja, setCaja] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null); // Estado para manejar la transacción expandida

  // Calcular la fecha de inicio y fin por defecto
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes

  const [startDateState, setStartDate] = useState(
    startDate.toISOString().split("T")[0]
  ); // Fecha de inicio
  const [endDateState, setEndDate] = useState(
    endDate.toISOString().split("T")[0]
  ); // Fecha de fin

  const [totals, setTotals] = useState({
    entradas: 0,
    salidas: 0,
    transferencias: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      await obtenerAllCajas(); // Llama a la función para obtener todas las cajas
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cajas.length > 0) {
      const foundCaja = cajas.find((c) => c._id === id);
      setCaja(foundCaja);
    }
  }, [cajas, id]);

  useEffect(() => {
    if (caja) {
      const entradas = caja.transactions
        .filter(
          (t) =>
            t.type === "INGRESO" &&
            (!startDateState || new Date(t.date) >= new Date(startDateState)) &&
            (!endDateState || new Date(t.date) <= new Date(endDateState))
        )
        .reduce((acc, t) => acc + t.amount, 0);
      const salidas = caja.transactions
        .filter(
          (t) =>
            t.type === "EGRESO" &&
            (!startDateState || new Date(t.date) >= new Date(startDateState)) &&
            (!endDateState || new Date(t.date) <= new Date(endDateState))
        )
        .reduce((acc, t) => acc + t.amount, 0);
      const transferencias = caja.transactions
        .filter(
          (t) =>
            t.type === "TRANSFERENCIA" &&
            (!startDateState || new Date(t.date) >= new Date(startDateState)) &&
            (!endDateState || new Date(t.date) <= new Date(endDateState))
        )
        .reduce((acc, t) => acc + t.amount, 0);
      setTotals({ entradas, salidas, transferencias });
    }
  }, [caja, startDateState, endDateState]);

  // Verificar si la caja está cargando o si no se encontró
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Cargando...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!caja) {
    return (
      <LoadingContainer>
        <LoadingText>No se encontró la caja.</LoadingText>
      </LoadingContainer>
    );
  }

  const sucursal = sucursales.find((s) => s._id === caja?.sucursalId); // Asegúrate de que `sucursalId` es el campo correcto en la caja

  // Calcular el balance total
  const balanceTotal = totals.entradas - totals.salidas + totals.transferencias;

  // Opción 1: Con Tooltip
  const TruncatedText = ({ text, maxLength = 30 }) => {
    const isTruncated = text?.length > maxLength;
    const truncatedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

    return (
      <div className="relative group uppercase">
        <span className="cursor-pointer">{truncatedText}</span>
        {isTruncated && (
          <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white p-2 rounded text-sm max-w-xs whitespace-normal break-words left-0 mt-1">
            {text}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-[2rem]">
      {/* Header y Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Wallet size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Detalles de la Cajas
              </h1>
              {sucursal && (
                <p className="text-sm text-gray-500">
                  Sucursal:{" "}
                  <span className="font-medium">{sucursal.nombre}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Desde:</span>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={startDateState}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Hasta:</span>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={endDateState}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            }).format(totals.entradas)}
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
            }).format(totals.salidas)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-900">
              Transferencias
            </h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <RefreshCw size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-blue-700">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totals.transferencias)}
          </p>
        </motion.div>
      </div>

      {/* Balance Total Card */}
      <div className="mb-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Balance Total</h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Wallet size={20} className="text-gray-600" />
            </div>
          </div>
          <p
            className={`text-3xl font-semibold ${
              balanceTotal >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(balanceTotal)}
          </p>
        </motion.div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {caja?.transactions
                .reduce((acc, transaction) => {
                  const lastBalance =
                    acc.length > 0 ? acc[acc.length - 1].balance : balanceTotal;
                  const newBalance =
                    lastBalance +
                    (transaction.type === "INGRESO"
                      ? transaction.amount
                      : -transaction.amount);
                  acc.push({
                    ...transaction,
                    lastBalance: lastBalance,
                    balance: newBalance,
                  });
                  return acc;
                }, [])
                .map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            transaction.lastBalance < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(transaction.lastBalance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="max-w-[200px] truncate text-sm text-gray-900"
                          title={transaction.description}
                        >
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      transaction.type === "INGRESO"
                        ? "bg-green-100 text-green-800"
                        : transaction.type === "EGRESO"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                        >
                          {transaction.type === "INGRESO" && (
                            <ArrowUpRight size={14} />
                          )}
                          {transaction.type === "EGRESO" && (
                            <ArrowDownLeft size={14} />
                          )}
                          {transaction.type === "TRANSFERENCIA" && (
                            <RefreshCw size={14} />
                          )}
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.date), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span
                          className={
                            transaction.type === "EGRESO"
                              ? "text-red-600"
                              : transaction.type === "INGRESO"
                              ? "text-green-600"
                              : "text-blue-600"
                          }
                        >
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <PDFDownloadLink
                          document={
                            <ComprobanteMovimientoPDF
                              movimiento={transaction}
                            />
                          }
                          fileName={`comprobante_movimiento_${transaction._id}.pdf`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <Download size={18} />
                          </motion.button>
                        </PDFDownloadLink>
                      </td>
                    </motion.tr>
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Nuevo Balance
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              transaction?.balance < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            }).format(transaction?.balance)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <PDFDownloadLink
          document={
            <CajaMovimientoPDF
              movimientos={caja.transactions.map((transaction) => ({
                descripcion: transaction.description,
                monto: transaction.amount,
              }))}
              fechaInicio={startDateState}
              fechaFin={endDateState}
              observacion={caja.observation}
              balanceFinal={balanceTotal}
            />
          }
          fileName={`movimiento_caja_${new Date().toLocaleDateString(
            "es-AR"
          )}.pdf`}
        >
          {({ loading }) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin">
                    <RefreshCw size={20} />
                  </div>
                  <span>Generando documento...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Descargar movimientos de la caja</span>
                </>
              )}
            </motion.button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default CajaUnica;
