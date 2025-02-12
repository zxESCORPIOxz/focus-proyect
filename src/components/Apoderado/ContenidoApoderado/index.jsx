import React, { useEffect, useState } from 'react'
import { FaBook, FaClipboardCheck, FaEdit, FaInfoCircle, FaLock, FaUnlock, FaUsers } from 'react-icons/fa'
import { listarAlumnosApoderado } from '../../../lib/apiListarAlumnosApoderado';
import { useRolContext } from '../../../context/RolContext';
import { useAuthContext } from '../../../context/AuthContext';
import NotasAlumnoApoderado from '../NotasAlumno';
import AsistenciaAlumnosApoderado from '../AsistenciaAlumno';
import LoadingSpinner from '../../LoadingSpinner';
import { useAlumnoContext } from '../../../context/AlumnoContext';
import CursosAlumno from '../CursosAlumno';

const ContenidoApoderado = () => {

  const [view, setView] = useState("listado");
  const { institucionId,selectedMatriculaId,idRolSeleccionado,rolSeleccionado } = useRolContext();
  const { clearAuth,token } = useAuthContext();
  const [loading, setLoading] = useState(true);  
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [status, setStatus] = useState("");
  const { guardarAlumnoSeleccionado,alumnoSeleccionado } = useAlumnoContext();

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };
  

  const fetchAlumnos = async () => {
      setLoading(true); // Muestra el indicador de carga
    
      try {
        const response = await listarAlumnosApoderado(token, selectedMatriculaId,idRolSeleccionado); 
    
        if (response.status === "SUCCESS") {
          const alumnosData = response.alumnos;
          setAlumnos(alumnosData);
        } else if (response.status === "LOGOUT") {
          setStatus("LOGOUT");
          setModalMessageError(response.message);
          setShowErrorPopup(true);
        } else if (response.status === "FAILED") {
          setModalMessageError(response.message);
          setAlumnos([]);
         
        }
      } catch (error) {
        console.error("Error al listar alumnos:", error);
        setModalMessageError("Ocurrió un error inesperado.");
        setAlumnos([]);

        setShowErrorPopup(true);
      } finally {
        setLoading(false); 
      }
    };

    const handleNotasAlumno = (alumnoSeleccionado) => {
      guardarAlumnoSeleccionado(alumnoSeleccionado); 
      setView("notas")           
                                                                                                   
    };

    const handleBackToListado = () => {
      guardarAlumnoSeleccionado(""); 
      setView("listado")           
                                                                                                   
    };
  
    const handleAsistenciaAlumno = (alumnoSeleccionado) => {
      guardarAlumnoSeleccionado(alumnoSeleccionado); 
      setView("curso")                                                                                                         
    };

    useEffect(() => {
        if (selectedMatriculaId) {
          fetchAlumnos(); // Obtén los alumnos si hay un `selectedMatriculaId`
        } else {
          setAlumnos([]); 
          setFilteredAlumnos([]); // Limpia los alumnos si no hay `selectedMatriculaId`
        }
      }, [token, selectedMatriculaId, idRolSeleccionado]);
  return (
    <div className="flex-1 mt-7 md:p-6 md:mt-0">
          <header className="bg-[#4B7DBF] mx-2 md:mx-0 text-white rounded-lg flex items-center gap-4 p-4 mb-6">
            <FaUsers className="text-3xl sm:text-5xl" />
            <h1 className="text-lg sm:text-xl font-bold">Módulo: Mis Hijos</h1>
          </header>
          <main className="sd:h-screen sd:w-screen mx-2 md:mx-0 bg-white py-2 px-4 rounded-lg shadow">
            <div className="sd:h-full  md:h-[calc(92vh-160px)] flex flex-col justify-between">
            {view === "notas" ? (
            <div className="overflow-auto mb-0 flex-1">
              <NotasAlumnoApoderado onBackToListado={handleBackToListado}/>

              
            </div>
          )  : view === "curso" ? (
            <div className="overflow-auto mb-0 flex-1">
              <CursosAlumno onBackToListado={handleBackToListado}/>
            </div>
            
          ) : (
            <>
              <div className="flex-1 overflow-auto mb-0">
                {loading ? (
                <div className="overflow-auto mb-0 flex-1 relative">
                  
                  <LoadingSpinner />
                
                </div>
              
              
                ) : alumnos.length === 0 ? (
                  <p className="text-center text-gray-500">No existen alumnos para listar.</p>
                ) : (
                  <>
                    <div className="w-full h-full transition-all duration-300 ease-in-out">
                      <div className="grid grid-cols-1 gap-4">
                        {alumnos.map((alumno) => (
                          <div key={alumno.id_alumno} className="bg-gray-100 hover:bg-gray-300 p-4 rounded-lg shadow-md flex justify-between items-center">
                            {/* Información del alumno */}
                            <div>
                              <h2 className="text-xl font-semibold">
                                {alumno.nombre_alumno + " " + alumno.apellido_paterno_alumno + " " + alumno.apellido_materno_alumno}
                              </h2>
                              <p className="text-sm text-gray-600">Grado: {alumno.nombre_grado}</p>
                              <p className="text-sm text-gray-600">Sección: {alumno.nombre_seccion}</p>
                              <p className="text-sm text-gray-600">N° Documento: {alumno.num_documento_alumno}</p>
                              <p className={`mt-2 text-sm font-bold ${alumno.estado_alumno === "Activo" ? "text-green-600" : "text-red-600"}`}>
                                {alumno.estado_alumno}
                              </p>
                            </div>

                            {/* Botones alineados a la derecha */}
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                              {/* Botón Notas */}
                              <div className="relative group">
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                  onClick={() => handleNotasAlumno(alumno)}
                                >
                                  <FaBook className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Notas
                                </span>
                              </div>

                              {/* Botón Asistencia */}
                              <div className="relative group">
                                <button
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  onClick={() => handleAsistenciaAlumno(alumno)}
                                >
                                  <FaClipboardCheck className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Asistencia
                                </span>
                              </div>
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
          )}
            </div>
          </main>
    </div>
  )
}

export default ContenidoApoderado