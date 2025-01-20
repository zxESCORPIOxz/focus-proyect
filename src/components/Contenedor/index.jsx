import React, { useEffect, useState } from 'react'
import Menu from '../Menu'
import ContenidoAlumnos from '../ContenidoAlumnos'
import ContenidoDocentes from '../ContenidoDocentes';
import ContenidoCursos from '../ContenidoCursos';

const Contenedor = ({ roles }) => {
  const [activeOption, setActiveOption] = useState('alumnos'); // Opción activa
  const [availableSections, setAvailableSections] = useState({
    alumnos: false,
    docentes: false,
    cursos: false,
  });

  useEffect(() => {
    // Activa o desactiva las opciones según los roles
    setAvailableSections({
      alumnos: roles.includes('Coordinador') || roles.includes('Docente'), // Acceso a 'alumnos' para Coordinador o Docente
      docentes: roles.includes('Coordinador'), // Acceso a 'docentes' solo para Coordinador
      cursos: roles.includes('Coordinador'), // Acceso a 'cursos' solo para Coordinador
    });
  }, [roles]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Menú lateral */}
      <Menu activeOption={activeOption} setActiveOption={setActiveOption} />

      {/* Contenido principal */}
      <div className="flex-1 p-0 md:p-6 mt-10 md:mt-0 transition-all duration-300 ease-in-out ml-0 ">
        {/* Mostrar contenido según la opción activa */}
        {availableSections.alumnos && activeOption === 'alumnos' && <ContenidoAlumnos />}
        {availableSections.docentes && activeOption === 'docentes' && <ContenidoDocentes />}
        {availableSections.cursos && activeOption === 'cursos' && <ContenidoCursos />}
      </div>
    </div>
  )
}

export default Contenedor
