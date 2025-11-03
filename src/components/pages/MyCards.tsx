import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  type: 'credit_card';
  name: string;
  lastFourDigits: string;
  cardType: string;
  accountHolder: string;
  isBlocked?: string;  
}

export const MyCards = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      const allMethods = JSON.parse(stored);
      // Filter only credit cards
      const creditCards = allMethods.filter((m: any) => m.type === 'credit_card');
      setPaymentMethods(creditCards);
    } else {
      const mockData: PaymentMethod[] = [
        {
          id: '1',
          type: 'credit_card',
          name: 'Tarjeta Corporativa Principal',
          lastFourDigits: '4532',
          cardType: 'Visa Business',
          accountHolder: 'DATUM RedSoft'
        },
        {
          id: '2',
          type: 'credit_card',
          name: 'Tarjeta Corporativa Secundaria',
          lastFourDigits: '8821',
          cardType: 'Mastercard',
          accountHolder: 'DATUM RedSoft'
        }
      ];
      localStorage.setItem('paymentMethods', JSON.stringify(mockData));
      setPaymentMethods(mockData);
    }
  }, []);

  const getCreditCardIcon = () => {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Mis Tarjetas
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Tarjetas de crédito disponibles para el registro de gastos empresariales
          </p>
        </div>
        <button
          onClick={() => navigate('/panel/my-cards/new-card')}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar nueva tarjeta</span>
        </button>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-lg shadow-sm border transition-all p-4 md:p-6 ${
                method.isBlocked === 'Y' 
                  ? 'border-red-300 bg-red-50/30 opacity-75' 
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-white">
                    {getCreditCardIcon()}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {/* Card Name with Blocked Badge */}
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 truncate">
                      {method.name}
                    </h3>
                    {method.isBlocked === 'Y' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 flex-shrink-0">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        BLOQUEADA
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 md:space-y-1.5">
                    <div className="flex items-start text-xs md:text-sm text-gray-600">
                      <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Tipo:</span>
                      <span className="break-words">Tarjeta de Crédito</span>
                    </div>

                    <div className="flex items-start text-xs md:text-sm text-gray-600">
                      <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Titular:</span>
                      <span className="break-words">{method.accountHolder}</span>
                    </div>

                    <div className="flex items-start text-xs md:text-sm text-gray-600">
                      <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Número:</span>
                      <span className="font-mono break-all">•••• •••• •••• {method.lastFourDigits}</span>
                    </div>

                    <div className="flex items-start text-xs md:text-sm text-gray-600">
                      <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Red:</span>
                      <span className="break-words">{method.cardType}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/panel/my-cards/edit/${method.id}`)}
                      disabled={method.isBlocked === 'Y'}
                      className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        method.isBlocked === 'Y'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {method.isBlocked === 'Y' ? 'Bloqueada' : 'Editar'}
                    </button>
                    <button
                      onClick={() => navigate(`/panel/my-cards/report/${method.id}`)}
                      className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-xs font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Reportar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 md:mb-3">
              No hay tarjetas registradas
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Comienza agregando tu primera tarjeta de crédito para registrar gastos empresariales
            </p>
            <button
              onClick={() => navigate('/panel/my-cards/new-card')}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar tarjeta</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base md:text-lg mb-2">Gestión Centralizada</h3>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
              Las tarjetas de crédito son administradas por el departamento de finanzas. Si necesitas acceso a tarjetas adicionales o tienes dudas sobre su uso, contacta a tu supervisor o al área de contabilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};