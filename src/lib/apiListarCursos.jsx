export const listarCursos = async (token, id_docente) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-18-ListarCursosNotas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id_docente  }),
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
          message: data.message || "Error al listar los cursos.",
        };
      }
  
      // Verificar si hay alumnos listados
      if (!data.cursos || data.cursos.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron cursos para los parámetros proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
        cursos: data.cursos,
      };
    } catch (error) {
      console.error("Error en el listar alumnos:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar los cursos del docente",
      };
    }
  };
  