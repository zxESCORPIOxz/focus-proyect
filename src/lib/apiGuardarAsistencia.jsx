export const guardarAsistencia = async (token,asistencias) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-23-ModificarAsistencias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token,asistencias}),
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
        return { status: "FAILED", message: data.message || "Error en el guardar registro de asistencia" };
      }
  
      return data;
    } catch (error) {
      console.error("Error en editarDocente:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al guardar registro de asistencia",
      };
    }
  };
  