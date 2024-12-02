import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompras } from "../context/ComprasContext";
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  CreditCard,
  FileText,
  ShoppingBag,
  FileDown,
  Truck,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Modal from "../components/Modal/Modal";
import useModal from "../hooks/useModal";
import FormularioFactura from "../components/proveedores/FormularioFactura";
import FormularioOrdenCompra from "../components/proveedores/FormularioOrdenCompra";
import TablaFacturas from "../components/proveedores/TablaFacturas";
import TablaOrdenesCompra from "../components/proveedores/TablaOrdenesCompra";
import TablaPagosProveedor from "../components/proveedores/documentos/TablaPagosProveedor";
import clienteAxios from "../config/axios";
import { formatearDinero } from "../utils/formatearDinero";

const DetalleProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProveedor, proveedor, loading, CONDICIONES_FISCALES } =
    useCompras();
  const [activeTab, setActiveTab] = useState("info");

  const [modalStates, setModalStates] = useState({
    addPurchaseOrder: false,
    editPurchaseOrder: false,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (modalName) => {
    setModalStates((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalStates((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === "editPurchaseOrder") {
      setSelectedOrder(null);
    }
  };

  const handleEditOrder = (orden) => {
    setSelectedOrder(orden);
    openModal("editPurchaseOrder");
  };

  useEffect(() => {
    getProveedor(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Proveedor no encontrado
        </h2>
      </div>
    );
  }

  const tabs = [
    { id: "info", label: "Información General" },
    { id: "invoices", label: "Facturas" },
    { id: "orders", label: "Órdenes de Compra" },
    { id: "delivery", label: "Remitos" },
    { id: "history", label: "Historial" },
    { id: "payments", label: "Pagos" },
  ];

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const response = await clienteAxios.post(
        `/api/suppliers/${proveedor._id}/invoices`,
        invoiceData
      );
      if (response.data.ok) {
        // Manejar la respuesta exitosa, por ejemplo, actualizar el estado o mostrar un mensaje
        console.log("Factura creada:", response.data.invoice);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al crear la factura:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Mejorado */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a Proveedores
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {proveedor.businessName}
            </h1>
            <p className="text-gray-500 capitalize">{proveedor.fantasyName}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => openModal("addInvoice")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={20} />
              Nueva Factura
            </button>
            <button
              onClick={() => openModal("addPurchaseOrder")}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus size={20} />
              Nueva Orden
            </button>
          </div>
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
                <Building2 className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Información Básica
                </h3>
              </div>
              <div className="space-y-4">
                <InfoItem
                  icon={<Building2 className="text-gray-400" size={20} />}
                  label="CUIT"
                  value={proveedor.cuit}
                />
                <InfoItem
                  icon={<CreditCard className="text-gray-400" size={20} />}
                  label="Condición Fiscal"
                  value={
                    CONDICIONES_FISCALES.find(
                      (c) => c.value === proveedor.taxCondition
                    )?.label
                  }
                />
                <InfoItem
                  icon={<Phone className="text-gray-400" size={20} />}
                  label="Teléfono"
                  value={proveedor.contact?.phone}
                />
                <InfoItem
                  icon={<Mail className="text-gray-400" size={20} />}
                  label="Email"
                  value={proveedor.contact?.email}
                />
                <InfoItem
                  icon={<Globe className="text-gray-400" size={20} />}
                  label="Sitio Web"
                  value={proveedor.contact?.website}
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Dirección
                </h3>
              </div>
              <div className="space-y-4">
                <InfoItem
                  icon={<MapPin className="text-gray-400" size={20} />}
                  label="Dirección"
                  value={`${proveedor.address?.street} ${proveedor.address?.number}`}
                />
                {proveedor.address?.floor && (
                  <InfoItem
                    icon={<Building2 className="text-gray-400" size={20} />}
                    label="Piso/Depto"
                    value={`${proveedor.address.floor} ${proveedor.address.apartment}`}
                  />
                )}
                <InfoItem
                  icon={<MapPin className="text-gray-400" size={20} />}
                  label="Ciudad"
                  value={`${proveedor.address?.city}, ${proveedor.address?.state}`}
                />
                <InfoItem
                  icon={<MapPin className="text-gray-400" size={20} />}
                  label="Código Postal"
                  value={proveedor.address?.zipCode}
                />
              </div>
            </div>

            {/* Condiciones Comerciales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Condiciones Comerciales
                </h3>
              </div>
              <div className="space-y-4">
                <InfoItem
                  icon={<CreditCard className="text-gray-400" size={20} />}
                  label="Límite de Crédito"
                  value={`$${proveedor.paymentConditions?.creditLimit?.toFixed(
                    2
                  )}`}
                />
                <InfoItem
                  icon={<FileText className="text-gray-400" size={20} />}
                  label="Días de Vencimiento"
                  value={`${proveedor.paymentConditions?.defaultDueDays} días`}
                />
                <InfoItem
                  icon={<CreditCard className="text-gray-400" size={20} />}
                  label="Saldo Actual"
                  value={`${formatearDinero(proveedor.balance?.current)}`}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaFacturas
              facturas={proveedor.documents?.invoices || []}
              onAddInvoice={() => openModal("addInvoice")}
            />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaOrdenesCompra
              onCreateInvoice={handleCreateInvoice}
              proveedor={proveedor}
              ordenes={proveedor.documents?.purchaseOrders || []}
              onAddOrder={() => openModal("addPurchaseOrder")}
              onEdit={handleEditOrder}
            />
          </div>
        )}

        {activeTab === "payments" && proveedor?._id && (
          <div className="bg-white rounded-xl shadow-sm">
            <TablaPagosProveedor
              facturas={proveedor?.documents?.invoices || []}
              pagos={proveedor.documents?.payments || []}
              proveedor={proveedor._id}
            />
          </div>
        )}

        {/* Secciones en desarrollo */}
        {(activeTab === "delivery" || activeTab === "history") && (
          <div className="bg-white rounded-xl shadow-sm p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                {activeTab === "delivery" ? (
                  <Truck className="text-blue-500" size={32} />
                ) : (
                  <FileDown className="text-blue-500" size={32} />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === "delivery" ? "Remitos" : "Historial"}
              </h3>
              <p className="text-gray-500">
                Esta sección está actualmente en desarrollo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalStates.addInvoice}
        onClose={() => closeModal("addInvoice")}
        title="Nueva Factura"
        width="800px"
      >
        <FormularioFactura
          proveedor={proveedor}
          onClose={() => closeModal("addInvoice")}
        />
      </Modal>

      <Modal
        isOpen={modalStates.addPurchaseOrder}
        onClose={() => closeModal("addPurchaseOrder")}
        title="Nueva Orden de Compra"
        width="1440px"
      >
        <FormularioOrdenCompra
          proveedor={proveedor}
          onClose={() => closeModal("addPurchaseOrder")}
        />
      </Modal>

      <Modal
        isOpen={modalStates.editPurchaseOrder}
        onClose={() => closeModal("editPurchaseOrder")}
        title={`Editar Orden de Compra ${selectedOrder?.orderNumber}`}
        width="1440px"
      >
        <FormularioOrdenCompra
          proveedor={proveedor}
          orden={selectedOrder}
          onClose={() => closeModal("editPurchaseOrder")}
        />
      </Modal>
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

export default DetalleProveedor;
