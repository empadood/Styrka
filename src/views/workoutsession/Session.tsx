import "./Session.css";

import { Button, Heading } from "../../components";
import { Input } from "../../components/input/Input";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { Span } from "../../components/text/Span";
import { isExerciseCompleted } from "../../helpers/progression.helper";
import type { ExerciseName, LoggedExercise, SessionType } from "../../types";

type Props = {
  sessionType: SessionType;
  exercises: LoggedExercise[];
  onExercisesChange: (exercises: LoggedExercise[]) => void;
  onFinish: (result: {
    sessionType: SessionType;
    exercises: LoggedExercise[];
  }) => void;
};

export const WorkoutSession = ({
  sessionType,
  exercises,
  onExercisesChange,
  onFinish,
}: Props) => {
  const updateSet = (
    exerciseName: ExerciseName,
    setIndex: number,
    field: "reps" | "weight",
    value: number,
  ) => {
    onExercisesChange(
      exercises.map((exercise) =>
        exercise.name === exerciseName
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const handleFinish = () => {
    onFinish({
      sessionType,
      exercises: exercises.map((exercise) => ({
        ...exercise,
        completed: isExerciseCompleted(exercise.sets),
      })),
    });
  };

  return (
    <div className="session__container">
      <div className="session__intro">
        <span>Session {sessionType}</span>
        <Heading text="Today's workout" level="2" />
      </div>
      {exercises.map((exercise) => (
        <section className="session__exercise" key={exercise.name}>
          <div className="session__exercise-header">
            <ExerciseWithWeight
              exercise={exercise.name}
              weight={exercise.weightUsed}
            />
            <Span
              text={`${exercise.sets.length} ${exercise.sets.length < 2 ? "set" : "sets"}`}
              size="small"
            />
          </div>
          <div className="session__sets">
            {exercise.sets.map((set, index) => (
              <div className="session__set" key={index}>
                <Span text={`Set ${index + 1}`} size="small" />
                <div className="session__set__inputs">
                  <div>
                    <div className="session--label-gap">
                      <Span
                        text={`Target reps: ${set.targetReps}`}
                        size="small"
                      />
                    </div>
                    <Input
                      value={set.reps}
                      size="small"
                      onChange={(value) =>
                        updateSet(exercise.name, index, "reps", value)
                      }
                    />
                  </div>
                  <div>
                    <div className="session--label-gap">
                      <Span text="Weight" size="small" />
                    </div>
                    <Input
                      size="medium"
                      value={set.weight}
                      onChange={(value) =>
                        updateSet(exercise.name, index, "weight", value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <Button label="Finish workout" onClick={handleFinish} />
    </div>
  );
};
