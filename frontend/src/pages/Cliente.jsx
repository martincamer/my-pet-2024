import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClientes } from "../context/ClientesContext";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Plus,
  FileText,
  FileDown,
  Users,
} from "lucide-react";
import TablaFacturas from "../components/clientes/documentos/TablaFacturas";
import TablaPagos from "../components/clientes/documentos/TablaPagos";
import TablaPresupuestos from "../components/clientes/documentos/TablaPresupuestos";
import TablaNotalDebCred from "../components/clientes/documentos/TablaNotalDebCred";
import ModelosContratados from "../components/clientes/modelos/ModelosContratados";
import DocumentosLegales from "../components/clientes/legales/DocumentosLegales";

const Cliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCliente, cliente, loading, CONDICIONES_FISCALES } = useClientes();
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    getCliente(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Cliente no encontrado
        </h2>
      </div>
    );
  }

  const tabs = [
    { id: "info", label: "Información General" },
    {
      id: "facturas",
      label: "Facturas",
      count: cliente.documents?.invoices?.length || 0,
    },
    {
      id: "pagos",
      label: "Pagos",
      count: cliente.documents?.payments?.length || 0,
    },
    {
      id: "presupuestos",
      label: "Presupuestos",
      count: cliente.documents?.quotes?.length || 0,
    },
    {
      id: "notas",
      label: "Notas C/D",
      count: cliente.documents?.creditDebitNotes?.length || 0,
    },
    {
      id: "modelos",
      label: "Modelo Contratado",
      count: cliente.modeloContratado ? 1 : 0,
    },
    {
      id: "legales",
      label: "Legales",
      count: cliente.documents?.legales?.length || 0,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Mejorado */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a Clientes
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {cliente.fantasyName}
            </h1>
            <p className="text-gray-500">{cliente.contractNumber}</p>
          </div>
          {/* 
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
              <Plus size={20} />
              Nueva Factura
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Plus size={20} />
              Nuevo Presupuesto
            </button>
          </div> */}
        </div>
      </div>

      {/* Tabs Mejorados */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <nav className="flex px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de los tabs */}
      <div className="space-y-8">
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Básica */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Información Básica
                </h3>
              </div>
              <div className="space-y-4">
                <InfoItem
                  icon={<Building2 className="text-gray-400" size={20} />}
                  label="Documento"
                  value={`${cliente.documentType}: ${cliente.documentNumber}`}
                />
                <InfoItem
                  icon={<CreditCard className="text-gray-400" size={20} />}
                  label="Condición Fiscal"
                  value={
                    CONDICIONES_FISCALES.find(
                      (c) => c.value === cliente.taxCondition
                    )?.label
                  }
                />
                <InfoItem
                  icon={<Phone className="text-gray-400" size={20} />}
                  label="Teléfono"
                  value={cliente.contact?.phone}
                />
                <InfoItem
                  icon={<Mail className="text-gray-400" size={20} />}
                  label="Email"
                  value={cliente.contact?.email}
                />
              </div>
            </div>

            {/* Información Comercial */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Información Comercial
                </h3>
              </div>
              <div className="space-y-4">
                <InfoItem
                  icon={<CreditCard className="text-gray-400" size={20} />}
                  label="Límite de Crédito"
                  value={`$${cliente.paymentInfo?.creditLimit?.toLocaleString()}`}
                />
                <InfoItem
                  icon={<FileText className="text-gray-400" size={20} />}
                  label="Saldo Actual"
                  value={`$${cliente.balance?.current?.toLocaleString()}`}
                />
                <InfoItem
                  icon={<FileDown className="text-gray-400" size={20} />}
                  label="Última Compra"
                  value={
                    cliente.lastPurchaseDate
                      ? new Date(cliente.lastPurchaseDate).toLocaleDateString()
                      : "Sin compras"
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "facturas" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaFacturas
              facturas={cliente.documents.invoices}
              clienteId={cliente._id}
              cliente={cliente}
            />
          </div>
        )}

        {activeTab === "pagos" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaPagos
              cliente={cliente}
              pagos={cliente.documents?.payments || []}
              clienteId={cliente._id}
            />
          </div>
        )}

        {activeTab === "presupuestos" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaPresupuestos
              cliente={cliente}
              presupuestos={cliente.documents?.quotes || []}
              clienteId={cliente._id}
            />
          </div>
        )}

        {activeTab === "notas" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaNotalDebCred
              notas={cliente.documents?.creditDebitNotes || []}
              clienteId={cliente._id}
            />
          </div>
        )}

        {activeTab === "modelos" && (
          <div className="bg-white rounded-xl shadow-sm">
            <ModelosContratados cliente={cliente} clienteId={cliente._id} />
          </div>
        )}

        {activeTab === "legales" && (
          <div className="bg-white rounded-xl shadow-sm">
            <DocumentosLegales cliente={cliente} clienteId={cliente._id} />
          </div>
        )}
      </div>
    </div>
  );
};

// Componente InfoItem mejorado
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start group">
    <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
      {icon}
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value || "-"}</p>
    </div>
  </div>
);

export default Cliente;
