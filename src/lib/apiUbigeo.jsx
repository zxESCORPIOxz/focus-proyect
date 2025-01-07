import axios from "axios";

const API_BASE_URL = "https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-02-ubigeo?ruta=departamentos";

export const fetchDepartamentos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    throw error;
  }
};

export const fetchProvincias = async (departamentoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/provincias`, {
      params: { id: departamentoId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener provincias:", error);
    throw error;
  }
};

export const fetchDistritos = async (provinciaId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/distritos`, {
      params: { id: provinciaId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener distritos:", error);
    throw error;
  }
};