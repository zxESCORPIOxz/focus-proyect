import React, { createContext, useContext, useState } from "react";

const DocenteContext = createContext();

export const useDocenteContext = () => {
  return useContext(DocenteContext);
};

export const DocenteProvider = ({ children }) => {
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);

  const guardarDocenteSeleccionado= (docente) => {
    setDocenteSeleccionado(docente);
  };

  return (
    <DocenteContext.Provider
      value={{
        docenteSeleccionado,
        guardarDocenteSeleccionado,
      }}
    >
      {children}
    </DocenteContext.Provider>
  );
};
