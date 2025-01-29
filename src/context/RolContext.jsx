import React, { createContext, useContext, useState } from "react";

const RolContext = createContext();

export const useRolContext = () => {
  return useContext(RolContext);
};

export const RolProvider = ({ children }) => {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [idRolSeleccionado, setIdRolSeleccionado] = useState(null);
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState(null);
  const [institucionId, setInstitucionId] = useState(null);
  const [selectedMatriculaId,setSelectedMatriculaId] = useState("");
  const [matriculas, setMatriculas] = useState([]);
  const [error, setError] = useState(null);

  const seleccionarRol = (rol, institucionNombre, institucionId, matriculas,idRolSeleccionado) => {
    setIdRolSeleccionado(idRolSeleccionado);
    setRolSeleccionado(rol);
    setInstitucionSeleccionada(institucionNombre);
    setInstitucionId(institucionId);
    setMatriculas(matriculas);
    setSelectedMatriculaId(matriculas.length > 0 ? matriculas[0].id_matricula : ""); // Inicializa el id_matricula
};


  const clearRolData = () => {
    setRolSeleccionado(null);
    setInstitucionSeleccionada(null);
    setInstitucionId(null);
    setMatriculas([]);
    setNombreMatricula(null)
  };
  const seleccionarMatricula = (matriculaId) => {
    setSelectedMatriculaId(matriculaId);
    
};

  return (
    <RolContext.Provider
      value={{
        rolSeleccionado,
        institucionSeleccionada,
        selectedMatriculaId,
        institucionId,
        matriculas,
        seleccionarRol,
        idRolSeleccionado,
        seleccionarMatricula,
        clearRolData,
        error,
        setError
      }}
    >
      {children}
    </RolContext.Provider>
  );
};
