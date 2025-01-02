import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDepartamentos, fetchDistritos, fetchProvincias } from "../../lib/apiUbigeo";
import { useAuthContext } from "../../context/AuthContext";
import PopupErrorRegister from "../../Popups/RegistroError";
import { useRegisterContext } from "../../context/RegisterContext";
import PopupSuccesRegister from "../../Popups/RegisterSucces";

const RegistroFormulario = ({ titulo, botonTexto,onFormValidation }) => {
  // const { clearAuth } = useAuthContext();
  const { user,
    loading,
    status,
    error,
    successMessage,
    register,
    clearRegisterState } = useRegisterContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const [showPopupSucces, setShowPopupSucces] = useState(false);

  const [ubigeo, setUbigeo] = useState({
    departamentos: [],
    provincias: [],
    distritos: [],
    departamento: "",
    provincia: "",
    distrito: "",
  });

  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    sexo: "",
    email: "",
    password: "",
    telefono: "",
    ubigeo: "",
    direccion: "",
    fecha_nacimiento: "",
    tipo_doc: "",
    num_documento: "",
    img_b64: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
  });
  
  const DEFAULT_BASE64_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";

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
      setFormData({ ...formData, ubigeo: value });
    }
  };

  // Validaciones de campos específicos
  const validatePasswords = () => {
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const validateDocument = () => {
    const { tipo_doc, num_documento } = formData;
    const longitudEsperada = tipo_doc === "DNI" ? 8 : 12;
    if (num_documento.length !== longitudEsperada) {
      return `El ${tipo_doc} debe tener ${longitudEsperada} caracteres.`;
    }
    return "";
  };

  const validateTelefono = () => {
    if (!/^\d{9}$/.test(formData.telefono)) {
      return "El teléfono debe ser un número válido de 9 dígitos.";
    }
    return "";
  };

  const validateDireccion = () => {
    if (formData.direccion.length < 10) {
      return "La dirección debe tener al menos 10 caracteres.";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    const passwordError = validatePasswords();
    if (passwordError) errors.password = passwordError;

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
    setFormData({ ...formData, [name]: value });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          setFormData({ ...formData, img_b64: base64String });
        };
        reader.readAsDataURL(file);
        setErrorMessage({ ...errorMessage, imagen: "" });
      } else {
        setErrorMessage({ ...errorMessage, imagen: "Por favor selecciona una imagen válida." });
        setFormData({ ...formData, img_b64: "" || DEFAULT_BASE64_IMAGE});
      }
    }
  };
  useEffect(() => {
      if (error) {
        setShowPopup(true);
      }
    }, [error]);
  // useEffect(() => {
  //   if (status === "SUCCESS") {
  //       setShowPopupSucces(true);
  //   }
  // }, [status]);
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };



  

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (validateForm()) {
      try {
        const response = await register(formData);
        if (response && response.status === "SUCCESS") {
          onFormValidation(true);
          setShowPopupSucces(true);
        } else {
          console.error("Error en el registro: ", response.message);
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
        <h1 className="text-3xl font-bold mb-6 text-blue-600">{titulo}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_paterno"
              placeholder="Apellido Paterno"
              value={formData.apellido_paterno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_materno"
              placeholder="Apellido Materno"
              value={formData.apellido_materno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <select
              name="sexo"
              value={formData.sexo}
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
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value) }
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repetir Contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFormData({ ...formData, password: e.target.value }); 
              }}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            {validatePasswords() && (
              <p className="ml-1 text-red-500 text-sm mt-2">{validatePasswords()}</p>
            )}
          </div>

          

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
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
            value={formData.direccion}
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
            value={formData.fecha_nacimiento}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="tipo_doc"
              value={formData.tipo_doc}
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
              value={formData.num_documento}
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
            {formData.img_b64 && (
              <div className="mt-4">
                <label className="block mb-2 text-sm text-blue-600">Vista previa:</label>
                <div className=" flex justify-center items-center"> 
                  
                  <img
                    src={`data:image/jpeg;base64,${formData.img_b64}`}
                    alt="Vista previa de la imagen"
                    className="w-[150px] h-[200px] object-cover rounded-lg mt-2"
                  />
                </div>
              </div>
              
            )}

          {errorMessage.imagen && <p className="text-red-500 text-sm">{errorMessage.imagen}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition duration-300"
          >
            {botonTexto}
          </button>
        </form>
      </div>
      {showPopup && (
        <PopupErrorRegister 
          message={error} 
          onClose={handleClosePopup} 
        />
      )}

      {showPopupSucces && (
        <PopupSuccesRegister
          
          message={successMessage} 
          onClose={handleClosePopupSucces} 
        />
      )}
    </>
  );
};

export default RegistroFormulario;
