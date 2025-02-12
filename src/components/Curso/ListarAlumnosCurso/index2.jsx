{view === "formulario" ? (
    <div className="overflow-auto mb-0 flex-1">
      <FormularioNuevoAlumno onBackToListado={handleBackToListado} />
    </div>
  ) : view === "editar" ? (
    <div className="overflow-auto mb-0 flex-1">
      <EditarAlumno
      onBackToListado={handleBackToListado}               
      onFormValidation={handleFormValidation}
      onSuccess={handleSuccess}/>
    </div>
  ) : view === "detalle" ? (
    <div className="overflow-auto mb-0 flex-1">
      <DetalleAlumno onBackToListado={handleBackToListado}/>
    </div>
    
  ) : (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label
            htmlFor="filter-grado"
            className="block text-sm font-medium text-gray-700"
          >
            Grado:
          </label>
          <select
            id="filter-grado"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={filtroGrado}
            onChange={(e) => setFiltroGrado(e.target.value)}
          >
            <option value="">Todos</option>
            {grados.map((grado, index) => (
              <option key={index} value={grado}>
                {grado}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="filter-seccion"
            className="block text-sm font-medium text-gray-700"
          >
            Sección:
          </label>
          <select
            id="filter-seccion"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={filtroSeccion}
            onChange={(e) => setFiltroSeccion(e.target.value)}
          >
            <option value="">Todas</option>
            {secciones.map((seccion, index) => (
              <option key={index} value={seccion}>
                {seccion}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="filter-estado"
            className="block text-sm font-medium text-gray-700"
          >
            Estado:
          </label>
          <select
            id="filter-estado"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="filter-numero-documento"
            className="block text-sm font-medium text-gray-700"
          >
            Número de Documento:
          </label>
          <input
            id="filter-numero-documento"
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={filtroNumeroDocumento}
            onChange={(e) => setFiltroNumeroDocumento(e.target.value)}
            placeholder="Ingrese número"
          />
        </div>
        <div className='flex flex-row justify-between md:mt-6'>
          <div className="md:mx-2 ">
            <button
              className="bg-[#5155A6] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={aplicarFiltros}
            >
              Aplicar Filtros
            </button>
          </div>

          <div className=" md:mt-0">
            <button
              className="bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleAddAlumno}
            >
              Nuevo Alumno
            </button>
          </div>
        </div>

        
      </div>


      <div className="flex-1 overflow-auto mb-0">
      {loading ? (
        <div className="overflow-auto mb-0 flex-1 relative">
          
          <LoadingSpinner />
        
        </div>
      
      
        ) : currentAlumnos.length === 0 ? (
          <p className="text-center text-gray-500">No existen alumnos para listar.</p>
        ) : (
        <>
        <div className="hidden md:block">
        <table className=" w-full text-left border-collapse border border-gray-300">
            <thead className="sticky top-[-1px]  bg-gray-100 shadow-md z-10 ">
              <tr className='mt-4'>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Nombre</th>
              
              <th className="p-3 h-12 border-b border-gray-300 text-center">Grado</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Sección</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">N° Documento</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Estado</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className='h-7'>
              {currentAlumnos.map((alumno) => (
                <tr key={alumno.id_alumno}>
                  <td className="p-3 border-b text-start border-gray-300">
                    {alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno}
                  </td>
                  
                  <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_grado}</td>
                  <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_seccion}</td>
                  <td className="p-3 border-b text-center border-gray-300">{alumno.num_documento}</td>
                  <td className={`p-4 border-b text-center border-gray-300 ${alumno.estado_alumno === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}>
                    {alumno.estado_alumno}
                  </td>
                  <td className="p-2 border-b text-center border-gray-300">
                  <div className="flex space-x-4 justify-center">
                      {/* Botón Editar Alumno */}
                      <div className="relative group">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          onClick={() => {
                            handleEditarAlumno(alumno)
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
                        {alumno.estado_alumno === "Activo" ? (
                          <button
                            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600"
                            onClick={() => desactivarHandlerPopup(alumno.id_alumno)}
                          >
                            <FaLock className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600"
                            onClick={() => activarHandlerPopup(alumno.id_alumno)}
                          >
                            <FaUnlock className="h-5 w-5" />
                          </button>
                        )}
                        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          {alumno.estado_alumno === "Activo" ? "Desactivar" : "Activar"}
                        </span>
                      </div>

                      {/* Botón Detalle Alumno */}
                      <div className="relative group">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                          onClick={() => {
                            handleDetalleAlumno(alumno)
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
                          <FaUsers className="h-5 w-5" />
                        </button>
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Asignar Apoderado
                        </span>
                      </div>
                    </div>



                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
  <div className="md:hidden w-full h-full transition-all duration-300 ease-in-out ">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {currentAlumnos.map((alumno) => (
        <div key={alumno.id_alumno} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno}</h2>
          <p className="text-sm text-gray-600">Grado: {alumno.nombre_grado}</p>
          <p className="text-sm text-gray-600">Sección: {alumno.nombre_seccion}</p>
          <p className="text-sm text-gray-600">N° Documento: {alumno.num_documento}</p>
          <p
            className={`mt-2 text-sm font-bold ${alumno.estado_alumno === "Activo" ? "text-green-600" : "text-red-600"}`}
          >
            {alumno.estado_alumno}
          </p>
          <div className="mt-4 flex justify-between">
          <div className="flex space-x-4 justify-center">
                      {/* Botón Editar Alumno */}
                      <div className="relative group">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          onClick={() => {
                            handleEditarAlumno(alumno)
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
                        {alumno.estado_alumno === "Activo" ? (
                          <button
                            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-red-500 hover:bg-red-600"
                            onClick={() => desactivarHandlerPopup(alumno.id_alumno)}
                          >
                            <FaLock className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 bg-green-500 hover:bg-green-600"
                            onClick={() => activarHandlerPopup(alumno.id_alumno)}
                          >
                            <FaUnlock className="h-5 w-5" />
                          </button>
                        )}
                        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          {alumno.estado_alumno === "Activo" ? "Desactivar" : "Activar"}
                        </span>
                      </div>

                      {/* Botón Detalle Alumno */}
                      <div className="relative group">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                          onClick={() => {
                            handleDetalleAlumno(alumno)
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
                          <FaUsers className="h-5 w-5" />
                        </button>
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Asignar Apoderado
                        </span>
                      </div>
                    </div>
        </div>
      </div>
    ))}
  </div>
</div>
          
        </>
      )}
      {showConfirmacionPopup && (
              <PopupConfirmacion 
                message={modalMessageConfirmacion}
                onConfirm={desactivarAlumnoHandler}
                onCancel={handleCancel}
                titulo={tituloModal}
              />
            )}
    </div>

    {filteredCursos.length > itemsPerPage && (
   <div className="flex flex-wrap justify-center items-center mt-4 gap-2 sm:gap-3">
    <button
      onClick={handlePrevPage}
      className={`bg-[#4B7DBF] text-white text-sm sm:text-base px-2 md:px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed ' : ''}`}
      disabled={currentPage === 1}
    >
      Anterior
    </button>

    <div className="mx-0 flex flex-wrap justify-center md:gap-2 gap-0">
      {renderPageButtons()}
    </div>

    <button
      onClick={handleNextPage}
      className={`bg-[#4B7DBF] text-white text-sm sm:text-base px-2 md:px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-[#3A6B9F] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={currentPage === totalPages}
    >
      Siguiente
    </button>
  </div>
    )}
      {showErrorPopup && (
        <PopupErrorRegister 
          message={modalMessageError} 
          onClose={handleClosePopupError} 
        />
      )}

    </>
  )}