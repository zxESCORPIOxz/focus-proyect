import React, { useState } from "react";
import RegistroFormulario from "../FormularioUsuario";

const FormularioNuevoAlumno = () => {
  const [step, setStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    sexo: "",
    telefono: "",
    email: "",
    foto: "",
    ubigeo: "",
    direccion: "",
    fechaNacimiento: "",
    tipoDoc: "",
    numeroDocumento: "",
    seccion: "",
    grado: "",
    fechaInicio: "",
    anioInicio: "",
    anioAcademico: "",
    institucion: "",
  });

  const handleSaveDocumento = async (e) => {
      if (validateForm()) {
        try {
          const response = await cambiarContrasena( email,verificationCode,confirmPassword);
          if (response && response.status === "SUCCESS") {
            
            setShowPopupSucces(true);
          } else {
            console.error("Error en el registro: ", response.message);
          }
        } catch (err) {
          console.error("Error al registrar usuario", err);
        }
      }
      
    };


  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[800px] shadow-lg">
      {step === 1 && (
          <form onSubmit={handleSaveDocumento} className="">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-blue-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
             
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
            />
            {/* {validateCorreo(email) && (
            <p className="ml-1 text-red-500 text-sm mt-2">{validateCorreo(email)}</p>
          )} */}
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
          <>
            
            
            <RegistroFormulario
                titulo="Paso 1: Registrar Usuario"
                botonTexto="Registrar"
                onFormValidation={handleFormValidation}
            />
            <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={nextStep}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!isFormValid} // El botón se deshabilita funcionalmente
            >
              Siguiente
            </button>

            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-lg font-bold mb-4">Paso 2: Información Académica</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="seccion"
                placeholder="Sección"
                value={formData.seccion}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="grado"
                placeholder="Grado"
                value={formData.grado}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between">
                
                <button
                  type="button"
                  onClick={() => alert("Alumno creado!")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Finalizar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FormularioNuevoAlumno;
