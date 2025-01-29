// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { listarRoles } from "../../lib/apiListarRoles";
// import PopupErrorRegister from "../../Popups/RegistroError";
//  // Puedes usar cualquier spinner que prefieras

// const defaultImage = "https://108.181.169.248/assets/institucion.webp";

// const Rol = () => {
//   const { token, error,clearAuth } = useAuthContext();
//   const [loading, setLoading] = useState(true);  
//   const [rolesData, setRolesData] = useState([]);
//   const navigate = useNavigate();
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [modalMessageError, setModalMessageError] = useState("");
//   const [status, setStatus] = useState("");

//   const handleClosePopupError = () => {
//     setShowErrorPopup(false);
//     if (status === "LOGOUT" || status === "EMPTY") {
//       clearAuth(); 
//       navigate("/login"); 
//     }
    
//   };

  
//   useEffect(() => {
//       const fetchRoles = async () => {
        
//         const response = await listarRoles(token);
//         console.log(response)
//         if (response.status === "SUCCESS") {
//           setRolesData(response.entities);
          
//         } else if (response.status === "LOGOUT") {
//           setStatus("LOGOUT");
//           setModalMessageError(response.message);
//           setShowErrorPopup(true); 
//         } else if (response.status === "EMPTY") {
//           setModalMessageError(response.message);
//           setShowErrorPopup(true);
//         }else if(response.status === "FAILED"){

//         }
    
//         setLoading(false);
//       };
    
//       fetchRoles();
//     }, []);

//   const groupByRole = (entities) => {
//     return entities.reduce((acc, entity) => {
//       const { rol } = entity;
//       if (!acc[rol]) {
//         acc[rol] = [];
//       }
//       acc[rol].push(entity);
//       return acc;
//     }, {});
//   };

//   const groupedEntities = groupByRole(rolesData);

//   const handleRoleClick = (role, institutionName, id_institucion, matriculas) => {
//     localStorage.setItem("userRole", role);
//     localStorage.setItem("institucion", institutionName);
//     localStorage.setItem("id_institucion", id_institucion);
//     localStorage.setItem("matriculas", JSON.stringify(matriculas));
//     navigate("/dashboard");
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       {loading ? (
//         <div className="flex justify-center items-center h-96">
//           <LoadingSpinner/>
//         </div>
//       ) : error ? (
//         <p className="text-lg text-red-500">Error: {error}</p>
//       ) : status === "EMPTY" ? (
//         <p className="text-lg text-gray-500 mt-4">No hay roles disponibles.</p>
//       ) : (
//         Object.keys(groupedEntities).map((role, index) => (
//           <div key={index} className="w-full mt-4">
//             <h2 className="text-2xl font-bold text-blue-600 mb-4 md:text-center">{role}</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center lg:justify-start">
//               {groupedEntities[role].map((entity, idx) => (
//                 <div
//                   key={idx}
//                   className={`bg-white border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center cursor-pointer ${
//                     idx % 3 === 0 ? "md:col-start-2" : ""
//                   }`}
//                   onClick={() => handleRoleClick(role, entity.nombre_ie, entity.id_institucion, entity.matriculas)}
//                 >
//                   <div className="mr-4">
//                     <img
//                       src={entity.url_imagen_ie || defaultImage}
//                       alt="Logo Institución"
//                       className="w-16 h-16 object-contain"
//                       onError={(e) => (e.target.src = defaultImage)}
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xl font-semibold text-blue-500">{entity.nombre_ie}</p>
//                     <p className="text-gray-500 mt-2">Código: {entity.codigo}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//       {showErrorPopup && (
//                 <PopupErrorRegister 
//                   message={modalMessageError} 
//                   onClose={handleClosePopupError} 
//                 />
//               )}
//     </div>
//   );
  
  
// };

// export default Rol;
