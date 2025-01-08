import React, { useState, useEffect } from 'react';
import { listarGrados } from '../../lib/apiListarSecciones';
import PopupErrorRegister from '../../Popups/RegistroError';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const SelectorGrados = ({ token, id_institucion,onSeccionChange  }) => {
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { clearAuth } = useAuthContext();

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === "LOGOUT") {
      clearAuth(); // Limpia cualquier dato relacionado con la autenticación
      navigate("/login"); // Redirigir al login
    }
    
  };
  const handleSeccionChange = (e) => {
    const selectedIdSeccion = e.target.value;
    setSeccionSeleccionada(selectedIdSeccion);
    if (onSeccionChange) {
      onSeccionChange(selectedIdSeccion); // Llama a la función pasada desde el padre
    }
  };

  useEffect(() => {
    // Llamar a la API para obtener los datos de niveles
    const fetchGrados = async () => {
      const data = await listarGrados(token, id_institucion);
        if (data.status === 'SUCCESS') {
            setNiveles(data.niveles);
             // Se asume que "grados" contiene los niveles
        }else if (data.status === "LOGOUT") {
            setStatus("LOGOUT");
            setModalMessageError(data.message); // Configura el mensaje de error
            setShowErrorPopup(true);
        }else{
            setModalMessageError(data.message);
            setShowErrorPopup(true);
        }
    };

    fetchGrados();
  }, [token, id_institucion]);

  // Actualizar grados según el nivel seleccionado
  useEffect(() => {
    if (nivelSeleccionado) {
      const selectedNivel = niveles.find(nivel => nivel.id_nivel === parseInt(nivelSeleccionado));
      setGrados(selectedNivel ? selectedNivel.grados : []);
      setGradoSeleccionado('');
      setSecciones([]); // Limpiar secciones
    }
  }, [nivelSeleccionado, niveles]);

  // Actualizar secciones según el grado seleccionado
  useEffect(() => {
    if (gradoSeleccionado) {
      const selectedGrado = grados.find(grado => grado.id_grado === parseInt(gradoSeleccionado));
      setSecciones(selectedGrado ? selectedGrado.secciones : []);
      setSeccionSeleccionada('');
    }
  }, [gradoSeleccionado, grados]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4"> {/* Flexbox para alinear horizontalmente */}
        
        {/* Sección de Nivel */}
        <div className="flex-1">
          {/* <label className="block font-semibold">Nivel</label> */}
          <select
            value={nivelSeleccionado}
            onChange={(e) => setNivelSeleccionado(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione un nivel</option>
            {Array.isArray(niveles) && niveles.map((nivel) => (
              <option key={nivel.id_nivel} value={nivel.id_nivel}>
                {nivel.nombre}
              </option>
            ))}
          </select>
        </div>
  
        {/* Sección de Grado */}
        <div className="flex-1">
          {/* <label className="block font-semibold">Grado</label> */}
          <select
            value={gradoSeleccionado}
            onChange={(e) => setGradoSeleccionado(e.target.value)}
            className="border p-2 rounded w-full"
            disabled={!nivelSeleccionado}
          >
            <option value="">Seleccione un grado</option>
            {Array.isArray(grados) && grados.map((grado) => (
              <option key={grado.id_grado} value={grado.id_grado}>
                {grado.nombre}
              </option>
            ))}
          </select>
        </div>
  
        {/* Sección de Sección */}
        <div className="flex-1">
          {/* <label className="block font-semibold">Sección</label> */}
          <select
            value={seccionSeleccionada}
            onChange={handleSeccionChange}
            className="border p-2 rounded w-full"
            disabled={!gradoSeleccionado}
          >
            <option value="">Seleccione una sección</option>
            {Array.isArray(secciones) && secciones.map((seccion) => (
              <option key={seccion.id_seccion} value={seccion.id_seccion}>
                {seccion.nombre}
              </option>
            ))}
          </select>
        </div>
  
      </div>
  
      {/* Mostrar popup de error */}
      {showErrorPopup && (
        <PopupErrorRegister 
          message={modalMessageError} 
          onClose={handleClosePopupError} 
        />
      )}
    </div>
  );
  
};
export default SelectorGrados;
