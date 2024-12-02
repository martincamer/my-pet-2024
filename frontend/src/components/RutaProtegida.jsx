import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RutaProtegida = () => {
  const { auth, loading } = useAuth();

  console.log("at", auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return auth?.user?._id ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RutaProtegida;
