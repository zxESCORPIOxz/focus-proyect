// import React from 'react'

// import {
//     FaUser
//   } from 'react-icons/fa';


// const defaultUser= "../src/assets/User4.png"
// const Header = () => {
//   return (
//     <>
//         <header className="flex justify-between items-center py-4   shadow-md text-white bg-[#5155A6] ">
//             <div className="flex items-center ml-2">
//                 <a href="#" className="text-4xl font-semibold ml-8">FocusClass</a>    
//             </div>
//             <div className="flex items-center mr-8">
//                 <i className="fas fa-bell mr-8 text-xl cursor-pointer"></i>
//                 <div className="flex items-center">
//                 {/* <FaUser className="text-white w-10 h-10" /> */}
//                 <img
//                     src="./pic/img.jpg"
//                     alt="User"
//                     className="w-10 h-10 rounded-full"
//                     onError={(e) => (e.target.src = defaultUser)}
//                 />
//                 <h4 className="ml-4 font-semibold">Jhon Viek</h4>
//                 </div>
//             </div>
            
//         </header>
//     </>
//   )
// }

// export default Header


import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';

const defaultUser = "../src/assets/User4.png";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex flex-wrap justify-between items-center py-4 px-4 md:px-8 shadow-md text-white bg-[#5155A6]">
      {/* Logo / Título */}
      <div className="w-full md:w-auto flex justify-between items-center">
        <a href="#" className="text-2xl md:text-4xl font-semibold">FocusClass</a>
        
        {/* Botón de menú para pantallas pequeñas */}
        <button
          className="block md:hidden text-xl"
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      {isMenuOpen && (
        <div className="w-full flex flex-col space-y-4 mt-4 md:hidden">
          <a href="#" className="text-lg">Notificaciones</a>
          <a href="#" className="text-lg">Perfil</a>
        </div>
      )}

      {/* Icono de campana y perfil de usuario
      <div className="hidden md:flex items-center space-x-6">
        <FaBell className="text-xl cursor-pointer" />
        <div className="flex items-center">
          <img
            src="./pic/img.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
            onError={(e) => (e.target.src = defaultUser)}
          />
          <h4 className="ml-4 font-semibold hidden lg:block">Jhon Viek</h4>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
