import "./Home.css";

import { useState } from "react";

import { ChartComponent, Heading, Section, Toolbar } from "../../components";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { workoutData } from "../../data";
import { buildOverviewFromStore } from "../../helpers/overview.helper";
import {
  calculateSessionProgression,
  getNextSessionType,
  type ProgressionResult,
} from "../../helpers/progression.helper";
import { useWorkoutStore } from "../../hooks/useWorkoutStore";
import type { ExerciseName, LoggedExercise, SessionType } from "../../types";
import { PostWorkout } from "../postworkout/PostWorkout";
import { Profile } from "../profile/Profile";
import { WorkoutSession } from "../workoutsession/Session";

type PendingSession = {
  sessionType: SessionType;
  exercises: LoggedExercise[];
};

export const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [pendingResults, setPendingResults] = useState<
    ProgressionResult[] | null
  >(null);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(
    null,
  );

  const { store, update } = useWorkoutStore();
  const sessionType = getNextSessionType(store.lastCompletedSession);
  const items = buildOverviewFromStore(store);

  const startWorkout = () => {
    setPendingResults(null);
    setPendingSession(null);
    setWorkoutOpen(true);
  };

  const closeWorkout = () => {
    setWorkoutOpen(false);
    setPendingResults(null);
    setPendingSession(null);
  };

  const handleFinishWorkout = (result: PendingSession) => {
    setPendingSession(result);
    setPendingResults(
      calculateSessionProgression(
        result.exercises,
        store.workingWeights,
        store.increments,
      ),
    );
  };

  const handleConfirmPostWorkout = (
    finalIncrements: Record<ExerciseName, number>,
  ) => {
    if (!pendingResults || !pendingSession) {
      return;
    }

    update((prev) => {
      const workingWeights = { ...prev.workingWeights };
      pendingResults.forEach((result) => {
        if (result.completed) {
          workingWeights[result.name] =
            result.previousWeight +
            (finalIncrements[result.name] ?? result.proposedIncrement);
        }
      });

      return {
        ...prev,
        workingWeights,
        increments: { ...prev.increments, ...finalIncrements },
        lastCompletedSession: pendingSession.sessionType,
        history: [
          ...prev.history,
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            sessionType: pendingSession.sessionType,
            exercises: pendingSession.exercises,
          },
        ],
      };
    });

    closeWorkout();
  };

  return (
    <div className="home">
      <Toolbar title="Hey" onShowProfile={() => setShowProfile(true)} />
      <UpcomingSession session={items} onStartWorkout={startWorkout} />
      <Summary items={items} />
      <PreviousSession session={items} />

      <Section>
        <div className="home__overview__title">
          <Heading text={"Trends"} />
        </div>
        <ChartComponent data={workoutData} />
      </Section>
      <Dialog
        title="Profile"
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile increments={store.increments} />
      </Dialog>

      <Dialog
        title={pendingResults ? "Workout Summary" : "Workout"}
        isOpen={workoutOpen}
        onClose={closeWorkout}
      >
        {pendingResults ? (
          <PostWorkout
            results={pendingResults}
            onConfirm={handleConfirmPostWorkout}
          />
        ) : (
          <WorkoutSession
            sessionType={sessionType}
            workingWeights={store.workingWeights}
            onFinish={handleFinishWorkout}
          />
        )}
      </Dialog>
    </div>
  );
};
