export const listarAlumnos = async (token, id_institucion, id_matricula) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-07-ListarAlumnos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id_institucion, id_matricula }),
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
          message: data.message || "Error al listar los alumnos.",
        };
      }
  
      // Verificar si hay alumnos listados
      if (!data.alumnos || data.alumnos.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron alumnos para los parámetros proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
        alumnos: data.alumnos,
      };
    } catch (error) {
      console.error("Error en el listar alumnos:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar los alumnos",
      };
    }
  };
  