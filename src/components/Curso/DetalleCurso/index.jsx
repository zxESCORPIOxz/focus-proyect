import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias, fetchUbigeoGeneral } from "../../../lib/apiUbigeo";
import PopupErrorRegister from "../../../Popups/RegistroError";
import SelectorGrados from "../../SelectorGrados";
import { useRolContext } from "../../../context/RolContext";
import { registrarAlumno } from "../../../lib/apiRegistrarAlumno";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useAlumnoContext } from "../../../context/AlumnoContext";
import { useCursoContext } from "../../../context/CursoContext";


const DetalleCurso = ({onBackToListado }) => {
  
  const {selectedMatriculaId,institucionId,institucionSeleccionada,nombreMatricula } = useRolContext();
  
  const {alumnoSeleccionado}=useAlumnoContext();
  const {cursoSeleccionado}=useCursoContext();
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showPopupSucces, setShowPopupSucces] = useState(false);

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState({
  });
  console.log(cursoSeleccionado)
  const DEFAULT_BASE64_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";

  const [ubigeo, setUbigeo] = useState({
      departamentos: [],
      provincias: [],
      distritos: [],
      departamento: "",
      provincia: "",
      distrito: "",
    });

  
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");



  const [formBody1 , setFormBody1]  = useState({
    nombre: cursoSeleccionado.nombre_curso,
    descripcion_curso: cursoSeleccionado.descripcion_curso,
    estado_curso: cursoSeleccionado.estado_curso,
    nombre_curso: cursoSeleccionado.nombre_curso,
    nombre_grado: cursoSeleccionado.nombre_grado,
    nombre_nivel:cursoSeleccionado.nombre_nivel, 
    numero_alumnos:cursoSeleccionado.numero_alumnos, 
    secciones:cursoSeleccionado.secciones,   
  });


  const [grados, setGrados] = useState({
    id_nivel:alumnoSeleccionado.id_nivel, 
    id_grado:alumnoSeleccionado.id_grado,
    id_seccion:alumnoSeleccionado.id_seccion,

 
  });

  


  





  useEffect(() => {
    const obtenerUbigeoGeneral = async () => {
      try {
        const data = await fetchUbigeoGeneral(alumnoSeleccionado.ubigeo);
        const departamento= data.departamento
        const provincia= data.provincia
        const distrito= data.distrito
        setDepartamento(departamento.nombre);
        setProvincia(provincia.nombre);
        setDistrito(distrito.nombre);
      } catch (error) {
        console.error("Error al obtener datos de ubigeo general:", error);
      }
    };

    if (ubigeo) {
      obtenerUbigeoGeneral();
    }
  }, [alumnoSeleccionado.ubigeo]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-600 text-center">
          Detalle del Curso
        </h1>
  
        
  
        {/* Detalles */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-900">{formBody1.nombre_curso}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Descripcion:</span>
            <span className="text-gray-900">{formBody1.descripcion_curso}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Numero de Alumnos:</span>
            <span className="text-gray-900">{formBody1.numero_alumnos}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Secciones:</span>
            <span className="text-gray-900">{formBody1.secciones}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Nivel:</span>
            <span className="text-gray-900">{formBody1.nombre_nivel}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Grado:</span>
            <span className="text-gray-900">{formBody1.nombre_grado}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Institución:</span>
            <span className="text-gray-900">{institucionSeleccionada}</span>
          </div>
         
        </div>
  
        {/* Botón de regreso */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onBackToListado}
            className="py-3 px-6 sm:px-10 bg-gray-400 text-white font-medium text-base sm:text-lg rounded-lg hover:bg-gray-500 transition duration-300"
          >
            Regresar
          </button>
        </div>
      </div>
    </>
  );
  
};

export default DetalleCurso;
