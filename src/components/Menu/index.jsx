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

const defaultImage = "../src/assets/institucion.webp";
const defaultUser = "../src/assets/User2.png";

const Menu = ({ activeOption, setActiveOption }) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthContext();
  const [role, setRole] = useState(null); // Estado para el rol

  useEffect(() => {
    // Obtener el rol desde localStorage
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole); // Establece el rol en el estado
  }, []);

  const handleLogout = () => {
    clearAuth(); // Limpiar la sesión
    navigate("/"); // Redirigir a la página de login después de cerrar sesión
  };

  const handleNavigate = (id) => {
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

  return (
    <aside className="w-auto bg-gradient-to-b from-[#5155A6] to-[#4B7DBF] text-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="w-full md:w-auto flex items-center justify-center space-x-4 ml-4 mr-4 mt-3">
          <img
            src="../src/assets/icon_focusclass.png"
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
              <div className="p-2 rounded-lg shadow-lg flex items-center space-x-2 bg-gray-300 h-10 max-w-s w-full">
                <img
                  src={defaultImage}
                  alt="Logo Institución"
                  className="w-7 h-7"
                  onError={(e) => (e.target.src = defaultImage)}
                />
                <div className="flex-1">
                  <h2 className="text-sm text-black font-bold break-words">{localStorage.getItem("institucion") || "Institución 1"}</h2>
                </div>
              </div>
            </div>

            <div className='flex mt-2 items-center justify-start h-16'>
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
            </div>

            
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex flex-col mt-3">
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
      <div className="flex flex-col mt-4">
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
