import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "react-hot-toast";
import RutaProtegida from "./components/RutaProtegida";
import DocumentTitle from "./components/DocumentTitle";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import MisMascotas from "./pages/MisMascotas";
import NuevaMascota from "./pages/NuevaMascota";
import EditarMascota from "./pages/EditarMascota";
import Mascotas from "./pages/Mascotas";
import Mascota from "./pages/Mascota";
import SolicitudesAdopcion from "./pages/SolicitudesAdopcion";
import Perfil from "./pages/Perfil";
import OlvidePassword from "./pages/OlvidePassword";
import SobreNosotros from "./pages/SobreNosotros";

function App() {
  const { auth } = useAuth();
  return (
    // <ErrorBoundary>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <HelmetProvider>
          <BrowserRouter>
            <DocumentTitle />
            <Navbar />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#059669",
                  },
                },
                error: {
                  duration: 3000,
                  style: {
                    background: "#DC2626",
                  },
                },
                loading: {
                  duration: Infinity,
                  style: {
                    background: "#333",
                  },
                },
              }}
            />
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/mascotas" element={<Mascotas />} />
              <Route path="/mascota/:id" element={<Mascota />} />
              <Route path="/about" element={<SobreNosotros />} />
              <Route path="/mis-mascotas" element={<RutaProtegida />}>
                <Route path="/mis-mascotas" element={<MisMascotas />} />
              </Route>
              <Route path="/nueva-mascota" element={<RutaProtegida />}>
                <Route path="/nueva-mascota" element={<NuevaMascota />} />
              </Route>
              <Route path="/editar-mascota/:id" element={<RutaProtegida />}>
                <Route path="/editar-mascota/:id" element={<EditarMascota />} />
              </Route>
              <Route path="/solicitudes-adopcion" element={<RutaProtegida />}>
                <Route
                  path="/solicitudes-adopcion"
                  element={<SolicitudesAdopcion />}
                />
              </Route>
              <Route path="/perfil" element={<RutaProtegida />}>
                <Route path="/perfil" element={<Perfil />} />
              </Route>
              <Route path="/recuperar-password" element={<OlvidePassword />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
    // </ErrorBoundary>
  );
}

export default App;
