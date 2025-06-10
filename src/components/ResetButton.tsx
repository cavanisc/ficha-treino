import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <RotateCcw className="w-5 h-5" />
        Reset Semanal
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar Reset</h3>
            </div>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              Tem certeza que deseja resetar a semana? Isso irá:
            </p>
            
            <ul className="text-sm text-slate-300 mb-8 space-y-2 ml-4">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                Limpar todas as marcações de "feito"
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                Remover todas as observações
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Manter o histórico de cargas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Preservar os valores de peso registrados
              </li>
            </ul>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Confirmar Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetButton;