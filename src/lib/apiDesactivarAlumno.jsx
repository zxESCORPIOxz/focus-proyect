export const desactivarAlumno = async (token, id_alumno) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-08-DesactivarAlumno",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id_alumno }),
        }
      );
  
      const data = await response.json();
  
      // Manejar el estado LOGOUT
      if (data.status === "LOGOUT") {
        return {
          status: "LOGOUT",
          message: data.message || "Sesión expirada.",
        };
      }
  
      // Manejar errores generales
      if (data.status !== "SUCCESS") {
        return {
          status: "FAILED",
          message: data.message || "Error al desactivar alumno",
        };
      }
  
      
  
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
      };
    } catch (error) {
      console.error("Error en el desactivar alumno:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al desactivar alumno",
      };
    }
  };
  