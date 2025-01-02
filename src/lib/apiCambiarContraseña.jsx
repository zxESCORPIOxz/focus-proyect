export const cambiarContraseña = async (email,codigoRecuperacion,nuevaContraseña) => {
    const response = await fetch(
      "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-05-CambiarContraConCodigo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,codigoRecuperacion,nuevaContraseña}),
      }
    );
  

    
  
    const data = await response.json();
    if (data.status !== "SUCCESS") {
      return { status: "FAILED", message: data.message || "Error al iniciar sesión" };
    }

  
    return data;
  };