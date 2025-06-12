import React, { useState, useEffect } from 'react';
import { Check, Edit3, Save, X, Weight, Clock, Timer } from 'lucide-react';
import { Exercise } from '../types/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempWeight, setTempWeight] = useState(exercise.weight?.toString() || '');
  const [tempNotes, setTempNotes] = useState(exercise.notes || '');
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            // Optional: Play notification sound or show alert
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  const handleSave = () => {
    onUpdate({
      ...exercise,
      weight: tempWeight ? parseFloat(tempWeight) : 0,
      notes: tempNotes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempWeight(exercise.weight?.toString() || '');
    setTempNotes(exercise.notes || '');
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    const newCompleted = !exercise.completed;
    onUpdate({
      ...exercise,
      completed: newCompleted,
    });

    // Start rest timer when exercise is completed
    if (newCompleted && exercise.restTime && exercise.restTime > 0) {
      setRestTimer(exercise.restTime);
      setIsResting(true);
    }
  };

  const startRestTimer = () => {
    if (exercise.restTime && exercise.restTime > 0) {
      setRestTimer(exercise.restTime);
      setIsResting(true);
    }
  };

  const stopRestTimer = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 ${
      exercise.completed 
        ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/10 shadow-lg shadow-green-500/20' 
        : 'border-white/20 hover:border-white/30 hover:bg-white/15'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-100 transition-colors">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-2 text-slate-300 mb-2">
              <Weight className="w-4 h-4" />
              <span className="text-sm">
                {exercise.sets} séries × {exercise.reps} repetições
              </span>
            </div>
            {exercise.restTime && (
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Descanso: {Math.floor(exercise.restTime / 60)}:{(exercise.restTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleCompleted}
            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              exercise.completed
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20'
            }`}
          >
            <Check className="w-5 h-5" />
          </button>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="mb-4 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-orange-400" />
                <span className="text-white font-medium">Descanso</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-orange-300">
                  {formatTime(restTimer)}
                </span>
                <button
                  onClick={stopRestTimer}
                  className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${exercise.restTime ? ((exercise.restTime - restTimer) / exercise.restTime) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-300 w-16">Carga:</label>
            {isEditing ? (
              <input
                type="number"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                step="0.5"
              />
            ) : (
              <span className="text-lg font-bold text-blue-300">
                {exercise.weight ? `${exercise.weight} kg` : 'Não definida'}
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <label className="text-sm font-medium text-slate-300 w-16 mt-1">Obs:</label>
            {isEditing ? (
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Observações opcionais..."
              />
            ) : (
              <span className="text-sm text-slate-300 flex-1">
                {exercise.notes || 'Nenhuma observação'}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-3 mt-6">
          {/* Rest Timer Button */}
          {exercise.restTime && exercise.restTime > 0 && !isResting && (
            <button
              onClick={startRestTimer}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Timer className="w-4 h-4" />
              Descanso
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2 border border-white/20"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;