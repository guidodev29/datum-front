import { useState, type JSX } from 'react';

// Type definitions
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    totalFolders: number;
    totalExpenses: string;
    status: 'Active' | 'Inactive';
}

interface Stat {
    title: string;
    value: string;
    icon: JSX.Element;
    bgColor: string;
    iconColor: string;
}

export function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@company.com', role: 'Empleado', totalFolders: 4, totalExpenses: '$12,450', status: 'Active' },
        { id: 2, name: 'María García', email: 'maria.garcia@company.com', role: 'Empleado', totalFolders: 2, totalExpenses: '$8,320', status: 'Active' },
        { id: 3, name: 'Carlos López', email: 'carlos.lopez@company.com', role: 'Empleado', totalFolders: 1, totalExpenses: '$15,890', status: 'Active' },
        { id: 4, name: 'Ana Martínez', email: 'ana.martinez@company.com', role: 'Empleado', totalFolders: 5, totalExpenses: '$5,230', status: 'Inactive' },
        { id: 5, name: 'Pedro Sánchez', email: 'pedro.sanchez@company.com', role: 'Empleado', totalFolders: 6, totalExpenses: '$9,640', status: 'Active' },
    ]);

    const stats: Stat[] = [
        {
            title: 'Gastos Totales',
            value: '$51,530',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Folders por Aprobar',
            value: '23',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Folders Aprovados',
            value: '48',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            ),
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Panel Departamento Finanzas</h2>
                    <p className="text-gray-600 mt-1">Acá podras manejar y visualizar la información de los usuarios, sus gastos, folders y más.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.bgColor} ${stat.iconColor} p-4 rounded-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Management Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Usuarios Overview</h3>
                        <p className="text-sm text-gray-600 mt-1">Visualiza información de los usuarios del sistema</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Folders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gastos Totales</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalFolders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.totalExpenses}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - RESPONSIVE */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50">
                    {/* Results text - Hide on small mobile */}
                    <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-medium">1</span>-<span className="font-medium">5</span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden"> / </span>
                        <span className="font-medium">48</span>
                        <span className="hidden sm:inline"> results</span>
                    </div>

                    {/* Pagination buttons - Compact on mobile */}
                    <div className="flex space-x-1 sm:space-x-2">
                        <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm">
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">‹</span>
                        </button>
                        <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium">
                            1
                        </button>
                        <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm">
                            2
                        </button>
                        <button className="hidden sm:inline-block px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                            3
                        </button>
                        <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm">
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">›</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}