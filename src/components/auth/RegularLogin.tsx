import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoDatum from '/src/assets/images/logo_datum.png';

export const RegularLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Check if there's a success message from password change
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            // Backend expects 'username' but we're collecting 'email' from user
            await login({
                username: email,  // Map email to username
                password
            });

            // Success! Navigate to dashboard
            navigate('/panel');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al iniciar sesión. Verifica tus credenciales.';
            setError(errorMessage);
            console.error('Login error:', err);
        }
    };

    return (
        <div className="bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/src/assets/images/bg-datum.jpg')] bg-cover bg-center bg-no-repeat h-screen w-screen fixed top-0 left-0 flex items-center justify-center p-4">

            <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
                <img src={logoDatum} alt="Datum Logo" className="mb-6" />

                <h2 className="text-white text-2xl font-bold text-center mb-6">
                    Iniciar Sesión
                </h2>

                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Success Message (from password change) */}
                    {successMessage && (
                        <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Correo electrónico"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Contraseña"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};