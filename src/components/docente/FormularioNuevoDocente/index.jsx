import React, { useContext, useState } from "react";
import RegistroFormulario from "../../FormularioUsuario";
import { verificarUsuarioExite } from "../../../lib/apiVerificarUsuario";
import PopupErrorRegister from "../../../Popups/RegistroError";
import PopupSuccesGeneral from "../../../Popups/SuccesGeneral";
import { useNavigate } from "react-router-dom";
import PopupErrorGeneral from "../../../Popups/ErrorGeneral";
import { useAuthContext } from "../../../context/AuthContext";
import SelectorGrados from "../../SelectorGrados";
import { useRolContext } from "../../../context/RolContext";

import { useUserContext } from "../../../context/UserContext";


const FormularioNuevoDocente = ({onBackToListado }) => {
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
            console.log("status: "+response.status +"y" + status)
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

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center ">
      <div className="bg-white p-6 rounded-lg w-[800px] shadow-lg">
      {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Paso 1: Verificar Usuario</h1>
            <form onSubmit={handleSaveDocumento}>
      <div className="text-left mb-6">
        <label htmlFor="tipo_doc" className="block text-sm font-medium text-blue-600 mb-2">
          Tipo de documento
        </label>
        <select
          name="tipo_doc"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Selecciona el tipo de documento</option>
          <option value="DNI">DNI</option>
          <option value="Carne de extranjería">Carné de extranjería</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      <div className="text-left mb-6">
        <label htmlFor="num_documento" className="block text-sm font-medium text-blue-600 mb-2">
          Número de documento
        </label>
        <input
          type="text"
          name="num_documento"
          placeholder="Número de documento"
          value={numDocumento}
          onChange={(e) => setNumDocumento(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
        />
        {errorMessage.documento && (
          <p className="ml-1 text-red-500 text-sm mt-0 col-start-2">{errorMessage.documento}</p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBackToListado}
          className="py-3 px-4 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Regresar al listado
        </button>
        <button
          type="submit"
          className="py-3 px-4 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
        >
          Verificar Usuario
        </button>
      </div>
    </form>
          
          {showErrorPopup && (
            <PopupErrorRegister 
              message={modalMessageError} 
              onClose={handleClosePopupError} 
            />
          )}
          {showPopupSucces && (
            <PopupSuccesGeneral
              
              message={modalMessageSucces} 
              onClose={handleClosePopupSucces} 
            />
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
                className={`bg-blue-500  w-[150px] text-white px-4 py-2 rounded `}
              >
                Atras
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={`bg-blue-500 w-[150px] text-white px-4 py-2 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isFormValid}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormularioNuevoDocente;
