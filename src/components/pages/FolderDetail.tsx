import { useParams, useNavigate } from 'react-router-dom';

export const FolderDetail = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Folder Detail - {folderId}</h1>
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm font-medium mb-2">Compras Realizadas</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$5,000.00</p>
                            <p className="text-xs text-gray-500 mt-1">Gastos Actuales</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm font-medium mb-2">Gastos hechos con Tarjeta Corporativa</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$2,547.50</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm font-medium mb-2">Gastos hechos con otros métodos de pagos</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$2,452.50</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <button
                    onClick={() => navigate(`/panel/folders/${folderId}/new-purchase`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Agregar Nueva Compra
                </button>
            </div>
        </div>

    );
};
