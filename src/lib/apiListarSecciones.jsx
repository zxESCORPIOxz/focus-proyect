export const listarGrados = async (token, id_institucion) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-12-ListarGrados",
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
          message:  "No se encontraron secciones para la institución proporcionada.",
        };
      }
  
      // Verificar si hay datos de grados disponibles
      if (!data.data || data.data.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron grados para los parámetros proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver la lista de grados
      return {
        status: "SUCCESS",
        message: data.message,
        niveles: data.data, // Aquí estamos devolviendo la data de grados
      };
    } catch (error) {
      console.error("Error al listar grados:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar los grados.",
      };
    }
  };
  