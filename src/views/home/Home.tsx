import "./Home.css";

import { useState } from "react";

import { ChartComponent, Heading, Section, Toolbar } from "../../components";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { calculateSessionOneRepMax } from "../../helpers/one-rep-max.helper";
import { buildOverviewFromStore } from "../../helpers/overview.helper";
import {
  calculateSessionProgression,
  getNextSessionType,
  type ProgressionResult,
} from "../../helpers/progression.helper";
import { buildTrendData } from "../../helpers/trends.helper";
import { useWorkoutStore } from "../../hooks/useWorkoutStore";
import type { ExerciseName, LoggedExercise, SessionType } from "../../types";
import { OneRepMax } from "../onerepmax/OneRepMax";
import { PostWorkout } from "../postworkout/PostWorkout";
import { Profile } from "../profile/Profile";
import { WorkoutSession } from "../workoutsession/Session";

type PendingSession = {
  sessionType: SessionType;
  exercises: LoggedExercise[];
};

type Stage = "workout" | "onerepmax" | "summary";

const DIALOG_TITLES: Record<Stage, string> = {
  workout: "Workout",
  onerepmax: "Estimated 1RM",
  summary: "Workout Summary",
};

export const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(
    null,
  );
  const [pendingResults, setPendingResults] = useState<
    ProgressionResult[] | null
  >(null);

  const { store, update } = useWorkoutStore();
  const sessionType = getNextSessionType(store.lastCompletedSession);
  const items = buildOverviewFromStore(store);
  const trendData = buildTrendData(store.history);

  const stage: Stage = pendingResults
    ? "summary"
    : pendingSession
      ? "onerepmax"
      : "workout";

  const startWorkout = () => {
    setPendingSession(null);
    setPendingResults(null);
    setWorkoutOpen(true);
  };

  const closeWorkout = () => {
    setWorkoutOpen(false);
    setPendingSession(null);
    setPendingResults(null);
  };

  const handleFinishWorkout = (result: PendingSession) => {
    setPendingSession(result);
  };

  const handleContinueFromOneRepMax = () => {
    if (!pendingSession) {
      return;
    }

    setPendingResults(
      calculateSessionProgression(
        pendingSession.exercises,
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
        <ChartComponent data={trendData} />
      </Section>
      <Dialog
        title="Profile"
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile increments={store.increments} />
      </Dialog>

      <Dialog
        title={DIALOG_TITLES[stage]}
        isOpen={workoutOpen}
        onClose={closeWorkout}
      >
        {stage === "workout" && (
          <WorkoutSession
            sessionType={sessionType}
            workingWeights={store.workingWeights}
            onFinish={handleFinishWorkout}
          />
        )}
        {stage === "onerepmax" && pendingSession && (
          <OneRepMax
            results={calculateSessionOneRepMax(
              pendingSession.exercises,
              store,
            )}
            onContinue={handleContinueFromOneRepMax}
          />
        )}
        {stage === "summary" && pendingResults && (
          <PostWorkout
            results={pendingResults}
            onConfirm={handleConfirmPostWorkout}
          />
        )}
      </Dialog>
    </div>
  );
};
