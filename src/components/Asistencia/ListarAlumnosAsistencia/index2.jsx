import { useState, useEffect } from 'react';
import axios from 'axios';

const ListarAlumnosAsistencia = ({ token, id_curso }) => {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState(fechaPorDefecto);
    const [mensajeError, setMensajeError] = useState('');
    const [asistencias, setAsistencias] = useState([]);
    const [showCreateButton, setShowCreateButton] = useState(false);

    useEffect(() => {
        const fetchAsistencia = async () => {
            try {
                const response = await axios.post('API_URL_DE_LISTADO', {
                    token,
                    fecha,
                    id_curso,
                });

                if (response.data.status === 'FAILED') {
                    setMensajeError('No se encontraron registros de asistencia para el curso y fecha proporcionados.');
                    setShowCreateButton(true);
                } else {
                    setAsistencias(response.data.asistencias);
                }
            } catch (error) {
                console.error('Error al obtener datos de asistencia', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencia();
    }, [fecha, token, id_curso]);

    const handleEstadoChange = (id_asistencia, nuevoEstado) => {
        setAsistencias(prevAsistencias => {
            return prevAsistencias.map(asistencia => {
                if (asistencia.id_asistencia === id_asistencia) {
                    return { ...asistencia, estado: nuevoEstado };
                }
                return asistencia;
            });
        });
    };

    const handleGuardarAsistencias = async () => {
        try {
            await axios.post('API_URL_ACTUALIZAR_ASISTENCIAS', {
                token,
                asistencias,
            });
            alert('Asistencias actualizadas exitosamente.');
        } catch (error) {
            console.error('Error al guardar asistencias', error);
        }
    };

    const handleCreateRecord = async () => {
        try {
            await axios.post('https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/lambda-22-RegistrarDiaAsistencia', {
                token,
                id_curso,
                fecha,
            });
            alert('Registro creado exitosamente.');
        } catch (error) {
            console.error('Error al crear registro', error);
        }
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow-lg p-3 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold mb-6 text-blue-600">Asistencia de Alumnos</h1>
                    <button
                        type="button"
                        onClick={() => setFecha(getFechaAnterior())}
                        className="py-2 px-6 mr-1 mt-0 bg-gray-400 text-white font-medium text-lg rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                        Regresar
                    </button>
                </div>
                <main className="sd:h-screen bg-white py-2 px-4 rounded-lg shadow">
                    <div className="sd:h-full md:h-[calc(92vh-160px)] flex flex-col justify-between">
                        {loading ? (
                            <div className="text-center">Cargando...</div>
                        ) : mensajeError ? (
                            <div>
                                <p>{mensajeError}</p>
                                {showCreateButton && (
                                    <button onClick={handleCreateRecord} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                                        Crear Registro de Asistencia
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {asistencias.map((asistencia) => (
                                    <div key={asistencia.id_asistencia} className="p-4 border-b">
                                        <div className="flex justify-between items-center">
                                            <span>{asistencia.nombre_alumno}</span>
                                            <select
                                                value={asistencia.estado}
                                                onChange={(e) => handleEstadoChange(asistencia.id_asistencia, e.target.value)}
                                                className="p-2 border rounded"
                                            >
                                                <option value="PENDIENTE">PENDIENTE</option>
                                                <option value="PRESENTE">PRESENTE</option>
                                                <option value="TARDANZA">TARDANZA</option>
                                                <option value="AUSENTE">AUSENTE</option>
                                                <option value="JUSTIFICADO">JUSTIFICADO</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleGuardarAsistencias}
                                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Guardar Asistencias
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListarAlumnosAsistencia;
