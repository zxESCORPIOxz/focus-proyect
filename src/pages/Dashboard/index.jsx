import React, { useEffect } from "react";
import Header from "../../components/Header";
import Contenedor from "../../components/Contenedor";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, roles, token, error, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el rol está en localStorage al cargar la página
    const savedRole = localStorage.getItem("userRole");

    // Si no hay rol guardado en localStorage, redirigir al componente de roles
    if (savedRole) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (loading) {
      console.log("Cargando...");
    }
    if (error) {
      console.error("Error:", error);
    }
  }, [loading, error]);

  return (
    <div className="bg-gray-300 h-screen flex flex-col overflow-x-hidden">
      <div className="flex flex-col flex-grow">
        {/* <Header /> */}
        <Contenedor roles={roles} />
      </div>
    </div>
  );
};

export default Dashboard;
