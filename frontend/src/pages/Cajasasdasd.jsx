import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  Download,
  Eye,
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

const Cajas = () => {
  const { caja, loading, setCaja } = useCajaBanco();

  // Obtener datos iniciales
  const obtenerDatos = async () => {
    try {
      const cajaRes = await clienteAxios("/cash");
      setCaja(cajaRes.data);
    } catch (error) {
      console.error("Error completo:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

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

  const transactionsWithRunningBalance = useMemo(() => {
    if (!caja?.transactions || caja.transactions.length === 0) {
      return [];
    }

    return caja?.transactions
      ?.slice()
      ?.reverse()
      ?.reduce((acc, transaction, index) => {
        const previousBalance =
          index === 0 ? caja.balance : acc[index - 1].runningBalance;
        const change =
          transaction.type === "INGRESO"
            ? transaction.amount
            : -transaction.amount;
        const runningBalance = previousBalance - change;

        return [...acc, { ...transaction, runningBalance }];
      }, [])
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
  }, [caja?.transactions, startDate, endDate, caja?.balance]);

  const movimientos = useMemo(() => {
    return transactionsWithRunningBalance.map((transaction) => ({
      descripcion: transaction.description || "",
      monto: transaction.amount || 0,
      tipo: transaction.type || "OTROS",
    }));
  }, [transactionsWithRunningBalance]);

  const totalFilteredBalance = useMemo(() => {
    return transactionsWithRunningBalance?.reduce((total, transaction) => {
      return transaction.type === "INGRESO"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  }, [transactionsWithRunningBalance]);

  const totalFilteredBalanceDocumento = useMemo(() => {
    if (!movimientos) return 0;

    return movimientos.reduce((total, movimiento) => {
      const amount =
        movimiento.tipo === "EGRESO" || movimiento.tipo === "TRANSFERENCIA"
          ? -movimiento.monto
          : movimiento.monto;
      return total + amount;
    }, 0);
  }, [movimientos]);

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

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 className="animate-spin" size={48} />
        <LoadingText>Cargando datos de caja...</LoadingText>
      </LoadingContainer>
    );
  }

  // Opción 1: Con Tooltip
  const TruncatedText = ({ text, maxLength = 50 }) => {
    const isTruncated = text?.length > maxLength;
    const truncatedText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

    return (
      <div className="relative group">
        <span className="cursor-pointer">{truncatedText}</span>
        {isTruncated && (
          <div className="absolute z-[1000] invisible group-hover:visible bg-gray-900 text-white p-2 rounded text-sm max-w-xs whitespace-normal break-words left-0 mt-1 cursor-pointer">
            {text}
          </div>
        )}
      </div>
    );
  };

  // Renderizar el PDF solo si hay una caja configurada
  const renderPDFContent = () => {
    if (!caja || !caja.sucursal) return null;

    return (
      <>
        <PDFDownloadLink
          document={
            <CajaMovimientoPDF
              sucursal={caja?.sucursal?.nombre || "Sin sucursal"}
              movimientos={movimientos}
              fechaInicio={startDate?.toLocaleDateString("es-AR")}
              fechaFin={endDate?.toLocaleDateString("es-AR")}
              observacion={"Sin movimientos en el período seleccionado"}
              balanceFinal={totalFilteredBalanceDocumento || 0}
            />
          }
          fileName={`movimiento_caja_${new Date().toLocaleDateString(
            "es-AR"
          )}.pdf`}
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            color: "#fff",
            backgroundColor: "#007bff",
            borderRadius: "5px",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          {({ loading: pdfLoading }) =>
            pdfLoading
              ? "Preparando documento..."
              : "Descargar movimientos de la caja"
          }
        </PDFDownloadLink>

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
                  fechaInicio={startDate?.toLocaleDateString("es-AR")}
                  fechaFin={endDate?.toLocaleDateString("es-AR")}
                  observacion={"Sin movimientos en el período seleccionado"}
                  balanceFinal={totalFilteredBalanceDocumento || 0}
                />
              </PDFViewer>
            </div>
          </Modal>
        )}

        {showModal && (
          <ModalTransaccion
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            type={modalType}
            source="CAJA"
          />
        )}

        {/* Modal para Comprobante Individual */}
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
      </>
    );
  };

  return (
    <Container className="min-h-screen border">
      <Header>
        <Title>
          <Wallet size={24} />
          Caja, <span className="text-blue-600">{caja?.sucursal?.nombre}</span>
        </Title>
        <HeaderActions>
          <Button onClick={() => handleOpenModal("INGRESO")}>
            <ArrowUpRight size={18} />
            Ingreso
          </Button>
          <Button variant="danger" onClick={() => handleOpenModal("EGRESO")}>
            <ArrowDownLeft size={18} />
            Egreso
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOpenModal("TRANSFERENCIA")}
          >
            <RefreshCw size={18} />
            Transferencia
          </Button>
          <Button variant="secondary" onClick={() => setShowPdfModal(true)}>
            <Download size={18} />
            Ver Reporte
          </Button>
        </HeaderActions>
      </Header>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle>Balance Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <Balance>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(caja.balance)}
            </Balance>
          </CardContent>
        </Card>
      </Grid>

      <Section>
        <SectionTitle>Últimos Movimientos.</SectionTitle>
        <DateFilter>
          <div className="flex gap-1 items-center">
            <label className="font-medium">Desde:</label>
            <input
              className="border outline-none py-1 px-2"
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="flex gap-1 items-center">
            <label className="font-medium">Hasta:</label>
            <input
              className="border outline-none py-1 px-2"
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div className="flex items-center">
            <span
              className={`font-semibold ml-2 border py-1.5 px-4 ${
                totalFilteredBalance < 0 ? "text-red-700" : "text-black"
              }`}
            >
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(totalFilteredBalance)}
            </span>
          </div>
        </DateFilter>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Fecha</Th>
                <Th>Tipo</Th>
                <Th>Descripción</Th>
                <Th>Categoría</Th>
                <Th align="right">Monto</Th>
                <Th align="right">Saldo</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {transactionsWithRunningBalance?.map((transaction) => (
                <tr key={transaction._id}>
                  <Td>
                    {format(new Date(transaction.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </Td>
                  <Td>
                    <TransactionType type={transaction.type}>
                      {transaction.type === "INGRESO" ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownLeft size={16} />
                      )}
                      {transaction.type}
                    </TransactionType>
                  </Td>
                  <Td className="">
                    <TruncatedText
                      text={transaction.description}
                      maxLength={50}
                    />
                  </Td>
                  <Td>
                    <Category>{transaction.category}</Category>
                  </Td>
                  <Td align="right">
                    <Amount type={transaction.type}>
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(transaction.amount)}
                    </Amount>
                  </Td>
                  <Td align="right">
                    <span
                      className={`${
                        transaction.runningBalance < 0
                          ? "text-red-700"
                          : "text-black"
                      } font-semibold`}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(transaction.runningBalance)}
                    </span>
                  </Td>
                  <Td>
                    <Status status={transaction.status || "COMPLETADO"}>
                      {transaction.status || "COMPLETADO"}
                    </Status>
                  </Td>
                  <Td align="center">
                    <button
                      onClick={() => handleSelectTransaction(transaction)}
                    >
                      <Eye size={19} className="text-blue-600" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Section>

      {renderPDFContent()}
    </Container>
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
