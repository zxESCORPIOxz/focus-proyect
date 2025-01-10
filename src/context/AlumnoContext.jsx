import React, { createContext, useContext, useState } from "react";

const AlumnoContext = createContext();

export const useAlumnoContext = () => {
  return useContext(AlumnoContext);
};

export const AlumnoProvider = ({ children }) => {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState([]);

  const guardarAlumnoSeleccionado= (alumno) => {
    setAlumnoSeleccionado(alumno);
  };

  return (
    <AlumnoContext.Provider
      value={{
        alumnoSeleccionado,
        guardarAlumnoSeleccionado,
      }}
    >
      {children}
    </AlumnoContext.Provider>
  );
};
