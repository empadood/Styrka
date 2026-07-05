import "./Session.css";

import { useState } from "react";

import { Heading } from "../../components";
import { Input } from "../../components/input/Input";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { INCREMENTATION } from "../../data/incrementation";
import { type Overview, workoutA, workoutB } from "../../data/workout-session";
import type { ExerciseName } from "../../types";
type Props = {
  items: Overview[];
};
export const WorkoutSession = ({ items }: Props) => {
  const [workoutType] = useState<"A" | "B">("A");

  const todaysWorkout = items.filter((val) => {
    return workoutType === "A"
      ? workoutA.includes(val.id)
      : workoutB.includes(val.id);
  });

  console.log(todaysWorkout);

  const stuffToLift = todaysWorkout.map((v) => {
    const sets = v.lastSession?.exercises.sets.map(
      (l) => l.weight + INCREMENTATION[v.id],
    );
    return {
      id: v.id,
      sets: sets,
    };
  });

  console.log(stuffToLift);

  const getHighestWeightFromLastSession = (overview: Overview) => {
    const res = overview.lastSession?.exercises.sets.reduce((prev, curr) => {
      return curr.weight > prev.weight ? curr : prev;
    });
    return (res?.weight || 0) + INCREMENTATION[overview.id];
  };

  const getSetsForExercise = (id: ExerciseName) => {
    return stuffToLift.find((exName) => exName.id === id)?.sets || [];
  };

  return (
    <div className="session__container">
      <Heading text="Today's workout" />
      {todaysWorkout.map((val) => {
        return (
          <div key={val.id}>
            <ExerciseWithWeight
              exercise={val.id}
              weight={getHighestWeightFromLastSession(val)}
            />

            <div className="session__sets">
              {getSetsForExercise(val.id).map((sets) => {
                return (
                  <div>
                    <div>
                      <Input
                        value={sets}
                        onChange={(val) => console.log(val)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
