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

const ListarAlumnosCurso = ({onBackToListado}) => { 
  //PAGINACION
  const itemsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  // Usamos un estado para manejar los acordeones de los alumnos
  const [activeAlumno, setActiveAlumno] = useState(null);
    
  // Usamos un estado para manejar los acordeones de las etapas
  const [activeEtapas, setActiveEtapas] = useState({});
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
const { guardarCursoSeleccionado,cursoSeleccionado } = useCursoContext();
  const navigate = useNavigate(); 
  const { institucionId } = useRolContext(); 
  const [status, setStatus] = useState("");
  const [filtroNumeroDocumento, setFiltroNumeroDocumento] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    });

  const [editandoNota, setEditandoNota] = useState(null); // Guarda el ID de la nota en edición
  const [nuevaNota, setNuevaNota] = useState({});


  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleAlumnoAccordion = (alumnoId) => {
    // Alterna el estado del acordeón del alumno
    setActiveAlumno((prev) => (prev === alumnoId ? null : alumnoId));
  };

  const toggleEtapaAccordion = (alumnoId, etapaIndex) => {
    const etapaKey = `${alumnoId}-${etapaIndex}`;
    setActiveEtapas((prev) => ({
      ...prev,
      [etapaKey]: !prev[etapaKey],
    }));
  };

  

  const fetchAlumnos = async () => { 
    setLoading(true); 
    try { 
      const id_curso = cursoSeleccionado.id_curso; 
      const response = await listarAlumnosNotas(token, id_curso); 
      if (response.status === 'SUCCESS') { 
        const alumnosData = response.alumnos; 
        setAlumnos(alumnosData); 
        setFilteredAlumnos(alumnosData); 
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
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
    if (modalMessageError) {
      setShowErrorPopup(true);
    }
  }, [modalMessageError]);

  useEffect(() => { 
    if (institucionId && cursoSeleccionado.id_curso) { 
      fetchAlumnos(); 
    } 
  }, [token, institucionId, cursoSeleccionado]);

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

  const handleBackToListado = () => {
    guardarAlumnoSeleccionado(""); 
    setView("listado")           
                                                                                                 
  };
  

  const handleEditarNota = (nota) => {
    setEditandoNota(nota.id_nota_alumno_curso);
    setNuevaNota((prevNotas) => ({
      ...prevNotas,
      [nota.id_nota_alumno_curso]: nota.nota_obtenida
    }));
    
  };
  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };

  const actualizarListaAlumnos = () => {
    fetchAlumnos();
  };
  const handleGuardarNota = async (idNota) => {

    if (nuevaNota[idNota] < 0 || nuevaNota[idNota] > 20) {
      setModalMessageError('La nota debe estar entre 0 y 20.');
      setShowErrorPopup(true);
      
      return;
    }

  
    const requestBody = {
      token: token,
      notas: [{ id_nota_alumno_curso: idNota, nueva_nota: nuevaNota[idNota] }]
    };
  
    try {
      const response = await editarNota(requestBody);
      if (response && response.status === "SUCCESS") {
        setEditandoNota(null);
        setShowPopupSucces(true);
        setSuccessMessage(response.message)
        actualizarListaAlumnos();
        setTimeout(() => {
          setShowPopupSucces(false);
        }, 2500);
      }else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message); // Configura el mensaje de error
        setShowErrorPopup(true); // Muestra el popup de error
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setShowErrorPopup(true);

      }
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };


  const handleSuccess = () => {
    
    fetchAlumnos();
    setView("listado") 
  };                                       



  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-3 w-full mr-2">
        <div className='flex justify-between items-center'>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Alumnos Listado</h1>
          <button
              type="button"
              onClick={onBackToListado}
              className="py-2 px-6 mr-1 mt-0 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Regresar
          </button>
        </div>
        
        <main className="  bg-white py-0 px-0 ml-0 rounded-lg ">
          <div className=" md:h-[calc(92vh-160px)] flex flex-col justify-between mr-2">
            { view === "editar" ? (
              <div className="overflow-auto mb-0 flex-1">
                EDTIAR
              </div>
            ): (
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                
                
                  ) : currentAlumnos.length === 0 ? (
                    <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                  ) : (
                    <>
                    <div>
                      {currentAlumnos.map((alumno) => (
                        <div key={alumno.id_alumno} className="accordion border  bg-white shadow-md mb-4">
                          {/* Acordeón del Alumno */}
                          <div
                            className="accordion-header p-4 cursor-pointer bg-gray-100 border-b border-gray-300 text-gray-800 font-bold flex justify-between items-center"
                            onClick={() => toggleAlumnoAccordion(alumno.id_alumno)}
                          >
                            {alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno} (DNI: {alumno.num_documento})
                            <span className={`toggle-icon text-xl transform transition-transform duration-300 ${activeAlumno === alumno.id_alumno ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                          {activeAlumno === alumno.id_alumno && (
                            <div className="accordion-content p-4 border-t border-gray-300 overflow-x-auto">
                              {alumno.etapas?.map((etapa, index) => (
                                <div key={index} className="accordion border border-gray-300 rounded-lg mb-2">
                                  {/* Acordeón de la Etapa */}
                                  <div
                                    className="accordion-header p-4 cursor-pointer bg-gray-100 border-b border-gray-300 text-gray-800 font-bold flex justify-between items-center"
                                    onClick={() => toggleEtapaAccordion(alumno.id_alumno, index)}
                                  >
                                    {etapa.nombre_etapa}
                                    <span className={`toggle-icon text-xl transform transition-transform duration-300 ${activeEtapas[`${alumno.id_alumno}-${index}`] ? 'rotate-180' : ''}`}>
                                      ▼
                                    </span>
                                  </div>
                                  {activeEtapas[`${alumno.id_alumno}-${index}`] && (
                                    <div className="overflow-x-auto">
                                    <table className="w-full border-collapse mt-4 mr-1 ">
                                      <thead>
                                        <tr>
                                          <th className="text-center border border-gray-300 p-1 md:p-2 bg-gray-100 md:min-w-[150px]">
                                            Actividad
                                          </th>
                                          <th className="text-center border border-gray-300 p-1 md:p-2 bg-gray-100 md:min-w-[80px]">
                                            Peso
                                          </th>
                                          <th className="text-center border border-gray-300 p-1 md:p-2 bg-gray-100 md:min-w-[120px]">
                                            Nota Obtenida
                                          </th>
                                          <th className="text-center border border-gray-300 p-1 md:p-2 bg-gray-100 md:min-w-[100px]">
                                            Acciones
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {etapa.notas?.map((nota, idx) => (
                                          <tr key={idx}>
                                            <td className="text-center border border-gray-300 p-2">
                                              {nota.nombre}
                                            </td>
                                            <td className="text-center border border-gray-300 p-2">
                                              {nota.peso * 100}%
                                            </td>
                                            <td className="text-center border border-gray-300 p-2">
                                              {editandoNota === nota.id_nota_alumno_curso ? (
                                                <input
                                                  type="number"
                                                  className="border p-1 w-full md:w-16 text-center"
                                                  value={nuevaNota[nota.id_nota_alumno_curso] || ""}
                                                  onChange={(e) =>
                                                    setNuevaNota({
                                                      ...nuevaNota,
                                                      [nota.id_nota_alumno_curso]: e.target.value,
                                                    })
                                                  }
                                                />
                                              ) : (
                                                <span
                                                  className={`${
                                                    nota.nota_obtenida <= 10 ? "text-red-500" : "text-blue-500"
                                                  }`}
                                                >
                                                  {nota.nota_obtenida}
                                                </span>
                                              )}
                                            </td>
                                            <td className="text-center border border-gray-300 p-1">
                                              {editandoNota === nota.id_nota_alumno_curso ? (
                                                <button
                                                  disabled={nuevaNota[nota.id_nota_alumno_curso] === nota.nota_obtenida}
                                                  className={`bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 w-full md:w-auto ${
                                                    nuevaNota[nota.id_nota_alumno_curso] === nota.nota_obtenida
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : ""
                                                  }`}
                                                  onClick={() => handleGuardarNota(nota.id_nota_alumno_curso)}
                                                >
                                                  Guardar
                                                </button>
                                              ) : (
                                                <button
                                                  className="bg-blue-500 text-white py-1 px-2 rounded-md items-center hover:bg-blue-600 md:w-auto"
                                                  onClick={() => handleEditarNota(nota)}
                                                >
                                                  <FaEdit />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>

                                    </table>
                                  </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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
            )}
            </div>
          </main>
      </div>
      
          
    </>
    
  );
};

export default ListarAlumnosCurso;
