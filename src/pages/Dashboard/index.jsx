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
    }, [loading, error]);

    useEffect(() => {

      if (loading) return;

      if (!user || !roles.length) {
        navigate("/"); 
      }
    }, [user, roles, loading, navigate]);

  
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