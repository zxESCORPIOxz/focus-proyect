import { createContext, useState, useContext } from "react";
import { registerUser } from "../lib/apiRegistrarUsuario";


const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [status, setStatus] = useState(null);

  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const data = await registerUser(userData);
      if (data.status === "SUCCESS") {
        setSuccessMessage(data.message); // Guardamos el mensaje de éxito
        setUser(userData);
        setStatus(data.status) // Puedes guardar los datos del usuario si es necesario
      } else {
        setError(data.message);
        setStatus(data.status) // Si ocurre un error, guardamos el mensaje
      }
      return data;
    } catch (err) {
      setError("Error al registrar el usuario: " + err.message); // Guardamos el error
      console.error("Error al registrar el usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearRegisterState = () => {
    setUser(null);
    setLoading(false);
    setError(null);
    setSuccessMessage(null);
    setStatus(null)
  };

  return (
    <RegisterContext.Provider
      value={{
        user,
        status,
        loading,
        error,
        successMessage,
        register,
        clearRegisterState,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegisterContext debe ser usado dentro de un RegisterProvider");
  }
  return context;
};
