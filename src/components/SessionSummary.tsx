import React, { useState } from 'react';
import { Clock, Target, TrendingUp, MessageSquare, X, Calendar } from 'lucide-react';
import { WorkoutSession } from '../types/workout';

interface SessionSummaryProps {
  sessions: WorkoutSession[];
  onClose: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ sessions, onClose }) => {
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
      'segunda': 'Segunda',
      'terca': 'Terça',
      'quarta': 'Quarta',
      'quinta': 'Quinta',
      'sexta': 'Sexta',
      'sabado': 'Sábado'
    };
    return dayNames[day] || day;
  };

  const getSheetColor = (sheet: string) => {
    const colors = {
      'A': 'from-red-500 to-red-600',
      'B': 'from-green-500 to-green-600',
      'C': 'from-blue-500 to-blue-600'
    };
    return colors[sheet as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Resumo dos Treinos</h2>
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
          {sortedSessions.length === 0 ? (
            <div className="text-center py-16 text-slate-300">
              <div className="p-4 bg-white/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-12 h-12 opacity-50" />
              </div>
              <p className="text-xl font-semibold mb-2">Nenhum treino registrado</p>
              <p className="text-sm opacity-75">Complete alguns treinos para ver o resumo aqui</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sessions List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Histórico de Treinos</h3>
                {sortedSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      selectedSession?.id === session.id
                        ? 'bg-white/15 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getSheetColor(session.sheet)}`}>
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{session.sheetName}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(session.date)}
                            </span>
                            <span>{getDayName(session.day)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-slate-300 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {session.duration ? formatDuration(session.duration) : 'N/A'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300">
                          {session.completedExercises}/{session.totalExercises} exercícios
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(session.completedExercises / session.totalExercises) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-400">
                        {Math.round((session.completedExercises / session.totalExercises) * 100)}%
                      </span>
                    </div>

                    {session.notes && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                        <MessageSquare className="w-4 h-4" />
                        <span className="truncate">{session.notes}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Session Details */}
              <div className="space-y-6">
                {selectedSession ? (
                  <>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${getSheetColor(selectedSession.sheet)}`}>
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{selectedSession.sheetName}</h4>
                          <p className="text-slate-300">
                            {formatDate(selectedSession.date)} - {getDayName(selectedSession.day)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-slate-300 mb-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">Duração</span>
                            </div>
                            <span className="text-xl font-bold text-blue-300">
                              {selectedSession.duration ? formatDuration(selectedSession.duration) : 'N/A'}
                            </span>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-slate-300 mb-2">
                              <Target className="w-4 h-4" />
                              <span className="text-sm">Progresso</span>
                            </div>
                            <span className="text-xl font-bold text-green-400">
                              {Math.round((selectedSession.completedExercises / selectedSession.totalExercises) * 100)}%
                            </span>
                          </div>
                        </div>

                        {selectedSession.notes && (
                          <div>
                            <h5 className="font-medium text-white mb-3 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Observações do Treino
                            </h5>
                            <p className="text-slate-300 bg-white/10 rounded-lg p-4 leading-relaxed">
                              {selectedSession.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Exercise Details */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                      <h5 className="font-bold text-white mb-4">Exercícios Realizados</h5>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedSession.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className={`p-3 rounded-lg border ${
                              exercise.completed
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">{exercise.name}</span>
                              <div className="flex items-center gap-2">
                                {exercise.weight && exercise.weight > 0 && (
                                  <span className="text-sm text-blue-300 font-medium">
                                    {exercise.weight}kg
                                  </span>
                                )}
                                <div className={`w-3 h-3 rounded-full ${
                                  exercise.completed ? 'bg-green-500' : 'bg-slate-500'
                                }`} />
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 mt-1">
                              {exercise.sets} séries × {exercise.reps} repetições
                            </div>
                            {exercise.notes && (
                              <div className="text-sm text-slate-400 mt-2 italic">
                                {exercise.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                    <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">
                      Selecione um treino para ver os detalhes
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <h4 className="font-bold text-white mb-4">Estatísticas Gerais</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Total de treinos:</span>
                      <span className="text-white font-medium">{sessions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Tempo total:</span>
                      <span className="text-white font-medium">
                        {formatDuration(sessions.reduce((acc, s) => acc + (s.duration || 0), 0))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Média por treino:</span>
                      <span className="text-white font-medium">
                        {sessions.length > 0 
                          ? formatDuration(Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / sessions.length))
                          : '0min'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;