import { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  time?: string;
  category: 'work' | 'personal' | 'meeting' | 'other';
  description?: string;
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'month' | 'list'>('month');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(event.startDate);
    setShowEventModal(true);
  };

  const saveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event =>
        event.id === editingEvent.id
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const isEventOnDate = (event: CalendarEvent, dateStr: string) => {
    return dateStr >= event.startDate && dateStr <= event.endDate;
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => isEventOnDate(event, dateStr));
  };

  const isMultiDayEvent = (event: CalendarEvent) => {
    return event.startDate !== event.endDate;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      meeting: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const exportCalendar = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendario-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-gray-200 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentYear, currentMonth, day);
      const dayEvents = getEventsForDate(dateStr);
      const isToday = today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;
      const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 ||
        new Date(currentYear, currentMonth, day).getDay() === 6;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 md:h-32 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 ring-2 ring-blue-500' : isWeekend ? 'bg-gray-50' : 'bg-white'
            }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={(e) => handleEventClick(event, e)}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${getCategoryColor(event.category)} hover:opacity-80 ${isMultiDayEvent(event) ? 'border-l-2 border-white' : ''
                  }`}
                title={isMultiDayEvent(event) ? `${event.startDate} - ${event.endDate}` : event.title}
              >
                {event.time && <span className="mr-1">{event.time}</span>}
                {event.title}
                {isMultiDayEvent(event) && <span className="ml-1">↔</span>}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 px-1">+{dayEvents.length - 2} más</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderListView = () => {
    const sortedEvents = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEvent(event);
                  setSelectedDate(event.startDate);
                  setShowEventModal(true);
                }}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`}></div>
                      <h3 className="font-semibold text-slate-800">{event.title}</h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-0.5">
                      {isMultiDayEvent(event) ? (
                        <p className="flex items-center gap-1">
                          <span>{new Date(event.startDate).toLocaleDateString('es-ES')}</span>
                          <span>→</span>
                          <span>{new Date(event.endDate).toLocaleDateString('es-ES')}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full ml-2">
                            Múltiples días
                          </span>
                        </p>
                      ) : (
                        <p>{new Date(event.startDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      )}
                      {event.time && <p>Hora: {event.time}</p>}
                      {event.description && <p className="text-gray-500 mt-1">{event.description}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              No hay eventos programados
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Calendario</h1>
        <p className="text-gray-600">Gestiona tus recordatorios y eventos importantes</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-slate-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Hoy
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-200 rounded-lg p-1">
            {(['month', 'list'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 text-sm rounded ${view === viewType
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {viewType === 'month' ? 'Mes' : 'Lista'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={exportCalendar}
            className="px-3 py-1.5 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'month' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dayNames.map((day) => (
              <div key={day} className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderMonthView()}
          </div>
        </div>
      ) : (
        renderListView()
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={saveEvent}
          onDelete={editingEvent ? () => deleteEvent(editingEvent.id) : undefined}
          event={editingEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

// Event Modal Component
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: () => void;
  event?: CalendarEvent | null;
  selectedDate: string | null;
}

function EventModal({ isOpen, onClose, onSave, onDelete, event, selectedDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<CalendarEvent['category']>('work');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setTime(event.time || '');
      setCategory(event.category);
      setDescription(event.description || '');
    } else {
      setTitle('');
      setStartDate(selectedDate || '');
      setEndDate(selectedDate || '');
      setTime('');
      setCategory('work');
      setDescription('');
    }
  }, [event, selectedDate]);

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate) return;
    if (endDate < startDate) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }

    onSave({
      title: title.trim(),
      startDate,
      endDate,
      time: time || undefined,
      category,
      description: description.trim() || undefined
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Viaje a Guatemala"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {startDate !== endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Este evento durará {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} días
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="work">Trabajo</option>
                <option value="personal">Personal</option>
                <option value="meeting">Reunión</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detalles del evento..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                >
                  {event ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;