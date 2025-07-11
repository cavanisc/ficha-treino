export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // Can be "8-12" or "10" etc.
  weight?: number;
  completed: boolean;
  notes: string;
  restTime?: number; // Rest time in seconds
}

export interface WorkoutSheet {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutSheets {
  A: WorkoutSheet;
  B: WorkoutSheet;
  C: WorkoutSheet;
}

export interface DayWorkout {
  selectedSheet: 'A' | 'B' | 'C';
  completedExercises: { [exerciseId: string]: Exercise };
}

export interface WeekWorkout {
  [key: string]: DayWorkout;
}

export interface WorkoutHistory {
  date: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  day: string;
  sheet: 'A' | 'B' | 'C';
}

export interface WorkoutSession {
  id: string;
  date: string;
  day: string;
  sheet: 'A' | 'B' | 'C';
  sheetName: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  completedExercises: number;
  totalExercises: number;
  notes: string;
  exercises: Exercise[];
}

export interface AppState {
  currentWeek: WeekWorkout;
  workoutSheets: WorkoutSheets;
  history: WorkoutHistory[];
  sessions: WorkoutSession[];
  weekStartDate: string;
  activeSession?: {
    id: string;
    startTime: string;
    day: string;
    sheet: 'A' | 'B' | 'C';
  };
}