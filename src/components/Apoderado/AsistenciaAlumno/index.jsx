import React, { useEffect, useState } from 'react'; 
import LoadingSpinner from '../../LoadingSpinner'; 
import PopupErrorRegister from '../../../Popups/RegistroError'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuthContext } from '../../../context/AuthContext'; 
import PopupSuccesGeneral from '../../../Popups/SuccesGeneral';
import { useCursoContext } from '../../../context/CursoContext';
import { listarAsistenciaApoderado } from '../../../lib/apiListarAsistenciaApoderado';
import { useAlumnoContext } from '../../../context/AlumnoContext';
const AsistenciaAlumnosApoderado = ({onBackToListado}) => { 

  const itemsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  const [asistencia, setCursos] = useState([]); 
  const [filteredCursos, setFilteredCursos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [showErrorPopup, setShowErrorPopup] = useState(false); 
  const [modalMessageError, setModalMessageError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopupSucces, setShowPopupSucces] = useState(false);
  const { clearAuth,token } = useAuthContext(); 
  const { cursoSeleccionado } = useCursoContext(); 
  const { guardarAlumnoSeleccionado,alumnoSeleccionado } = useAlumnoContext();
  const navigate = useNavigate(); 
  const [status, setStatus] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  const fetchAsistencia = async () => { 
    setLoading(true); 
    try { 
      const id_alumno_matricula = alumnoSeleccionado.id_alumno_matricula; 
      const id_curso = cursoSeleccionado.id_curso; 
      const response = await listarAsistenciaApoderado(token, id_alumno_matricula,id_curso); 

      if (response.status === 'SUCCESS') { 
        
        const cursosData = response.asistencia; 
        setCursos(cursosData); 
        setFilteredCursos(cursosData);
      } else if (response.status === "LOGOUT") {
        setStatus("LOGOUT");
        setModalMessageError(response.message);
        setShowErrorPopup(true);
      } else if (response.status === "FAILED") {
        setModalMessageError(response.message);
        setCursos([]);
        setFilteredCursos([]);
        setShowErrorPopup(true);
      }
    } catch (error) { 
      console.error('Error al listar alumnos:', error); 
      setModalMessageError('Ocurrió un error inesperado.'); 
      setCursos([]);
      setFilteredCursos([]);
      setShowErrorPopup(true); 
    } finally { 
      setLoading(false); 
    } 
  };
  useEffect(() => {
    if (cursoSeleccionado) {
      fetchAsistencia(); 
    }
  }, [cursoSeleccionado]);

  useEffect(() => {
    if (modalMessageError) {
      setShowErrorPopup(true);
    }
  }, [modalMessageError]);


  const aplicarFiltros = () => {
    let asistenciaFiltrada = asistencia;
  
    if (filtroFecha) {
      asistenciaFiltrada = asistenciaFiltrada.filter((item) => item.fecha === filtroFecha);
    }
  
    setFilteredCursos(asistenciaFiltrada);
    setCurrentPage(1);
  };
  const restaurarFiltros = () => {
    setFiltroFecha('');
    setFilteredCursos(asistencia); // Restaurar todos los cursos
  };

  const indexOfLastAsistencia = currentPage * itemsPerPage;
  const indexOfFirstAsistencia = indexOfLastAsistencia - itemsPerPage;
  const currentAsistencia = filteredCursos.slice(indexOfFirstAsistencia, indexOfLastAsistencia);

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); 
      navigate("/login"); 
    }
    
  };

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
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg md:p-4 p-0  md:w-full  ">
        <div className='flex justify-between items-center'>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Asistencia Hijo</h1>
          <button
              type="button"
              onClick={onBackToListado}
              className="py-2 px-6 mr-1 mt-0 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Regresar
          </button>
        </div>
        <main className="sd:h-screen sd:w-screen mx-2   bg-white py-auto px-auto rounded-lg ">
          <div className="sd:h-full sd:w-full md:h-[calc(92vh-160px)] flex flex-col justify-between">
              <>
                <div className="flex flex-col md:flex-row md:gap-2  mr-6">
                <div className="md:mb-6 mb-3">
                  <label className="block text-sm mb-1 font-medium text-gray-700">Fecha de Asistencia:</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>            
                  <div className='flex flex-row justify-between md:mt-6 '>
                    <div className="md:mx-2 ">
                      <button
                        className="bg-[#5155A6] text-white p-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700"
                        onClick={aplicarFiltros}
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                    <div className="md:mx-2 ">
                      <button
                        className="bg-[#6d70ac] text-white p-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-500"
                        onClick={restaurarFiltros}
                      >
                        Restaurar Filtros
                      </button>
                    </div>
                  </div> 
                </div>
                <div className="flex-1 overflow-auto mb-0">
                {loading ? (
                  <div className="overflow-auto mb-0 flex-1 relative">
                    
                    <LoadingSpinner />
                  
                  </div>
                
                
                ): (
                  <>
                  
                    {filteredCursos.length === 0 ? (
                      <p className="text-center text-gray-600 mt-4">No hay asistencias registradas.</p>
                    ) : (
                      currentAsistencia.map((alumno) => (
                        <div key={alumno.id_asistencia} className="bg-white  p-4 rounded-lg md:w-full shadow-md border mt-3">
                          <div className="flex justify-between mb-2">
                            <span className='font-bold text-lg text-gray-800'>{alumno.fecha}</span>
                            <span
                              className={`p-2 rounded-lg text-white ${
                                alumno.estado === "PRESENTE"
                                  ? "bg-green-500"
                                  : alumno.estado === "AUSENTE"
                                  ? "bg-red-500"
                                  : alumno.estado === "JUSTIFICADO"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }`}
                            >
                              {alumno.estado}
                            </span>
                          </div>
                          <p className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700">
                            {alumno.observaciones || 'Sin observaciones'}
                          </p>
                        </div>
                      ))
                    )}

                  
                </>
                
                )}
              
              </div>
              {filteredCursos.length > itemsPerPage && ( 
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

export default AsistenciaAlumnosApoderado;
