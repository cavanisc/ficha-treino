import { AppState, WorkoutSheets, WeekWorkout, WorkoutHistory, WorkoutSession } from '../types/workout';
import { defaultWorkoutSheets, defaultWeekWorkout } from '../data/defaultWorkout';

const STORAGE_KEY = 'workout_tracker_abc_data';

export const saveToStorage = (data: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

export const loadFromStorage = (): AppState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure sessions array exists for backward compatibility
      if (!parsed.sessions) {
        parsed.sessions = [];
      }
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
};

export const getWeekStartDate = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  return monday.toISOString().split('T')[0];
};

export const exportWorkoutHistory = (): string => {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
};

export const importWorkoutData = (jsonString: string): boolean => {
  try {
    const importedData = JSON.parse(jsonString);
    
    // Validate basic structure for workout sheets
    if (importedData.workoutSheets && typeof importedData.workoutSheets === 'object') {
      const currentData = loadFromStorage();
      const newData: AppState = {
        workoutSheets: importedData.workoutSheets,
        currentWeek: currentData?.currentWeek || defaultWeekWorkout,
        history: currentData?.history || [],
        sessions: currentData?.sessions || [],
        weekStartDate: currentData?.weekStartDate || getWeekStartDate()
      };
      
      saveToStorage(newData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

export const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};