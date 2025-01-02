export const verificarEnviarCorreo = async (email) => {
    const response = await fetch(
      "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-04-enviarCodRecCorreo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email}),
      }
    );
  

    
  
    const data = await response.json();
    if (data.status !== "SUCCESS") {
      return { status: "FAILED", message: data.message || "Error al iniciar sesión" };
    }

  
    return data;
  };