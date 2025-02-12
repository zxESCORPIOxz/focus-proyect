import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaEdit, FaLock, FaUnlock, FaInfoCircle,FaUsers, FaChalkboardTeacher, FaBook } from 'react-icons/fa';
import FormularioNuevoAlumno from '../Alumno/FormularioNuevoAlumno';

import LoadingSpinner from '../LoadingSpinner';
import PopupErrorRegister from '../../Popups/RegistroError';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useRolContext } from '../../context/RolContext';
import e from 'cors';
import { desactivarAlumno } from '../../lib/apiDesactivarAlumno';
import PopupConfirmacion from '../../Popups/Confirmacion';

import { Tooltip } from 'react-tooltip';
import { useAlumnoContext } from '../../context/AlumnoContext';
import EditarAlumno from '../Alumno/EditarAlumno';
import DetalleAlumno from '../Alumno/DetalleAlumno';
import FormularioNuevoDocente from '../docente/FormularioNuevoDocente';
import { listarDocentes } from '../../lib/apiListarDocentes';
import EditarDocente from '../docente/EditarDocente';
import DetalleDocente from '../docente/DetalleDocente';
import { desactivarDocente } from '../../lib/apiDesactivarDocente';
import { useDocenteContext } from '../../context/DocenteContext';

const ContenidoDocentes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState("listado"); 
  const { clearAuth,token } = useAuthContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const { institucionId,selectedMatriculaId } = useRolContext();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");

  const [showConfirmacionPopup, setShowConfirmacionPopup] = useState(false);
  const [modalMessageConfirmacion, setModalMessageConfirmar] = useState("");
  const [tituloModal, setTituloModal] = useState("");
  const [currentDocenteId, setCurrentDocenteId] = useState(null);
  
  const [filtroNumeroDocumento, setFiltroNumeroDocumento] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  //PAGINACION
  const itemsPerPage = 11; // Elementos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [selectedAlumno, setSelectedAlumno] = useState([]);
  const [selectedApoderado, setSelectedApoderado] = useState(null);

  const { guardarDocenteSeleccionado,docenteSeleccionado } = useDocenteContext();

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

  


  const handleCancel = () => {
    // Cierra el popup sin hacer cambios
    setShowConfirmacionPopup(false);
  };

  const desactivarHandlerPopup = async (id_docente) => {
    // Muestra el popup de confirmación
    setCurrentDocenteId(id_docente);
    setModalMessageConfirmar('¿Estás seguro de que deseas desactivar a este docente?');
    setTituloModal("Desactivar")
    setShowConfirmacionPopup(true);
  };

  const activarHandlerPopup = async (id_docente) => {
    // Muestra el popup de confirmación
    setCurrentDocenteId(id_docente);
    setTituloModal("Activar")
    setModalMessageConfirmar('¿Estás seguro de que deseas activar a este docente?');
    setShowConfirmacionPopup(true);
  };



  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };
  // console.log(currentDocenteId)
  const desactivarDocenteHandler = async () => {
    const response = await desactivarDocente(token, currentDocenteId);
  
    if (response.status === "SUCCESS") {
      // Actualiza el estado de los alumnos y los alumnos filtrados
      const updatedDocentes = docentes.map((docente) => {
        if (docente.id_docente === currentDocenteId) {
          return { ...docente, estado: docente.estado === "Activo" ? "Inactivo" : "Activo" };
        }
        return docente;
      });
  
      // Asegurarse de que se actualicen tanto los alumnos como los filtrados
      setDocentes(updatedDocentes);
      setFilteredDocentes(updatedDocentes); // Esta línea asegura que los alumnos filtrados también se actualicen
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
  
  const fetchDocentes = async () => {
    setLoading(true); // Activa el indicador de carga
  
    try {
      const response = await listarDocentes(token, institucionId); // Reemplaza con tu lógica de API
  
      if (response.status === "SUCCESS") {
        setDocentes(response.docentes);
        setFilteredDocentes(response.docentes);
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message); // Configura el mensaje de error
        setShowErrorPopup(true); // Muestra el popup de error
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setDocentes([]);
        setFilteredDocentes([]);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error al listar docentes:", error);
      setModalMessageError("Ocurrió un error inesperado.");
      setDocentes([]);
      setFilteredDocentes([]);
      setShowErrorPopup(true);
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };
  
  // Llama a `fetchDocentes` cuando el componente se monte
  useEffect(() => {
    if (selectedMatriculaId) {
      fetchDocentes();
    } else {
      setDocentes([]);
      setFilteredDocentes([]);
    }
  }, [token, institucionId, selectedMatriculaId]);

  // Aplicar filtros
  const aplicarFiltros = () => {
    let docentesFiltrados = docentes;
  
    
    if (filtroEstado) {
      docentesFiltrados = docentesFiltrados.filter(
        (docente) => docente.estado === filtroEstado
      );
    }
    if (filtroNumeroDocumento) {
      docentesFiltrados = docentesFiltrados.filter(
        (docente) => docente.num_documento === filtroNumeroDocumento
      );
    }
  
    setFilteredDocentes(docentesFiltrados);
    setCurrentPage(1);
  };

  // Calcular los alumnos a mostrar
  const indexOfLastDocentes = currentPage * itemsPerPage;
  const indexOfFirstDocentes= indexOfLastDocentes - itemsPerPage;
  const currentDocentes = filteredDocentes.slice(indexOfFirstDocentes, indexOfLastDocentes);

  


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
      if (currentPage <= 3) {  
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {  
        pageNumbers.push(1, "...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {  
        pageNumbers.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
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
        return <span key={index} className="mx-1 text-sm sm:text-xl text-[#4B7DBF]">. . . </span>;
      }
      return (
        <button
          key={index}
          onClick={() => handlePageChange(number)}
          className={`mx-0 md:mx-1 px-2 py-1 text-xs md:px-4 md:py-1 sm:text-base rounded-lg 
            ${number === currentPage ? "bg-[#5155A6] text-white" : "bg-[#4B7DBF] text-white"} 
            hover:bg-blue-600`}
          
        >
          {number}
        </button>
      );
    });
  };
 

  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);


  const handleBackToListado = () => {
    guardarDocenteSeleccionado(""); 
    setView("listado")           
                                                                                                 
  };
  const handleAddDocente = () => setView("formulario");

  
  const handleDetalleDocente = (docenteSeleccionado) => {
    guardarDocenteSeleccionado(docenteSeleccionado); 
    setView("detalle")           
                                                                                                 
  };

  const handleEditarDocente = (docenteSeleccionado) => {
    guardarDocenteSeleccionado(docenteSeleccionado); 
    setView("editar")                                                                                                         
  };

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };
  const handleSuccess = () => {
    guardarDocenteSeleccionado(""); 
    fetchDocentes();
    setView("listado") 
  };

  return (
    <div className="flex-1 mt-7 md:p-6 md:mt-0">
      <header className="bg-[#4B7DBF] sd:mx-2  text-white rounded-lg flex items-center gap-4 p-4 mb-6">
        <FaChalkboardTeacher className="text-3xl sm:text-5xl" />
        <h1 className="text-lg sm:text-xl font-bold">Módulo: Gestión de Docentes</h1>
      </header>

      <main className="sd:h-screen sd:w-screen mx-2   bg-white py-2 px-4 rounded-lg shadow">
        <div className="sd:h-full  md:h-[calc(92vh-160px)] flex flex-col justify-between">
          {view === "formulario" ? (
            <div className="overflow-auto mb-0 flex-1">
              <FormularioNuevoDocente onBackToListado={handleBackToListado} />
            </div>
          ) : view === "editar" ? (
            <div className="overflow-auto mb-0 flex-1">
              <EditarDocente
              onBackToListado={handleBackToListado}               
              onFormValidation={handleFormValidation}
              onSuccess={handleSuccess}/>
            </div>
          ) : view === "detalle" ? (
            <div className="overflow-auto mb-0 flex-1">
              <DetalleDocente onBackToListado={handleBackToListado}/>
            </div>
            
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <div className='flex flex-row justify-between md:mt-6'>
                <div className="md:mx-2">
                  <button className="bg-[#5155A6] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={aplicarFiltros}>
                    Aplicar Filtros
                  </button>
                </div>
                <div className="md:mt-0">
                  <button
                    className="bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleAddDocente}
                  >
                    Nuevo Docente
                  </button>
                </div>
                </div>
                
              </div>

              <div className="flex-1 overflow-auto mb-0">
              {loading ? (
                <div className="overflow-auto mb-0 flex-1">
                  <LoadingSpinner />
                </div>
                ) : currentDocentes.length === 0 ? (
                  <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                ) : (
                <>
                <div className="hidden md:block">
                <table className=" w-full text-left border-collapse border border-gray-300">
                    <thead className="sticky top-[-1px]  bg-gray-100 shadow-md z-10 ">
                      <tr className='mt-4'>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Nombre</th>
                      
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Especialidad</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Cursos</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">N° Documento</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Estado</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className='h-7'>
                      {currentDocentes.map((docente) => (
                        <tr key={docente.id_docente}>
                          <td className="p-3 border-b text-start border-gray-300">
                            {docente.nombre + " " + docente.apellido_paterno }
                          </td>
                          
                          <td className="p-3 border-b text-center border-gray-300">{docente.especialidad}</td>
                          {/* Select para Cursos */}
                          <td className="p-3 border-b text-center border-gray-300">
                            {docente.cursos.length > 0 ? (
                              <select
                                className="border border-gray-300 rounded-lg p-2 w-48" // Añade w-48 para un ancho fijo
                                defaultValue="" // Valor predeterminado
                              >
                                
                                {docente.cursos.map((curso) => (
                                  <option key={curso.id_curso} value={curso.id_curso}>
                                    {curso.nombre_curso}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-500 italic">No tiene cursos asignados</span>
                            )}
                          </td>
                          <td className="p-3 border-b text-center border-gray-300">{docente.num_documento}</td>
                          <td className={`p-4 border-b text-center border-gray-300 ${docente.estado === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}>
                            {docente.estado}
                          </td>
                          <td className="p-2 border-b text-center border-gray-300">
                          <div className="flex space-x-4 justify-center">
                              {/* Botón Editar Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                  onClick={() => {
                                    handleEditarDocente(docente)
                                  }}
                                >
                                  <FaEdit className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Editar
                                </span>
                              </div>

                              {/* Botón Activar/Desactivar Alumno */}
                              <div className="relative group">
                                {docente.estado === "Activo" ? (
                                  <button
                                    className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600"
                                    onClick={() => desactivarHandlerPopup(docente.id_docente)}
                                  >
                                    <FaLock className="h-5 w-5" />
                                  </button>
                                ) : (
                                  <button
                                    className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600"
                                    onClick={() => activarHandlerPopup(docente.id_docente)}
                                  >
                                    <FaUnlock className="h-5 w-5" />
                                  </button>
                                )}
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  {docente.estado === "Activo" ? "Desactivar" : "Activar"}
                                </span>
                              </div>

                              {/* Botón Detalle Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  onClick={() => {
                                    handleDetalleDocente(docente)
                                  }}
                                >
                                  <FaInfoCircle className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ver Detalles
                                </span>
                              </div>

                              {/* Botón Grupos */}
                              <div className="relative group">
                                <button className="bg-violet-500 text-white px-[12px] py-2 rounded-lg hover:bg-violet-600">
                                  <FaBook className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Asignar Cursos
                                </span>
                              </div>
                            </div>



                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                </div>
                <div className="md:hidden w-full h-full transition-all duration-300 ease-in-out ">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {currentDocentes.map((docente) => (
                          <div key={docente.id_docente} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{docente.nombre+ " " + docente.apellido_paterno + " " + docente.apellido_materno}</h2>
                            <p className="text-sm text-gray-600">Especialidad: {docente.especialidad}</p>
                            <p className="text-sm text-gray-600">
                              Cursos:{" "}
                              {docente.cursos.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {docente.cursos.map((curso) => (
                                    <li key={curso.id_curso}>{curso.nombre_curso}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500 italic">No tiene cursos asignados</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">N° Documento: {docente.num_documento}</p>
                            <p
                              className={`mt-2 text-sm font-bold ${docente.estado === "Activo" ? "text-green-600" : "text-red-600"}`}
                            >
                              {docente.estado}
                            </p>
                            <div className="mt-4 flex justify-between">
                            <div className="flex space-x-4 justify-center">
                                {/* Botón Editar Alumno */}
                                <div className="relative group">
                                  <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => {
                                      handleEditarDocente(docente)
                                    }}
                                  >
                                    <FaEdit className="h-5 w-5" />
                                  </button>
                                  <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    Editar
                                  </span>
                                </div>
  
                                {/* Botón Activar/Desactivar Alumno */}
                                <div className="relative group">
                                  {docente.estado === "Activo" ? (
                                    <button
                                      className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600"
                                      onClick={() => desactivarHandlerPopup(docente.id_docente)}
                                    >
                                      <FaLock className="h-5 w-5" />
                                    </button>
                                  ) : (
                                    <button
                                      className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600"
                                      onClick={() => activarHandlerPopup(docente.id_docente)}
                                    >
                                      <FaUnlock className="h-5 w-5" />
                                    </button>
                                  )}
                                  <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    {docente.estado === "Activo" ? "Desactivar" : "Activar"}
                                  </span>
                                </div>
  
                                {/* Botón Detalle Alumno */}
                                <div className="relative group">
                                  <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                    onClick={() => {
                                      handleDetalleDocente(docente)
                                    }}
                                  >
                                    <FaInfoCircle className="h-5 w-5" />
                                  </button>
                                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver Detalles
                                  </span>
                                </div>
  
                                {/* Botón Grupos */}
                              <div className="relative group">
                                <button className="bg-violet-500 text-white px-[12px] py-2 rounded-lg hover:bg-violet-600">
                                  <FaBook className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Asignar Cursos
                                </span>
                              </div>
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </>
              )}
              {showConfirmacionPopup && (
                      <PopupConfirmacion 
                        message={modalMessageConfirmacion}
                        onConfirm={desactivarDocenteHandler}
                        onCancel={handleCancel}
                        titulo={tituloModal}
                      />
                    )}
            </div>

            {filteredDocentes.length > itemsPerPage && (
            <div className="flex flex-wrap justify-center items-center mt-4 gap-2 sm:gap-3">
              <button
                onClick={handlePrevPage}
                className={`bg-[#4B7DBF] text-white text-sm sm:text-base px-2 md:px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed ' : ''}`}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              <div className="mx-0 flex flex-wrap justify-center md:gap-2 gap-0">
                {renderPageButtons()}
              </div>

              <button
                onClick={handleNextPage}
                className={`bg-[#4B7DBF] text-white text-sm sm:text-base px-2 md:px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
            )}
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

export default ContenidoDocentes;
