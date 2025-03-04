import React, { useEffect, useState } from 'react'
import { useRolContext } from '../../../context/RolContext';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import SelectorGrados from '../../SelectorGrados';
import { registrarAlumno } from '../../../lib/apiRegistrarAlumno';
import PopupErrorRegister from '../../../Popups/RegistroError';
import PopupSuccesGeneral from '../../../Popups/SuccesGeneral';
import { useAuthContext } from '../../../context/AuthContext';
import { registrarDocente } from '../../../lib/apiRegistrarDocente';

const MatricularDocente = ({onSuccess}) => {

    const {selectedMatriculaId,institucionId } = useRolContext();
    const {usuarioVerificado} = useUserContext();
    const { clearAuth } = useAuthContext();
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [modalMessageError, setModalMessageError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [showPopupSucces, setShowPopupSucces] = useState(false);
    const [status, setStatus] = useState("");
    const usuarioId=usuarioVerificado.id;
    const [errorMessage, setErrorMessage] = useState({
      });
    
    useEffect(() => {
        setFormBody2((prevFormBody) => ({
          ...prevFormBody,
          id_institucion: institucionId,
        }));
        setFormBody2((prevFormBody) => ({
          ...prevFormBody,
          token: token,
        }));

        setFormBody2((prevFormBody) => ({
            ...prevFormBody,
            id_usuario: usuarioId,
          }));
      }, [institucionId,token,selectedMatriculaId,usuarioId]);
      const validateEspecialidad= () => {
        if (formBody2.especialidad.length < 10) {
          return "La especialidad debe tener al menos 10 caracteres.";
        }
        return "";
      };

      const validateForm = () => {
        const errors = {};
    
        const especialidadError = validateEspecialidad();
        if (especialidadError) errors.especialidad = especialidadError;
    
        setErrorMessage(errors);
        return Object.keys(errors).length === 0;
      };

     
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormBody2({ ...formBody2, [name]: value });
      }; 
    
    const [formBody2 , setFormBody2]  = useState({
        token: "",
        id_usuario: "",
        especialidad: "", 
        id_institucion: "",
      });
      
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
        
    
        if (validateForm()) {
          try {
            const response = await registrarDocente(formBody2);
            if (response && response.status === "SUCCESS") {
              setShowPopupSucces(true);
              setSuccessMessage(response.message)
              setTimeout(() => {
                onSuccess();
                setShowPopupSucces(false);
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
    
    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg md:max-w-5xl">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">Paso 2: Registrar Docente</h1>
                {/* Sección de SelectorGrados */}
                <div className="space-y-4 mb-3">
                    <h2 className="text-2xl font-semibold text-blue-600">Información Académica</h2>
                    <input
                        type="text"
                        name="especialidad"
                        placeholder="Especialidad"
                        value={formBody2.especialidad}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                    />

                    {errorMessage.especialidad && (
                            <p className="ml-1 text-red-500 text-sm mt-2">{errorMessage.especialidad}</p>
                        )}
                </div>
                <button
                onClick={handleSubmit}
                className="mt-4 w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Registrar Docente
            </button>
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
    )
}

export default MatricularDocente