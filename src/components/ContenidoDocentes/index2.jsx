<tbody className='h-7'>
                      {currentDocentes.map((docente) => (
                        <tr key={docente.id_docente}>
                          <td className="p-3 border-b text-start border-gray-300">
                            {docente.nombre + " " + docente.apellido_paterno }
                          </td>
                          
                          <td className="p-3 border-b text-center border-gray-300">{docente.especialidad}</td>
                          {/* Select para Cursos */}
                          <td className="p-3 border-b text-center border-gray-300">
                            {docente.cursos.length > 0 ? (
                              <select
                                className="border border-gray-300 rounded-lg p-2 w-48" // Añade w-48 para un ancho fijo
                                defaultValue="" // Valor predeterminado
                              >
                                
                                {docente.cursos.map((curso) => (
                                  <option key={curso.id_curso} value={curso.id_curso}>
                                    {curso.nombre_curso}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-500 italic">No tiene cursos asignados</span>
                            )}
                          </td>
                          <td className="p-3 border-b text-center border-gray-300">{docente.num_documento}</td>
                          <td className={`p-4 border-b text-center border-gray-300 ${docente.estado === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}>
                            {docente.estado}
                          </td>
                          <td className="p-2 border-b text-center border-gray-300">
                          <div className="flex space-x-4 justify-center">
                              {/* Botón Editar Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                  onClick={() => {
                                    handleEditarDocente(docente)
                                  }}
                                >
                                  <FaEdit className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Editar
                                </span>
                              </div>

                              {/* Botón Activar/Desactivar Alumno */}
                              <div className="relative group">
                                {docente.estado === "Activo" ? (
                                  <button
                                    className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600"
                                    onClick={() => desactivarHandlerPopup(docente.id_docente)}
                                  >
                                    <FaLock className="h-5 w-5" />
                                  </button>
                                ) : (
                                  <button
                                    className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600"
                                    onClick={() => activarHandlerPopup(docente.id_docente)}
                                  >
                                    <FaUnlock className="h-5 w-5" />
                                  </button>
                                )}
                                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  {docente.estado === "Activo" ? "Desactivar" : "Activar"}
                                </span>
                              </div>

                              {/* Botón Detalle Alumno */}
                              <div className="relative group">
                                <button
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                  onClick={() => {
                                    handleDetalleDocente(docente)
                                  }}
                                >
                                  <FaInfoCircle className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ver Detalles
                                </span>
                              </div>

                              {/* Botón Grupos */}
                              <div className="relative group">
                                <button className="bg-violet-500 text-white px-[12px] py-2 rounded-lg hover:bg-violet-600">
                                  <FaBook className="h-5 w-5" />
                                </button>
                                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Asignar Cursos
                                </span>
                              </div>
                            </div>



                          </td>
                        </tr>
                      ))}
                    </tbody>