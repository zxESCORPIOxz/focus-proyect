import { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../lib/apiLogin"; // Asegúrate de que esta ruta es correcta
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    setLoading(true);
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setRoles(JSON.parse(savedUser).map(role => role.rol || []));
      
    } else {
      console.warn("No se encontró información del usuario en localStorage");
      // navigate("/");                             
    }
    setLoading(false);
  }, []);


  const setAuth = (userData, userToken, userRoles) => {
    setUser(userData);
    setToken(userToken);
    setRoles(userRoles);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRoles([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
  
    try {
      const data = await loginUser(email, password);
      if (data && data.status === "SUCCESS" && data.entities) {
        const fullName = `${data.nombre} ${data.ApellPaterno} ${data.ApellMaterno}`;
        setAuth(data.entities, data.token, data.entities.map(role => role.rol));
        localStorage.setItem("fullName", fullName);
      } else if(data.status === "FAILED"){
        setError(data.message);
      }
      return data;
    } catch (err) {
      setError(err.message);  // Guardar el error para mostrarlo
      console.error("Error al iniciar sesión:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, roles, setAuth, clearAuth, login, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
  }
  return context;
};
