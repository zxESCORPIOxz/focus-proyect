import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificarEnviarCorreo } from "../../lib/apiVerificarEnviarCorreo";
import PopupSuccesGeneral from "../../Popups/SuccesGeneral";
import PopupErrorRegister from "../../Popups/RegistroError";
import { cambiarContraseña } from "../../lib/apiCambiarContraseña";

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
          setStep(2);
        }, 2500);
      }else if (response.status === "FAILED") {
        console.log(response)
        setModalMessageError(response.message)
        setShowErrorPopup(true)
      }
    } catch (error) {
      
    }
    console.log("Verifying email:", email);
    
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const validateForm = () => {
    const errors = {};
    const passwordError = validatePasswords();
    if (passwordError) errors.password = passwordError;

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSavePassword = async (e) => {
    if (validateForm()) {
      try {
        const response = await cambiarContraseña(email,);
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
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5155A6] to-[#4B7DBF]">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative bg-gradient-to-b from-[#5155A6] to-[#4B7DBF] rounded-lg shadow-lg p-6 flex items-center justify-center text-white">
            <div className="relative z-10 text-center">
              <img 
                src="../src/assets/icon_focusclass.png" 
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
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
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

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
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
