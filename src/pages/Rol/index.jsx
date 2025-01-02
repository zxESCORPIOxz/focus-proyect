import React, { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const defaultImage = "../assets/institucion.webp";

const Rol = () => {
  const { user, roles, token, loading, error } = useAuthContext();
  const entities = user; // Asumiendo que 'user' contiene los roles
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log("Cargando...");
    }
    if (error) {
      console.error("Error:", error);
    }
  }, [loading, error]);

  const groupByRole = (entities) => {
    return entities.reduce((acc, entity) => {
      const { rol } = entity;
      if (!acc[rol]) {
        acc[rol] = [];
      }
      acc[rol].push(entity);
      return acc;
    }, {});
  };

  const groupedEntities = groupByRole(entities);

  const handleRoleClick = (role, institutionName) => {
    // Guarda el rol en el localStorage y redirige al dashboard
    localStorage.setItem("userRole", role);
    localStorage.setItem("institucion", institutionName);
  
    // Redirige al Dashboard después de guardar el rol
    navigate("/dashboard");
  };
  

  return (
    <div className="flex flex-col items-center p-4">
      {loading && <p className="text-lg font-semibold text-gray-600">Cargando...</p>}
      {error && <p className="text-lg text-red-500">Error: {error}</p>}
      {!loading && !error && entities && entities.length > 0 ? (
        Object.keys(groupedEntities).map((role, index) => (
          <div key={index} className="w-full mt-4">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 md:text-center">{role}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center lg:justify-start">
              {groupedEntities[role].map((entity, idx) => (
                <div
                  key={idx}
                  className={`bg-white border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center cursor-pointer ${
                    idx % 3 === 0 ? "md:col-start-2" : ""
                  }`}
                  onClick={() => handleRoleClick(role, entity.nombre_ie)}  // Se pasa el rol al hacer clic
                >
                  {/* Logo de la institución a la izquierda */}
                  <div className="mr-4">
                    <img
                      src={entity.url_imagen_ie || defaultImage}
                      alt="Logo Institución"
                      className="w-16 h-16 object-contain"
                      onError={(e) => (e.target.src = defaultImage)}
                    />
                  </div>
                  {/* Contenido de la tarjeta */}
                  <div>
                    <p className="text-xl font-semibold text-blue-500">{entity.nombre_ie}</p>
                    <p className="text-gray-500 mt-2">Código: {entity.codigo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500 mt-4">No hay roles disponibles.</p>
      )}
    </div>
  );
};

export default Rol;
