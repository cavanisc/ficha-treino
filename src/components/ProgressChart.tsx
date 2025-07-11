import React, { useState } from 'react';
import { TrendingUp, X, Weight, Calendar, Target } from 'lucide-react';
import { WorkoutHistory } from '../types/workout';

interface ProgressChartProps {
  history: WorkoutHistory[];
  onClose: () => void;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ history, onClose }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // Group history by exercise
  const exerciseHistory = history.reduce((acc, record) => {
    const key = `${record.sheet}-${record.exerciseName}`;
    if (!acc[key]) {
      acc[key] = {
        exerciseName: record.exerciseName,
        sheet: record.sheet,
        records: []
      };
    }
    acc[key].records.push(record);
    return acc;
  }, {} as { [key: string]: { exerciseName: string; sheet: string; records: WorkoutHistory[] } });

  // Sort records by date for each exercise
  Object.keys(exerciseHistory).forEach(key => {
    exerciseHistory[key].records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const getSheetColor = (sheet: string) => {
    const colors = {
      'A': 'from-red-500 to-red-600',
      'B': 'from-green-500 to-green-600',
      'C': 'from-blue-500 to-blue-600'
    };
    return colors[sheet as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getProgressAnalysis = (records: WorkoutHistory[]) => {
    if (records.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = records.slice(-3);
    const older = records.slice(-6, -3);
    
    if (older.length === 0) return { trend: 'stable', change: 0 };
    
    const recentAvg = recent.reduce((sum, r) => sum + r.weight, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.weight, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 5) return { trend: 'up', change };
    if (change < -5) return { trend: 'down', change };
    return { trend: 'stable', change };
  };

  const selectedData = selectedExercise ? exerciseHistory[selectedExercise] : null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Evolução de Cargas</h2>
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
          {Object.keys(exerciseHistory).length === 0 ? (
            <div className="text-center py-16 text-slate-300">
              <div className="p-4 bg-white/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Weight className="w-12 h-12 opacity-50" />
              </div>
              <p className="text-xl font-semibold mb-2">Nenhum histórico de cargas</p>
              <p className="text-sm opacity-75">Complete alguns exercícios com peso para ver a evolução</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Exercise List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Exercícios</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Object.entries(exerciseHistory).map(([key, data]) => {
                    const analysis = getProgressAnalysis(data.records);
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedExercise(key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                          selectedExercise === key
                            ? 'bg-white/15 border-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{data.exerciseName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getSheetColor(data.sheet)}`}>
                            {data.sheet}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{data.records.length} registros</span>
                          <div className="flex items-center gap-1">
                            {analysis.trend === 'up' && (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            )}
                            {analysis.trend === 'down' && (
                              <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                            )}
                            <span className={`text-xs font-medium ${
                              analysis.trend === 'up' ? 'text-green-400' :
                              analysis.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                            }`}>
                              {analysis.trend === 'stable' ? 'Estável' : 
                               `${analysis.change > 0 ? '+' : ''}${analysis.change.toFixed(1)}%`}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Chart */}
              <div className="lg:col-span-2">
                {selectedData ? (
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getSheetColor(selectedData.sheet)}`}>
                          <Weight className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{selectedData.exerciseName}</h4>
                          <p className="text-slate-300">Ficha {selectedData.sheet}</p>
                        </div>
                      </div>

                      {/* Simple Progress Visualization */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-slate-300">Evolução de Carga</span>
                          <span className="text-sm text-slate-300">
                            {selectedData.records.length} registros
                          </span>
                        </div>

                        <div className="relative">
                          <div className="flex items-end justify-between h-48 bg-white/5 rounded-lg p-4">
                            {selectedData.records.slice(-10).map((record, index) => {
                              const maxWeight = Math.max(...selectedData.records.map(r => r.weight));
                              const height = (record.weight / maxWeight) * 100;
                              
                              return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                  <div className="text-xs text-white font-medium">
                                    {record.weight}kg
                                  </div>
                                  <div
                                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                  />
                                  <div className="text-xs text-slate-400 rotate-45 origin-bottom-left">
                                    {formatDate(record.date)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <Target className="w-4 h-4" />
                          <span className="text-sm">Carga Atual</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-300">
                          {selectedData.records[selectedData.records.length - 1]?.weight || 0}kg
                        </span>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Máximo</span>
                        </div>
                        <span className="text-2xl font-bold text-green-400">
                          {Math.max(...selectedData.records.map(r => r.weight))}kg
                        </span>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Progresso</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-400">
                          {selectedData.records.length > 1 
                            ? `+${(selectedData.records[selectedData.records.length - 1].weight - selectedData.records[0].weight).toFixed(1)}kg`
                            : '0kg'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Recent Records */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                      <h5 className="font-bold text-white mb-4">Registros Recentes</h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedData.records.slice(-8).reverse().map((record, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              <span className="text-white font-medium">{record.weight}kg</span>
                            </div>
                            <span className="text-sm text-slate-300">
                              {formatDate(record.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                    <Weight className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-xl text-slate-300 mb-2">Selecione um exercício</p>
                    <p className="text-sm text-slate-400">
                      Escolha um exercício da lista para ver sua evolução de cargas
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;