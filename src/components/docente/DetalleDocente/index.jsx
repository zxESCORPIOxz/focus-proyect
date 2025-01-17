import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias, fetchUbigeoGeneral } from "../../../lib/apiUbigeo";
import PopupErrorRegister from "../../../Popups/RegistroError";
import SelectorGrados from "../../SelectorGrados";
import { useRolContext } from "../../../context/RolContext";
import { registrarAlumno } from "../../../lib/apiRegistrarAlumno";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useAlumnoContext } from "../../../context/AlumnoContext";
import { useDocenteContext } from "../../../context/DocenteContext";


const DetalleDocente = ({onBackToListado }) => {
  
  const {selectedMatriculaId,institucionId,institucionSeleccionada,nombreMatricula } = useRolContext();
    
    const {docenteSeleccionado}=useDocenteContext();
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
    // console.log(docenteSeleccionado)
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
      id_docente:docenteSeleccionado.id_docente,
      nombre: docenteSeleccionado.nombre,
      apellido_paterno: docenteSeleccionado.apellido_paterno,
      apellido_materno: docenteSeleccionado.apellido_materno,
      sexo: docenteSeleccionado.sexo,
      email: docenteSeleccionado.email,
      url_imagen:docenteSeleccionado.url_imagen,
      telefono: docenteSeleccionado.telefono,
      cursos:docenteSeleccionado.cursos,
      ubigeo: docenteSeleccionado.ubigeo,
      direccion: docenteSeleccionado.direccion,
      fecha_nacimiento: docenteSeleccionado.fecha_nacimiento,
      tipo_doc: docenteSeleccionado.tipo_doc,
      num_documento: docenteSeleccionado.num_documento,
      id_institucion: institucionId,
      especialidad: docenteSeleccionado.especialidad,
      estado: docenteSeleccionado.estado,
      img_b64: "", 
    });
    
    // console.log(formBody1)
  

    
    useEffect(() => {
        const obtenerUbigeoGeneral = async () => {
          try {
            const data = await fetchUbigeoGeneral(docenteSeleccionado.ubigeo);
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
      }, [docenteSeleccionado.ubigeo]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">Detalle del Docente</h1>

        {/* Imagen */}
        <div className="flex justify-center mb-6">
          <img
            src={formBody1.img_b64 || formBody1.url_imagen} // Muestra img_b64 si está disponible, de lo contrario url_imagen
            alt="Foto del alumno"
            className="w-32 h-40 rounded-full border border-gray-300"
          />
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-900">{formBody1.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Apellido Paterno:</span>
            <span className="text-gray-900">{formBody1.apellido_paterno}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Apellido Materno:</span>
            <span className="text-gray-900">{formBody1.apellido_materno}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Especialidad:</span>
            <span className="text-gray-900">{formBody1.especialidad}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Sexo:</span>
            <span className="text-gray-900">{formBody1.sexo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{formBody1.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <span className="text-gray-900">{formBody1.telefono}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Dirección:</span>
            <span className="text-gray-900">{formBody1.direccion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Fecha de Nacimiento:</span>
            <span className="text-gray-900">{formBody1.fecha_nacimiento}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tipo de Documento:</span>
            <span className="text-gray-900">{formBody1.tipo_doc}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Número de Documento:</span>
            <span className="text-gray-900">{formBody1.num_documento}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Institución:</span>
            <span className="text-gray-900">{institucionSeleccionada}</span>
          </div>

          
          
          
          
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Departamento:</span>
            <span className="text-gray-900">{departamento}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Provincia:</span>
            <span className="text-gray-900">{provincia}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Distrito:</span>
            <span className="text-gray-900">{distrito}</span>
          </div>
        </div>
        {/* Listado de cursos */}
        <div>
            <h2 className="text-2xl font-bold text-blue-500 mt-6 mb-4">Cursos Asignados</h2>
            {formBody1.cursos && formBody1.cursos.length > 0 ? (
              <ul className="space-y-2">
                {formBody1.cursos.map((curso, index) => (
                  <li
                    key={curso.id_curso || index}
                    className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col"
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      {curso.nombre_curso}
                    </span>
                    
                    <span className="text-sm text-gray-500">Estado: {curso.estado}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Este docente no tiene cursos asignados.</p>
            )}
          </div>
        {/* Botón de regreso */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onBackToListado}
            className="py-3 px-10 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
          >
            Regresar
          </button>
        </div>
      </div>
    </>
  );
};

export default DetalleDocente;
