import React, { useEffect, useState } from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import FormularioNuevoAlumno from '../FormularioNuevoAlumno';
import { listarAlumnos } from '../../lib/apiListarAlumnos';
import LoadingSpinner from '../LoadingSpinner';
import PopupErrorRegister from '../../Popups/RegistroError';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const ContenidoAlumnos = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { clearAuth } = useAuthContext();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);  
  
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  //PAGINACION
  const itemsPerPage = 6; // Elementos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };


  useEffect(() => {
    const fetchAlumnos = async () => {
      const token = localStorage.getItem("token");
      const id_institucion = localStorage.getItem("id_institucion");
      const id_matricula = 2; 
  
      const response = await listarAlumnos(token, id_institucion, id_matricula);
  
      if (response.status === "SUCCESS") {
        setAlumnos(response.alumnos); 
        // console.log(response.alumnos.id_alumno)
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message); // Configura el mensaje de error
        setShowErrorPopup(true); // Muestra el popup de error
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      }
  
      setLoading(false);
    };
  
    fetchAlumnos();
  }, []);

  // Calcular los alumnos a mostrar
  const indexOfLastAlumno = currentPage * itemsPerPage;
  const indexOfFirstAlumno = indexOfLastAlumno - itemsPerPage;
  const currentAlumnos = alumnos.slice(indexOfFirstAlumno, indexOfLastAlumno);

  // Controlar el cambio de página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(alumnos.length / itemsPerPage);
  return (
    <div className="flex-1 p-6">
      <header className="bg-[#4B7DBF] text-white rounded-lg flex items-center gap-4 p-4 mb-6">
        <FaUserGraduate className="text-5xl" />
        <h1 className="text-lg font-bold">Módulo: Gestión de Alumnos</h1>
      </header>

      <main className="bg-white py-2 px-4 rounded-lg shadow">
        <div className="h-[calc(92vh-160px)] flex flex-col justify-between">
          {isFormOpen ? (
            <div className="overflow-auto mb-0 flex-1">
              <FormularioNuevoAlumno />
            </div>
            
          ) : (
            <>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="filter-grado"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grado:
                  </label>
                  <select
                    id="filter-grado"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todos</option>
                    <option value="1">1°</option>
                    <option value="2">2°</option>
                    <option value="3">3°</option>
                    <option value="4">4°</option>
                    <option value="5">5°</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="filter-seccion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sección:
                  </label>
                  <select
                    id="filter-seccion"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todas</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="filter-estado"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Estado:
                  </label>
                  <select
                    id="filter-estado"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="mt-6">
                  <button className="bg-[#5155A6] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Aplicar Filtros
                  </button>
                </div>
                <div className="mt-6">
                  <button
                    className="bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Nuevo Alumno
                  </button>
                </div>
              </div>

              <div className="overflow-auto mb-0 flex-1">
                {loading ? (
                  <LoadingSpinner/>
                ) : (
                  <table className="w-full text-left border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 border-b border-gray-300 text-center">Nombre</th>
                        <th className="p-3 border-b border-gray-300 text-center">Matrícula</th>
                        <th className="p-3 border-b border-gray-300 text-center">Grado</th>
                        <th className="p-3 border-b border-gray-300 text-center">Sección</th>
                        <th className="p-3 border-b border-gray-300 text-center">Contacto</th>
                        <th className="p-3 border-b border-gray-300 text-center">Estado</th>
                        <th className="p-3 border-b border-gray-300 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAlumnos.map((alumno) => (
                        <tr key={alumno.id_alumno}>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno }</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_matricula}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_grado}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_seccion}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.telefono}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.estado_alumno}</td>
                          <td className="p-3 border-b text-center border-gray-300">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-4">
                              Editar
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 mr-4">
                              Desactivar
                            </button>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                              Detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                          )}
                
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  className={`bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                {/* Mostrar los botones de números de página */}
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`mx-2 px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-[#5155A6] text-white' : 'bg-[#4B7DBF] text-white hover:bg-[#3A6B9F]'}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  className={`bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>

            </>
          )}
        </div>
        
      </main>
    </div>
  );
};

export default ContenidoAlumnos;
