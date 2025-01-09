import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias } from "../../lib/apiUbigeo";
import PopupErrorRegister from "../../Popups/RegistroError";
import SelectorGrados from "../SelectorGrados";
import { useRolContext } from "../../context/RolContext";
import { registrarAlumno } from "../../lib/apiRegistrarAlumno";
import PopupSuccesGeneral from "../../Popups/SuccesGeneral";

const RegistroAlumno = ({  botonTexto,onFormValidation,onSuccess  }) => {
  
  const {selectedMatriculaId,institucionId } = useRolContext();
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

  const [formBody1 , setFormBody1]  = useState({
    token: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    sexo: "",
    email: "",
    telefono: "",
    ubigeo: "",
    direccion: "",
    fecha_nacimiento: "",
    tipo_doc: "",
    num_documento: "",
    id_institucion: "",
    id_matricula: "",
    id_seccion: "",
    img_b64: "",  
  });
  
  
  useEffect(() => {
    setFormBody1((prevFormBody) => ({
      ...prevFormBody,
      id_institucion: institucionId,
    }));
    setFormBody1((prevFormBody) => ({
      ...prevFormBody,
      token: token,
    }));
    setFormBody1((prevFormBody) => ({
      ...prevFormBody,
      id_matricula: selectedMatriculaId,
    }));
  }, [institucionId,token,selectedMatriculaId]);

  const handleSeccionChange = (idSeccion) => {
    setFormBody1((prevFormBody) => ({
      ...prevFormBody,
      id_seccion: idSeccion, 
    }));
  };
  

  

  // Maneja los cambios en los inputs de ubigeo
  const handleInputChangeUbigeo = (e) => {
    const { name, value } = e.target;
    setUbigeo((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "departamento" && { provincia: "", distrito: "" }),
      ...(name === "provincia" && { distrito: "" }),
    }));
    if (name === "distrito") {
      setFormBody1({ ...formBody1, ubigeo: value });
    }
  };

  
 

  const validateDocument = () => {
    const { tipo_doc, num_documento } = formBody1;
    console.log(num_documento)
    const longitudEsperada = tipo_doc === "DNI" ? 8 : 12;
    if (num_documento.length !== longitudEsperada) {
      return `El ${tipo_doc} debe tener ${longitudEsperada} caracteres.`;
    }
    return "";
  };

  const validateTelefono = () => {
    if (!/^\d{9}$/.test(formBody1.telefono)) {
      return "El teléfono debe ser un número válido de 9 dígitos.";
    }
    return "";
  };

  const validateDireccion = () => {
    if (formBody1.direccion.length < 10) {
      return "La dirección debe tener al menos 10 caracteres.";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};

    const documentError = validateDocument();
    if (documentError) errors.documento = documentError;

    const telefonoError = validateTelefono();
    if (telefonoError) errors.telefono = telefonoError;

    const direccionError = validateDireccion();
    if (direccionError) errors.direccion = direccionError;

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormBody1({ ...formBody1, [name]: value });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          setFormBody1({ ...formBody1, img_b64: base64String });
        };
        reader.readAsDataURL(file);
        setErrorMessage({ ...errorMessage, imagen: "" });
      } else {
        setErrorMessage({ ...errorMessage, imagen: "Por favor selecciona una imagen válida." });
        setFormBody1({ ...formBody1, img_b64: "" || DEFAULT_BASE64_IMAGE});
      }
    }
  };
  useEffect(() => {
      if (modalMessageError) {
        setShowErrorPopup(true);
      }
    }, [modalMessageError]);

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };


  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };



  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formBody1)

    if (validateForm()) {
      try {
        const response = await registrarAlumno(formBody1);
        if (response && response.status === "SUCCESS") {
          onFormValidation(true);
          setShowPopupSucces(true);
          setSuccessMessage(response.message)
          setTimeout(() => {
            onSuccess();
            setShowPopupSucces(false);
            onFormValidation(false);
          }, 2500);
        }else if (response.status === "LOGOUT") {
          setStatus("LOGOUT");
          setModalMessageError(response.message); // Configura el mensaje de error
          setShowErrorPopup(true); // Muestra el popup de error
        } else if (response.status === "FAILED") {
          setModalMessageError(response.message);
          setShowErrorPopup(true);

        }
        
      } catch (err) {
        console.error("Error al registrar usuario", err);
      }   
      
    }
  };

  // Cargar ubigeos desde la API
  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const data = await fetchDepartamentos();
        setUbigeo((prevState) => ({ ...prevState, departamentos: data }));
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };
    loadDepartamentos();
  }, []);

  useEffect(() => {
    const loadProvincias = async () => {
      if (ubigeo.departamento) {
        try {
          const data = await fetchProvincias(ubigeo.departamento);
          setUbigeo((prevState) => ({ ...prevState, provincias: data }));
        } catch (error) {
          console.error("Error al cargar provincias:", error);
        }
      }
    };
    loadProvincias();
  }, [ubigeo.departamento]);

  useEffect(() => {
    const loadDistritos = async () => {
      if (ubigeo.provincia) {
        try {
          const data = await fetchDistritos(ubigeo.provincia);
          setUbigeo((prevState) => ({ ...prevState, distritos: data }));
        } catch (error) {
          console.error("Error al cargar distritos:", error);
        }
      }
    };
    loadDistritos();
  }, [ubigeo.provincia]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg md:max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Paso 2: Registrar Alumno</h1>
        {/* Sección de SelectorGrados */}
      <div className="space-y-4 mb-3">
        <h2 className="text-2xl font-semibold text-blue-600">Información Académica</h2>
        <SelectorGrados
          token={token}
          id_institucion={institucionId}
          onSeccionChange={handleSeccionChange}
        />
      </div>
        {/* Sección de Datos Personales */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600">Datos Personales</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formBody1.nombre}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_paterno"
              placeholder="Apellido Paterno"
              value={formBody1.apellido_paterno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_materno"
              placeholder="Apellido Materno"
              value={formBody1.apellido_materno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <select
              name="sexo"
              value={formBody1.sexo}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option className="text-black"  value="">Sexo</option>
              <option className="text-black"  value="Masculino">Masculino</option>
              <option className="text-black"  value="Femenino">Femenino</option>
            </select>
           
          </div>
          

          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formBody1.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          

          

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formBody1.telefono}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />
          {errorMessage.telefono && (
                <p className="ml-1 text-red-500 text-sm mt-2">{errorMessage.telefono}</p>
              )}

          <select
            name="departamento"
            value={ubigeo.departamento}
            onChange={handleInputChangeUbigeo}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Seleccione un departamento</option>
            {ubigeo.departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>{dep.nombre}</option>
            ))}
          </select>

          <select
            name="provincia"
            value={ubigeo.provincia}
            onChange={handleInputChangeUbigeo}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            disabled={!ubigeo.departamento}
          >
            <option value="">Seleccione una provincia</option>
            {ubigeo.provincias.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>

          <select
            name="distrito"
            value={ubigeo.distrito}
            onChange={handleInputChangeUbigeo}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            disabled={!ubigeo.provincia}
          >
            <option value="">Seleccione un distrito</option>
            {ubigeo.distritos.map((dist) => (
              <option key={dist.id} value={dist.id}>{dist.nombre}</option>
            ))}
          </select>

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formBody1.direccion}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          {errorMessage.direccion && (
                <p className="ml-1 text-red-500 text-sm mt-2">{errorMessage.direccion}</p>
              )}

          <input
            type="date"
            name="fecha_nacimiento"
            value={formBody1.fecha_nacimiento}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="tipo_doc"
              value={formBody1.tipo_doc}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option className="text-black"  value="">Tipo de Documento</option>
              <option className="text-black"  value="DNI">DNI</option>
              <option className="text-black"  value="Carne de extranjería">Carne de extranjería</option>
              <option className="text-black"  value="Pasaporte">Pasaporte</option>
            </select>

            <input
              type="text"
              name="num_documento"
              placeholder="Número de Documento"
              value={formBody1.num_documento}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 "
            />

            {errorMessage.documento && (
                <p className="ml-1 text-red-500 text-sm mt-0 col-start-2">{errorMessage.documento}</p>
              )}     
          </div>
          
          
          <div className="mt-4">
            <label className="block mb-2 text-sm text-blue-600">Foto (Fondo blanco recomendado)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errorMessage.imagen && (
                <p className="text-red-500 text-sm mt-2">{errorMessage.imagen}</p>
              )}
            </div>
            {formBody1.img_b64 && (
              <div className="mt-4">
                <label className="block mb-2 text-sm text-blue-600">Vista previa:</label>
                <div className=" flex justify-center items-center"> 
                  
                  <img
                    src={`data:image/jpeg;base64,${formBody1.img_b64}`}
                    alt="Vista previa de la imagen"
                    className="w-[150px] h-[200px] object-cover rounded-lg mt-2"
                  />
                </div>
              </div>
              
            )}

          {errorMessage.imagen && <p className="text-red-500 text-sm">{errorMessage.imagen}</p>}
          
          <button
        type="submit"
        className="w-full mt-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition duration-300"
      >
        {botonTexto}
      </button>
         
        </form>
      </div>
        

      {/* Otros campos y el botón de envío */}
      
      

      {/* Popups */}
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
      </div>
      

    </>
  );
};

export default RegistroAlumno;
