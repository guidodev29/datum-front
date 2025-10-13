import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewPurchaseForm() {
    // Router hooks
    const navigate = useNavigate();
    const { folderId } = useParams<{ folderId: string }>();
    
    // Refs with proper TypeScript types
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        description: '',
        total: '',
        date: '',
        expenseType: '',
        paymentMethod: '',
        costCenter: '',
        guestName: '',
        receipt: null as string | null
    });

    // Camera state
    const [cameraState, setCameraState] = useState({
        isOpen: false,
        capturedImage: null as string | null,
        showPreview: false,
        isVideoReady: false
    });

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'expenseType' && value !== 'representacion' ? { guestName: '' } : {})
        }));
    };

    // Compress image to optimize storage
    const compressImage = (canvas: HTMLCanvasElement, quality: number = 0.7): string => {
        return canvas.toDataURL('image/jpeg', quality);
    };

    // Open camera
    const openCamera = async () => {
        try {
            // Show modal immediately
            setCameraState(prev => ({ ...prev, isOpen: true, isVideoReady: false }));
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                } 
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    // Set video ready after a small delay to ensure it's fully loaded
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

    // Close camera
    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraState({ isOpen: false, capturedImage: null, showPreview: false, isVideoReady: false });
    };

    // Capture photo
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

    // Accept photo and save to form
    const acceptPhoto = () => {
        setFormData(prev => ({
            ...prev,
            receipt: cameraState.capturedImage
        }));
        setCameraState({ isOpen: false, capturedImage: null, showPreview: false, isVideoReady: false });
    };

    // Retake photo
    const retakePhoto = () => {
        setCameraState(prev => ({ ...prev, capturedImage: null, showPreview: false, isVideoReady: false }));
        openCamera();
    };

    // Remove photo
    const removePhoto = () => {
        setFormData(prev => ({ ...prev, receipt: null }));
    };

    // Submit form
    const handleSubmit = () => {
        if (!formData.description || !formData.total || !formData.date || 
            !formData.expenseType || !formData.paymentMethod || !formData.costCenter) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.expenseType === 'representacion' && !formData.guestName) {
            alert('El nombre del invitado/cliente es obligatorio para gastos de representación');
            return;
        }

        if (!formData.receipt) {
            alert('Por favor captura una foto del recibo');
            return;
        }

        try {
            const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
            const newPurchase = {
                id: Date.now(),
                folderId,
                ...formData,
                createdAt: new Date().toISOString()
            };
            purchases.push(newPurchase);
            localStorage.setItem('purchases', JSON.stringify(purchases));
            
            alert('✅ Compra registrada correctamente');
            navigate(`/panel/folders/${folderId}`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Error al guardar. La imagen puede ser muy grande.');
        }
    };

    // Cancel and go back
    const handleCancel = () => {
        navigate(`/panel/folders/${folderId}`);
    };

    const isGuestFieldEnabled = formData.expenseType === 'representacion';

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Camera Modal */}
            {cameraState.isOpen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex-1 relative">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Loading indicator */}
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
                        <button
                            onClick={closeCamera}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={capturePhoto}
                            disabled={!cameraState.isVideoReady}
                            className={`flex items-center justify-center w-16 h-16 rounded-full font-medium transition-colors shadow-lg ${
                                cameraState.isVideoReady 
                                    ? 'bg-white hover:bg-gray-100 cursor-pointer' 
                                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                            }`}
                        >
                            <div className="w-14 h-14 bg-red-600 rounded-full"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {cameraState.showPreview && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex-1 relative overflow-auto">
                        <img 
                            src={cameraState.capturedImage || ''} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="bg-gray-900 p-6">
                        <p className="text-white text-center mb-4 font-medium">¿La foto se ve bien?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={retakePhoto}
                                className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
                            >
                                Tomar otra vez
                            </button>
                            <button
                                onClick={acceptPhoto}
                                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                            >
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
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Ej: Cena de negocios con cliente"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                    </div>

                    {/* Total and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium text-slate-800 mb-2">
                                Total <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    id="total"
                                    name="total"
                                    value={formData.total}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-800 mb-2">
                                Fecha <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Expense Type */}
                    <div>
                        <label htmlFor="expenseType" className="block text-sm font-medium text-slate-800 mb-2">
                            Tipo de gasto <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="expenseType"
                            name="expenseType"
                            value={formData.expenseType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="viaje">Gastos de Viaje</option>
                            <option value="comida">Gastos de Comida</option>
                            <option value="representacion">Gastos de Representación</option>
                        </select>
                    </div>

                    {/* Payment Method and Cost Center */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-800 mb-2">
                                Método de pago <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                <option value="">Selecciona método</option>
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta de Crédito</option>
                                <option value="debito">Tarjeta de Débito</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="costCenter" className="block text-sm font-medium text-slate-800 mb-2">
                                Centro de costo <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="costCenter"
                                name="costCenter"
                                value={formData.costCenter}
                                onChange={handleChange}
                                placeholder="Ej: Marketing"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Guest/Client Name */}
                    <div>
                        <label htmlFor="guestName" className="block text-sm font-medium text-slate-800 mb-2">
                            Nombre de Invitado/Cliente
                            {isGuestFieldEnabled && <span className="text-red-600"> *</span>}
                        </label>
                        <input
                            type="text"
                            id="guestName"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleChange}
                            disabled={!isGuestFieldEnabled}
                            placeholder={isGuestFieldEnabled ? "Nombre del invitado o cliente" : "Solo para gastos de representación"}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                !isGuestFieldEnabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                            }`}
                        />
                        {!isGuestFieldEnabled && (
                            <p className="text-xs text-gray-500 mt-1">
                                Este campo se habilitará al seleccionar "Gastos de Representación"
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
                                <button
                                    type="button"
                                    onClick={openCamera}
                                    className="inline-flex items-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Tomar Fotografía
                                </button>
                                <p className="text-xs text-gray-500 mt-2">
                                    Captura una foto del recibo o factura para adjuntarla al gasto
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="relative border-2 border-green-500 rounded-lg overflow-hidden">
                                    <img 
                                        src={formData.receipt} 
                                        alt="Recibo capturado" 
                                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(formData.receipt || '', '_blank')}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors"
                                        >
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
                                    Foto del recibo adjuntada correctamente
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
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md"
                        >
                            Registrar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}