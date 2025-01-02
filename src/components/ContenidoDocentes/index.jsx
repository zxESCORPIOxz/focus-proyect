import React from 'react'
import {
    FaUserGraduate
  } from 'react-icons/fa';
const ContenidoDocentes = () => {
  return (
    <div className="flex-1 p-6">
      
      <header className="bg-[#4B7DBF] text-white rounded-lg flex items-center gap-4 p-4 mb-6">
        <FaUserGraduate className="text-5xl" />
        <h1 className="text-lg font-bold">Módulo: Gestión de Docentes</h1>
        
      </header>

      
      <main className="bg-white p-6 rounded-lg shadow">
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="filter-grado" className="block text-sm font-medium text-gray-700">Grado:</label>
            <select id="filter-grado" className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <option value="">Todos</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
              <option value="4">4°</option>
              <option value="5">5°</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="filter-seccion" className="block text-sm font-medium text-gray-700">Sección:</label>
            <select id="filter-seccion" className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <option value="">Todas</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="filter-estado" className="block text-sm font-medium text-gray-700">Estado:</label>
            <select id="filter-estado" className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <button className="bg-[#5155A6]  text-white px-4 py-2 rounded-lg hover:bg-blue-700">Aplicar Filtros</button>
        </div>

       
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300">Nombre</th>
                <th className="p-3 border-b border-gray-300">Matrícula</th>
                <th className="p-3 border-b border-gray-300">Grado</th>
                <th className="p-3 border-b border-gray-300">Sección</th>
                <th className="p-3 border-b border-gray-300">Contacto</th>
                <th className="p-3 border-b border-gray-300">Estado</th>
                <th className="p-3 border-b border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-gray-300">Juan Pérez</td>
                <td className="p-3 border-b border-gray-300">20231001</td>
                <td className="p-3 border-b border-gray-300">5°</td>
                <td className="p-3 border-b border-gray-300">A</td>
                <td className="p-3 border-b border-gray-300">123-456-7890</td>
                <td className="p-3 border-b border-gray-300">Activo</td>
                <td className="p-3 border-b border-gray-300">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-4">Editar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 mr-4">Desactivar</button>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">Detalle</button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>

        
        <button className="mt-4 bg-[#4B7DBF] text-white px-4 py-2 rounded-lg hover:bg-blue-700">Agregar Nuevo Alumno</button>
      </main>
    </div>
  )
}
                          
export default ContenidoDocentes                                                                                                                                                 