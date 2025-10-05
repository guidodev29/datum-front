import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const TermsConditions = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const navigate = useNavigate();

  const termsItems = [
    "1. Uso de Datos y Privacidad",
    "1.1. El usuario acepta expresamente que sus datos personales y profesionales sean tratados conforme a lo establecido en la Política de Privacidad de la empresa.",
    "1.2. El usuario reconoce y acepta que los datos relativos al uso del sistema podrán ser recopilados con el único fin de análisis y mejora del rendimiento.",
    "2. Uso del Sistema",
    "2.1. El usuario se compromete a utilizar el sistema exclusivamente para fines legítimos y autorizados por la empresa.",
    "2.2. El usuario tiene estrictamente prohibido compartir sus credenciales de acceso con terceros no autorizados.",
    "2.3. El usuario será el único responsable de mantener la confidencialidad y seguridad de su cuenta, eximiendo a la empresa de cualquier responsabilidad derivada del uso indebido de la misma.",
    "3. Seguridad de la Información",
    "3.1. El usuario se obliga a no intentar acceder a información, datos o áreas del sistema a las que no tenga autorización expresa.",
    "3.2. El usuario se compromete a notificar de manera inmediata cualquier incidente de seguridad o actividad sospechosa que detecte en el uso del sistema.",
    "4. Cumplimiento Normativo",
    "4.1. El usuario se compromete a cumplir estrictamente con todas las políticas internas de la empresa, así como con la legislación y normativa aplicable en cada caso.",
    "4.2. El usuario reconoce que cualquier uso indebido del sistema podrá dar lugar a la suspensión temporal o definitiva de su cuenta, sin perjuicio de las acciones legales que correspondan.",
    "5. Responsabilidad",
    "5.1. El usuario reconoce que DATUM no será responsable por la pérdida, alteración o eliminación de datos ocasionada por error u omisión atribuible al propio usuario.",
    "5.2. El usuario acepta expresamente que el uso del sistema se realiza bajo su exclusiva responsabilidad y riesgo."
  ];

  const handleTerms = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/src/assets/images/bg-datum.jpg')] bg-cover bg-center bg-no-repeat h-screen w-screen fixed top-0 left-0 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-black/30 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
        <div className="flex justify-center mb-6">
          <img src="/src/assets/images/logo_datum.png" alt="DATUM Logo" className="h-24 w-auto" />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Términos y Condiciones</h2>
            <p className="text-white/90 text-sm mb-4">
              Por favor, lea y acepte los siguientes términos para continuar:
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 max-h-60 overflow-y-auto border-2 border-white/30">
            <ul className="space-y-3">
              {termsItems.map((term, index) => (
                <li key={index} className="text-white/90 text-sm flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-white/20 border-white/30 rounded focus:ring-red-500 focus:ring-2"
            />
            <label htmlFor="acceptTerms" className="text-white/90 text-sm cursor-pointer">
              Acepto los términos y condiciones
            </label>
          </div>

          <button
            onClick={handleTerms}
            disabled={!isAccepted}
            className={`w-full font-semibold py-3 rounded-lg transition-all ${isAccepted
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
