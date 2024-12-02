import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        clienteAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const { data } = await clienteAxios.get("/users/profile");
        setAuth(data);
      } catch (error) {
        console.error("Error de verificación:", error);
        localStorage.removeItem("token");
        delete clienteAxios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    verificarAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await clienteAxios.post("/users/login", credentials);

      if (data.token) {
        localStorage.setItem("token", data.token);
        clienteAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        setAuth(data.user);
        return { success: true };
      }

      return {
        success: false,
        message: "Credenciales inválidas",
      };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete clienteAxios.defaults.headers.common["Authorization"];
    setAuth({});
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
