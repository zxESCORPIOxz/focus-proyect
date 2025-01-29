export const editarNota = async (notaData) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-20-LevantarNotasPorBloque",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notaData),
        }
      );
  
      const data = await response.json();
  
      if (data.status === "LOGOUT") {
        return {
          status: "LOGOUT",
          message: data.message || "Sesión expirada.",
        };
      }
  
      if (data.status !== "SUCCESS") {
        return { status: "FAILED", message: data.message || "Error en el editar nota" };
      }
  
      return data;
    } catch (error) {
      console.error("Error en editar nota:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al editar nota",
      };
    }
  };