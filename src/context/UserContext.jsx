import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [usuarioVerificado, setUsuarioVerificado] = useState(null);

  const guardarUsuarioVerificado = (usuario) => {
    setUsuarioVerificado(usuario);
  };

  return (
    <UserContext.Provider
      value={{
        usuarioVerificado,
        guardarUsuarioVerificado,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
