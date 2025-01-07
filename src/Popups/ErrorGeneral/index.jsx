import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PopupErrorGeneral = ({ message }) => {



  return (

    <div className="fixed z-10 inset-0 overflow-y-auto " id="my-modal">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-b from-[#5155A6] to-[#4B7DBF]">
                    <img src="https://ll6aenqwm9.execute-api.us-east-1.amazonaws.com/service/util-01-imagen?img=exclamacion" alt="Exclamación" className="h-14 w-14" />

                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-3xl leading-6 font-bold text-black" id="modal-headline">
                            Ups, algo salio mal !
                        </h3>
                        <div className="mt-2">
                            <p className="text-base mt-5 text-gray-700">
                            {message || "Ha ocurrido un error inesperado"}
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    
  );
};

export default PopupErrorGeneral;
