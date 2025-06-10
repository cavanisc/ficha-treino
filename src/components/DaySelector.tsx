import React from 'react';
import { Calendar } from 'lucide-react';
import { WeekWorkout, WorkoutSheets } from '../types/workout';

interface DaySelectorProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
  weekWorkout: WeekWorkout;
  workoutSheets: WorkoutSheets;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onDaySelect, weekWorkout, workoutSheets }) => {
  const days = [
    { key: 'segunda', label: 'SEG', fullName: 'Segunda' },
    { key: 'terca', label: 'TER', fullName: 'Terça' },
    { key: 'quarta', label: 'QUA', fullName: 'Quarta' },
    { key: 'quinta', label: 'QUI', fullName: 'Quinta' },
    { key: 'sexta', label: 'SEX', fullName: 'Sexta' },
    { key: 'sabado', label: 'SAB', fullName: 'Sábado' },
  ];

  const getCompletionStatus = (dayKey: string) => {
    const dayWorkout = weekWorkout[dayKey];
    if (!dayWorkout) return { completed: 0, total: 0 };
    
    const sheet = workoutSheets[dayWorkout.selectedSheet];
    const totalExercises = sheet.exercises.length;
    const completedExercises = Object.values(dayWorkout.completedExercises).filter(ex => ex.completed).length;
    
    return { completed: completedExercises, total: totalExercises };
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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Selecionar Dia</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {days.map((day) => {
          const status = getCompletionStatus(day.key);
          const dayWorkout = weekWorkout[day.key];
          const selectedSheet = dayWorkout?.selectedSheet || 'A';
          const isCompleted = status.completed === status.total && status.total > 0;
          const progress = status.total > 0 ? Math.round((status.completed / status.total) * 100) : 0;
          
          return (
            <button
              key={day.key}
              onClick={() => onDaySelect(day.key)}
              className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedDay === day.key
                  ? 'bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/40 shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r ${getSheetColor(selectedSheet)} shadow-lg`}>
                  {selectedSheet}
                </div>
                <span className="text-sm font-bold text-white">{day.label}</span>
                <span className="text-xs text-slate-300">{day.fullName}</span>
              </div>
              
              {status.total > 0 && (
                <div className="absolute -top-2 -right-2">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  ) : progress > 0 ? (
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">{progress}%</span>
                    </div>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;