import React, { useEffect, useState } from 'react';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaSync,
  FaSchool,
  FaClipboardList,
  FaInfoCircle,
  FaNewspaper,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useRolContext } from '../../context/RolContext';
import { List } from 'lucide-react';

const defaultImage = "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-01-imagen?img=institucion";
const defaultUser = "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-01-imagen?img=perfil_default";

const Menu = ({ activeOption, setActiveOption }) => {
  const navigate = useNavigate();
  const { matriculas,rolSeleccionado,institucionSeleccionada , selectedMatriculaId, seleccionarMatricula } = useRolContext();
  const { clearAuth } = useAuthContext();
  const [role, setRole] = useState(null);
  
  
  // console.log("Desde menu el id guardado :"+selectedMatriculaId)
  useEffect(() => {
    // Obtener el rol desde localStorage
    
    setRole(rolSeleccionado);
    
    
  }, []);

  const handleLogout = () => {
    clearAuth(); // Limpiar la sesión
    navigate("/login"); // Redirigir a la página de login después de cerrar sesión
  };

  const handleNavigate = (id) => {
    if (!selectedMatriculaId) {
      alert("Por favor, seleccione una matrícula antes de continuar.");
      return;
  }
    if (id === 'volver') {
      navigate('/roles'); // Redirige a /roles
    } else {
      setActiveOption(id); // Cambia la opción activa
    }
  };
  

  // Menú para Coordinador
  const coordinatorMenuItems = [
    { id: 'alumnos', icon: <FaUserGraduate />, label: 'Gestión de Alumnos' },
    { id: 'docentes', icon: <FaChalkboardTeacher />, label: 'Gestión de Docentes' },
    { id: 'cursos', icon: <FaBookOpen />, label: 'Gestión de Cursos' },
    { id: 'informes', icon: <FaClipboardList />, label: 'Informes' },
    { id: 'noticias', icon: <FaNewspaper />, label: 'Noticias' },
  ];

  // Menú para Docente
  const teacherMenuItems = [
    { id: 'cursos', icon: <FaBookOpen />, label: 'Mis Cursos' },
    { id: 'informes', icon: <FaClipboardList />, label: 'Mis Informes' },
    { id: 'asistencia', icon: <FaSchool />, label: 'Asistencia' },
  ];

  // Menú para Alumno
  const studentMenuItems = [
    { id: 'cursos', icon: <FaBookOpen />, label: 'Mis Cursos' },
    { id: 'informes', icon: <FaClipboardList />, label: 'Mis Informes' },
    { id: 'asistencia', icon: <FaSchool />, label: 'Mi Asistencia' },
  ];

  // Menú para Apoderado
  const guardianMenuItems = [
    { id: 'hijo', icon: <FaUserGraduate />, label: 'Ver Información de Hijo' },
    { id: 'comunicarse', icon: <FaInfoCircle />, label: 'Comunicarse con Docente' },
  ];

  // Determinar qué menú mostrar según el rol
  const menuItems =
    role === 'Coordinador'
      ? coordinatorMenuItems
      : role === 'Docente'
      ? teacherMenuItems
      : role === 'Alumno'
      ? studentMenuItems
      : role === 'Apoderado'
      ? guardianMenuItems
      : [];
      const handleMatriculaChange = (event) => {
        const selectedId = event.target.value;
        seleccionarMatricula(selectedId);
        // console.log("DESDE MENU:" + selectedId)
    };
  return (
    <aside className="w-auto bg-gradient-to-b from-[#5155A6] to-[#4B7DBF] text-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="w-full md:w-auto flex items-center justify-center space-x-4 ml-4 mr-4 mt-3">
          <img
            src="https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-01-imagen?img=icon_focusclass"
            alt="Icono FocusClass"
            className="w-11 h-11 object-contain"
          />
          <a href="#" className="text-2xl md:text-2xl font-semibold">FocusClass</a>
        </div>

        {/* Perfil */}
        <div className="text-center p-6 space-y-4">
          <div className="p-2 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src="./pic/img.jpg"
              alt="User"
              className="w-24 h-24"
              onError={(e) => (e.target.src = defaultUser)}
            />
            <h3 className="text-gray-300">Hola,</h3>
            <h2 className="text-lg text-white font-bold">{localStorage.getItem("fullName") || "Nombre"}</h2>
          </div>

          {/* Institución y rol */}
          <div className="flex flex-col items-center justify-start h-16 ">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg shadow-lg flex items-center space-x-2 ">
                <img
                  src={defaultImage}
                  alt="Logo Institución"
                  className="w-7 h-7"
                  onError={(e) => (e.target.src = defaultImage)}
                />
                <div className="flex-1">
                  <h2 className="text-base text-gray-200 font-bold break-words mr-1">{institucionSeleccionada|| "Institución 1"}</h2>
                </div>
              </div>
            </div>

            <div className='flex mb-1  items-center justify-start h-16'>
              <div className="p-2 ml-1 rounded-lg shadow-lg flex items-center bg-gray-300 h-10">
                <h2 className="text-sm text-black font-bold">{role}</h2>
              </div>

              {/* Botón de Recarga */}
              <button
                className="flex ml-1 items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white shadow-lg hover:bg-[#5155A6]"
                onClick={() => window.location.reload()}
              >
                <FaSync className="text-lg" />
              </button>

              {matriculas.length > 0 && (
                <div className="flex items-center justify-start h-16">
                  <div className="p-2 ml-1 rounded-lg shadow-lg flex items-center bg-gray-300 h-10">
                    <select
                      value={selectedMatriculaId}
                      onChange={handleMatriculaChange}
                      className="text-sm text-black font-bold bg-transparent outline-none pl-1  border border-gray-300 "
                    >
                      {matriculas.map((matricula, index) => (
                        <option className='pl-2' key={index} value={matricula.id_matricula}>
                          {matricula.nombre_matricula}
                        </option>
                      ))}
                    </select>
                   
                  </div>
                </div>
              )}
            </div>

            

            
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex flex-col mt-5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`py-3 px-6 flex items-center gap-3 hover:bg-white/20 ${
                activeOption === item.id ? 'bg-white/20 shadow-lg shadow-blue-500/50' : ''
              }`}
              onClick={() => handleNavigate(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Cerrar sesión */}
      <div className="flex flex-col mb-2">
        <button
          className="py-3 px-6 flex items-center gap-3 hover:bg-white/20"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-lg" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Menu;
