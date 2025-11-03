import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Country {
    id: number;
    name: string;
}

interface Company {
    id: number;
    name: string;
}

interface CardFormData {
    cardName: string;
    lastNumbers: string;
    expMonth: string;
    expYear: string;
    countryId: string;
    companyId: string;
}

interface Card {
    id: string;
    name: string;
    lastFourDigits: string;
    expDate: string;
    country: string;
    accountHolder: string;
    cardType: string;
}

export const EditCard = () => {
    const navigate = useNavigate();
    const { cardId } = useParams<{ cardId: string }>();
    const [formData, setFormData] = useState<CardFormData>({
        cardName: '',
        lastNumbers: '',
        expMonth: '',
        expYear: '',
        countryId: '',
        companyId: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCard, setIsLoadingCard] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [changedFields, setChangedFields] = useState<string[]>([]);

    // Load card data, countries, and companies
    useEffect(() => {
        const loadData = async () => {
            try {
                // TODO: Replace with actual API calls
                const mockCountries: Country[] = [
                    { id: 1, name: 'El Salvador' },
                    { id: 2, name: 'Guatemala' },
                    { id: 3, name: 'Honduras' },
                    { id: 4, name: 'Nicaragua' },
                    { id: 5, name: 'Costa Rica' },
                    { id: 6, name: 'Estados Unidos' },
                    { id: 7, name: 'México' }
                ];

                const mockCompanies: Company[] = [
                    { id: 1, name: 'DATUM RedSoft' },
                    { id: 2, name: 'TechCorp S.A.' },
                    { id: 3, name: 'Innovation Labs' }
                ];

                setCountries(mockCountries);
                setCompanies(mockCompanies);

                // Load card from localStorage (replace with API call)
                const stored = localStorage.getItem('paymentMethods');
                if (stored) {
                    const cards = JSON.parse(stored);
                    const card = cards.find((c: any) => c.id === cardId);

                    if (card) {
                        // Parse expiration date
                        const expDate = card.expDate ? new Date(card.expDate) : new Date();
                        const expMonth = String(expDate.getMonth() + 1).padStart(2, '0');
                        const expYear = String(expDate.getFullYear());

                        // Find country and company IDs
                        const country = mockCountries.find(c => c.name === card.country);
                        const company = mockCompanies.find(c => c.name === card.accountHolder);

                        setFormData({
                            cardName: card.name || '',
                            lastNumbers: card.lastFourDigits || '',
                            expMonth: expMonth,
                            expYear: expYear,
                            countryId: country ? String(country.id) : '',
                            companyId: company ? String(company.id) : ''
                        });
                    } else {
                        setFormErrors({ submit: 'Tarjeta no encontrada' });
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setFormErrors({ submit: 'Error al cargar los datos' });
            } finally {
                setIsLoadingCard(false);
            }
        };

        loadData();
    }, [cardId]);

    // Generate years and months
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
    const months = [
        { value: '01', label: '01 - Enero' },
        { value: '02', label: '02 - Febrero' },
        { value: '03', label: '03 - Marzo' },
        { value: '04', label: '04 - Abril' },
        { value: '05', label: '05 - Mayo' },
        { value: '06', label: '06 - Junio' },
        { value: '07', label: '07 - Julio' },
        { value: '08', label: '08 - Agosto' },
        { value: '09', label: '09 - Septiembre' },
        { value: '10', label: '10 - Octubre' },
        { value: '11', label: '11 - Noviembre' },
        { value: '12', label: '12 - Diciembre' }
    ];

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.cardName.trim()) {
            errors.cardName = 'El nombre de la tarjeta es requerido';
        } else if (formData.cardName.length > 75) {
            errors.cardName = 'El nombre no puede exceder 75 caracteres';
        }

        if (!formData.expMonth) {
            errors.expMonth = 'El mes de expiración es requerido';
        }

        if (!formData.expYear) {
            errors.expYear = 'El año de expiración es requerido';
        }

        // Validate that expiration date is not in the past
        if (formData.expMonth && formData.expYear) {
            const expDate = new Date(parseInt(formData.expYear), parseInt(formData.expMonth) - 1);
            const today = new Date();
            today.setDate(1);
            if (expDate < today) {
                errors.expMonth = 'La fecha de expiración no puede estar en el pasado';
            }
        }

        if (!formData.countryId) {
            errors.countryId = 'Debe seleccionar un país';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
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

        // Check if Company was changed (requires confirmation)
        const stored = localStorage.getItem('paymentMethods');
        if (stored) {
            const cards = JSON.parse(stored);
            const originalCard = cards.find((c: any) => c.id === cardId);

            if (originalCard) {
                const originalCompany = companies.find(c => c.name === originalCard.accountHolder);
                if (originalCompany && String(originalCompany.id) !== formData.companyId) {
                    setShowConfirmation(true);
                    return;
                }
            }
        }

        await saveCard();
    };

    const saveCard = async () => {
        setIsLoading(true);

        try {
            const expDate = `${formData.expYear}-${formData.expMonth}-01`;

            const cardData = {
                cardName: formData.cardName,
                expDate: expDate,
                countryId: parseInt(formData.countryId),
                companyId: parseInt(formData.companyId)
            };

            // TODO: Replace with actual API call
            console.log('Card data to be updated:', cardData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update localStorage (remove when backend is ready)
            const stored = localStorage.getItem('paymentMethods');
            if (stored) {
                const cards = JSON.parse(stored);
                const cardIndex = cards.findIndex((c: any) => c.id === cardId);

                if (cardIndex !== -1) {
                    cards[cardIndex] = {
                        ...cards[cardIndex],
                        name: formData.cardName,
                        expDate: expDate,
                        country: countries.find(c => c.id === parseInt(formData.countryId))?.name || '',
                        accountHolder: companies.find(c => c.id === parseInt(formData.companyId))?.name || ''
                    };

                    localStorage.setItem('paymentMethods', JSON.stringify(cards));
                }
            }

            navigate('/panel/payments-methods');
        } catch (error) {
            console.error('Error updating card:', error);
            setFormErrors({ submit: 'Error al actualizar la tarjeta. Por favor intenta de nuevo.' });
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const selectedCompany = companies.find(c => c.id === parseInt(formData.companyId));
    const selectedCountry = countries.find(c => c.id === parseInt(formData.countryId));

    if (isLoadingCard) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-slate-800 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Cargando información de la tarjeta...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
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
                    Editar Tarjeta
                </h1>
                <p className="text-base text-gray-600">
                    Actualiza la información de tu tarjeta corporativa
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="order-2 lg:order-1">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Información de la Tarjeta
                        </h2>

                        <div className="space-y-6">
                            {/* Card Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la Tarjeta *
                                </label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Tarjeta Corporativa Principal"
                                    maxLength={75}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.cardName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                />
                                {formErrors.cardName && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formErrors.cardName}
                                    </p>
                                )}
                            </div>

                            {/* Last 4 Digits - Read Only */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Últimos 4 Dígitos
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.lastNumbers}
                                        disabled
                                        className="w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-gray-500 font-mono text-lg tracking-widest cursor-not-allowed"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Los últimos 4 dígitos no pueden ser modificados por seguridad
                                </p>
                            </div>

                            {/* Expiration Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Expiración *
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <select
                                            name="expMonth"
                                            value={formData.expMonth}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.expMonth ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <option value="">Mes</option>
                                            {months.map(month => (
                                                <option key={month.value} value={month.value}>
                                                    {month.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <select
                                            name="expYear"
                                            value={formData.expYear}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.expYear ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <option value="">Año</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {formErrors.expMonth && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formErrors.expMonth}
                                    </p>
                                )}
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Empresa *
                                </label>
                                <select
                                    name="companyId"
                                    value={formData.companyId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all border-gray-300 hover:border-gray-400"
                                >
                                    <option value="">Seleccionar empresa</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-yellow-600 mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Cambiar la empresa puede afectar los registros contables
                                </p>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    País de Emisión *
                                </label>
                                <select
                                    name="countryId"
                                    value={formData.countryId}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.countryId ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <option value="">Seleccionar país</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.countryId && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formErrors.countryId}
                                    </p>
                                )}
                            </div>

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
                                className="w-full sm:flex-1 px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card Preview Section */}
                <div className="order-1 lg:order-2">
                    <div className="lg:sticky lg:top-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Vista Previa
                        </h2>

                        {/* Credit Card Visual */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl shadow-2xl p-6 md:p-8 aspect-[1.586/1] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                                </div>

                                <div className="relative h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md"></div>
                                        <svg className="w-8 h-8 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                            <path d="M7 12c0-2.761 2.239-5 5-5v10c-2.761 0-5-2.239-5-5z" />
                                            <path d="M17 12c0 2.761-2.239 5-5 5V7c2.761 0 5 2.239 5 5z" opacity="0.3" />
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="font-mono text-xl md:text-2xl text-white tracking-wider mb-6">
                                            •••• •••• •••• {formData.lastNumbers || '••••'}
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nombre de la tarjeta</p>
                                                <p className="text-sm md:text-base text-white font-medium truncate">
                                                    {formData.cardName || 'Nombre de la Tarjeta'}
                                                </p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expira</p>
                                                <p className="text-sm md:text-base text-white font-mono">
                                                    {formData.expMonth || 'MM'}/{formData.expYear ? formData.expYear.slice(-2) : 'AA'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 right-6">
                                    <div className="text-white text-2xl font-bold opacity-30">CARD</div>
                                </div>
                            </div>

                            {/* Card Details Below */}
                            <div className="mt-6 bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-slate-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Empresa</p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {selectedCompany?.name || 'No seleccionada'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-slate-800 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">País</p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {selectedCountry?.name || 'No seleccionado'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">Estado</p>
                                        <p className="text-sm font-semibold text-green-600">ACTIVA</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Notice */}
                            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                            Campos Editables
                                        </h4>
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            Solo puedes editar: Nombre de la tarjeta, Fecha de expiración, Empresa y País. Los últimos 4 dígitos no pueden modificarse por seguridad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal for Company Change */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-start mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Confirmar Cambio de Empresa
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Estás cambiando la empresa asociada a esta tarjeta. Este cambio puede afectar los registros contables y de auditoría. ¿Estás seguro de que deseas continuar?
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveCard}
                                className="w-full sm:flex-1 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Sí, Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};