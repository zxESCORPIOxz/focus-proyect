export const listarRoles = async (token) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-03-ObtenerRolesUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token}),
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

      // Verificar si hay alumnos listados
      if (!data.entities || data.entities.length === 0) {
        return {
          status: "EMPTY",
          message: "No se encontraron roles",
        };
      }
  
      // Manejar errores generales
      if (data.status !== "SUCCESS") {
        return {
          status: "FAILED",
          message: data.message || "Error al listar los alumnos.",
        };
      }

  
      
      // Si todo es correcto, devolver la lista de alumnos
      return {
        status: "SUCCESS",
        message: data.message,
        num_documento:data.num_documento,
        entities: data.entities,
      };
    } catch (error) {
      console.error("Error en el listar alumnos:", error);
      return {
        status: "FAILED",
        message: "Ocurrió un error inesperado al listar los alumnos",
      };
    }
  };