import React, { useEffect, useState } from 'react'
import Menu from '../Menu'
import ContenidoAlumnos from '../ContenidoAlumnos'
import ContenidoDocentes from '../ContenidoDocentes';
import ContenidoCursos from '../ContenidoCursos';
import ContenidoAsistencia from '../ContenidoAsistencia';
import ContenidoApoderado from '../Apoderado/ContenidoApoderado';

const Contenedor = ({ roles }) => {
  const [activeOption, setActiveOption] = useState(null); // Opción activa
  const [availableSections, setAvailableSections] = useState({
    alumnos: false,
    docentes: false,
    cursos: false,
    asistencia: false,
    apoderado: false,
  });
 

  useEffect(() => {
    // Configura las secciones disponibles según los roles
    const sections = {
      alumnos: roles.includes('Coordinador') || roles.includes('Docente'), // Acceso a 'alumnos'
      docentes: roles.includes('Coordinador'), // Acceso a 'docentes'
      cursos: roles.includes('Coordinador') || roles.includes('Docente'),
      asistencia: roles.includes('Coordinador') || roles.includes('Docente'),
      apoderado: roles.includes('Coordinador') || roles.includes('Apoderado'),  // Acceso a 'cursos'
    };
    

    setAvailableSections(sections);

    // Configura la opción activa inicial según los roles
    
    if (roles.includes('Coordinador')) {
      setActiveOption('alumnos');
    } else if (roles.includes('Docente')) {
      setActiveOption('cursos');
    }else if (roles.includes('Apoderado')) {
      setActiveOption('apoderado');
    } else {
      setActiveOption(null);
    }
  }, [roles]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Menú lateral */}
      <Menu activeOption={activeOption} setActiveOption={setActiveOption} />

      {/* Contenido principal */}
      <div className="flex-1 p-0 md:p-6 mt-10 md:mt-0 transition-all duration-300 ease-in-out ml-0">
        {/* Mostrar contenido según la opción activa */}
        {availableSections.alumnos && activeOption === 'alumnos' && <ContenidoAlumnos />}
        {availableSections.docentes && activeOption === 'docentes' && <ContenidoDocentes />}
        {availableSections.cursos && activeOption === 'cursos' && <ContenidoCursos />}
        {availableSections.asistencia && activeOption === 'asistencia' && <ContenidoAsistencia />}
        {availableSections.apoderado && activeOption === 'apoderado' && <ContenidoApoderado />}
        {/* Mostrar mensaje si no hay ninguna sección activa */}
        {!activeOption && <p>Selecciona una opción del menú</p>}
      </div>
    </div>
  )
}

export default Contenedor
