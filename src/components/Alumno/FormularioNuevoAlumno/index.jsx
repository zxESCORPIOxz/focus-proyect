import React, { useContext, useState } from "react";
import RegistroFormulario from "../../FormularioUsuario";
import { verificarUsuarioExite } from "../../../lib/apiVerificarUsuario";
import PopupErrorRegister from "../../../Popups/RegistroError";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useNavigate } from "react-router-dom";
import PopupErrorGeneral from "../../../Popups/ErrorGeneral";
import { useAuthContext } from "../../../context/AuthContext";
import SelectorGrados from "../../SelectorGrados";


import { useUserContext } from "../../../context/UserContext";
import FormularioMatriculaAlumno from "../MatricularUsuario";
import RegistroAlumno from "../RegistroAlumno";

const FormularioNuevoAlumno = ({onBackToListado }) => {
  const { clearAuth } = useAuthContext();
  const { guardarUsuarioVerificado } = useUserContext();
  const [step, setStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numDocumento, setNumDocumento] = useState("");
  const token = localStorage.getItem("token")
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showPopupSucces, setShowPopupSucces] = useState(false);
  const [modalMessageSucces, setModalMessageSucces] = useState("");
  const [modalMessageError, setModalMessageError] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    });
  
  const navigate = useNavigate();
  const validateDocument = () => {
    
    const longitudEsperada = tipoDocumento === "DNI" ? 8 : 12;
    if (numDocumento.length !== longitudEsperada) {
      return `El ${tipoDocumento} debe tener ${longitudEsperada} caracteres.`;
    }
    return "";
  };

  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };
  const handleSuccess = () => {
    setStep(1); // Cambia al paso 1
  };
  const handleSuccessMatricula = () => {
    setStep(1); // Cambia al paso 1
  };
  
  const handleClosePopupError = () => {

    if(status === "LOGOUT"){
      setShowErrorPopup(false);
      clearAuth()
      navigate("/login")
    }else {
      setShowErrorPopup(false);
      nextStep(2)
    }
    
  };

  const validateForm = () => {
    const errors = {};
    const documentError = validateDocument();
    if (documentError) errors.documento = documentError;

  
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDocumento = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await verificarUsuarioExite(token, tipoDocumento, numDocumento);
        if (response && response.status === "SUCCESS") {
          guardarUsuarioVerificado(response.user)
          setModalMessageSucces(response.message);
          setShowPopupSucces(true)
          setTimeout(() => {
            setShowPopupSucces(false);
            setStep(3);
          }, 2500);
          setShowPopupSucces(true);
        } else if( response.status === "LOGOUT"){
            setStatus("LOGOUT")
            setModalMessageError(response.message);
            setShowErrorPopup(true);
            
        }else if(response.status === "FAILED"){
          
          setModalMessageError(response.message)
          setShowErrorPopup(true)

          
          console.error("Error al verificar usuario if: ", response.message);
        }
      } catch (err) {
        console.error("Error al verificar usuario try", err);
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const firstStep = () => setStep(step - 2);

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-md shadow-lg md:max-w-lg lg:max-w-2xl">
        {step === 1 && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 text-center">
              Paso 1: Verificar Usuario
            </h1>
            <form onSubmit={handleSaveDocumento}>
              {/* Tipo de documento */}
              <div className="text-left mb-4">
                <label
                  htmlFor="tipo_doc"
                  className="block text-sm font-medium text-blue-600 mb-1"
                >
                  Tipo de documento
                </label>
                <select
                  name="tipo_doc"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Selecciona el tipo de documento</option>
                  <option value="DNI">DNI</option>
                  <option value="Carne de extranjería">Carné de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
  
              {/* Número de documento */}
              <div className="text-left mb-4">
                <label
                  htmlFor="num_documento"
                  className="block text-sm font-medium text-blue-600 mb-1"
                >
                  Número de documento
                </label>
                <input
                  type="text"
                  name="num_documento"
                  placeholder="Número de documento"
                  value={numDocumento}
                  onChange={(e) => setNumDocumento(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
                {errorMessage.documento && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.documento}</p>
                )}
              </div>
  
              {/* Botones */}
              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0">
                <button
                  type="button"
                  onClick={onBackToListado}
                  className="py-2 px-4 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
                >
                  Regresar al listado
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
                >
                  Verificar Usuario
                </button>
              </div>
            </form>
  
            {/* Popups */}
            {showErrorPopup && (
              <PopupErrorRegister message={modalMessageError} onClose={handleClosePopupError} />
            )}
            {showPopupSucces && (
              <PopupSuccesGeneral message={modalMessageSucces} onClose={handleClosePopupSucces} />
            )}
          </div>
        )}
        {step === 2 && (
          <>
            <RegistroAlumno
              botonTexto="Registrar Alumno"
              onFormValidation={handleFormValidation}
              onSuccess={handleSuccess}
            />
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-blue-500 w-[120px] text-white px-4 py-2 rounded"
              >
                Atrás
              </button>
             
            </div>
          </>
        )}                                      
        {step === 3 &&(
          <>
          <FormularioMatriculaAlumno onSuccess={handleSuccessMatricula} />
          <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={firstStep}
            className="bg-blue-500 w-[120px] text-white px-4 py-2 rounded"
          >
            Atrás
          </button>
         
        </div>
          </>
          
        ) }
      </div>
    </div>
  );
};

export default FormularioNuevoAlumno;
