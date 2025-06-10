import React, { useState, useEffect } from 'react';
import { Dumbbell, History } from 'lucide-react';
import DaySelector from './components/DaySelector';
import SheetSelector from './components/SheetSelector';
import ExerciseCard from './components/ExerciseCard';
import HistoryView from './components/HistoryView';
import ResetButton from './components/ResetButton';
import ImportExport from './components/ImportExport';
import { AppState, Exercise, WorkoutHistory } from './types/workout';
import { saveToStorage, loadFromStorage, getWeekStartDate } from './utils/storage';
import { defaultWorkoutSheets, defaultWeekWorkout } from './data/defaultWorkout';

function App() {
  const [appState, setAppState] = useState<AppState>({
    workoutSheets: defaultWorkoutSheets,
    currentWeek: defaultWeekWorkout,
    history: [],
    weekStartDate: getWeekStartDate()
  });
  
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [showHistory, setShowHistory] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      // Check if it's a new week
      const currentWeekStart = getWeekStartDate();
      if (saved.weekStartDate !== currentWeekStart) {
        // New week - reset workout but keep history and sheets
        setAppState({
          workoutSheets: saved.workoutSheets,
          currentWeek: defaultWeekWorkout,
          history: saved.history,
          weekStartDate: currentWeekStart
        });
      } else {
        setAppState(saved);
      }
    }
  }, []);

  // Save data whenever appState changes
  useEffect(() => {
    saveToStorage(appState);
  }, [appState]);

  const updateDaySheet = (dayKey: string, sheetType: 'A' | 'B' | 'C') => {
    setAppState(prev => ({
      ...prev,
      currentWeek: {
        ...prev.currentWeek,
        [dayKey]: {
          ...prev.currentWeek[dayKey],
          selectedSheet: sheetType,
          completedExercises: {} // Reset completed exercises when changing sheet
        }
      }
    }));
  };

  const updateExercise = (dayKey: string, updatedExercise: Exercise) => {
    setAppState(prev => {
      const newState = { ...prev };
      const dayWorkout = newState.currentWeek[dayKey];
      
      if (dayWorkout) {
        const oldExercise = dayWorkout.completedExercises[updatedExercise.id];
        dayWorkout.completedExercises[updatedExercise.id] = updatedExercise;
        
        // Add to history if weight changed and exercise is completed
        if (
          updatedExercise.completed && 
          updatedExercise.weight && 
          updatedExercise.weight > 0 &&
          (!oldExercise || oldExercise.weight !== updatedExercise.weight)
        ) {
          const historyEntry: WorkoutHistory = {
            date: new Date().toISOString().split('T')[0],
            exerciseId: updatedExercise.id,
            exerciseName: updatedExercise.name,
            weight: updatedExercise.weight,
            day: dayKey,
            sheet: dayWorkout.selectedSheet
          };
          
          newState.history.push(historyEntry);
        }
      }
      
      return newState;
    });
  };

  const resetWeek = () => {
    setAppState(prev => ({
      ...prev,
      currentWeek: Object.keys(prev.currentWeek).reduce((acc, dayKey) => {
        acc[dayKey] = {
          ...prev.currentWeek[dayKey],
          completedExercises: {}
        };
        return acc;
      }, {} as typeof prev.currentWeek),
      weekStartDate: getWeekStartDate()
    }));
  };

  const handleImportSuccess = () => {
    // Reload the app state after successful import
    const saved = loadFromStorage();
    if (saved) {
      setAppState(saved);
    }
  };

  const currentDayWorkout = appState.currentWeek[selectedDay];
  const currentSheet = currentDayWorkout ? appState.workoutSheets[currentDayWorkout.selectedSheet] : null;

  // Get exercises for current day with completion status
  const getCurrentExercises = () => {
    if (!currentSheet) return [];
    
    return currentSheet.exercises.map(exercise => {
      const completedExercise = currentDayWorkout.completedExercises[exercise.id];
      return completedExercise || exercise;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90" />
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Ficha de Treino
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Controle seu progresso com sistema de fichas personalizadas e acompanhe sua evolução
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 max-w-7xl">
        {/* Day Selector */}
        <div className="mb-8">
          <DaySelector
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            weekWorkout={appState.currentWeek}
            workoutSheets={appState.workoutSheets}
          />
        </div>

        {/* Sheet Selector */}
        {currentDayWorkout && (
          <div className="mb-8">
            <SheetSelector
              selectedSheet={currentDayWorkout.selectedSheet}
              onSheetSelect={(sheet) => updateDaySheet(selectedDay, sheet)}
              workoutSheets={appState.workoutSheets}
            />
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImportExport onImportSuccess={handleImportSuccess} />
            
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <History className="w-5 h-5" />
                Ver Histórico
              </button>
              
              <ResetButton onReset={resetWeek} />
            </div>
          </div>
        </div>

        {/* Current Day Workout */}
        {currentSheet && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentSheet.name}
              </h2>
              <p className="text-slate-300 text-lg">
                {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}-feira
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCurrentExercises().map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={(updatedExercise) => updateExercise(selectedDay, updatedExercise)}
                />
              ))}
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <HistoryView
            history={appState.history}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;