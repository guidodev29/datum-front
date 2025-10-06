import { useEffect, useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'cash' | 'bank_transfer';
  name: string;
  lastFourDigits?: string;
  cardType?: string;
  bankName?: string;
  accountHolder?: string;
}

export const PaymentsMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      setPaymentMethods(JSON.parse(stored));
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
        },
        {
          id: '3',
          type: 'cash',
          name: 'Fondo Caja Chica',
          accountHolder: 'Oficina Central'
        },
        {
          id: '4',
          type: 'bank_transfer',
          name: 'Cuenta Empresarial',
          lastFourDigits: '7890',
          bankName: 'Banco Agrícola',
          accountHolder: 'DATUM RedSoft S.A.'
        }
      ];
      localStorage.setItem('paymentMethods', JSON.stringify(mockData));
      setPaymentMethods(mockData);
    }
  }, []);

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'cash':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'bank_transfer':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getMethodTypeText = (type: string) => {
    const types = {
      credit_card: 'Tarjeta de Crédito',
      cash: 'Efectivo',
      bank_transfer: 'Transferencia'
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredMethods = filter === 'all' 
    ? paymentMethods 
    : paymentMethods.filter(m => m.type === filter);

  const methodCounts = {
    all: paymentMethods.length,
    credit_card: paymentMethods.filter(m => m.type === 'credit_card').length,
    cash: paymentMethods.filter(m => m.type === 'cash').length,
    bank_transfer: paymentMethods.filter(m => m.type === 'bank_transfer').length
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Métodos de Pago
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Métodos de pago disponibles para el registro de gastos empresariales
        </p>
      </div>

      {/* Filter Tabs - Responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-gray-600 hover:text-slate-800'
            }`}
          >
            Todos ({methodCounts.all})
          </button>
          <button
            onClick={() => setFilter('credit_card')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'credit_card'
                ? 'bg-slate-800 text-white'
                : 'text-gray-600 hover:text-slate-800'
            }`}
          >
            Tarjetas ({methodCounts.credit_card})
          </button>
          <button
            onClick={() => setFilter('cash')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'cash'
                ? 'bg-slate-800 text-white'
                : 'text-gray-600 hover:text-slate-800'
            }`}
          >
            Efectivo ({methodCounts.cash})
          </button>
          <button
            onClick={() => setFilter('bank_transfer')}
            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'bank_transfer'
                ? 'bg-slate-800 text-white'
                : 'text-gray-600 hover:text-slate-800'
            }`}
          >
            Transferencias ({methodCounts.bank_transfer})
          </button>
        </div>
      </div>

      {/* Payment Methods List */}
      {filteredMethods.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4 md:p-6"
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-white">
                    {getMethodIcon(method.type)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2 md:mb-3 truncate">
                    {method.name}
                  </h3>

                  <div className="space-y-1 md:space-y-1.5">
                    <div className="flex items-start text-xs md:text-sm text-gray-600">
                      <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Tipo:</span>
                      <span className="break-words">{getMethodTypeText(method.type)}</span>
                    </div>

                    {method.accountHolder && (
                      <div className="flex items-start text-xs md:text-sm text-gray-600">
                        <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Titular:</span>
                        <span className="break-words">{method.accountHolder}</span>
                      </div>
                    )}

                    {method.lastFourDigits && (
                      <div className="flex items-start text-xs md:text-sm text-gray-600">
                        <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">
                          {method.type === 'credit_card' ? 'Número:' : 'Cuenta:'}
                        </span>
                        <span className="font-mono break-all">•••• •••• •••• {method.lastFourDigits}</span>
                      </div>
                    )}

                    {method.cardType && (
                      <div className="flex items-start text-xs md:text-sm text-gray-600">
                        <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Red:</span>
                        <span className="break-words">{method.cardType}</span>
                      </div>
                    )}

                    {method.bankName && (
                      <div className="flex items-start text-xs md:text-sm text-gray-600">
                        <span className="font-medium min-w-16 md:min-w-24 flex-shrink-0">Banco:</span>
                        <span className="break-words">{method.bankName}</span>
                      </div>
                    )}
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
              No hay métodos de pago en esta categoría
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Selecciona otra categoría para ver los métodos disponibles
            </p>
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
              Los métodos de pago son administrados por el departamento de finanzas. Si necesitas acceso a métodos adicionales o tienes dudas sobre su uso, contacta a tu supervisor o al área de contabilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};