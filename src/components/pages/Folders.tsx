import { Link } from "react-router-dom";

export const Folders = () => {
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
        <>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Todas las Carpetas</h1>
                <p className="text-gray-600 mt-2">Administra y revisa todas tus carpetas de gastos</p>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-800">Mis Carpetas</h2>
                    <div className="flex items-center gap-3">
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
        </>
    )
}
