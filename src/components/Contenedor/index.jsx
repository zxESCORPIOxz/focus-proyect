import React, { useEffect, useState } from 'react'
import Menu from '../Menu'
import ContenidoAlumnos from '../ContenidoAlumnos'
import ContenidoDocentes from '../ContenidoDocentes';
import ContenidoCursos from '../ContenidoCursos';




const Contenedor = ({ roles }) => {

  const [activeOption, setActiveOption] = useState('alumnos'); 
  const [availableSections, setAvailableSections] = useState({
    alumnos: false,
    docentes: false,
    cursos: false,
  });

  useEffect(() => {
    // Activa o desactiva las opciones según los roles
    setAvailableSections({
      alumnos: roles.includes('Coordinador') || roles.includes('Docente'), // Puedes ajustar los roles
      docentes: roles.includes('Coordinador'),
      cursos: roles.includes('Coordinador'),
    });
  }, [roles]);
  return (
    <>
        <div className="flex w-full h-full">
          <Menu activeOption={activeOption} setActiveOption={setActiveOption} />
          <div className="flex-1 p-6">
            {availableSections.alumnos && activeOption === 'alumnos' && <ContenidoAlumnos />}
            {availableSections.docentes && activeOption === 'docentes' && <ContenidoDocentes />}
            {availableSections.cursos && activeOption === 'cursos' && <ContenidoCursos />}
          </div>
        </div>
    </>
  )
}

export default Contenedor
