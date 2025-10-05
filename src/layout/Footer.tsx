import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">© 2024 DATUM RedSoft</span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                        <Link to="/panel/questions" className="text-gray-600 hover:text-red-600 transition-colors">
                            Ayuda
                        </Link>
                        <Link to="/privacy" className="text-gray-600 hover:text-red-600 transition-colors">
                            Privacidad
                        </Link>
                        <a href="mailto:support@datum.com" className="text-gray-600 hover:text-red-600 transition-colors">
                            Soporte
                        </a>
                    </div>

                    <div className="text-sm text-gray-500">
                        Versión 1.0.0
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;