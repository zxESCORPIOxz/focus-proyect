import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias, fetchUbigeoGeneral } from "../../../lib/apiUbigeo";
import PopupErrorRegister from "../../../Popups/RegistroError";
import SelectorGrados from "../../SelectorGrados";
import { useRolContext } from "../../../context/RolContext";
import { registrarAlumno } from "../../../lib/apiRegistrarAlumno";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useAlumnoContext } from "../../../context/AlumnoContext";


const DetalleAlumno = ({onBackToListado }) => {
  
  const {selectedMatriculaId,institucionId,institucionSeleccionada,nombreMatricula } = useRolContext();
  
  const {alumnoSeleccionado}=useAlumnoContext();
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showPopupSucces, setShowPopupSucces] = useState(false);

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState({
  });
    
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
    token: token,
    id_usuario:alumnoSeleccionado.id_usuario,
    nombre: alumnoSeleccionado.nombre,
    apellido_paterno: alumnoSeleccionado.apellido_paterno,
    apellido_materno: alumnoSeleccionado.apellido_materno,
    sexo: alumnoSeleccionado.sexo,
    email: alumnoSeleccionado.email,
    url_imagen:alumnoSeleccionado.url_imagen,
    telefono: alumnoSeleccionado.telefono,
    ubigeo: alumnoSeleccionado.ubigeo,
    direccion: alumnoSeleccionado.direccion,
    fecha_nacimiento: alumnoSeleccionado.fecha_nacimiento,
    tipo_doc: alumnoSeleccionado.tipo_doc,
    nombre_matricula:alumnoSeleccionado.nombre_matricula,
    nombre_nivel:alumnoSeleccionado.nombre_nivel,
    nombre_grado:alumnoSeleccionado.nombre_grado,
    nombre_seccion:alumnoSeleccionado.nombre_seccion,
    num_documento: alumnoSeleccionado.num_documento,
    id_institucion: institucionId,
    id_matricula: selectedMatriculaId,
    id_seccion: alumnoSeleccionado.id_seccion,
    img_b64: "",  
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
          Detalle del Alumno
        </h1>
  
        {/* Imagen */}
        <div className="flex justify-center mb-6">
          <img
            src={formBody1.img_b64 || formBody1.url_imagen} // Muestra img_b64 si está disponible, de lo contrario url_imagen
            alt="Foto del alumno"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-300"
          />
        </div>
  
        {/* Detalles */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-900">{formBody1.nombre}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Apellido Paterno:</span>
            <span className="text-gray-900">{formBody1.apellido_paterno}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Apellido Materno:</span>
            <span className="text-gray-900">{formBody1.apellido_materno}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Sexo:</span>
            <span className="text-gray-900">{formBody1.sexo}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{formBody1.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <span className="text-gray-900">{formBody1.telefono}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Dirección:</span>
            <span className="text-gray-900">{formBody1.direccion}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Fecha de Nacimiento:</span>
            <span className="text-gray-900">{formBody1.fecha_nacimiento}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Tipo de Documento:</span>
            <span className="text-gray-900">{formBody1.tipo_doc}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Número de Documento:</span>
            <span className="text-gray-900">{formBody1.num_documento}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Institución:</span>
            <span className="text-gray-900">{institucionSeleccionada}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Matrícula:</span>
            <span className="text-gray-900">{formBody1.nombre_matricula}</span>
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
            <span className="font-semibold text-gray-700">Sección:</span>
            <span className="text-gray-900">{formBody1.nombre_seccion}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Departamento:</span>
            <span className="text-gray-900">{departamento}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Provincia:</span>
            <span className="text-gray-900">{provincia}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-gray-700">Distrito:</span>
            <span className="text-gray-900">{distrito}</span>
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

export default DetalleAlumno;
