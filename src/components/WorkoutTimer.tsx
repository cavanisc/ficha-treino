import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Timer } from 'lucide-react';

interface WorkoutTimerProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  startTime?: string;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ isActive, onStart, onStop, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const start = new Date(startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
            <Timer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Cronômetro do Treino</h3>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4" />
              <span className="text-2xl font-mono font-bold text-blue-300">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {!isActive ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5" />
              Iniciar Treino
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Square className="w-5 h-5" />
              Finalizar Treino
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;