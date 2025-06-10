import React from 'react';
import { Dumbbell, Target, Zap } from 'lucide-react';
import { WorkoutSheets } from '../types/workout';

interface SheetSelectorProps {
  selectedSheet: 'A' | 'B' | 'C';
  onSheetSelect: (sheet: 'A' | 'B' | 'C') => void;
  workoutSheets: WorkoutSheets;
}

const SheetSelector: React.FC<SheetSelectorProps> = ({ selectedSheet, onSheetSelect, workoutSheets }) => {
  const sheets: Array<{ key: 'A' | 'B' | 'C'; icon: React.ReactNode; gradient: string }> = [
    { key: 'A', icon: <Target className="w-6 h-6" />, gradient: 'from-red-500 to-pink-600' },
    { key: 'B', icon: <Zap className="w-6 h-6" />, gradient: 'from-green-500 to-emerald-600' },
    { key: 'C', icon: <Dumbbell className="w-6 h-6" />, gradient: 'from-blue-500 to-cyan-600' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Selecionar Ficha de Treino</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sheets.map((sheet) => (
          <button
            key={sheet.key}
            onClick={() => onSheetSelect(sheet.key)}
            className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              selectedSheet === sheet.key
                ? 'bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/40 shadow-xl'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${sheet.gradient} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                {sheet.icon}
              </div>
              <div className="text-left">
                <span className="text-xl font-bold text-white block">Ficha {sheet.key}</span>
                <span className="text-sm text-slate-300">{workoutSheets[sheet.key].exercises.length} exercícios</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 text-left leading-relaxed">
              {workoutSheets[sheet.key].name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SheetSelector;