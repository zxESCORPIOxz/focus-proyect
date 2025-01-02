import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";
import PopupError from "../../Popups/LoginError";

const Login = () => {
  const { login, setAuth, error, loading, user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/roles");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setShowPopup(true);
    }
  }, [error]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response && response.entities) {
        
        setAuth(response.entities, response.token, response.entities.map(role => role.rol));
        console.log("Inició sesión con éxito");
        navigate("/roles");
      } else {
        console.error("Error: 'entities' no está presente en la respuesta.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión", err);
    }
  };

  const handleRegistroClick = () => {

    navigate("/registro");
  };
  
  const handleContraseñaClick= () => {

    navigate("/recuperarContraseña");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5155A6] to-[#4B7DBF]">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative bg-gradient-to-b from-[#5155A6] to-[#4B7DBF] rounded-lg shadow-lg p-6 flex items-center justify-center text-white">
            <div className="relative z-10 text-center">
              <img 
                src='../assets/icon_focusclass.png' 
                alt="Icono FocusClass" 
                className="mx-auto w-20 h-20 object-contain mb-3"
              />
              <h1 className="text-3xl font-bold">FocusClass</h1>
              <p className="text-sm font-light">Organiza tus clases de manera eficiente</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div className="text-left">
            <label htmlFor="username" className="block text-sm font-medium text-blue-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="username"
              name="username"
              placeholder="Ingresa tu email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-blue-600 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
          <button
            type="button"
            onClick={handleRegistroClick}
            className="w-full py-3 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-500 transition duration-300"
          >
            Registrarse
          </button>


          <a
            onClick={handleContraseñaClick}
            className="block mt-4 text-sm text-red-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>

      {showPopup && (
        <PopupError 
          message={error} 
          onClose={handleClosePopup} 
        />
      )}
    </div>
  );
};

export default Login;
