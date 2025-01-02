export const verificarUsuarioExite = async (token,tipoDocumento,numDocumento) => {
    const response = await fetch(
      "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-06-ValidarExistenciaUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token,tipoDocumento,numDocumento}),
      }
    );
  

    
  
    const data = await response.json();
    if (data.status !== "SUCCESS") {
      return { status: "FAILED", message: data.message || "Error al verificar el usuario" };
    }

  
    return data;
  };