import { WorkoutSheets, WeekWorkout } from '../types/workout';

export const defaultWorkoutSheets: WorkoutSheets = {
  A: {
    name: 'Ficha A - Peito, Ombro e Tríceps',
    exercises: [
      { id: 'a-1', name: 'Supino Reto', sets: 4, reps: '8-12', weight: 0, completed: false, notes: '' },
      { id: 'a-2', name: 'Supino Inclinado', sets: 3, reps: '10-12', weight: 0, completed: false, notes: '' },
      { id: 'a-3', name: 'Crucifixo', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'a-4', name: 'Desenvolvimento', sets: 4, reps: '8-12', weight: 0, completed: false, notes: '' },
      { id: 'a-5', name: 'Elevação Lateral', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'a-6', name: 'Elevação Frontal', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'a-7', name: 'Tríceps Testa', sets: 3, reps: '10-12', weight: 0, completed: false, notes: '' },
      { id: 'a-8', name: 'Tríceps Pulley', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
    ]
  },
  B: {
    name: 'Ficha B - Costas e Bíceps',
    exercises: [
      { id: 'b-1', name: 'Puxada Frontal', sets: 4, reps: '8-12', weight: 0, completed: false, notes: '' },
      { id: 'b-2', name: 'Remada Baixa', sets: 3, reps: '10-12', weight: 0, completed: false, notes: '' },
      { id: 'b-3', name: 'Remada Alta', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'b-4', name: 'Pullover', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'b-5', name: 'Rosca Direta', sets: 3, reps: '10-12', weight: 0, completed: false, notes: '' },
      { id: 'b-6', name: 'Rosca Martelo', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'b-7', name: 'Rosca Concentrada', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
    ]
  },
  C: {
    name: 'Ficha C - Pernas e Glúteos',
    exercises: [
      { id: 'c-1', name: 'Agachamento', sets: 4, reps: '8-12', weight: 0, completed: false, notes: '' },
      { id: 'c-2', name: 'Leg Press', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'c-3', name: 'Extensora', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'c-4', name: 'Flexora', sets: 3, reps: '12-15', weight: 0, completed: false, notes: '' },
      { id: 'c-5', name: 'Stiff', sets: 4, reps: '8-12', weight: 0, completed: false, notes: '' },
      { id: 'c-6', name: 'Afundo', sets: 3, reps: '10-12', weight: 0, completed: false, notes: '' },
      { id: 'c-7', name: 'Panturrilha', sets: 4, reps: '15-20', weight: 0, completed: false, notes: '' },
      { id: 'c-8', name: 'Glúteo 4 Apoios', sets: 3, reps: '15-20', weight: 0, completed: false, notes: '' },
    ]
  }
};

export const defaultWeekWorkout: WeekWorkout = {
  segunda: { selectedSheet: 'A', completedExercises: {} },
  terca: { selectedSheet: 'B', completedExercises: {} },
  quarta: { selectedSheet: 'C', completedExercises: {} },
  quinta: { selectedSheet: 'A', completedExercises: {} },
  sexta: { selectedSheet: 'B', completedExercises: {} },
  sabado: { selectedSheet: 'C', completedExercises: {} },
};