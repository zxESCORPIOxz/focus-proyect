import React, { useEffect, useState } from 'react'; 
import { FaUserGraduate, FaEdit, FaLock, FaUnlock } from 'react-icons/fa'; 
import { listarAlumnosNotas } from '../../../lib/apiListarAlumnosNotas'; 
import LoadingSpinner from '../../LoadingSpinner'; 
import PopupErrorRegister from '../../../Popups/RegistroError'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuthContext } from '../../../context/AuthContext'; 
import { useRolContext } from '../../../context/RolContext'; 
import { desactivarAlumno } from '../../../lib/apiDesactivarAlumno'; 
import PopupConfirmacion from '../../../Popups/Confirmacion'; 
import { editarNota } from '../../../lib/apiEditarNotas';
import PopupSuccesGeneral from '../../../Popups/SuccesGeneral';
import { useCursoContext } from '../../../context/CursoContext';
import { listarAlumnosAsistencia } from '../../../lib/apiListarAlumnosAsistencia';
import { crearRegitroAsistencia } from '../../../lib/apiCrearRegistroAsistencia';
import { guardarAsistencia } from '../../../lib/apiGuardarAsistencia';

const ListarAlumnosAsistencia = ({onBackToListado}) => { 



    const getFechaHoyAPI = () => {
        const today = new Date();
        today.setDate(today.getDate()); // Resta un día
        return today.toISOString().split("T")[0] ; // Formato YYYY-MM-DD HH:MM:SS
    };

    const fechaHoyAPI= getFechaHoyAPI();

    const getFechaHoy= () => {
        const today = new Date();
        today.setDate(today.getDate() ); // Resta un día
        return today.toISOString().split("T")[0] + " " + today.toTimeString().split(" ")[0]; // Formato YYYY-MM-DD HH:MM:SS
    };

    const fechaHoy = getFechaHoy();

  //PAGINACION
  const itemsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  const [alumnos, setAlumnos] = useState([]); 
  const [filteredAlumnos, setFilteredAlumnos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [view, setView] = useState("listado"); 
  const [showErrorPopup, setShowErrorPopup] = useState(false); 
  const [modalMessageError, setModalMessageError] = useState(''); 
  const [showConfirmacionPopup, setShowConfirmacionPopup] = useState(false); 
  const [modalMessageConfirmacion, setModalMessageConfirmar] = useState(''); 
  const [tituloModal, setTituloModal] = useState(''); 
  const [currentAlumnoId, setCurrentAlumnoId] = useState(null); 
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopupSucces, setShowPopupSucces] = useState(false);
  const { clearAuth,token } = useAuthContext(); 
  const { cursoSeleccionado } = useCursoContext(); 

  

  const [fechaActual, setFechaActual] = useState(fechaHoy);
  const [fechaActualAPI, setFechaActualAPI] = useState(fechaHoyAPI);

  const [mensajeError, setMensajeError] = useState('');
  const [mensaje, setMensaje] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);

  const navigate = useNavigate(); 
  const { institucionId } = useRolContext(); 
  const [status, setStatus] = useState("");
  const [filtroNumeroDocumento, setFiltroNumeroDocumento] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    });



  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };




  const fetchAlumnos = async () => { 
    setLoading(true); 
    try { 
      const id_curso = cursoSeleccionado.id_curso; 
      const response = await listarAlumnosAsistencia(token, id_curso,fechaActualAPI); 
      if (response.status === 'SUCCESS') { 
        const alumnosData = response.alumnos; 
        setAlumnos(alumnosData); 
        setFilteredAlumnos(alumnosData);
        setMensajeError("") 
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setMensajeError(response.message)
        setShowCreateButton(true);
        setAlumnos([]);
        setFilteredAlumnos([]);
        setShowErrorPopup(true);
      }
    } catch (error) { 
      console.error('Error al listar alumnos:', error); 
      setModalMessageError('Ocurrió un error inesperado.'); 
      setAlumnos([]);
      setFilteredAlumnos([]);
      setShowErrorPopup(true); 
    } finally { 
      setLoading(false); 
    } 
  };
  useEffect(() => {
    if (fechaActualAPI) {
      fetchAlumnos(); 
    }
  }, [fechaActualAPI]);

  useEffect(() => {
    aplicarFiltros();
  }, []);

 

  useEffect(() => {
    if (modalMessageError) {
      setShowErrorPopup(true);
    }
  }, [modalMessageError]);



  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let alumnosFiltrados = alumnos;
    
    if (filtroNumeroDocumento) {
      alumnosFiltrados = alumnosFiltrados.filter(
        (alumno) => alumno.num_documento === filtroNumeroDocumento
      );
    }
 
    setFilteredAlumnos(alumnosFiltrados);
    setCurrentPage(1);
    // fetchAlumnos();
  };

  // Calcular los alumnos a mostrar
  const indexOfLastAlumno = currentPage * itemsPerPage;
  const indexOfFirstAlumno = indexOfLastAlumno - itemsPerPage;
  const currentAlumnos = filteredAlumnos.slice(indexOfFirstAlumno, indexOfLastAlumno);
  
  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); 
      navigate("/login"); 
    }
    
  };

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
 

  const totalPages = Math.ceil(filteredAlumnos.length / itemsPerPage);


  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };

  const actualizarListaAlumnos = () => {
    fetchAlumnos();
  };


  const handleCrearRegistroAsistencia  = async () => { 
    const today = new Date();
    today.setDate(today.getDate());
    const hora = today.toTimeString().split(" ")[0];
    const fechaHora =`${fechaActualAPI} ${hora}`

    setLoading(true); 
    try { 
      const id_curso = cursoSeleccionado.id_curso; 
      const response = await crearRegitroAsistencia(token, id_curso,fechaHora); 
      if (response.status === 'SUCCESS') { 
        setShowPopupSucces(true);
        setSuccessMessage(response.message)
        actualizarListaAlumnos();
        setTimeout(() => {
          setShowPopupSucces(false);
        }, 2500);
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      }
    } catch (error) { 
      console.error('Error al listar alumnos:', error); 
      setModalMessageError('Ocurrió un error inesperado.'); 
      setAlumnos([]);
      setFilteredAlumnos([]);
      setShowErrorPopup(true); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handleEstadoChange = (idAlumno, nuevoEstado) => {
    // Actualizar solo el estado de asistencia de un alumno sin modificar los demás campos
    const alumnosActualizados = filteredAlumnos.map((alumno) => {
        if (alumno.id_alumno === idAlumno) {
            return {
                ...alumno, // Mantén los demás campos sin cambios
                estado_asistencia: nuevoEstado, // Solo cambia el estado de asistencia
            };
        }
        return alumno; // Si no es el alumno que estamos actualizando, retorna sin cambios
    });

    setFilteredAlumnos(alumnosActualizados); // Actualiza el estado
};

const handleObservacionChange = (id_alumno, nuevaObservacion) => {
    // Actualizar solo la observación de un alumno sin modificar los demás campos
    const alumnosActualizados = filteredAlumnos.map((alumno) => {
        if (alumno.id_alumno === id_alumno) {
            return {
                ...alumno, // Mantén los demás campos sin cambios
                observaciones: nuevaObservacion, // Solo cambia la observación
            };
        }
        return alumno; // Si no es el alumno que estamos actualizando, retorna sin cambios
    });

    setFilteredAlumnos(alumnosActualizados); // Actualiza el estado
};
const asistencias1 = filteredAlumnos
        .filter((alumno) => alumno.estado_asistencia !== alumno.estado_asistencia_original || alumno.observaciones !== alumno.observaciones_original) // Compara con el valor original
        .map((alumno) => ({
            id_asistencia: alumno.id_asistencia,
            estado: alumno.estado_asistencia,
            observaciones: alumno.observaciones,
        }));

const handleGuardarAsistencias = async () => {
    // Filtrar solo los alumnos que tienen cambios en el estado o en las observaciones
    const asistencias = filteredAlumnos
        .filter((alumno) => alumno.estado_asistencia !== alumno.estado_asistencia_original || alumno.observaciones !== alumno.observaciones_original) // Compara con el valor original
        .map((alumno) => ({
            id_asistencia: alumno.id_asistencia,
            estado: alumno.estado_asistencia,
            observaciones: alumno.observaciones,
        }));
    
    if (asistencias.length > 0) {
        try {
            const response = await guardarAsistencia(token, asistencias);
            if (response && response.status === "SUCCESS") {
                setShowPopupSucces(true);
                setSuccessMessage(response.message);
                actualizarListaAlumnos();
                setTimeout(() => {
                    setShowPopupSucces(false);
                }, 2500);
            } else if (response.status === "LOGOUT") {
                setStatus("LOGOUT");
                setModalMessageError(response.message);
                setShowErrorPopup(true);
            } else if (response.status === "FAILED") {
                setModalMessageError(response.message);
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
        }
    } else {
        setModalMessageError("No se detectaron cambios en las asistencias.");
        setShowErrorPopup(true);
    }
};


  const handleSuccess = () => {
    guardarAlumnoSeleccionado(""); 
    fetchAlumnos();
    setView("listado") 
  };


  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-3 w-full ">
      <div className='flex justify-between items-center mx-2 '>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Asistencia de Alumnos</h1>
          <button
              type="button"
              onClick={onBackToListado}
              className="py-2 px-6 mr-1 mt-0 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Regresar
          </button>
        </div>
        <main className="sd:h-screen sd:w-screen mx-2   bg-white py-2 px-4 rounded-lg shadow">
          <div className="sd:h-full md:h-[calc(92vh-160px)] flex flex-col justify-between">
            
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                    <label
                      htmlFor="filter-fecha"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fecha de Asistencia:
                    </label>
                    <input
                    id="filter-fecha"
                    type="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    value={fechaActualAPI}
                    onChange={(e) => setFechaActualAPI(e.target.value)} // Aquí actualizamos el valor de fecha
                    />
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
                
                
                ): currentAlumnos.length === 0 ? (
                  <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                )  : mensajeError ? (
                    <div className="flex flex-col items-center space-y-4">
                    {/* Mensaje de error en la parte superior */}
                    <p className="text-red-500">{mensajeError}</p>

                    {/* Botón centrado */}
                    {showCreateButton && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleCrearRegistroAsistencia}
                                className="bg-blue-500 mt-11 text-white py-2 px-4 rounded-lg"
                            >
                                Crear Registro
                            </button>
                        </div>
                    )}
                    </div>
                ) : (
                  <>
                  <div>
                    {currentAlumnos.map((alumno) => (
                      <div key={alumno.id_alumno} className="p-4 border-b">
                        <div className="flex justify-between mb-2 items-center">
                          <span className='font-bold'>{alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno}</span>
                          <select
                            value={alumno.estado_asistencia}
                            onChange={(e) => handleEstadoChange(alumno.id_alumno, e.target.value)} // Llama a handleEstadoChange
                            className="p-2 border rounded"
                          >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="PRESENTE">PRESENTE</option>
                            <option value="TARDANZA">TARDANZA</option>
                            <option value="AUSENTE">AUSENTE</option>
                            <option value="JUSTIFICADO">JUSTIFICADO</option>
                          </select>
                        </div>
                
                        {/* Sección de observaciones */}
                        <div>
                        <input
                          type="text"
                          value={alumno.observaciones || ''}
                          onChange={(e) => handleObservacionChange(alumno.id_alumno, e.target.value)} // Llama a la función de cambio
                          className="p-2 border rounded w-full"
                          placeholder="Agregar observación"
                        />
                        </div>
                      </div>
                    ))}
                    {filteredAlumnos.length > 0 && (
                      <button
                        onClick={handleGuardarAsistencias}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
                      >
                        Guardar Asistencias
                      </button>  


                    )}

                   
                    
                  </div>
                </>
                
                )}
              
              </div>

              {filteredAlumnos.length > itemsPerPage && (
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

                {showPopupSucces && (
                  <PopupSuccesGeneral
                    message={successMessage}
                    onClose={handleClosePopupSucces}
                  />
                )}

              </>
            </div>
          </main>
      </div>
      
          
    </>
    
  );
};

export default ListarAlumnosAsistencia;
