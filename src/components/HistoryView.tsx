import React from 'react';
import { TrendingUp, Calendar, Weight, X } from 'lucide-react';
import { WorkoutHistory } from '../types/workout';

interface HistoryViewProps {
  history: WorkoutHistory[];
  onClose: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClose }) => {
  // Group history by exercise and sheet
  const groupedHistory = history.reduce((acc, record) => {
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

  // Sort each exercise history by date
  Object.keys(groupedHistory).forEach(key => {
    groupedHistory[key].records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Histórico de Treinos</h2>
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
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-16 text-slate-300">
              <div className="p-4 bg-white/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Weight className="w-12 h-12 opacity-50" />
              </div>
              <p className="text-xl font-semibold mb-2">Nenhum histórico encontrado</p>
              <p className="text-sm opacity-75">Complete alguns exercícios para ver seu progresso aqui</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([key, data]) => (
                <div key={key} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-white flex items-center gap-3">
                      <Weight className="w-6 h-6 text-blue-400" />
                      {data.exerciseName}
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getSheetColor(data.sheet)} shadow-lg`}>
                      Ficha {data.sheet}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.records.slice(0, 8).map((record, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(record.date)}
                          </span>
                          <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full border border-white/20">
                            {getDayName(record.day)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-300">
                          {record.weight} kg
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {data.records.length > 8 && (
                    <p className="text-sm text-slate-400 mt-4 text-center bg-white/5 rounded-lg p-3 border border-white/10">
                      Mostrando os 8 registros mais recentes de {data.records.length} total
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;