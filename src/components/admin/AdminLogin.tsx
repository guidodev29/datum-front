import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDatum from '/src/assets/images/logo_datum.png';

export const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = formData;

        // Simple local validation
        if (email === 'admin' && password === 'admin') {
            // Save a simple flag to indicate admin session (optional)
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Credenciales inválidas. Intente de nuevo.');
        }
    };

    const goToAdmin = () => {
        navigate('/admin');
    };

    return (
        <div className="bg-[linear-gradient(rgba(0,0,0,0.7),rgba(80,0,0,0.7)),url('/src/assets/images/bg-datum.jpg')] bg-cover bg-center bg-no-repeat h-screen w-screen fixed top-0 left-0 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/40 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
                <div className="flex justify-center mb-6">
                    <img src={logoDatum} alt="Datum Logo" className="h-16" />
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Acceso Administrador</h2>
                    <p className="text-white/80 text-sm">
                        Ingresa tus credenciales para acceder al panel de administración
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Usuario"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-200 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={goToAdmin}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
                        type="submit"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};
