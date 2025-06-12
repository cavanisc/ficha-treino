import React, { useState, useEffect } from 'react';
import { Dumbbell, History, Calendar, BarChart3, FileText } from 'lucide-react';
import DaySelector from './components/DaySelector';
import SheetSelector from './components/SheetSelector';
import ExerciseCard from './components/ExerciseCard';
import HistoryView from './components/HistoryView';
import ResetButton from './components/ResetButton';
import ImportExport from './components/ImportExport';
import WorkoutTimer from './components/WorkoutTimer';
import CalendarView from './components/CalendarView';
import SessionSummary from './components/SessionSummary';
import ProgressChart from './components/ProgressChart';
import { AppState, Exercise, WorkoutHistory, WorkoutSession } from './types/workout';
import { saveToStorage, loadFromStorage, getWeekStartDate, generateSessionId } from './utils/storage';
import { defaultWorkoutSheets, defaultWeekWorkout } from './data/defaultWorkout';

function App() {
  const [appState, setAppState] = useState<AppState>({
    workoutSheets: defaultWorkoutSheets,
    currentWeek: defaultWeekWorkout,
    history: [],
    sessions: [],
    weekStartDate: getWeekStartDate()
  });
  
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [showHistory, setShowHistory] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Load data on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      // Check if it's a new week
      const currentWeekStart = getWeekStartDate();
      if (saved.weekStartDate !== currentWeekStart) {
        // New week - reset workout but keep history, sessions and sheets
        setAppState({
          workoutSheets: saved.workoutSheets,
          currentWeek: defaultWeekWorkout,
          history: saved.history,
          sessions: saved.sessions || [],
          weekStartDate: currentWeekStart
        });
      } else {
        setAppState({
          ...saved,
          sessions: saved.sessions || [] // Ensure sessions array exists
        });
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

  const startWorkout = () => {
    const sessionId = generateSessionId();
    const startTime = new Date().toISOString();
    
    setAppState(prev => ({
      ...prev,
      activeSession: {
        id: sessionId,
        startTime,
        day: selectedDay,
        sheet: prev.currentWeek[selectedDay].selectedSheet
      }
    }));
  };

  const stopWorkout = () => {
    if (!appState.activeSession) return;

    const endTime = new Date().toISOString();
    const startTime = new Date(appState.activeSession.startTime);
    const duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60));
    
    const currentDayWorkout = appState.currentWeek[selectedDay];
    const currentSheet = appState.workoutSheets[currentDayWorkout.selectedSheet];
    
    const completedExercises = Object.values(currentDayWorkout.completedExercises).filter(ex => ex.completed).length;
    
    const session: WorkoutSession = {
      id: appState.activeSession.id,
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      sheet: currentDayWorkout.selectedSheet,
      sheetName: currentSheet.name,
      startTime: appState.activeSession.startTime,
      endTime,
      duration,
      completedExercises,
      totalExercises: currentSheet.exercises.length,
      notes: sessionNotes,
      exercises: Object.values(currentDayWorkout.completedExercises)
    };

    setAppState(prev => ({
      ...prev,
      sessions: [...prev.sessions, session],
      activeSession: undefined
    }));

    setSessionNotes('');
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
      weekStartDate: getWeekStartDate(),
      activeSession: undefined
    }));
  };

  const handleImportSuccess = () => {
    // Reload the app state after successful import
    const saved = loadFromStorage();
    if (saved) {
      setAppState({
        ...saved,
        sessions: saved.sessions || []
      });
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
        {/* Workout Timer */}
        <div className="mb-8">
          <WorkoutTimer
            isActive={!!appState.activeSession}
            onStart={startWorkout}
            onStop={stopWorkout}
            startTime={appState.activeSession?.startTime}
          />
        </div>

        {/* Session Notes (when workout is active) */}
        {appState.activeSession && (
          <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-3">Observações do Treino</h3>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Como você se sente hoje? Alguma observação sobre o treino..."
            />
          </div>
        )}

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
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  <History className="w-4 h-4" />
                  Histórico
                </button>
                
                <button
                  onClick={() => setShowCalendar(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Calendário
                </button>

                <button
                  onClick={() => setShowSessions(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Resumos
                </button>

                <button
                  onClick={() => setShowProgress(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  Evolução
                </button>
              </div>
              
              <div className="flex justify-end">
                <ResetButton onReset={resetWeek} />
              </div>
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

        {/* Modals */}
        {showHistory && (
          <HistoryView
            history={appState.history}
            onClose={() => setShowHistory(false)}
          />
        )}

        {showCalendar && (
          <CalendarView
            sessions={appState.sessions}
            onClose={() => setShowCalendar(false)}
          />
        )}

        {showSessions && (
          <SessionSummary
            sessions={appState.sessions}
            onClose={() => setShowSessions(false)}
          />
        )}

        {showProgress && (
          <ProgressChart
            history={appState.history}
            onClose={() => setShowProgress(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;