import React from 'react'

const Main = () => {
  return (
    <div className="w-3/4 h-100% p-8">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <div className="promo_card bg-gray-800 text-white mt-4 p-4 rounded-lg ">
            <h1 className="text-3xl mb-4">Bienvenido a FocusClass</h1>
            <span className='pt-10'>Esta aplicacion esta dedicada a para tener una mejor gestion del rendimiento de los estudiantes.</span>
            
        </div>

        <div className="history_lists mt-6 flex justify-between">
            <div className="list1 w-1/2 mr-6">
                <div className="row flex justify-between items-center mb-4">
                    <h4 className="text-xl text-white">Cursos</h4>
                    <a href="#" className="text-blue-500">See all</a>
                </div>
                <table className="w-full table-auto bg-white rounded-lg">
                    <thead>
                        <tr>
                        <th className="p-2 text-left text-sm">#</th>
                        <th className="p-2 text-left text-sm">Dates</th>
                        <th className="p-2 text-left text-sm">Name</th>
                        <th className="p-2 text-left text-sm">Type</th>
                        <th className="p-2 text-left text-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td className="p-2 text-sm">1</td>
                        <td className="p-2 text-sm">2, Aug, 2022</td>
                        <td className="p-2 text-sm">Sam Tonny</td>
                        <td className="p-2 text-sm">Premium</td>
                        <td className="p-2 text-sm">$2000.00</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>

            <div className="list2 w-1/2 ml-6">
                <div className="row flex justify-between items-center mb-4">
                    <h4 className="text-xl text-white">Horario</h4>
                    <a href="#" className="text-blue-500">Upload</a>
                </div>
                <table className="w-full table-auto bg-white rounded-lg">
                <thead>
                    <tr>
                    <th className="p-2 text-left text-sm">#</th>
                    <th className="p-2 text-left text-sm">Title</th>
                    <th className="p-2 text-left text-sm">Type</th>
                    <th className="p-2 text-left text-sm">Uploaded</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className="p-2 text-sm">1</td>
                    <td className="p-2 text-sm">CNIC</td>
                    <td className="p-2 text-sm">PDF</td>
                    <td className="p-2 text-sm">20</td>
                    </tr>
                    
                </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Main