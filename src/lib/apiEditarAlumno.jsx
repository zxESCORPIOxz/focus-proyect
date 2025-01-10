export const editarAlumno = async (alumnoData) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-11-ModificarAlumno",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(alumnoData),
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
        return { status: "FAILED", message: data.message || "Error en el registro del alumno" };
      }
  
      return data;
    } catch (error) {
      console.error("Error en registrarAlumno:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al registrar al alumno",
      };
    }
  };
  