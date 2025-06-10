import React, { useState } from 'react';
import { Download, Upload, FileText, AlertCircle } from 'lucide-react';
import { exportWorkoutHistory, importWorkoutData } from '../utils/storage';

interface ImportExportProps {
  onImportSuccess: () => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ onImportSuccess }) => {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const handleExport = () => {
    const data = exportWorkoutHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha-treino-abc-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError('');
    
    if (!importText.trim()) {
      setImportError('Por favor, cole o conteúdo JSON para importar');
      return;
    }

    const success = importWorkoutData(importText);
    
    if (success) {
      setImportText('');
      setShowImport(false);
      onImportSuccess();
    } else {
      setImportError('Erro ao importar dados. Verifique se o formato JSON está correto.');
    }
  };

  const sampleJson = {
    "workoutSheets": {
      "A": {
        "name": "Ficha A - Peito, Ombro e Tríceps",
        "exercises": [
          {
            "id": "a-1",
            "name": "Supino Reto",
            "sets": 4,
            "reps": "8-12",
            "weight": 0,
            "completed": false,
            "notes": ""
          },
          {
            "id": "a-2",
            "name": "Desenvolvimento",
            "sets": 3,
            "reps": "10-12",
            "weight": 0,
            "completed": false,
            "notes": ""
          }
        ]
      },
      "B": {
        "name": "Ficha B - Costas e Bíceps",
        "exercises": [
          {
            "id": "b-1",
            "name": "Puxada Frontal",
            "sets": 4,
            "reps": "8-12",
            "weight": 0,
            "completed": false,
            "notes": ""
          }
        ]
      },
      "C": {
        "name": "Ficha C - Pernas e Glúteos",
        "exercises": [
          {
            "id": "c-1",
            "name": "Agachamento",
            "sets": 4,
            "reps": "8-12",
            "weight": 0,
            "completed": false,
            "notes": ""
          }
        ]
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Importar/Exportar</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          Exportar Dados
        </button>

        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Upload className="w-5 h-5" />
          Importar Fichas
        </button>
      </div>

      {showImport && (
        <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <h3 className="font-bold text-white mb-3">Importar Fichas A, B e C</h3>
          <p className="text-sm text-slate-300 mb-4">
            Cole o conteúdo JSON com suas fichas de treino abaixo:
          </p>
          
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder={JSON.stringify(sampleJson, null, 2)}
          />
          
          {importError && (
            <div className="flex items-center gap-2 mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              {importError}
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setShowImport(false);
                setImportText('');
                setImportError('');
              }}
              className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Importar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExport;