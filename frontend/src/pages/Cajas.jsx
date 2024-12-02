import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  Download,
  Eye,
  Wallet,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCajaBanco } from "../context/CajaBancoContext";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import ModalTransaccion from "../components/finanzas/ModalTransaccion";
import ComprobanteMovimientoPDF from "../components/clientes/documentos/ComprobanteMovimientoPDF";
import CajaMovimientoPDF from "../components/clientes/documentos/CajaMovimientoPDF";
import Modal from "../components/Modal/Modal";
import clienteAxios from "../config/axios";
import { motion } from "framer-motion";

const Cajas = () => {
  const { caja, loading, setCaja } = useCajaBanco();
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);

  const obtenerDatos = async () => {
    try {
      const cajaRes = await clienteAxios("/cash");
      setCaja(cajaRes.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const filteredTransactions = useMemo(() => {
    return caja?.transactions
      ?.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .reduce((acc, transaction, index) => {
        const previousBalance =
          index === 0 ? caja.balance : acc[index - 1].runningBalance;
        const change =
          transaction.type === "INGRESO"
            ? transaction.amount
            : -transaction.amount;
        const runningBalance = previousBalance - change;

        return [...acc, { ...transaction, runningBalance }];
      }, []);
  }, [caja?.transactions, startDate, endDate, caja?.balance]);

  const movimientos = useMemo(() => {
    return filteredTransactions?.map((transaction) => ({
      descripcion: transaction.description || "",
      monto: transaction.amount || 0,
      tipo: transaction.type || "OTROS",
      balance: transaction.runningBalance || 0,
      fecha: transaction.createdAt || "",
      categoria: transaction.category || "",
    }));
  }, [filteredTransactions]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowComprobanteModal(true);
  };

  const handleDownloadComprobante = async () => {
    if (!selectedTransaction) return;
    const doc = <ComprobanteMovimientoPDF movimiento={selectedTransaction} />;
    const asPdf = await pdf(doc).toBlob();
    const url = URL.createObjectURL(asPdf);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comprobante_${selectedTransaction._id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totales = useMemo(() => {
    if (!filteredTransactions)
      return { ingresos: 0, egresos: 0, transferencias: 0 };

    return filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount || 0;
        switch (transaction.type) {
          case "INGRESO":
            acc.ingresos += amount;
            break;
          case "EGRESO":
            acc.egresos += amount;
            break;
          case "TRANSFERENCIA":
            acc.transferencias += amount;
            break;
        }
        return acc;
      },
      { ingresos: 0, egresos: 0, transferencias: 0 }
    );
  }, [filteredTransactions]);

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 className="animate-spin" size={48} />
        <LoadingText>Cargando datos...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <div className="py-6 px-6">
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
                Caja{" "}
                <span className="text-blue-600">{caja?.sucursal?.nombre}</span>
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-sm mt-1"
              >
                Balance actual:{" "}
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(caja?.balance || 0)}
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal("INGRESO")}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/20"
            >
              <ArrowUpRight size={20} />
              Ingreso
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal("EGRESO")}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/20"
            >
              <ArrowDownLeft size={20} />
              Egreso
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal("TRANSFERENCIA")}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-2.5 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg shadow-gray-500/20"
            >
              <RefreshCw size={20} />
              Transferencia
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-lg"
            >
              <Download size={20} />
              Ver Reporte
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-green-900">
              Total Ingresos
            </h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowUpRight size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-green-700">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(totales.ingresos)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Movimientos de entrada
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-red-900">Total Egresos</h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowDownLeft size={20} className="text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-red-700">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(totales.egresos)}
            </p>
            <p className="text-sm text-red-600 mt-1">Movimientos de salida</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Transferencias
            </h3>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <RefreshCw size={20} className="text-gray-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-700">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(totales.transferencias)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Movimientos internos</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex gap-4 items-center mb-6">
        <div className="flex items-center gap-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Desde:</span>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Hasta:</span>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={format(endDate, "yyyy-MM-dd")}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPdfModal(true)}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
        >
          <Download size={18} />
          Exportar PDF
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-auto">
        <div className="">
          <table className="w-full divide-y divide-gray-200 overflow-x-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Movimiento
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions?.map((transaction) => (
                <motion.tr
                  key={transaction._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(transaction.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "INGRESO"
                          ? "bg-green-100 text-green-800"
                          : transaction.type === "EGRESO"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      className="max-w-[200px] truncate cursor-default hover:text-blue-600"
                      title={transaction.description}
                    >
                      {transaction.description}
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span
                      className={`font-medium ${
                        transaction.type === "INGRESO"
                          ? "text-green-600"
                          : transaction.type === "EGRESO"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(
                        transaction.type === "EGRESO" ||
                          transaction.type === "TRANSFERENCIA"
                          ? -transaction.amount
                          : transaction.amount
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span
                      className={`${
                        transaction.type === "INGRESO"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(transaction.runningBalance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelectTransaction(transaction)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Eye size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales y PDFs */}
      {showModal && (
        <ModalTransaccion
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type={modalType}
          source="CAJA"
        />
      )}

      {showPdfModal && (
        <Modal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          title="Vista Previa del Reporte"
          width="90vw"
        >
          <div className="h-[80vh]">
            <PDFViewer className="w-full h-full">
              <CajaMovimientoPDF
                sucursal={caja?.sucursal?.nombre || "Sin sucursal"}
                movimientos={movimientos}
                balanceFinal={caja?.balance || 0}
                fechaInicio={startDate?.toLocaleDateString("es-AR")}
                fechaFin={endDate?.toLocaleDateString("es-AR")}
                observacion={"Sin movimientos en el período seleccionado"}
              />
            </PDFViewer>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showComprobanteModal}
        onClose={() => {
          setShowComprobanteModal(false);
          setSelectedTransaction(null);
        }}
        title="Vista Previa del Comprobante"
        width="50vw"
      >
        <div className="h-[80vh] p-4 flex flex-col">
          {selectedTransaction ? (
            <>
              <div className="flex-grow">
                <PDFViewer className="w-full h-full">
                  <ComprobanteMovimientoPDF
                    sucursal={caja?.sucursal?.nombre}
                    movimiento={selectedTransaction}
                  />
                </PDFViewer>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowComprobanteModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleDownloadComprobante}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Descargar
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Cargando comprobante...</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const Container = styled.div`
  padding: 2rem;
  background-color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;

  ${(props) => {
    switch (props.variant) {
      case "danger":
        return `
          color: #dc2626;
          background-color: #fee2e2;
          &:hover {
            background-color: #fecaca;
          }
        `;
      case "secondary":
        return `
          color: #4b5563;
          background-color: #f3f4f6;
          &:hover {
            background-color: #e5e7eb;
          }
        `;
      default:
        return `
          color: #047857;
          background-color: #d1fae5;
          &:hover {
            background-color: #a7f3d0;
          }
        `;
    }
  }}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
`;

const CardContent = styled.div``;

const Balance = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const TableContainer = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  ${(props) => props.align === "right" && "text-align: right;"}
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;

  ${(props) => props.align === "right" && "text-align: right;"}
`;

const TransactionType = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;

  ${(props) =>
    props.type === "INGRESO" ? "color: #047857;" : "color: #dc2626;"}
`;

const Amount = styled.span`
  font-weight: 500;

  ${(props) =>
    props.type === "INGRESO" ? "color: #047857;" : "color: #dc2626;"}
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;

  ${(props) => {
    switch (props.status) {
      case "COMPLETADO":
        return `
          background-color: #d1fae5;
          color: #047857;
        `;
      case "PENDIENTE":
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  color: #6b7280;
`;

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  text-align: center;
  max-width: 400px;
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #374151;
`;

const DateFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export default Cajas;
