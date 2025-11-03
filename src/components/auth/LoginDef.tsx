import { useNavigate } from 'react-router-dom';
import logoDatum from '/src/assets/images/logo_datum.png'
import { Settings } from 'lucide-react';


export const LoginDef = () => {

    const navigate = useNavigate();

    const handleLoginDef = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        navigate('/terms-conditions');
    };

    const goToAdmin = () => {
        navigate('/admin-login');
    };


    return (
        <div className="bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/src/assets/images/bg-datum.jpg')] bg-cover bg-center bg-no-repeat h-screen w-screen fixed top-0 left-0 flex items-center justify-center p-4">

            <button
                onClick={goToAdmin}
                title="Panel de Control"
                className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white border border-white/20 px-3 py-2 rounded-lg shadow-md transition-all"
            >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Panel</span>
            </button>

            <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
                <img src={logoDatum} />
                <form className="space-y-5" onSubmit={handleLoginDef}>

                    <div>
                        <input type="email"
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Correo electrónico" required />
                    </div>

                    <div>
                        <input type="password"
                            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                            placeholder="Contraseña" required />
                    </div>

                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
                        type="submit">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}
