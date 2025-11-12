import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { folderApi } from '../../services/api/folderApi';
import { type Folder } from '../../services/types/api.types';

export const Welcome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State management
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch folders from API
    useEffect(() => {
        const fetchFolders = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                setError('');

                const userId = 81;

                //const userId = parseInt(user.id);
                const data = await folderApi.getAllFolders(userId);

                setFolders(data);
            } catch (err: any) {
                console.error('Error fetching folders:', err);
                setError('Error al cargar las carpetas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolders();
    }, [user]);

    const getStatusBadge = (status: string) => {
        const badges = {
            DRAFT: { text: 'Borrador', color: 'bg-gray-100 text-gray-700', iconColor: 'text-gray-400' },
            PENDING: { text: 'En Revisión', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500' },
            APPROVED: { text: 'Aprobado', color: 'bg-green-100 text-green-700', iconColor: 'text-green-500' },
            REJECTED: { text: 'Rechazado', color: 'bg-red-100 text-red-700', iconColor: 'text-red-500' }
        };
        return badges[status as keyof typeof badges] || badges.DRAFT;
    };

    const newFolder = () => {
        navigate('/panel/new-folder');
    };

    const handleDeleteFolder = async (folderId: number) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            '¿Está seguro de eliminar esta carpeta?\n\nSe perderá toda la información que la carpeta pueda contener.'
        );

        if (!confirmed) return;

        try {
            setIsLoading(true);
            await folderApi.deleteFolder(81, folderId);

            // Remove from state
            setFolders(folders.filter(f => f.id !== folderId));

            alert('Carpeta eliminada exitosamente');
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert('Error al eliminar la carpeta');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total
    const totalAmount = 2945.50; // TODO: Calculate from purchases

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando carpetas...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Welcome Header - OPTIMIZED FOR MOBILE */}
            <div className="relative rounded-xl overflow-hidden shadow-sm h-28 sm:h-36">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg"
                        className="w-full h-full object-cover"
                        alt="Background"
                    />
                    {/* More subtle gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-red-700/80"></div>
                </div>

                {/* Content - More compact for mobile */}
                <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                        Bienvenido a DATUM Expenses
                    </h1>
                    <p className="text-white/95 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                        {folders.length} carpetas activas • ${totalAmount.toFixed(2)} este mes
                    </p>
                    {/* Feature bullets - hidden on small mobile */}
                    <div className="hidden sm:flex flex-wrap items-center gap-4 text-white/90 text-center justify-center">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs md:text-sm font-medium">Control total de gastos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs md:text-sm font-medium">Reportes automáticos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Folders Section - MOBILE OPTIMIZED */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {/* Header - Stack vertically on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Mis Carpetas</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Organiza tus gastos por evento o proyecto</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={newFolder}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all text-sm shadow-sm hover:shadow-md"
                        >
                            <svg className="w-4 h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva
                        </button>
                        <Link
                            to="/panel/folders"
                            className="flex-1 sm:flex-none text-center sm:text-left text-sm text-red-600 hover:text-red-700 font-semibold inline-flex items-center justify-center transition-colors"
                        >
                            Ver todas
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Folders list - Column layout for mobile */}
                <div className="space-y-3 mt-4">
                    {folders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <p className="text-lg text-gray-600 mb-2">No tienes carpetas aún</p>
                            <p className="text-sm text-gray-500">Crea tu primera carpeta para comenzar</p>
                        </div>
                    ) : (
                        folders.map((folder) => {
                            const badge = getStatusBadge(folder.validationStatus);
                            return (
                                <div
                                    key={folder.id}
                                    onClick={() => navigate(`/panel/folders/${folder.id}`)}
                                    className="flex flex-col p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all duration-200 group bg-white space-y-3 cursor-pointer"
                                >
                                    {/* Main Content Row */}
                                    <div className="flex items-start sm:items-center space-x-3 flex-1">
                                        {/* Icon with status-based color */}
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${folder.validationStatus === 'APPROVED' ? 'bg-green-50' : folder.validationStatus === 'PENDING' ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${badge.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>

                                        {/* Folder Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-red-600 line-clamp-1 sm:line-clamp-2 transition-colors">
                                                {folder.folderName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {folder.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color} whitespace-nowrap`}>
                                                    {badge.text}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {new Date(folder.startDate).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right">
                                            <p className="text-base sm:text-lg font-bold text-slate-800">
                                                ${(Math.random() * 1000).toFixed(2)}
                                            </p>
                                            <span className="text-xs text-gray-500">Total</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/panel/folders/${folder.id}/edit`);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Editar carpeta"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteFolder(folder.id);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Eliminar carpeta"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Helper text at bottom - hidden on small mobile */}
                <div className="mt-4 pt-4 border-t border-gray-100 hidden sm:block">
                    <p className="text-xs text-gray-500 text-center">
                        <svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Haz clic en una carpeta para ver los detalles y agregar gastos
                    </p>
                </div>
            </div>

            {/* Help Section - MOBILE OPTIMIZED */}
            <div className="relative rounded-xl overflow-hidden shadow-sm h-44 sm:h-52">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/4968390/pexels-photo-4968390.jpeg"
                        alt="Professional workspace"
                        className="w-full h-full object-cover"
                    />
                    {/* Lighter overlay on mobile for better visibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/80 to-slate-800/75 sm:from-slate-900/93 sm:to-slate-800/88"></div>
                </div>

                {/* Content - More compact on mobile - CENTERED con mx-auto */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 max-w-2xl mx-auto text-center">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                        ¿Necesitas ayuda?
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        Consulta nuestras guías y tutoriales para aprovechar al máximo el sistema de gestión de gastos corporativos.
                    </p>
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                        <Link
                            to="/panel/questions"
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm shadow-md"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Preguntas Frecuentes
                        </Link>
                        <Link
                            to="/panel/calendar"
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white/80 hover:border-white text-xs sm:text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ver Tutorial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};