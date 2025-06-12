import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock, Target } from 'lucide-react';
import { WorkoutSession } from '../types/workout';

interface CalendarViewProps {
  sessions: WorkoutSession[];
  onClose: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ sessions, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getSessionsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
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

  const getSheetColor = (sheet: string) => {
    const colors = {
      'A': 'from-red-500 to-red-600',
      'B': 'from-green-500 to-green-600',
      'C': 'from-blue-500 to-blue-600'
    };
    return colors[sheet as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Calendário de Treinos</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-300 p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="p-2" />;
                    }

                    const daySessions = getSessionsForDate(day);
                    const hasWorkout = daySessions.length > 0;

                    return (
                      <button
                        key={day}
                        onClick={() => hasWorkout && setSelectedSession(daySessions[0])}
                        className={`relative p-3 rounded-lg text-center transition-all duration-200 ${
                          hasWorkout
                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-sm font-medium">{day}</span>
                        {hasWorkout && (
                          <div className="absolute -top-1 -right-1 flex gap-1">
                            {daySessions.map((session, idx) => (
                              <div
                                key={idx}
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSheetColor(session.sheet)} shadow-lg`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-6">
              {selectedSession ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getSheetColor(selectedSession.sheet)}`}>
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{selectedSession.sheetName}</h4>
                      <p className="text-sm text-slate-300">
                        {new Date(selectedSession.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4" />
                      <span>Duração: {selectedSession.duration ? formatDuration(selectedSession.duration) : 'N/A'}</span>
                    </div>

                    <div className="text-slate-300">
                      <span>Exercícios: {selectedSession.completedExercises}/{selectedSession.totalExercises}</span>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(selectedSession.completedExercises / selectedSession.totalExercises) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {selectedSession.notes && (
                      <div>
                        <h5 className="font-medium text-white mb-2">Observações:</h5>
                        <p className="text-sm text-slate-300 bg-white/10 rounded-lg p-3">
                          {selectedSession.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300">
                    Clique em um dia com treino para ver os detalhes
                  </p>
                </div>
              )}

              {/* Monthly Stats */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h4 className="font-bold text-white mb-4">Estatísticas do Mês</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Total de treinos:</span>
                    <span className="text-white font-medium">
                      {sessions.filter(s => {
                        const sessionDate = new Date(s.date);
                        return sessionDate.getMonth() === currentDate.getMonth() &&
                               sessionDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ficha A:</span>
                    <span className="text-red-400 font-medium">
                      {sessions.filter(s => {
                        const sessionDate = new Date(s.date);
                        return s.sheet === 'A' &&
                               sessionDate.getMonth() === currentDate.getMonth() &&
                               sessionDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ficha B:</span>
                    <span className="text-green-400 font-medium">
                      {sessions.filter(s => {
                        const sessionDate = new Date(s.date);
                        return s.sheet === 'B' &&
                               sessionDate.getMonth() === currentDate.getMonth() &&
                               sessionDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ficha C:</span>
                    <span className="text-blue-400 font-medium">
                      {sessions.filter(s => {
                        const sessionDate = new Date(s.date);
                        return s.sheet === 'C' &&
                               sessionDate.getMonth() === currentDate.getMonth() &&
                               sessionDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;