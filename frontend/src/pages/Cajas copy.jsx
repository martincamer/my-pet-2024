import { useState, useMemo, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  Download,
  Eye,
  Wallet,
  Calendar,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCajaBanco } from "../context/CajaBancoContext";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import ModalTransaccion from "../components/finanzas/ModalTransaccion";
import ComprobanteMovimientoPDF from "../components/clientes/documentos/ComprobanteMovimientoPDF";
import CajaMovimientoPDF from "../components/clientes/documentos/CajaMovimientoPDF";
import Modal from "../components/Modal/Modal";
import clienteAxios from "../config/axios";

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Wallet size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Caja,{" "}
                <span className="text-blue-600">{caja?.sucursal?.nombre}</span>
              </h1>
              <p className="text-sm text-gray-500">
                Gestiona los movimientos de caja
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal("INGRESO")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all"
            >
              <ArrowUpRight size={18} />
              Ingreso
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal("EGRESO")}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all"
            >
              <ArrowDownLeft size={18} />
              Egreso
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal("TRANSFERENCIA")}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all"
            >
              <RefreshCw size={18} />
              Transferencia
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
            >
              <Download size={18} />
              Ver Reporte
            </motion.button>
          </div>
        </div>

        {/* Filtro de Fechas */}
        <div className="mt-6 flex gap-4 items-center">
          <div className="flex items-center gap-6 bg-white p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              <input
                type="date"
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="border-0 outline-none text-sm text-gray-600 focus:ring-0"
              />
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              <input
                type="date"
                value={format(endDate, "yyyy-MM-dd")}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="border-0 outline-none text-sm text-gray-600 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Ingresos
            </h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowUpRight size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totales.ingresos)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Total Egresos</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <ArrowDownLeft size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-red-600">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totales.egresos)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Transferencias
            </h3>
            <div className="p-2 bg-gray-100 rounded-lg">
              <RefreshCw size={20} className="text-gray-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-600">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totales.transferencias)}
          </p>
        </motion.div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-auto divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions?.map((transaction) => (
                <motion.tr
                  key={transaction._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(
                      new Date(transaction.createdAt),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: es,
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        transaction.type === "INGRESO"
                          ? "text-green-600"
                          : transaction.type === "EGRESO"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {transaction.type === "INGRESO" && (
                        <ArrowUpRight size={16} />
                      )}
                      {transaction.type === "EGRESO" && (
                        <ArrowDownLeft size={16} />
                      )}
                      {transaction.type === "TRANSFERENCIA" && (
                        <RefreshCw size={16} />
                      )}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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
                      }).format(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(transaction.runningBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSelectTransaction(transaction)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadComprobante(transaction)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {/* Modal de Transacción */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Nueva ${
          modalType.charAt(0) + modalType.slice(1).toLowerCase()
        }`}
        width="600px"
      >
        <ModalTransaccion
          type={modalType}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            obtenerDatos();
          }}
        />
      </Modal>

      {/* Modal de PDF */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title="Reporte de Movimientos"
        width="800px"
      >
        <div className="p-4">
          <PDFViewer className="w-full h-[600px] rounded-lg">
            <CajaMovimientoPDF movimientos={movimientos} />
          </PDFViewer>
        </div>
      </Modal>

      {/* Estado vacío */}
      {!filteredTransactions?.length && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay movimientos
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No se encontraron movimientos para el período seleccionado.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal("INGRESO")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus size={18} />
            Registrar Movimiento
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default Cajas;
