import React, { createContext, useContext, useState } from "react";

const CursoContext = createContext();

export const useCursoContext = () => {
  return useContext(CursoContext);
};

export const CursoProvider = ({ children }) => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState([]);

  const guardarCursoSeleccionado= (curso) => {
    setCursoSeleccionado(curso);
  };

  return (
    <CursoContext.Provider
      value={{
        cursoSeleccionado,
        guardarCursoSeleccionado,
      }}
    >
      {children}
    </CursoContext.Provider>
  );
};