import React, { useEffect, useState } from 'react'
import { listarCursosNotas } from '../../../lib/apiListarCursosNotas';
import { useAlumnoContext } from '../../../context/AlumnoContext';
import { useAuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';
import PopupErrorRegister from '../../../Popups/RegistroError';

const NotasAlumnoApoderado = ({onBackToListado}) => {
  const itemsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCurso, setActiveAlumno] = useState(null);
  const [activeEtapas, setActiveEtapas] = useState({});
  const [filtroNombreCurso, setFiltroNombreCurso] = useState("");
  const { guardarAlumnoSeleccionado,alumnoSeleccionado } = useAlumnoContext();
  const [cursos, setCursos] = useState([]); 
  const [filteredCursos, setFilteredCursos] = useState([]); 
  const [showErrorPopup, setShowErrorPopup] = useState(false); 
  const [modalMessageError, setModalMessageError] = useState('');
  const [status, setStatus] = useState("");
  const { clearAuth,token } = useAuthContext();
  const [loading, setLoading] = useState(true); 




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleAlumnoAccordion = (cursoId) => {
    setActiveAlumno((prev) => (prev === cursoId ? null : cursoId));
  };

  const toggleEtapaAccordion = (cursoId, etapaIndex) => {
    const etapaKey = `${cursoId}-${etapaIndex}`;
    setActiveEtapas((prev) => ({
      ...prev,
      [etapaKey]: !prev[etapaKey],
    }));
  };

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); 
      navigate("/login"); 
    }
  };

  const aplicarFiltros = () => {

    // Filtrar cursos por nombre parcial
    const cursosFiltrados = cursos.filter(curso =>
      curso.nombre_curso.toLowerCase().includes(filtroNombreCurso.toLowerCase())
    );
    setFilteredCursos(cursosFiltrados);
    setCurrentPage(1);
  };
  const restaurarFiltros = () => {
    setFiltroNombreCurso('');
    setFilteredCursos(cursos); // Restaurar todos los cursos
  };
  

  const fetchCursos = async () => { 
      setLoading(true); 
      try { 
        const id_alumno_matricula = alumnoSeleccionado.id_alumno_matricula; 
        const response = await listarCursosNotas(token, id_alumno_matricula); 
        if (response.status === 'SUCCESS') { 
          const cursosData = response.cursos; 
          
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
      if (alumnoSeleccionado.id_alumno_matricula) { 
        fetchCursos(); 
      } else {
        setCursos([]); 
        setFilteredCursos([]); // Limpia los alumnos si no hay `selectedMatriculaId`
      }
    }, [token, alumnoSeleccionado.id_alumno_matricula]);

    const indexOfLastCurso = currentPage * itemsPerPage;
    const indexOfFirstCurso = indexOfLastCurso - itemsPerPage;
    const currentCursos = filteredCursos.slice(indexOfFirstCurso, indexOfLastCurso);
    console.log(currentCursos)
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-3 w-full mr-2">
        <div className='flex justify-between items-center pb-2'>
          <h1 className="text-3xl font-bold mb-1 text-blue-600 mt-3">Notas Hijo</h1>
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
            
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label
                      htmlFor="filter-numero-documento"
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      Nombre del Curso:
                    </label>
                    <input
                      id="filter-numero-documento"
                      type="text"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                      value={filtroNombreCurso}
                      onChange={(e) => setFiltroNombreCurso(e.target.value)}
                      placeholder="Ingrese nombre"
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
                    <div className="md:mx-2 ">
                      <button
                        className="bg-[#6d70ac] text-white px-4 py-2 rounded-lg hover:bg-blue-500"
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
                
                
                  ) : currentCursos.length === 0 ? (
                    <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                  ) : (
                    <>
                    <div className='w-full'>
                      {currentCursos.map((curso) => (
                        <div key={curso.id_curso} className="accordion border  bg-white shadow-md  mb-4">
                          {/* Acordeón del Alumno */}
                          <div
                            className="accordion-header p-4 cursor-pointer bg-gray-100 border-b border-gray-300 text-gray-800 font-bold flex justify-between  items-center"
                            onClick={() => toggleAlumnoAccordion(curso.id_curso)}
                          >
                            {curso.nombre_curso } 
                            <span className={`toggle-icon text-xl transform transition-transform duration-300 ${activeCurso === curso.id_curso ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                          {activeCurso === curso.id_curso && (
                            <div className="accordion-content p-4 border-t border-gray-300 overflow-x-auto">
                              {curso.etapas?.map((etapa, index) => (
                                <div key={index} className="accordion border border-gray-300 rounded-lg mb-2">
                                  {/* Acordeón de la Etapa */}
                                  <div
                                    className="accordion-header p-4 cursor-pointer bg-gray-100 border-b border-gray-300 text-gray-800 font-bold flex justify-between items-center"
                                    onClick={() => toggleEtapaAccordion(curso.id_curso, index)}
                                  >
                                    {etapa.nombre_etapa}
                                    <span className={`toggle-icon text-xl transform transition-transform duration-300 ${activeEtapas[`${curso.id_curso}-${index}`] ? 'rotate-180' : ''}`}>
                                      ▼
                                    </span>
                                  </div>
                                  {activeEtapas[`${curso.id_curso}-${index}`] && (
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
                                              <span
                                                className={`${
                                                  nota.nota_obtenida <= 10 ? "text-red-500" : "text-blue-500"
                                                }`}
                                              >
                                                {nota.nota_obtenida}
                                              </span>
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


              </>
            </div>
          </main>

      </div>
    </>
  )
}

export default NotasAlumnoApoderado