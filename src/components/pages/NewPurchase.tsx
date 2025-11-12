import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseApi } from '../../services/api/purchaseApi.ts';
import { PurchaseType, PaymentMethod } from '../../services/types/api.types.ts';
import { useAuth } from '../../hooks/useAuth';

export default function NewPurchaseForm() {
    const navigate = useNavigate();
    const { folderId } = useParams<{ folderId: string }>();
    const { user } = useAuth();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        description: '',
        total: '',
        date: '',
        expenseType: '',
        paymentMethod: '',
        costCenter: '',
        guestName: '',
        selectedCard: '',
        receipt: null as File | null,
        applyCostCenter: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [cameraState, setCameraState] = useState({
        isOpen: false,
        capturedImage: null as string | null,
        showPreview: false,
        isVideoReady: false
    });

    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('paymentMethods');
        if (stored) {
            setCards(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'expenseType' && value !== 'presentacion' ? { guestName: '' } : {})
        }));
    };

    const base64ToFile = (base64: string, filename: string): File => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const compressImage = (canvas: HTMLCanvasElement, quality: number = 0.7): string => {
        return canvas.toDataURL('image/jpeg', quality);
    };

    const openCamera = async () => {
        try {
            setCameraState(prev => ({ ...prev, isOpen: true, isVideoReady: false }));
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setTimeout(() => {
                        setCameraState(prev => ({ ...prev, isVideoReady: true }));
                    }, 100);
                };
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('No se pudo acceder a la cámara. Verifica los permisos.');
            setCameraState({ isOpen: false, capturedImage: null, showPreview: false, isVideoReady: false });
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraState({ isOpen: false, capturedImage: null, showPreview: false, isVideoReady: false });
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
            }
            const imageData = compressImage(canvas, 0.7);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setCameraState(prev => ({
                ...prev,
                capturedImage: imageData,
                showPreview: true,
                isOpen: false,
                isVideoReady: false
            }));
        } else {
            alert('La cámara aún no está lista. Espera un momento e intenta de nuevo.');
        }
    };

    const acceptPhoto = () => {
        if (cameraState.capturedImage) {
            const file = base64ToFile(cameraState.capturedImage, `receipt_${Date.now()}.jpg`);
            setFormData(prev => ({ ...prev, receipt: file }));
        }
        setCameraState({ isOpen: false, capturedImage: null, showPreview: false, isVideoReady: false });
    };

    const retakePhoto = () => {
        setCameraState(prev => ({ ...prev, capturedImage: null, showPreview: false, isVideoReady: false }));
        openCamera();
    };

    const removePhoto = () => {
        setFormData(prev => ({ ...prev, receipt: null }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Formato no válido. Solo se aceptan imágenes (JPG, PNG) o PDF');
            return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('El archivo es muy grande. Tamaño máximo: 5MB');
            return;
        }
        setFormData(prev => ({ ...prev, receipt: file }));
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!formData.description || !formData.total || !formData.date ||
            !formData.expenseType || !formData.paymentMethod) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.expenseType === 'presentacion' && !formData.guestName) {
            alert('El nombre del invitado/cliente es obligatorio para gastos de presentación');
            return;
        }

        if (formData.paymentMethod === 'tarjeta-credito' && !formData.selectedCard) {
            alert('Por favor selecciona una tarjeta corporativa');
            return;
        }

        if (formData.applyCostCenter && !formData.costCenter) {
            alert('Por favor ingresa el centro de costo');
            return;
        }

        if (!formData.receipt) {
            alert('Por favor captura una foto del recibo o sube un archivo');
            return;
        }

        if (!user?.id) {
            alert('Usuario no autenticado');
            return;
        }

        try {
            setIsSubmitting(true);

            const expenseTypeMap: { [key: string]: PurchaseType } = {
                'transporte': PurchaseType.TRANSPORTE,
                'presentacion': PurchaseType.PRESENTACION,
                'comida': PurchaseType.COMIDA,
                'servicios': PurchaseType.SERVICIOS
            };

            const paymentMethodMap: { [key: string]: PaymentMethod } = {
                'tarjeta-credito': PaymentMethod.TARJETA_CREDITO,
                'viaticos': PaymentMethod.VIATICOS,
                'transferencia': PaymentMethod.TRANSFERENCIA
            };

            const purchaseData = {
                idUser: parseInt(user.id),
                idFolder: parseInt(folderId || '0'),
                idPType: expenseTypeMap[formData.expenseType],
                idPaymentMethod: paymentMethodMap[formData.paymentMethod],
                totalAmount: parseFloat(formData.total),
                description: formData.description,
                purchaseDate: formData.date,
                file: formData.receipt,
                ...(formData.applyCostCenter && formData.costCenter ? { idCostCenter: parseInt(formData.costCenter) } : {}),
                ...(formData.guestName ? { guestName: formData.guestName } : {})
            };

            await purchaseApi.createPurchase(purchaseData);

            // Show success modal
            setShowSuccessModal(true);

            // Wait 2 seconds then navigate
            setTimeout(() => {
                navigate(`/panel/folders/${folderId}`);
            }, 2000);
        } catch (error: any) {
            console.error('Error creating purchase:', error);
            const errorMessage = error.response?.data?.message || 'Error al registrar la compra';
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/panel/folders/${folderId}`);
    };

    const isGuestFieldEnabled = formData.expenseType === 'presentacion';

    const getFilePreview = () => {
        if (!formData.receipt) return null;
        return URL.createObjectURL(formData.receipt);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Compra Registrada!</h3>
                        <p className="text-gray-600 mb-4">La compra se ha registrado exitosamente</p>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                </div>
            )}

            {/* Camera Modal */}
            {cameraState.isOpen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex-1 relative">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <canvas ref={canvasRef} className="hidden" />
                        {!cameraState.isVideoReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                                    <p className="text-lg">Iniciando cámara...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-900 p-6 flex justify-center gap-4">
                        <button onClick={closeCamera} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                            Cancelar
                        </button>
                        <button onClick={capturePhoto} disabled={!cameraState.isVideoReady}
                            className={`flex items-center justify-center w-16 h-16 rounded-full font-medium transition-colors shadow-lg ${cameraState.isVideoReady ? 'bg-white hover:bg-gray-100 cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-50'}`}>
                            <div className="w-14 h-14 bg-red-600 rounded-full"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {cameraState.showPreview && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex-1 relative overflow-auto">
                        <img src={cameraState.capturedImage || ''} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-gray-900 p-6">
                        <p className="text-white text-center mb-4 font-medium">¿La foto se ve bien?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={retakePhoto} className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors">
                                Tomar otra vez
                            </button>
                            <button onClick={acceptPhoto} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg">
                                Usar esta foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Nueva Compra</h1>
                <p className="text-gray-600 mt-2">Registra un nuevo gasto y adjunta el recibo correspondiente</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
                <div className="space-y-6">
                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-800 mb-2">
                            Descripción <span className="text-red-600">*</span>
                        </label>
                        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange}
                            placeholder="Ej: Cena de negocios con cliente"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" />
                    </div>

                    {/* Total and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium text-slate-800 mb-2">
                                Total <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input type="number" id="total" name="total" value={formData.total} onChange={handleChange}
                                    min="0" step="0.01" placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-800 mb-2">
                                Fecha <span className="text-red-600">*</span>
                            </label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" />
                        </div>
                    </div>

                    {/* Expense Type */}
                    <div>
                        <label htmlFor="expenseType" className="block text-sm font-medium text-slate-800 mb-2">
                            Tipo de gasto <span className="text-red-600">*</span>
                        </label>
                        <select id="expenseType" name="expenseType" value={formData.expenseType} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white">
                            <option value="">Selecciona un tipo</option>
                            <option value="transporte">Gastos de Transporte</option>
                            <option value="presentacion">Gastos de Presentación</option>
                            <option value="comida">Gastos de Comida</option>
                            <option value="servicios">Servicios</option>
                        </select>
                    </div>

                    {/* Payment Method and Cost Center */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-800 mb-2">
                                Método de pago <span className="text-red-600">*</span>
                            </label>
                            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white">
                                <option value="">Selecciona método</option>
                                <option value="tarjeta-credito">Tarjeta de Crédito</option>
                                <option value="viaticos">Viáticos</option>
                                <option value="transferencia">Transferencia</option>
                            </select>

                            {formData.paymentMethod === 'tarjeta-credito' && (
                                <div className="mt-4">
                                    <label htmlFor="selectedCard" className="block text-sm font-medium text-slate-800 mb-2">
                                        Seleccionar Tarjeta <span className="text-red-600">*</span>
                                    </label>
                                    <select id="selectedCard" name="selectedCard" value={formData.selectedCard} onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white">
                                        <option value="">Selecciona una tarjeta</option>
                                        {cards.map((card) => (
                                            <option key={card.id} value={card.id}>
                                                {card.name} - •••• {card.lastFourDigits}
                                            </option>
                                        ))}
                                    </select>
                                    {cards.length === 0 && (
                                        <p className="text-xs text-red-600 mt-1">
                                            No hay tarjetas registradas.
                                            <button type="button" onClick={() => navigate('/panel/payments-methods/new-card')}
                                                className="underline ml-1 hover:text-red-700">
                                                Registrar una tarjeta
                                            </button>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-3">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" name="applyCostCenter" checked={formData.applyCostCenter}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            applyCostCenter: e.target.checked,
                                            costCenter: e.target.checked ? prev.costCenter : ''
                                        }))}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm font-medium text-slate-800">
                                        Aplicable a centro de costos
                                    </span>
                                </label>
                            </div>
                            <label htmlFor="costCenter" className="block text-sm font-medium text-slate-800 mb-2">
                                Centro de costo
                                {formData.applyCostCenter && <span className="text-red-600"> *</span>}
                            </label>
                            <input type="text" id="costCenter" name="costCenter" value={formData.costCenter} onChange={handleChange}
                                disabled={!formData.applyCostCenter}
                                placeholder={formData.applyCostCenter ? "Ej: Marketing" : "Marcar checkbox para habilitar"}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${!formData.applyCostCenter ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`} />
                            {!formData.applyCostCenter && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Marca el checkbox si este gasto aplica a un centro de costos específico
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Guest/Client Name */}
                    <div>
                        <label htmlFor="guestName" className="block text-sm font-medium text-slate-800 mb-2">
                            Nombre de Invitado/Cliente
                            {isGuestFieldEnabled && <span className="text-red-600"> *</span>}
                        </label>
                        <input type="text" id="guestName" name="guestName" value={formData.guestName} onChange={handleChange}
                            disabled={!isGuestFieldEnabled}
                            placeholder={isGuestFieldEnabled ? "Nombre del invitado o cliente" : "Solo para gastos de presentación"}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${!isGuestFieldEnabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`} />
                        {!isGuestFieldEnabled && (
                            <p className="text-xs text-gray-500 mt-1">
                                Este campo se habilitará al seleccionar "Gastos de Presentación"
                            </p>
                        )}
                    </div>

                    {/* Photo Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <label className="block text-sm font-medium text-slate-800 mb-3">
                            Recibo o Comprobante <span className="text-red-600">*</span>
                        </label>

                        {!formData.receipt ? (
                            <div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button type="button" onClick={openCamera}
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Tomar Fotografía
                                    </button>
                                    <button type="button" onClick={triggerFileUpload}
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Subir Archivo
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Toma una foto o sube un archivo (JPG, PNG, PDF) del recibo
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="relative border-2 border-green-500 rounded-lg overflow-hidden">
                                    {formData.receipt.type.startsWith('image') ? (
                                        <img src={getFilePreview() || ''} alt="Recibo capturado"
                                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(getFilePreview() || '', '_blank')} />
                                    ) : formData.receipt.type === 'application/pdf' ? (
                                        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 mx-auto text-red-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm font-medium text-gray-700">{formData.receipt.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{(formData.receipt.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 mx-auto text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm font-medium text-gray-700">{formData.receipt.name}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <button type="button" onClick={removePhoto}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Archivo adjuntado correctamente
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm text-blue-900 font-medium">Consejo</p>
                                <p className="text-sm text-blue-800 mt-1">
                                    Asegúrate de capturar una imagen clara del recibo donde se puedan leer todos los detalles importantes como fecha, monto y concepto.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={handleCancel} disabled={isSubmitting}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </>
                            ) : (
                                'Registrar Compra'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    0% {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}