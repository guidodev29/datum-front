import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('La nueva contraseña debe ser diferente a la actual');
            return;
        }

        // TODO: Send to backend
        console.log('Password change:', formData);
        alert('Contraseña cambiada exitosamente');
        navigate('/panel/welcome');
    };

    return (
        <div className="bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/src/assets/images/bg-datum.jpg')] bg-cover bg-center bg-no-repeat h-screen w-screen fixed top-0 left-0 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src="/src/assets/images/logo_datum.png" alt="Datum Logo" className="h-16" />
                </div>

                {/* Title and Instructions */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Cambiar Contraseña</h2>
                    <p className="text-white/80 text-sm">
                        Por seguridad, debes cambiar tu contraseña predeterminada
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm text-white/90">
                                La nueva contraseña debe tener al menos 6 caracteres y ser diferente a la actual
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Current Password */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                            Contraseña Actual
                        </label>
                        <input 
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Ingresa tu contraseña actual"
                            required 
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                            Nueva Contraseña
                        </label>
                        <input 
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Mínimo 6 caracteres"
                            required 
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                            Confirmar Nueva Contraseña
                        </label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Repite la nueva contraseña"
                            required 
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-200 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                        type="submit"
                    >
                        Cambiar Contraseña
                    </button>
                </form>

                {/* Footer Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-white/60 text-xs">
                        Esta es una acción de seguridad requerida para proteger tu cuenta
                    </p>
                </div>
            </div>
        </div>
    );
};