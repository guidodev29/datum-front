import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SupportFormData {
    fullName: string;
    email: string;
    category: string;
    subject: string;    
    description: string;
    urgency: string;
}

export const Settings = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SupportFormData>({
        fullName: "",
        email: "",
        category: "",
        subject: "",
        description: "",
        urgency: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [emailPreview, setEmailPreview] = useState("");

    const categories = [
        { value: "bug", label: "Error o Falla del Sistema" },
        { value: "request", label: "Solicitud de Asistencia" },
        { value: "access", label: "Problema de Acceso" },
        { value: "suggestion", label: "Sugerencia o Mejora" },
        { value: "other", label: "Otro" },
    ];

    const urgencies = [
        { value: "low", label: "Baja" },
        { value: "medium", label: "Media" },
        { value: "high", label: "Alta" },
    ];

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.fullName.trim()) errors.fullName = "El nombre es obligatorio.";
        if (!formData.email.trim())
            errors.email = "El correo electrónico es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email = "Debe ingresar un correo electrónico válido.";

        if (!formData.category) errors.category = "Debe seleccionar una categoría.";
        if (!formData.subject.trim())
            errors.subject = "El asunto es obligatorio.";
        if (!formData.description.trim())
            errors.description = "Debe describir el problema o solicitud.";
        if (!formData.urgency) errors.urgency = "Seleccione el nivel de urgencia.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear individual errors
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate sending the email
            const emailBody = `
        Nombre: ${formData.fullName}
        Correo: ${formData.email}
        Categoría: ${categories.find(c => c.value === formData.category)?.label}
        Nivel de Urgencia: ${urgencies.find(u => u.value === formData.urgency)?.label}
        Asunto: ${formData.subject}
        
        Descripción del problema:
        ${formData.description}
      `.trim();

            console.log("Mensaje enviado a soporte técnico:", emailBody);

            setEmailPreview(emailBody);

            await new Promise((resolve) => setTimeout(resolve, 1200));

            // Navigate or show confirmation
            navigate("/panel/support/confirmation");
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            setFormErrors({
                submit: "Error al enviar la solicitud. Intente nuevamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/panel")}
                    className="flex items-center text-gray-600 hover:text-slate-800 mb-4 transition-colors group"
                >
                    <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="text-sm font-medium">Volver al Panel</span>
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Soporte Técnico
                </h1>
                <p className="text-base text-gray-600">
                    Complete el siguiente formulario para reportar un problema o solicitar
                    asistencia técnica.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="order-2 lg:order-1">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2 text-slate-800"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Información de la Solicitud
                        </h2>

                        <div className="space-y-6">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Juan Pérez"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.fullName
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="usuario@empresa.com"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.email
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Solicitud *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.category
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                >
                                    <option value="">Seleccionar</option>
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.category && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Asunto *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Error al guardar datos"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.subject
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                />
                                {formErrors.subject && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Descripción del Problema o Solicitud *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="Describa detalladamente el problema o solicitud..."
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.description
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                />
                                {formErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                )}
                            </div>

                            {/* Urgency */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nivel de Urgencia *
                                </label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all ${formErrors.urgency
                                            ? "border-red-500"
                                            : "border-gray-300 hover:border-gray-400"
                                        }`}
                                >
                                    <option value="">Seleccionar nivel</option>
                                    {urgencies.map((u) => (
                                        <option key={u.value} value={u.value}>
                                            {u.label}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.urgency && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.urgency}</p>
                                )}
                            </div>

                            {formErrors.submit && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
                                    {formErrors.submit}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8 pt-6 border-t-2">
                            <button
                                onClick={() => navigate("/panel")}
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
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                        1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Enviar Solicitud
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="order-1 lg:order-2">
                    <div className="lg:sticky lg:top-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2 text-slate-800"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 
                  2.943 9.542 7-1.274 4.057-5.064 7-9.542 
                  7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            Vista Previa del Mensaje
                        </h2>

                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <p className="text-gray-800 whitespace-pre-line text-sm">
                                {emailPreview ||
                                    `Aún no hay vista previa del mensaje.\n\nComplete el formulario para ver el contenido del correo que será enviado al equipo técnico.`}
                            </p>
                        </div>

                        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 
                    002-2v-6a2 2 0 00-2-2H6a2 2 
                    0 00-2 2v6a2 2 0 002 
                    2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                        Confidencialidad
                                    </h4>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Su solicitud será tratada con confidencialidad. El equipo de
                                        soporte responderá a su correo electrónico registrado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
