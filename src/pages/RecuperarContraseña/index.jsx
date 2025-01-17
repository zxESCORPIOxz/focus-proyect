import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificarEnviarCorreo } from "../../lib/apiVerificarEnviarCorreo";
import PopupSuccesGeneral from "../../Popups/SuccesGeneral";
import PopupErrorRegister from "../../Popups/RegistroError";
import { cambiarContrasena } from "../../lib/apiCambiarContraseña";

const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Verify email, 2: Set new password
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showPopupSucces, setShowPopupSucces] = useState(false);
  const [modalMessageSucces, setModalMessageSucces] = useState("");
  const [modalMessageError, setModalMessageError] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    });

  const handleClosePopupSucces = () => {
    setShowPopupSucces(false)
  };
  const handleClosePopupError = () => {
    setShowErrorPopup(false);
  };


  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await verificarEnviarCorreo(email);
      if (response && response.status === "SUCCESS") {
        setModalMessageSucces(response.message);
        setShowPopupSucces(true)
        setTimeout(() => {
          setShowPopupSucces(false);
          setModalMessageSucces("");
          setStep(2);
        }, 2500);
      }else if (response.status === "FAILED") {
        
        setModalMessageError(response.message)
        setShowErrorPopup(true)
      }
    } catch (error) { 
      console.error(error);
      setModalMessageError("Ha ocurrido un error, por favor intenta nuevamente.");
      setShowErrorPopup(true);
    }
    
    
  };

  const validateCorreo = (email) => {
    if (!email) return "El correo no puede estar vacío.";
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return "El correo no es válido.";
    return "";
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const validateForm = () => {
    const errors = {};
    const correoError = validateCorreo(email);
    if (correoError) errors.correo = correoError;
  
    const passwordError = validatePasswords();
    if (passwordError) errors.password = passwordError;
  
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const isSaveDisabled = () => {
    return (
      !verificationCode || 
      !password ||         
      !confirmPassword ||  
      password !== confirmPassword
    )
  };
  

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!isSaveDisabled()) {
      try {
        const response = await cambiarContrasena(
          email,
          verificationCode,
          confirmPassword
        );
        if (response && response.status === "SUCCESS") {
          setShowPopupSucces(true);
          setModalMessageSucces(response.message)
          setTimeout(() => {
            setShowPopupSucces(false);
            setModalMessageSucces(""); 
            navigate("/login"); 
          }, 2500);
        } else {
          setModalMessageError(response.message);
          setShowErrorPopup(true);
        }
      } catch (err) {
        console.error("Error al cambiar contraseña", err);
        setModalMessageError("Ha ocurrido un error. Por favor, intenta de nuevo.");
        setShowErrorPopup(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5155A6] to-[#4B7DBF]">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative bg-gradient-to-b from-[#5155A6] to-[#4B7DBF] rounded-lg shadow-lg p-6 flex items-center justify-center text-white">
            <div className="relative z-10 text-center">
              <img 
                src="https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-01-imagen?img=icon_focusclass" 
                alt="Icono FocusClass" 
                className="mx-auto w-20 h-20 object-contain mb-3"
              />
              <h1 className="text-3xl font-bold">Recuperar Contraseña</h1>
              <p className="text-sm font-light">Ingresa tu correo y sigue los pasos</p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-blue-600 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingresa tu email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
              />
              {validateCorreo(email) && (
              <p className="ml-1 text-red-500 text-sm mt-2">{validateCorreo(email)}</p>
            )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
            >
              Verificar correo
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSavePassword} className="space-y-6">
            <div className="text-left">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-blue-600 mb-2">
                Código de verificación
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                placeholder="Ingresa el código"
                value={verificationCode}
                required
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
              />
            </div>

            <div className="text-left">
              <label htmlFor="newPassword" className="block text-sm font-medium text-blue-600 mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
              />
            </div>
            
            <div className="text-left">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-600 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
              />
            </div>
            {validatePasswords() && (
              <p className="ml-1 text-red-500 text-sm mt-2">{validatePasswords()}</p>
            )}
            
            <button
              type="submit"
              disabled={isSaveDisabled()}
              className={`w-full py-3 font-medium text-lg rounded-lg transition duration-300 ${
                isSaveDisabled() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-indigo-500 text-white"
              }`}
            >
              Guardar contraseña
            </button>
          </form>
        )}
      </div>
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
  );
};

export default RecuperarContraseña;
