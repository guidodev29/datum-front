import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Card {
    id: string;
    name: string;
    lastFourDigits: string;
    accountHolder: string;
    cardType: string;
}

interface ReportFormData {
    reason: string;
    incidentDate: string;
    description: string;
    blockCard: boolean;
}

export const ReportCard = () => {
    const navigate = useNavigate();
    const { cardId } = useParams<{ cardId: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [formData, setFormData] = useState<ReportFormData>({
        reason: '',
        incidentDate: '',
        description: '',
        blockCard: false
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCard, setIsLoadingCard] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const reportReasons = [
        {
            value: 'LOST',
            label: 'Tarjeta Extraviada',
            color: 'text-orange-600',
            bgHover: 'hover:bg-orange-50',
            borderHover: 'hover:border-orange-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            value: 'STOLEN',
            label: 'Tarjeta Robada',
            color: 'text-red-600',
            bgHover: 'hover:bg-red-50',
            borderHover: 'hover:border-red-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            value: 'DAMAGED',
            label: 'Tarjeta Dañada',
            color: 'text-gray-600',
            bgHover: 'hover:bg-gray-50',
            borderHover: 'hover:border-gray-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            value: 'FRAUD',
            label: 'Transacciones Fraudulentas',
            color: 'text-red-600',
            bgHover: 'hover:bg-red-50',
            borderHover: 'hover:border-red-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            value: 'EXPIRED',
            label: 'Tarjeta Expirada',
            color: 'text-yellow-600',
            bgHover: 'hover:bg-yellow-50',
            borderHover: 'hover:border-yellow-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            value: 'OTHER',
            label: 'Otro Motivo',
            color: 'text-blue-600',
            bgHover: 'hover:bg-blue-50',
            borderHover: 'hover:border-blue-300',
            outlineIcon: (
                <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            filledIcon: (
                <svg className="w-6 h-6 hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
            )
        }
    ];

    useEffect(() => {
        const loadCard = async () => {
            try {
                // TODO: Replace with actual API call
                const stored = localStorage.getItem('paymentMethods');
                if (stored) {
                    const cards = JSON.parse(stored);
                    const foundCard = cards.find((c: any) => c.id === cardId);

                    if (foundCard) {
                        setCard({
                            id: foundCard.id,
                            name: foundCard.name,
                            lastFourDigits: foundCard.lastFourDigits,
                            accountHolder: foundCard.accountHolder,
                            cardType: foundCard.cardType
                        });
                    } else {
                        setFormErrors({ submit: 'Tarjeta no encontrada' });
                    }
                }
            } catch (error) {
                console.error('Error loading card:', error);
                setFormErrors({ submit: 'Error al cargar la tarjeta' });
            } finally {
                setIsLoadingCard(false);
            }
        };

        loadCard();
    }, [cardId]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.reason) {
            errors.reason = 'Debe seleccionar un motivo';
        }

        if (!formData.incidentDate) {
            errors.incidentDate = 'La fecha del incidente es requerida';
        } else {
            const incidentDate = new Date(formData.incidentDate);
            const today = new Date();
            if (incidentDate > today) {
                errors.incidentDate = 'La fecha no puede ser futura';
            }
        }

        if (!formData.description.trim()) {
            errors.description = 'La descripción es requerida';
        } else if (formData.description.length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        } else if (formData.description.length > 500) {
            errors.description = 'La descripción no puede exceder 500 caracteres';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Show confirmation if blocking card
        if (formData.blockCard) {
            setShowConfirmation(true);
            return;
        }

        await submitReport();
    };

    const submitReport = async () => {
        setIsLoading(true);

        try {
            const reportData = {
                cardId: cardId,
                reason: formData.reason,
                incidentDate: formData.incidentDate,
                description: formData.description,
                blockCard: formData.blockCard,
                reportedAt: new Date().toISOString()
            };

            // TODO: Replace with actual API call
            console.log('Report data to be submitted:', reportData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // If blocking card, update localStorage (remove when backend is ready)
            if (formData.blockCard) {
                const stored = localStorage.getItem('paymentMethods');
                if (stored) {
                    const cards = JSON.parse(stored);
                    const cardIndex = cards.findIndex((c: any) => c.id === cardId);

                    if (cardIndex !== -1) {
                        cards[cardIndex] = {
                            ...cards[cardIndex],
                            isBlocked: 'Y',
                            blockedDate: new Date().toISOString(),
                            blockedReason: formData.description
                        };

                        localStorage.setItem('paymentMethods', JSON.stringify(cards));
                    }
                }
            }

            // Navigate back with success message
            navigate('/panel/payments-methods', {
                state: {
                    message: formData.blockCard
                        ? 'Reporte enviado y tarjeta bloqueada exitosamente'
                        : 'Reporte enviado exitosamente'
                }
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            setFormErrors({ submit: 'Error al enviar el reporte. Por favor intenta de nuevo.' });
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const selectedReason = reportReasons.find(r => r.value === formData.reason);

    // Get today's date in YYYY-MM-DD format for max date
    const today = new Date().toISOString().split('T')[0];

    if (isLoadingCard) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-slate-800 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Cargando información...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                    <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-red-900 mb-2">Tarjeta No Encontrada</h3>
                    <p className="text-red-700 mb-4">No se pudo encontrar la información de la tarjeta.</p>
                    <button
                        onClick={() => navigate('/panel/payments-methods')}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Volver a Métodos de Pago
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/panel/my-cards')}
                    className="flex items-center text-gray-600 hover:text-slate-800 mb-4 transition-colors group"
                >
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Volver a Métodos de Pago</span>
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Reportar Problema con Tarjeta
                </h1>
                <p className="text-base text-gray-600">
                    Informa sobre cualquier incidente relacionado con tu tarjeta corporativa
                </p>
            </div>

            {/* Card Info Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 mb-8 text-white shadow-lg">
                <div className="flex items-center">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{card.name}</h3>
                        <p className="text-white/70 text-sm font-mono">•••• •••• •••• {card.lastFourDigits}</p>
                        <p className="text-white/60 text-xs mt-1">{card.accountHolder}</p>
                    </div>
                </div>
            </div>

            {/* Report Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Detalles del Reporte
                </h2>

                <div className="space-y-6">
                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Motivo del Reporte *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reportReasons.map((reason) => (
                                <button
                                    key={reason.value}
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, reason: reason.value }));
                                        if (formErrors.reason) {
                                            setFormErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.reason;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    className={`group p-4 rounded-lg border-2 transition-all text-left ${formData.reason === reason.value
                                            ? 'border-slate-800 bg-slate-50'
                                            : `border-gray-200 ${reason.borderHover} ${reason.bgHover}`
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`${formData.reason === reason.value ? reason.color : 'text-gray-400'} transition-colors`}>
                                            {reason.outlineIcon}
                                            {reason.filledIcon}
                                        </div>
                                        <div className="ml-3">
                                            <p className={`font-semibold ${formData.reason === reason.value ? 'text-slate-800' : 'text-gray-700'}`}>
                                                {reason.label}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {formErrors.reason && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.reason}
                            </p>
                        )}
                    </div>

                    {/* Incident Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha del Incidente *
                        </label>
                        <input
                            type="date"
                            name="incidentDate"
                            value={formData.incidentDate}
                            onChange={handleInputChange}
                            max={today}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.incidentDate ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                }`}
                        />
                        {formErrors.incidentDate && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.incidentDate}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Indica cuándo ocurrió el incidente o problema
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción del Problema *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            maxLength={500}
                            placeholder="Describe detalladamente qué ocurrió con la tarjeta. Incluye cualquier información relevante como ubicación, hora aproximada, o cualquier otra circunstancia importante..."
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all resize-none ${formErrors.description ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                }`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {formErrors.description ? (
                                <p className="text-red-500 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formErrors.description}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Mínimo 10 caracteres
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                {formData.description.length}/500
                            </p>
                        </div>
                    </div>

                    {/* Block Card Option */}
                    {(formData.reason === 'LOST' || formData.reason === 'STOLEN' || formData.reason === 'FRAUD') && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="blockCard"
                                    checked={formData.blockCard}
                                    onChange={handleInputChange}
                                    className="mt-1 w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500 cursor-pointer"
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-red-900 mb-1">
                                        Bloquear tarjeta inmediatamente
                                    </p>
                                    <p className="text-sm text-red-800">
                                        Se recomienda bloquear la tarjeta para prevenir transacciones no autorizadas. Esta acción requiere aprobación del administrador para revertirse.
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Submit Error */}
                    {formErrors.submit && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {formErrors.submit}
                            </p>
                        </div>
                    )}

                    {/* Important Notice */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                    Información Importante
                                </h4>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Este reporte será revisado por el departamento de finanzas. Si reportas una tarjeta como robada o perdida, se bloqueará de inmediato y no podrá usarse hasta que un administrador la reactive o emita una nueva.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8 pt-6 border-t-2">
                    <button
                        onClick={() => navigate('/panel/payments-methods')}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full sm:flex-1 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando Reporte...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Enviar Reporte
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal for Blocking */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-start mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Confirmar Bloqueo de Tarjeta
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Estás a punto de bloquear esta tarjeta. Esta acción:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                                    <li className="flex items-start">
                                        <svg className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Impedirá cualquier transacción futura
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Requiere aprobación de un administrador para reactivarse
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Quedará registrado en el historial de auditoría
                                    </li>
                                </ul>
                                <p className="text-sm font-semibold text-gray-900">
                                    ¿Estás seguro de que deseas continuar?
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitReport}
                                disabled={isLoading}
                                className="w-full sm:flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    'Sí, Bloquear y Reportar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};