return (
  <>
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-lg md:max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-600">
        Editar Alumno
      </h1>

      {/* Sección de SelectorGrados */}
      <div className="space-y-4 mb-4">
        <h2 className=" sm:text-2xl font-semibold text-blue-600">
          Información Académica
        </h2>
        <SelectorGrados
          token={token}
          id_institucion={institucionId}
          onSeccionChange={handleSeccionChange}
          alumnoSeleccionado={grados}
        />
      </div>

      {/* Sección de Datos Personales */}
      <div className="space-y-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
          Datos Personales
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formBody1.nombre}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_paterno"
              placeholder="Apellido Paterno"
              value={formBody1.apellido_paterno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              name="apellido_materno"
              placeholder="Apellido Materno"
              value={formBody1.apellido_materno}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
            <select
              name="sexo"
              value={formBody1.sexo}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formBody1.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formBody1.telefono}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />
          {errorMessage.telefono && (
            <p className="text-red-500 text-sm mt-1">{errorMessage.telefono}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="departamento"
              value={ubigeo.departamento}
              onChange={handleInputChangeUbigeo}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Selecciona un departamento</option>
              {ubigeo.departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>

            <select
              name="provincia"
              value={ubigeo.provincia}
              onChange={handleInputChangeUbigeo}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
              disabled={!ubigeo.departamentos.length}
            >
              <option value="">Selecciona una provincia</option>
              {ubigeo.provincias.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>

            <select
              name="distrito"
              value={ubigeo.distrito}
              onChange={handleInputChangeUbigeo}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
              disabled={!ubigeo.provincias.length}
            >
              <option value="">Selecciona un distrito</option>
              {ubigeo.distritos.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.nombre}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formBody1.direccion}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="date"
            name="fecha_nacimiento"
            value={formBody1.fecha_nacimiento}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="tipo_doc"
              value={formBody1.tipo_doc}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Tipo de Documento</option>
              <option value="DNI">DNI</option>
              <option value="Carne de extranjería">Carné de extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>

            <input
              type="text"
              name="num_documento"
              placeholder="Número de Documento"
              value={formBody1.num_documento}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-blue-600 mb-2">
              Foto (Fondo blanco recomendado)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {formBody1.img_b64 && (
            <div className="mt-4">
              <label className="block text-sm text-blue-600 mb-2">
                Vista previa:
              </label>
              <div className="flex justify-center">
                <img
                  src={`data:image/jpeg;base64,${formBody1.img_b64}`}
                  alt="Vista previa de la imagen"
                  className="w-[150px] h-[200px] object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBackToListado}
              className="py-3 px-6 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar Alumno
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
);
