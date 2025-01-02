import React, { useEffect } from "react";
import Header from "../../components/Header";
import Contenedor from "../../components/Contenedor";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, roles,token,error, loading } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      console.log("Cargando...");
    }
    if (error) {
      console.error("Error:", error);
    }

    // Verificar si el rol está en localStorage o contexto
    const savedRole = localStorage.getItem("userRole");
    if (!savedRole) {
      // Si no hay rol guardado, redirigir al login o roles
      navigate("/roles");
    }
  }, [loading, error, navigate]);

  
  return (
    <div className="bg-gray-300 h-screen flex flex-col">
      <div className="flex flex-col flex-grow">
        {/* <Header /> */}
        <Contenedor roles={roles} />
      </div>
    </div>
  )
}

export default Dashboard