import type { ChartData, LoggedExercise, WorkoutHistoryEntry } from "../types";

const getExerciseWeight = (exercise: LoggedExercise): number =>
  Math.max(exercise.weightUsed, ...exercise.sets.map((set) => set.weight));

const buildTrendData = (history: WorkoutHistoryEntry[]): ChartData[] =>
  history.map((session, index) =>
    session.exercises.reduce<ChartData>(
      (workout, exercise) => ({
        ...workout,
        [exercise.name]: getExerciseWeight(exercise),
      }),
      { workout: index + 1 },
    ),
  );

export { buildTrendData };
