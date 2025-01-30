import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaEdit, FaLock, FaUnlock, FaInfoCircle,FaUsers } from 'react-icons/fa';
import FormularioNuevoAlumno from '../Alumno/FormularioNuevoAlumno';
import { listarAlumnos } from '../../lib/apiListarAlumnos';
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
import { listarCursos } from '../../lib/apiListarCursos';

import ListarAlumnosCurso from '../Curso/ListarAlumnosCurso';
import { useCursoContext } from '../../context/CursoContext';
import ListarAlumnosAsistencia from '../Asistencia/ListarAlumnosAsistencia';

const ContenidoAsistencia = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState("listado"); 
  const { clearAuth,token } = useAuthContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const { institucionId,selectedMatriculaId,idRolSeleccionado } = useRolContext();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");
  const { guardarCursoSeleccionado } = useCursoContext();
  const [showConfirmacionPopup, setShowConfirmacionPopup] = useState(false);
  const [modalMessageConfirmacion, setModalMessageConfirmar] = useState("");
  const [tituloModal, setTituloModal] = useState("");
  const [currentAlumnoId, setCurrentAlumnoId] = useState(null);
  
  // const [filtroNumeroDocumento, setFiltroNumeroDocumento] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  //PAGINACION
  const itemsPerPage = 10; // Elementos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [grados, setGrados] = useState([]);
  const [nivel, setNiveles] = useState([]);
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [selectedAlumno, setSelectedAlumno] = useState([]);
  const [selectedApoderado, setSelectedApoderado] = useState(null);

  const { guardarAlumnoSeleccionado } = useAlumnoContext();
  

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 




  const handleCancel = () => {
    // Cierra el popup sin hacer cambios
    setShowConfirmacionPopup(false);
  };

  const desactivarHandlerPopup = async (id_curso) => {
    // Muestra el popup de confirmación
    setCurrentAlumnoId(id_curso);
    setModalMessageConfirmar('¿Estás seguro de que deseas desactivar a este curso?');
    setTituloModal("Desactivar")
    setShowConfirmacionPopup(true);
  };

  const activarHandlerPopup = async (id_curso) => {
    // Muestra el popup de confirmación
    setCurrentAlumnoId(id_curso);
    setTituloModal("Activar")
    setModalMessageConfirmar('¿Estás seguro de que deseas activar a este curso?');
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
      // Actualiza el estado de los cursos y los cursos filtrados
      const updatedAlumnos = cursos.map((curso) => {
        if (curso.id_curso === currentAlumnoId) {
          return { ...curso, estado_curso: curso.estado_curso === "Activo" ? "Inactivo" : "Activo" };
        }
        return curso;
      });
  
      // Asegurarse de que se actualicen tanto los cursos como los filtrados
      setCursos(updatedAlumnos);
      setFilteredCursos(updatedAlumnos); // Esta línea asegura que los cursos filtrados también se actualicen
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
  


  const fetchC = async () => {
    setLoading(true); // Muestra el indicador de carga
  
    try {
      const response = await listarCursos(token, idRolSeleccionado); // Llama a la API
  
      if (response.status === "SUCCESS") {
        const cursosData = response.cursos;

        // Extraer valores únicos de grado y sección
        const uniqueGrados = [...new Set(cursosData.map((curso) => curso.nombre_grado))];
        const uniqueSecciones = [...new Set(cursosData.map((curso) => curso.nombre_nivel))];
        setCursos(cursosData);
        setFilteredCursos(cursosData);
        setGrados(uniqueGrados);
        setNiveles(uniqueSecciones); // Filtra los cursos en base a los datos obtenidos
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message); // Configura el mensaje de error
        setShowErrorPopup(true); // Muestra el popup de error
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setCursos([]);
        setFilteredCursos([]);
        setShowErrorPopup(true);
        setGrados([]);
        setNiveles([]); // Muestra el popup de error
      }
    } catch (error) {
      console.error("Error al listar cursos:", error);
      setModalMessageError("Ocurrió un error inesperado."); // Mensaje genérico de error
      setCursos([]);
      setFilteredCursos([]);
      setShowErrorPopup(true);
    } finally {
      setLoading(false); // Oculta el indicador de carga
    }
  };
  useEffect(() => {
    if (selectedMatriculaId) {
      fetchC(); // Obtén los cursos si hay un `selectedMatriculaId`
    } else {
      setCursos([]); 
      setFilteredCursos([]); // Limpia los cursos si no hay `selectedMatriculaId`
    }
  }, [token, institucionId, selectedMatriculaId]);

  // Aplicar filtros
  const aplicarFiltros = () => {
    let cursosFiltrados = cursos;
  
    if (filtroGrado) {
      cursosFiltrados = cursosFiltrados.filter(
        (curso) => curso.nombre_grado === filtroGrado
      );
    }
    if (filtroNivel) {
      cursosFiltrados = cursosFiltrados.filter(
        (curso) => curso.nombre_nivel === filtroNivel
      );
    }
    if (filtroEstado) {
      cursosFiltrados = cursosFiltrados.filter(
        (curso) => curso.estado_curso === filtroEstado
      );
    }
    
  
    setFilteredCursos(cursosFiltrados);
    setCurrentPage(1);
  };

  // Calcular los cursos a mostrar
  const indexOfLastCurso = currentPage * itemsPerPage;
  const indexOfFirstCurso = indexOfLastCurso - itemsPerPage;
  const currentCursos = filteredCursos.slice(indexOfFirstCurso, indexOfLastCurso);


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
 

  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);


  const handleBackToListado = () => {
    guardarAlumnoSeleccionado(""); 
    setView("listado")           
                                                                                                 
  };
  const handleAddCurso = () => setView("formulario");

  
  const handleDetalleAlumno = (cursoSeleccionado) => {
    guardarAlumnoSeleccionado(cursoSeleccionado); 
    setView("detalle")           
                                                                                                 
  };

  const handleListarAlumnos = (curso) => {
    guardarCursoSeleccionado(curso); 
    setView("listarAlumnos")                                                 
  };

  const handleEditarAlumno = (cursoSeleccionado) => {
    guardarAlumnoSeleccionado(cursoSeleccionado); 
    setView("editar")                                                 
  };

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };
  const handleSuccess = () => {
    guardarAlumnoSeleccionado(""); 
    fetchC();
    setView("listado") 
  };

  

  return (
    <div className="flex-1  mt-7 md:p-6 md:mt-0">
      <header className="bg-[#4B7DBF] text-white rounded-lg flex items-center gap-4 p-4 mb-6">
        <FaUserGraduate className="text-3xl sm:text-5xl" />
        <h1 className="text-lg sm:text-xl font-bold">Módulo: Asistencia</h1>
      </header>

      <main className="sd:h-screen  bg-white py-2 px-4 rounded-lg shadow">
        <div className="sd:h-full md:h-[calc(92vh-160px)] flex flex-col justify-between">
          {view === "listarAlumnos" ? (
            <div className="overflow-auto mb-0 flex-1">
              <ListarAlumnosAsistencia onBackToListado={handleBackToListado} />

              
            </div>
          )  : view === "detalle" ? (
            <div className="overflow-auto mb-0 flex-1">
              <DetalleAlumno onBackToListado={handleBackToListado}/>
            </div>
            
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                    {grados.map((grado, index) => (
                      <option key={index} value={grado}>
                        {grado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="filter-nivel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nivel:
                  </label>
                  <select
                    id="filter-nivel"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {nivel.map((nivel, index) => (
                      <option key={index} value={nivel}>
                        {nivel}
                      </option>
                    ))}
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

                
                <div className='flex flex-row justify-between md:mt-6'>
                  <div className="md:mx-2 ">
                    <button
                      className="bg-[#5155A6] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={aplicarFiltros}
                    >
                      Aplicar Filtros
                    </button>
                  </div>

                  
                </div>

                
              </div>


              <div className="flex-1 overflow-auto mb-0">
              {loading ? (
                <div className="overflow-auto mb-0 flex-1 relative">
                  
                  <LoadingSpinner />
                
                </div>
              
              
                ) : currentCursos.length === 0 ? (
                  <p className="text-center text-gray-500">No existen cursos para listar.</p>
                ) : (
                <>
                <div className="hidden md:block">
                <table className=" w-full text-left border-collapse border border-gray-300">
                    <thead className="sticky top-[-1px]  bg-gray-100 shadow-md z-10 ">
                      <tr className='mt-4'>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Nombre</th>
                      
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Grado</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Secciones</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Nivel</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Numero Alumnos</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Estado</th>
                      <th className="p-3 h-12 border-b border-gray-300 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className='h-7'>
                      {currentCursos.map((curso) => (
                        <tr key={curso.id_curso}>
                          <td className="p-3 border-b text-start border-gray-300">
                            {curso.nombre_curso}
                          </td>
                          
                          <td className="p-3 border-b text-center border-gray-300">{curso.nombre_grado}</td>
                          <td className="p-3 border-b text-center border-gray-300">{curso.secciones}</td>
                          <td className="p-3 border-b text-center border-gray-300">{curso.nombre_nivel}</td>
                          <td className="p-3 border-b text-center border-gray-300">{curso.numero_alumnos}</td>
                          <td className={`p-4 border-b text-center border-gray-300 ${curso.estado_curso === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}>
                            {curso.estado_curso}
                          </td>
                          <td className="p-2 border-b text-center border-gray-300">
                          <div className="flex space-x-4 justify-center">
                              {/* Botón Editar Alumno */}
                              <div className="relative group">
                                <button className="bg-violet-500 text-white px-[12px] py-2 rounded-lg hover:bg-violet-600"
                                onClick={() => {
                                  handleListarAlumnos(curso)
                                }}
                                >
                                  <FaUsers className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Alumnos
                                </span>
                              </div>
                              

                              

                              {/* Botón Detalle Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  onClick={() => {
                                    handleDetalleAlumno(curso)
                                  }}
                                >
                                  <FaInfoCircle className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ver Detalles
                                </span>
                              </div>

                              {/* Botón Grupos */}
                              
                            </div>



                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                </div>
          <div className="md:hidden w-full h-full transition-all duration-300 ease-in-out ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentCursos.map((curso) => (
                <div key={curso.id_curso} className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold">{curso.nombre_curso}</h2>
                  <p className="text-sm text-gray-600">Grado: {curso.nombre_grado}</p>
                  <p className="text-sm text-gray-600">Secciones: {curso.secciones}</p>
                  <p className="text-sm text-gray-600">Nivel: {curso.nombre_nivel}</p>
                  <p
                    className={`mt-2 text-sm font-bold ${curso.estado_curso === "Activo" ? "text-green-600" : "text-red-600"}`}
                  >
                    {curso.estado_curso}
                  </p>
                  <div className="mt-4 flex justify-between">
                  <div className="flex space-x-4 justify-center">
                  <div className="relative group">
                                <button className="bg-violet-500 text-white px-[12px] py-2 rounded-lg hover:bg-violet-600"
                                onClick={() => {
                                  handleListarAlumnos(curso)
                                }}
                                >
                                  <FaUsers className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Alumnos
                                </span>
                              </div>
                            </div>
                              

                              
                              {/* Botón Detalle Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  onClick={() => {
                                    handleDetalleAlumno(curso)
                                  }}
                                >
                                  <FaInfoCircle className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ver Detalles
                                </span>
                              </div>

                              {/* Botón Grupos */}
                             
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

export default ContenidoAsistencia;
