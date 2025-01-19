<>
      {/* Tabla en pantallas grandes */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead className="sticky top-[-1px] bg-gray-100 shadow-md z-10">
            <tr>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Nombre</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Grado</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Sección</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">N° Documento</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Estado</th>
              <th className="p-3 h-12 border-b border-gray-300 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAlumnos.map((alumno) => (
              <tr key={alumno.id_alumno}>
                <td className="p-3 border-b text-start border-gray-300">
                  {alumno.nombre + " " + alumno.apellido_paterno + " " + alumno.apellido_materno}
                </td>
                <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_grado}</td>
                <td className="p-3 border-b text-center border-gray-300">{alumno.nombre_seccion}</td>
                <td className="p-3 border-b text-center border-gray-300">{alumno.num_documento}</td>
                <td
                  className={`p-4 border-b text-center border-gray-300 ${alumno.estado_alumno === "Activo" ? "bg-green-500 text-white" : "text-white bg-red-500"}`}
                >
                  {alumno.estado_alumno}
                </td>
                <td className="p-2 border-b text-center border-gray-300">
                  <div className="flex space-x-4 justify-center">
                    {/* Botones de acciones */}
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                      Editar
                    </button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                      Ver Detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards en pantallas pequeñas */}
      <div className="md:hidden">
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Editar
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>