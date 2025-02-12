import React, { useEffect, useState } from 'react'
import { FaBook, FaClipboardCheck, FaEdit, FaInfoCircle, FaLock, FaUnlock, FaUsers } from 'react-icons/fa'
import { listarAlumnosApoderado } from '../../../lib/apiListarAlumnosApoderado';
import { useRolContext } from '../../../context/RolContext';
import { useAuthContext } from '../../../context/AuthContext';
import NotasAlumnoApoderado from '../NotasAlumno';
import AsistenciaAlumnosApoderado from '../AsistenciaAlumno';
import LoadingSpinner from '../../LoadingSpinner';
import { useAlumnoContext } from '../../../context/AlumnoContext';
import { listarCursosNotas } from '../../../lib/apiListarCursosNotas';
import { useCursoContext } from '../../../context/CursoContext';

const CursosAlumno = ({onBackToListado}) => {

  const [view, setView] = useState("listado");
  const { institucionId,selectedMatriculaId,idRolSeleccionado,rolSeleccionado } = useRolContext();
  const { clearAuth,token } = useAuthContext();
  const [loading, setLoading] = useState(true);  
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");
  const [cursos, setCursos] = useState([]);
  const [status, setStatus] = useState("");
  const { guardarAlumnoSeleccionado,alumnoSeleccionado } = useAlumnoContext();
  const { guardarCursoSeleccionado,cursoSeleccionado } = useCursoContext();

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };
  

  const fetchCursos = async () => {
      setLoading(true); // Muestra el indicador de carga
    
      try {
        const id_alumno_matricula = alumnoSeleccionado.id_alumno_matricula; 
        const response = await listarCursosNotas(token,id_alumno_matricula); 
    
        if (response.status === "SUCCESS") {
          const cursosData = response.cursos;
          setCursos(cursosData);
        } else if (response.status === "LOGOUT") {
          setStatus("LOGOUT");
          setModalMessageError(response.message);
          setShowErrorPopup(true);
        } else if (response.status === "FAILED") {
          setModalMessageError(response.message);
          setCursos([]);
         
        }
      } catch (error) {
        console.error("Error al listar cursos:", error);
        setModalMessageError("Ocurrió un error inesperado.");
        setCursos([]);

        setShowErrorPopup(true);
      } finally {
        setLoading(false); 
      }
    };


    const handleBackToListado = () => {
      guardarAlumnoSeleccionado(""); 
      setView("listado")           
                                                                                                   
    };
  
    const handleAsistenciaAlumno = (cursoSeleccionado) => {
    guardarCursoSeleccionado(cursoSeleccionado); 
      setView("asistencia")                                                                                                         
    };

    useEffect(() => {
        if (selectedMatriculaId) {
          fetchCursos(); // Obtén los cursos si hay un `selectedMatriculaId`
        } else {
          setCursos([]); 
          setFilteredAlumnos([]); // Limpia los cursos si no hay `selectedMatriculaId`
        }
      }, [token, selectedMatriculaId, idRolSeleccionado]);
  return (
    <>
        {view === "asistencia" ? (
                <div className="overflow-auto mb-0 flex-1">
                    <AsistenciaAlumnosApoderado onBackToListado={handleBackToListado}/>

                    
                </div>
        ) : (
        <div className="bg-white rounded-lg shadow-lg p-3 w-full mr-2">
            <div className='flex justify-between items-center pb-2'>
                <h1 className="text-3xl font-bold mb-1 text-blue-600 mt-3">Cursos</h1>
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
                    <div className="flex-1 overflow-auto mb-0">
                    {loading ? (
                    <div className="overflow-auto mb-0 flex-1 relative">
                        
                        <LoadingSpinner />
                    
                    </div>
                    
                    
                    ) : cursos.length === 0 ? (
                        <p className="text-center text-gray-500">No existen cursos para listar.</p>
                    ) : (
                        <>
                        <div className="w-full h-full transition-all duration-300 ease-in-out">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                            {cursos.map((curso) => (
                                <div key={curso.id_curso} className="bg-gray-100 hover:bg-gray-300 p-4 rounded-lg shadow-md flex justify-between items-center"
                                onClick={() => handleAsistenciaAlumno(curso)}>
                                {/* Información del alumno */}
                                <div>
                                    <h2 className="text-4xl font-semibold">
                                    {curso.nombre_curso}
                                    </h2>
                                
                                    <p className={`mt-2 text-sm font-bold ${curso.estado_curso === "Activo" ? "text-green-600" : "text-red-600"}`}>
                                    {curso.estado_curso}
                                    </p>
                                </div>

                                
                                </div>
                            ))}
                            </div>
                        </div>
                        </>               
                    )}
                    
                </div>
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
    )}
    </>
    
  )
}

export default CursosAlumno