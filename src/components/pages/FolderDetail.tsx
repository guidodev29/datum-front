import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { purchaseApi } from './../../services/api/purchaseApi';
import type { Purchase } from './../../services/types/api.types';

export const FolderDetail = () => {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate stats from purchases
    const calculateStats = () => {
        const total = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
        // Asumiendo que idPaymentMethod 22 es viáticos (tarjeta corporativa)
        const corporate = purchases
            .filter(p => p.idPaymentMethod === 22)
            .reduce((sum, p) => sum + p.totalAmount, 0);
        const other = total - corporate;

        return { total, corporate, other };
    };

    const stats = calculateStats();

    const loadPurchases = async () => {
        if (!folderId) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await purchaseApi.getPurchasesByFolder(Number(folderId));
            setPurchases(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar las compras');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPurchases();
    }, [folderId]);

    const handleEdit = (purchaseId: number) => {
        navigate(`/panel/folders/${folderId}/edit-purchase/${purchaseId}`);
    };

    const handleDelete = async (purchaseId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta compra?')) {
            return;
        }

        try {
            await purchaseApi.deletePurchase(purchaseId);
            // Reload purchases after deletion
            await loadPurchases();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar la compra');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4 text-white">Folder Detail - {folderId}</h1>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-6">
                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm font-medium mb-2">Compras Realizadas</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">
                                ${stats.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Gastos Actuales</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm font-medium mb-2">Gastos hechos con Tarjeta Corporativa</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">
                                ${stats.corporate.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg shadow-md border border-gray-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm font-medium mb-2">Gastos hechos con otros métodos de pagos</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">
                                ${stats.other.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 mb-6">
                <button
                    onClick={() => navigate(`/panel/folders/${folderId}/new-purchase`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Agregar Nueva Compra
                </button>
            </div>

            {/* Purchases List */}
            <div className="px-4 pb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Compras Registradas</h2>
                
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="text-gray-400 mt-2">Cargando compras...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {!loading && !error && purchases.length === 0 && (
                    <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
                        <p className="text-gray-400">No hay compras registradas en esta carpeta</p>
                    </div>
                )}

                {!loading && !error && purchases.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {purchases.map((purchase) => (
                            <PurchaseCard
                                key={purchase.id}
                                purchase={purchase}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface PurchaseCardProps {
    purchase: Purchase;
    onEdit: (purchaseId: number) => void;
    onDelete: (purchaseId: number) => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ purchase, onEdit, onDelete }) => {
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-SV', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-SV', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Map payment method IDs to display names
    const getPaymentMethodName = (id: number): string => {
        const methods: Record<number, string> = {
            21: 'Tarjeta de Crédito',
            22: 'Viáticos',
            23: 'Transferencia'
        };
        return methods[id] || `Método ${id}`;
    };

    // Map purchase type IDs to display names
    const getPurchaseTypeName = (id: number): string => {
        const types: Record<number, string> = {
            21: 'Transporte',
            22: 'Presentación',
            23: 'Comida',
            24: 'Servicios'
        };
        return types[id] || `Tipo ${id}`;
    };

    const getPaymentMethodIcon = () => {
        return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        );
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getPaymentMethodIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg truncate">
                            {purchase.description}
                        </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Tipo:</span>
                            <span className="text-gray-300">{getPurchaseTypeName(purchase.idPType)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Método de pago:</span>
                            <span className="text-gray-300">{getPaymentMethodName(purchase.idPaymentMethod)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Monto:</span>
                            <span className="text-white font-bold text-lg">
                                {formatAmount(purchase.totalAmount)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Fecha:</span>
                            <span className="text-gray-300">{formatDate(purchase.purchaseDate)}</span>
                        </div>

                        {purchase.guestName && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Invitado:</span>
                                <span className="text-gray-300">{purchase.guestName}</span>
                            </div>
                        )}

                        {purchase.documentUrl && (
                            <div className="flex items-center gap-1 text-blue-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs">Documento adjunto</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => onEdit(purchase.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(purchase.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};