import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias, fetchUbigeoGeneral } from "../../../lib/apiUbigeo";
import PopupErrorRegister from "../../../Popups/RegistroError";
import SelectorGrados from "../../SelectorGrados";
import { useRolContext } from "../../../context/RolContext";
import { registrarAlumno } from "../../../lib/apiRegistrarAlumno";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useAlumnoContext } from "../../../context/AlumnoContext";
import { editarAlumno } from "../../../lib/apiEditarAlumno";

const EditarDocente = ({onBackToListado, onFormValidation,onSuccess  }) => {
  
  const {selectedMatriculaId,institucionId } = useRolContext();
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
    num_documento: alumnoSeleccionado.num_documento,
    id_institucion: institucionId,
    id_matricula: selectedMatriculaId,
    id_seccion: alumnoSeleccionado.id_seccion,
    img_b64: "",  
  });
  // console.log(formBody1)
  const [grados, setGrados] = useState({
    id_nivel:alumnoSeleccionado.id_nivel, 
    id_grado:alumnoSeleccionado.id_grado,
    id_seccion:alumnoSeleccionado.id_seccion,

 
  });

  



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
        const response = await editarAlumno(formBody1);
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

  useEffect(() => {
    const obtenerUbigeoGeneral = async () => {
      try {
        const data = await fetchUbigeoGeneral(alumnoSeleccionado.ubigeo);
        const departamento = data.departamento
        const provincia = data.provincia
        const distrito = data.distrito
        setUbigeo((prevState) => ({
          ...prevState,
          departamento: departamento.id,
          provincia: provincia.id,
          distrito: distrito.id,
        }));
        setDepartamento(data.departamento);
        setProvincia(data.provincia);
        setDistrito(data.distrito);
      } catch (error) {
        console.error("Error al obtener datos de ubigeo general:", error);
      }
    };
  
    if (alumnoSeleccionado.ubigeo) {
      obtenerUbigeoGeneral();
    }
  }, [alumnoSeleccionado.ubigeo]);
  console.log(ubigeo.departamento)

  return (
    <>
        EDITAR DOCENTE
      

    </>
  );
};

export default EditarDocente;
