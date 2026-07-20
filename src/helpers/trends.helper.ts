import type {
  ChartData,
  LoggedExercise,
  TrackedLiftId,
  WorkoutHistoryEntry,
} from "../types";

const getExerciseWeight = (exercise: LoggedExercise): number =>
  Math.max(exercise.weightUsed, ...exercise.sets.map((set) => set.weight));

const buildTrendData = (history: WorkoutHistoryEntry[]): ChartData[] =>
  history.map((session, index) =>
    session.exercises
      .filter((exercise) => exercise.tracked)
      .reduce<ChartData>(
        (workout, exercise) => ({
          ...workout,
          [exercise.exerciseId as TrackedLiftId]: getExerciseWeight(exercise),
        }),
        { workout: index + 1, date: session.date },
      ),
  );

type RpeDataPoint = {
  workout: number;
  date: string;
  rpe: number;
};

const buildRpeTrendData = (history: WorkoutHistoryEntry[]): RpeDataPoint[] =>
  history
    .map((session, index) => ({ session, workout: index + 1 }))
    .filter(({ session }) => session.checkIn?.rpe !== undefined)
    .map(({ session, workout }) => ({
      workout,
      date: session.date,
      rpe: session.checkIn!.rpe,
    }));

export { buildRpeTrendData, buildTrendData, getExerciseWeight };
