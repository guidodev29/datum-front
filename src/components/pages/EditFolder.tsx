import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { folderApi } from '../../services/api/folderApi';
import type { Folder } from '../../services/types/api.types';

export const EditFolder = () => {
    const navigate = useNavigate();
    const { folderId } = useParams<{ folderId: string }>();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        folderName: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    // Load folder data
    useEffect(() => {
        const loadFolder = async () => {
            if (!folderId) return;

            try {
                setIsLoading(true);
                const folder = await folderApi.getFolder(81, parseInt(folderId));
                
                setFormData({
                    folderName: folder.folderName,
                    description: folder.description,
                    startDate: folder.startDate,
                    endDate: folder.endDate
                });
            } catch (err) {
                console.error('Error loading folder:', err);
                setError('Error al cargar la carpeta');
            } finally {
                setIsLoading(false);
            }
        };

        loadFolder();
    }, [folderId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!folderId) return;

        try {
            setIsSaving(true);
            await folderApi.updateFolder(81, parseInt(folderId), formData);
            
            alert('Carpeta actualizada exitosamente');
            navigate('/panel/welcome');
        } catch (err) {
            console.error('Error updating folder:', err);
            alert('Error al actualizar la carpeta');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/panel/welcome');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando carpeta...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 text-xl mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/panel/welcome')} 
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleCancel}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Editar Carpeta</h1>
                <p className="text-gray-600 mt-2">Modifica la información de tu carpeta</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="folderName" className="block text-sm font-medium text-slate-800 mb-2">
                            Nombre de la carpeta <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="folderName"
                            name="folderName"
                            value={formData.folderName}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Viaje a Guatemala"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-800 mb-2">
                            Descripción <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe el propósito de esta carpeta..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-800 mb-2">
                                Fecha de inicio <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-800 mb-2">
                                Fecha de fin <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                min={formData.startDate}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 flex items-center justify-center"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};