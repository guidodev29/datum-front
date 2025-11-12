import React from 'react';
import { Purchase } from '../../domain/entities/Purchase';

interface PurchaseCardProps {
    purchase: Purchase;
    onEdit: (purchaseId: number) => void;
    onDelete: (purchaseId: number) => void;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ purchase, onEdit, onDelete }) => {
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

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            DRAFT: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800'
        };

        const statusText = {
            DRAFT: 'Borrador',
            APPROVED: 'Aprobado',
            REJECTED: 'Rechazado'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
                {statusText[status as keyof typeof statusText]}
            </span>
        );
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
                        {getStatusBadge(purchase.validationStatus)}
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Tipo:</span>
                            <span className="text-gray-300">ID: {purchase.idPType}</span>
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

                        {purchase.hasDocument && (
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
                            onClick={() => onEdit(purchase.idPurchase)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(purchase.idPurchase)}
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