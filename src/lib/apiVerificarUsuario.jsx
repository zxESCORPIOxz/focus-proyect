export const verificarUsuarioExite = async (token, tipo_doc, num_documento) => {
    try {
      const response = await fetch(
        "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-06-ValidarExistenciaUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, tipo_doc, num_documento }),
        }
      );
  
      const data = await response.json();
  
      // Manejar el estado LOGOUT
      if (data.status === "LOGOUT") {
        return { status: "LOGOUT", message: data.message || "Sesión expirada." };
      }
  
      // Manejar otros errores generales
      if (data.status !== "SUCCESS") {
        return { status: "FAILED", message: data.message || "Error al verificar el usuario." };
      }
  
      // Verificar si el usuario existe
      if (!data.user || !Array.isArray(data.user) || data.user.length === 0) {
        return {
          status: "FAILED",
          message: "No se encontraron datos de usuario en la respuesta.",
        };
      }
  
      // Verificar el estado del usuario específico
      const user = data.user[0];
      if (user.status === "FAILED") {
        return {
          status: "FAILED",
          message: user.mensaje || "El usuario no existe con el tipo y número de documento proporcionados.",
        };
      }
  
      // Si todo es correcto, devolver los datos del usuario
      return { status: "SUCCESS", message: data.message, user };
    } catch (error) {
      console.error("Error en la verificación del usuario:", error);
      return { status: "FAILED", message: "Ocurrió un error inesperado al verificar el usuario." };
    }
  };
  