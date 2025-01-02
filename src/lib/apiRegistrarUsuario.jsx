// import axios from "axios";

// const API_BASE_URL = "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-02-registroUsuario";

// export const registerUser = async (userData) => {
//   try {
//     const response = await axios.post(API_BASE_URL, userData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await response.json();
//     if (data.status !== "SUCCESS") {
//       return { status: "FAILED", message: data.message || "Error al registrar" };
//     }
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error("Error al registrar el usuario:", error);
//     throw error;
//   }
// };

export const registerUser = async (userData) => {
  const response = await fetch(
    "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-02-registroUsuario",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  // if (!response.ok) {
  //   return { status: "FAILED", message: data.message || "Error al iniciar sesión" };
  // }
  

  const data = await response.json();
  if (data.status !== "SUCCESS") {
    return { status: "FAILED", message: data.message || "Error al iniciar sesión" };
  }
  console.log(data)

  return data;
};