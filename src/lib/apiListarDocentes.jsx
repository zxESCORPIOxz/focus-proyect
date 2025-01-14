export const listarDocentes = async (token, id_institucion) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-15-ListarDocentes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id_institucion }),
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
      if (!data.docentes || data.docentes.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron docentes para los parámetros proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
        docentes: data.docentes,
      };
    } catch (error) {
      console.error("Error en el listar alumnos:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar los alumnos",
      };
    }
  };
  