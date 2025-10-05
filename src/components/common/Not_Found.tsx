export const Not_Found = () => {
    return (
            <div className="bg-gradient-to-r from-slate-200 to-gray-200 text-black h-screen w-screen fixed top-0 left-0">
                <div className="flex items-center justify-center min-h-screen px-2">
                    <div className="text-center">
                        <h1 className="text-9xl font-bold ">404</h1>
                        <p className="text-2xl font-medium mt-4">Ups! Pagina no encontrada</p>
                        <p className="mt-4 mb-8">La página que buscas no existe, o se ha movido a otro lugar.</p>
                        <a href="/"
                            className="w-full bg-red-600 hover:bg-red-700 p-8 text-white font-semibold py-3 rounded-lg transition-all">
                            Ir al inicio
                        </a>
                    </div>
                </div>
            </div>
    )
}
