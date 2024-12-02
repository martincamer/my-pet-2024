import { createContext, useContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : {};
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCargando(false);
        setAuth({});
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios.get("/users/profile", config);

        if (data.ok) {
          setAuth(data);
          localStorage.setItem("auth", JSON.stringify(data));
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } catch (error) {
        console.error("Error de autenticación:", error);
        setAuth({});
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = async (datos) => {
    try {
      const { data } = await clienteAxios.post("/users/login", datos);

      localStorage.setItem("token", data.token);
      localStorage.setItem("auth", JSON.stringify(data));

      clienteAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      setAuth(data);
      return true;
    } catch (error) {
      console.error("Error de login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    delete clienteAxios.defaults.headers.common["Authorization"];
    setAuth({});
  };

  const actualizarPerfil = async (datos) => {
    try {
      const { data } = await clienteAxios.put("/users/profile", datos);

      const nuevoAuth = { ...auth, user: data.user };
      setAuth(nuevoAuth);
      localStorage.setItem("auth", JSON.stringify(nuevoAuth));

      return { msg: "Perfil actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return { error: error.response?.data?.msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        login,
        logout,
        actualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
