import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaEdit, FaLock, FaUnlock, FaInfoCircle,FaUsers } from 'react-icons/fa';
import FormularioNuevoAlumno from '../FormularioNuevoAlumno';
import { listarAlumnos } from '../../lib/apiListarAlumnos';
import LoadingSpinner from '../LoadingSpinner';
import PopupErrorRegister from '../../Popups/RegistroError';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useRolContext } from '../../context/RolContext';
import e from 'cors';
import { desactivarAlumno } from '../../lib/apiDesactivarAlumno';
import PopupConfirmacion from '../../Popups/Confirmacion';


const ContenidoAlumnos = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState("listado"); 
  const { clearAuth,token } = useAuthContext();
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const { institucionId,selectedMatriculaId } = useRolContext();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");

  const [showConfirmacionPopup, setShowConfirmacionPopup] = useState(false);
  const [modalMessageConfirmacion, setModalMessageConfirmar] = useState("");
  const [tituloModal, setTituloModal] = useState("");
  const [currentAlumnoId, setCurrentAlumnoId] = useState(null);
  
  const [filtroNumeroDocumento, setFiltroNumeroDocumento] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  //PAGINACION
  const itemsPerPage = 11; // Elementos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBackToListado = () => setView("listado");
  const handleAddAlumno = () => setView("formulario");

  const handleCancel = () => {
    // Cierra el popup sin hacer cambios
    setShowConfirmacionPopup(false);
  };

  const desactivarHandlerPopup = async (id_alumno) => {
    // Muestra el popup de confirmación
    setCurrentAlumnoId(id_alumno);
    setModalMessageConfirmar('¿Estás seguro de que deseas desactivar a este alumno?');
    setTituloModal("Desactivar")
    setShowConfirmacionPopup(true);
  };

  const activarHandlerPopup = async (id_alumno) => {
    // Muestra el popup de confirmación
    setCurrentAlumnoId(id_alumno);
    setTituloModal("Activar")
    setModalMessageConfirmar('¿Estás seguro de que deseas activar a este alumno?');
    setShowConfirmacionPopup(true);
  };



  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };
  const desactivarAlumnoHandler = async () => {
    const response = await desactivarAlumno(token, currentAlumnoId);
  
    if (response.status === "SUCCESS") {
      // Actualiza el estado de los alumnos y los alumnos filtrados
      const updatedAlumnos = alumnos.map((alumno) => {
        if (alumno.id_alumno === currentAlumnoId) {
          return { ...alumno, estado_alumno: alumno.estado_alumno === "Activo" ? "Inactivo" : "Activo" };
        }
        return alumno;
      });
  
      // Asegurarse de que se actualicen tanto los alumnos como los filtrados
      setAlumnos(updatedAlumnos);
      setFilteredAlumnos(updatedAlumnos); // Esta línea asegura que los alumnos filtrados también se actualicen
    } else if(response.status === "LOGOUT"){
      setStatus("LOGOUT");
      setModalMessageError(response.message);
      setShowErrorPopup(true); 
    }else{
      setModalMessageError(response.message);
      setShowErrorPopup(true);
    }
    setShowConfirmacionPopup(false);
  };
  


  useEffect(() => {
    const fetchAlumnos = async () => {
    
      setLoading(true);
  
      const response = await listarAlumnos(token, institucionId, selectedMatriculaId);
  
      if (response.status === "SUCCESS") {
        setAlumnos(response.alumnos); 
        setFilteredAlumnos(response.alumnos);
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message); // Configura el mensaje de error
        setShowErrorPopup(true); // Muestra el popup de error
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setAlumnos([]); 
        setShowErrorPopup(true);
        setFilteredAlumnos([]);
      }
  
      setLoading(false);
    };
  
    if (selectedMatriculaId) {
    fetchAlumnos();
  } else {
    setAlumnos([]); 
    setFilteredAlumnos([]);
  }
  }, [token, institucionId, selectedMatriculaId]);

  // Aplicar filtros
  const aplicarFiltros = () => {
    let alumnosFiltrados = alumnos;
  
    if (filtroGrado) {
      alumnosFiltrados = alumnosFiltrados.filter(
        (alumno) => alumno.nombre_grado === filtroGrado
      );
    }
    if (filtroSeccion) {
      alumnosFiltrados = alumnosFiltrados.filter(
        (alumno) => alumno.nombre_seccion === filtroSeccion
      );
    }
    if (filtroEstado) {
      alumnosFiltrados = alumnosFiltrados.filter(
        (alumno) => alumno.estado_alumno === filtroEstado
      );
    }
    if (filtroNumeroDocumento) {
      alumnosFiltrados = alumnosFiltrados.filter(
        (alumno) => alumno.num_documento === filtroNumeroDocumento
      );
    }
  
    setFilteredAlumnos(alumnosFiltrados);
    setCurrentPage(1);
  };

  // Calcular los alumnos a mostrar
  const indexOfLastAlumno = currentPage * itemsPerPage;
  const indexOfFirstAlumno = indexOfLastAlumno - itemsPerPage;
  const currentAlumnos = filteredAlumnos.slice(indexOfFirstAlumno, indexOfLastAlumno);


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

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 6) {
        for (let i = 1; i <= 9; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
      } else if (currentPage >= totalPages - 5) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - 8; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      }
    }
    return pageNumbers;
  };

  const renderPageButtons = () => {
    const pageNumbers = getPageNumbers();

    return pageNumbers.map((number, index) => {
      if (number === "...") {
        return <span key={index} className="mx-1 text-xl text-[#4B7DBF]">. . .</span>;
      }
      return (
        <button
          key={index}
          onClick={() => handlePageChange(number)}
          className={`mx-1 px-4 py-2 rounded-lg ${number === currentPage ? "bg-[#5155A6] text-white" : "bg-[#4B7DBF] text-white"} hover:bg-blue-600`}
          
        >
          {number}
        </button>
      );
    });
  };
 

  const totalPages = Math.ceil(filteredAlumnos.length / itemsPerPage);

  return (
    <div className="flex-1 p-6">
      <header className="bg-[#4B7DBF] text-white rounded-lg flex items-center gap-4 p-4 mb-6">
        <FaUserGraduate className="text-5xl" />
        <h1 className="text-lg font-bold">Módulo: Gestión de Alumnos</h1>
      </header>

      <main className="bg-white py-2 px-4 rounded-lg shadow">
        <div className="h-[calc(92vh-160px)] flex flex-col justify-between">
          {view === "formulario" ? (
            <div className="overflow-auto mb-0 flex-1">
              <FormularioNuevoAlumno onBackToListado={handleBackToListado} />
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
                    value={filtroGrado}
                    onChange={(e) => setFiltroGrado(e.target.value)}
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
                    value={filtroSeccion}
                    onChange={(e) => setFiltroSeccion(e.target.value)}
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
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
               
                <div className="flex-1">
                  <label
                    htmlFor="filter-numero-documento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de Documento:
                  </label>
                  <input
                    id="filter-numero-documento"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    value={filtroNumeroDocumento}
                    onChange={(e) => setFiltroNumeroDocumento(e.target.value)}
                    placeholder="Ingrese número"
                  />
                </div>
                <div className="mt-6">
                  <button className="bg-[#5155A6] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={aplicarFiltros}>
                    Aplicar Filtros
                  </button>
                </div>
                <div className="mt-6">
                  <button
                    className="bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleAddAlumno}
                  >
                    Nuevo Alumno
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto mb-0">
              {loading ? (
                <div className="overflow-auto mb-0 flex-1">
                  <LoadingSpinner />
                </div>
                ) : currentAlumnos.length === 0 ? (
                  <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                ) : (
                <>
                  <table className=" w-full text-left border-collapse border border-gray-300">
                    <thead className="sticky top-[-1px]  bg-gray-100 shadow-md  ">
                      <tr className='mt-4'>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Nombre</th>
                      
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Grado</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Sección</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">N° Documento</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Estado</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className='h-7'>
                      {currentAlumnos.map((alumno) => (
                        <tr key={alumno.id_alumno}>
                          <td className="p-3 border-b text-start border-gray-300">
                            {alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno}
                          </td>
                          
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_grado}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_seccion}</td>
                          <td className="p-3 border-b text-center border-gray-300">{alumno.num_documento}</td>
                          <td className={`p-4 border-b text-center border-gray-300 ${alumno.estado_alumno === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}>
                            {alumno.estado_alumno}
                          </td>
                          <td className="p-2 border-b text-center border-gray-300">
                          <div className="flex space-x-4 justify-center">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            <FaEdit className="h-5 w-5" />
                            </button>

                            {alumno.estado_alumno === "Activo"? (
                              <button 
                                className={`px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600 `}
                                onClick={() => desactivarHandlerPopup(alumno.id_alumno)}
                              >
                                <FaLock className="h-5 w-5" />
                              </button>
                            ):(<button 
                              className={`px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600 `}
                              onClick={() => activarHandlerPopup(alumno.id_alumno)}
                            >
                              <FaUnlock className="h-5 w-5" />
                            </button>)}
                            
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                            <FaInfoCircle className="h-5 w-5" />
                            </button>
                            <button className="bg-violet-500 text-white px-[12px]  py-2 rounded-lg hover:bg-violet-600">
                            <FaUsers className="h-5 w-5" />
                            </button>
                          </div>


                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                </>
              )}
              {showConfirmacionPopup && (
                      <PopupConfirmacion 
                        message={modalMessageConfirmacion}
                        onConfirm={desactivarAlumnoHandler}
                        onCancel={handleCancel}
                        titulo={tituloModal}
                      />
                    )}
            </div>

            {/* Botones de Paginación */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={handlePrevPage}
                className={`bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              <div className="mx-1 flex justify-center gap-2">
                      {renderPageButtons()}
                    </div>

              <button
                onClick={handleNextPage}
                className={`bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
              
              {showErrorPopup && (
                <PopupErrorRegister 
                  message={modalMessageError} 
                  onClose={handleClosePopupError} 
                />
              )}

            </>
          )}
        </div>
        
      </main>
    </div>
  );
};

export default ContenidoAlumnos;
