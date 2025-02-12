export const listarAsistenciaApoderado= async (token, id_alumno_matricula, id_curso) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-26-ListarAlumnoAsistenciaCurso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id_alumno_matricula, id_curso  }),
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
          message: data.message || "Error al listar las asistencias del alumno.",
        };
      }
  
      // Verificar si hay alumnos listados
      if (!data.asistencia || data.asistencia.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron asistencias para los parámetros proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
        asistencia: data.asistencia,
      };
    } catch (error) {
      console.error("Error en el listar asistencias:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar asistencia del alumno",
      };
    }
  };
  