import { useNavigate, Link } from 'react-router-dom';

export const Welcome = () => {
    const navigate = useNavigate();

    const newFolder = () => {
        navigate('/panel/new-folder');
    };

    const folders = [
        { id: 1, name: 'Viaje a Guatemala', amount: 1250.00, status: 'draft', date: '15 Oct 2024' },
        { id: 2, name: 'Conferencia Tech', amount: 850.50, status: 'approved', date: '12 Oct 2024' },
        { id: 3, name: 'Comida con cliente', amount: 125.00, status: 'submitted', date: '10 Oct 2024' },
        { id: 4, name: 'Viaje San Miguel', amount: 320.00, status: 'draft', date: '08 Oct 2024' }
    ];

    const getStatusBadge = (status: string) => {
        const badges = {
            draft: { text: 'Borrador', color: 'bg-gray-100 text-gray-700' },
            submitted: { text: 'Enviado', color: 'bg-blue-100 text-blue-700' },
            approved: { text: 'Aprobado', color: 'bg-green-100 text-green-700' }
        };
        return badges[status as keyof typeof badges] || badges.draft;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header with Image Background */}
            <div className="relative rounded-xl overflow-hidden shadow-xl h-40 sm:h-44 md:h-48">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg"
                        className="w-full h-full object-cover"
                    />
                    {/* Red gradient overlay to match brand */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700/95 via-red-600/90 to-red-700/85"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6 md:p-8">
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                        Bienvenido a DATUM Expenses
                    </h1>
                    <p className="text-white/95 text-sm sm:text-base md:text-lg mb-3 md:mb-4">
                        Gestiona tus gastos empresariales de forma sencilla y organizada
                    </p>
                    {/* Feature bullets */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1.5 sm:space-y-0 text-white">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium">Control total de gastos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium">Reportes automáticos</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-600 text-sm font-medium mb-2">Límite Asignado</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$5,000.00</p>
                            <p className="text-xs text-gray-500 mt-1">Evento Actual</p>
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
                            <p className="text-gray-600 text-sm font-medium mb-2">Gastos Actuales</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$2,547.50</p>
                            <p className="text-xs text-green-600 mt-1">51% del límite</p>
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
                            <p className="text-gray-600 text-sm font-medium mb-2">Disponible</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-800">$2,452.50</p>
                            <p className="text-xs text-gray-500 mt-1">Restante del mes</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Folders Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-800">Mis Carpetas</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={newFolder}
                            className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm shadow-md"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva
                        </button>
                        <Link
                            to="/panel/folders"
                            className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                        >
                            Ver todas
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="space-y-3">
                    {folders.map((folder) => {
                        const badge = getStatusBadge(folder.status);
                        return (
                            <Link
                                key={folder.id}
                                to={`/panel/folders/${folder.id}`}
                                className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50/30 transition-all group"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 group-hover:text-red-700 truncate">{folder.name}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color} whitespace-nowrap`}>
                                                {badge.text}
                                            </span>
                                            <span className="text-xs text-gray-500">{folder.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm md:text-base font-semibold text-slate-800 ml-2 flex-shrink-0">${folder.amount.toFixed(2)}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Maximiza tu eficiencia */}
            <div className="relative rounded-xl overflow-hidden shadow-xl h-64 sm:h-56 md:h-48">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/4968390/pexels-photo-4968390.jpeg"
                        alt="Professional workspace"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/80"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 max-w-2xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                        Maximiza tu eficiencia con DATUM
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        Obtén las herramientas, la seguridad y el almacenamiento en la nube que necesitas para alcanzar tus objetivos de gestión de gastos.
                    </p>
                    <div className="flex flex-row gap-2 sm:gap-3">
                        <Link
                            to="/panel/questions"
                            className="inline-flex items-center justify-center px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm shadow-lg whitespace-nowrap"
                        >
                            Más información
                        </Link>
                        <Link
                            to="/panel/calendar"
                            className="inline-flex items-center justify-center px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white text-xs sm:text-sm whitespace-nowrap"
                        >
                            Ver tutorial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};