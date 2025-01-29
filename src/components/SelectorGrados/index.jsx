import React, { useState, useEffect } from 'react';
import { listarGrados } from '../../lib/apiListarSecciones';
import PopupErrorRegister from '../../Popups/RegistroError';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const SelectorGrados = ({ token, id_institucion, onSeccionChange, alumnoSeleccionado }) => {
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { clearAuth } = useAuthContext();

  const handleClosePopupError = () => {
    setShowErrorPopup(false);
    if (status === 'LOGOUT') {
      clearAuth();
      navigate('/login');
    }
  };
  
  const handleSeccionChange = (e) => {
    const selectedIdSeccion = e.target.value;
    if (selectedIdSeccion !== seccionSeleccionada) {
      setSeccionSeleccionada(selectedIdSeccion);
      if (onSeccionChange) {
        onSeccionChange(selectedIdSeccion);
      }
    }
  };

  
  // Obtener grados y niveles al cargar el componente
  useEffect(() => {
    const fetchGrados = async () => {
      const data = await listarGrados(token, id_institucion);
      if (data.status === 'SUCCESS') {
        setNiveles(data.niveles);
      } else if (data.status === 'LOGOUT') {
        setStatus('LOGOUT');
        setModalMessageError(data.message);
        setShowErrorPopup(true);
      } else {
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
      if (selectedNivel) {
        const nuevosGrados = selectedNivel.grados;
        setGrados(nuevosGrados);
  
        // Mantener el grado seleccionado si está en la nueva lista de grados
        if (!nuevosGrados.some(grado => grado.id_grado === parseInt(gradoSeleccionado))) {
          setGradoSeleccionado(''); // Restablecer si el grado ya no es válido
        }
  
        // Limpiar las secciones porque el nivel cambió
        setSecciones([]);
      }
    }
  }, [nivelSeleccionado, niveles]);

  // Actualizar secciones según el grado seleccionado
  useEffect(() => {
    if (gradoSeleccionado) {
      const selectedGrado = grados.find(grado => grado.id_grado === parseInt(gradoSeleccionado));
      if (selectedGrado) {
        const nuevasSecciones = selectedGrado.secciones;
        setSecciones(nuevasSecciones);
  
        // Mantener la sección seleccionada si está en la nueva lista de secciones
        if (!nuevasSecciones.some(seccion => seccion.id_seccion === parseInt(seccionSeleccionada))) {
          setSeccionSeleccionada(''); // Restablecer si la sección ya no es válida
        }
      }
    }
  }, [gradoSeleccionado, grados]);

  // Preseleccionar nivel, grado y sección según el alumno seleccionado
  useEffect(() => {
    if (alumnoSeleccionado && niveles.length > 0) {
      const { id_nivel, id_grado, id_seccion } = alumnoSeleccionado;

      setNivelSeleccionado(id_nivel || '');

      // Preseleccionar grado y sección solo si el nivel está disponible
      const selectedNivel = niveles.find((nivel) => nivel.id_nivel === id_nivel);
      if (selectedNivel) {
        setGrados(selectedNivel.grados || []);
        const selectedGrado = selectedNivel.grados.find((grado) => grado.id_grado === id_grado);
        if (selectedGrado) {
          setGradoSeleccionado(id_grado || '');
          setSecciones(selectedGrado.secciones || []);
          
          // Preseleccionar la sección si existe
          const selectedSeccion = selectedGrado.secciones.find(seccion => seccion.id_seccion === id_seccion);
          if (selectedSeccion) {
            setSeccionSeleccionada(id_seccion || '');
          }
        }
      }
    }
  }, [alumnoSeleccionado, niveles]);

  // Preseleccionar las opciones solo si no hay selección previa
  useEffect(() => {
    if (nivelSeleccionado && gradoSeleccionado && seccionSeleccionada) {
      setSeccionSeleccionada(seccionSeleccionada);
    }
  }, [nivelSeleccionado, gradoSeleccionado]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
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
  
        <div className="flex-1">
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
  
        <div className="flex-1">
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
