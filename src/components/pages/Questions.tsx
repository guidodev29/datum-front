import { useState } from 'react';

export const Questions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Cómo creo una nueva carpeta de gastos?",
      answer: "Puedes crear una nueva carpeta desde el panel principal haciendo clic en el botón 'Nueva carpeta'. Deberás completar el nombre, descripción y fechas del evento. Una vez creada, podrás agregar gastos individuales a esa carpeta."
    },
    {
      question: "¿Qué información necesito para registrar un gasto?",
      answer: "Para cada gasto necesitas proporcionar: fecha, monto, categoría, método de pago utilizado y una descripción. Es recomendable adjuntar el recibo o factura como respaldo."
    },
    {
      question: "¿Puedo editar una carpeta después de crearla?",
      answer: "Sí, puedes editar cualquier carpeta que esté en estado 'Borrador'. Una vez enviada para aprobación, solo podrás ver los detalles pero no modificarlos. Contacta a tu supervisor si necesitas hacer cambios a una carpeta ya enviada."
    },
    {
      question: "¿Cómo adjunto recibos a mis gastos?",
      answer: "Al agregar o editar un gasto, encontrarás una opción para adjuntar archivos. Puedes subir imágenes (JPG, PNG) o documentos PDF de tus recibos. El tamaño máximo por archivo es de 5MB."
    },
    {
      question: "¿Qué pasa si excedo mi límite asignado?",
      answer: "El sistema te alertará cuando te acerques a tu límite mensual. Si necesitas exceder el límite por razones justificadas, deberás solicitar una aprobación especial de tu supervisor antes de realizar los gastos."
    },
    {
      question: "¿Cuánto tiempo tarda la aprobación de una carpeta?",
      answer: "Normalmente, las carpetas enviadas son revisadas en 2-3 días laborales. Recibirás una notificación por correo cuando tu carpeta sea aprobada o si se requieren cambios."
    },
    {
      question: "¿Puedo ver el historial de mis gastos anteriores?",
      answer: "Sí, todas tus carpetas anteriores permanecen accesibles en la sección 'Mis Carpetas'. Puedes filtrar por estado, fecha o buscar por nombre para encontrar gastos específicos."
    },
    {
      question: "¿Qué métodos de pago puedo registrar?",
      answer: "Puedes registrar gastos realizados con tarjeta de crédito corporativa, efectivo, transferencia bancaria o tarjeta personal (para reembolso). Asegúrate de seleccionar el método correcto para facilitar el proceso de reembolso."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Preguntas Frecuentes
        </h1>
        <p className="text-gray-600">
          Encuentra respuestas rápidas a las preguntas más comunes sobre el sistema de gastos
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="transition-all">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-medium text-slate-800 pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o problema.
            </p>
            
            <a href="mailto:support@datum.com"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};