import RegistroFormulario from "../../components/FormularioUsuario";


const Registro = () => {
  const handleFormValidation = (isValid) => {
    if (isValid) {
      console.log("El formulario es válido.");
    } else {
      console.log("El formulario no es válido.");
    }
  };

  return (
      <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5155A6] to-[#4B7DBF]">
        
          <RegistroFormulario
            titulo="Registro"
            botonTexto="Registrarse"
            onFormValidation={handleFormValidation}
          />
          
        </div>
        
      </>
  );
};

export default Registro;