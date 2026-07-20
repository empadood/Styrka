import "./Home.css";

import { Minimize2 } from "lucide-react";
import { useState } from "react";

import { ChartComponent, Heading, Section, Toolbar } from "../../components";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { trackAnalyticsEvent } from "../../helpers/analytics.helper";
import { calculateSessionOneRepMax } from "../../helpers/one-rep-max.helper";
import { buildOverviewFromStore } from "../../helpers/overview.helper";
import {
  calculateSessionProgression,
  getNextSessionType,
  type ProgressionResult,
} from "../../helpers/progression.helper";
import { buildInitialExercises } from "../../helpers/session.helper";
import { buildStartingWeights } from "../../helpers/starting-weight.helper";
import { buildTrendData } from "../../helpers/trends.helper";
import { useWorkoutStore } from "../../hooks/useWorkoutStore";
import type { ExerciseName, LoggedExercise, SessionType } from "../../types";
import { OneRepMax } from "../onerepmax/OneRepMax";
import { PostWorkout } from "../postworkout/PostWorkout";
import { Profile } from "../profile/Profile";
import { SessionHistory } from "../sessionhistory/SessionHistory";
import { SetupOneRepMax } from "../setuponepmax/SetupOneRepMax";
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
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(
    null,
  );
  const [pendingResults, setPendingResults] = useState<
    ProgressionResult[] | null
  >(null);

  const { store, update } = useWorkoutStore();
  const sessionType = getNextSessionType(store.lastCompletedSession);
  const activeSessionType = store.activeWorkout?.sessionType ?? sessionType;
  const workoutActive = store.activeWorkout !== null;
  const items = buildOverviewFromStore(store);
  const trendData = buildTrendData(store.history);

  const handleOverrideWorkingWeight = (
    exercise: ExerciseName,
    weight: number,
  ) => {
    update((previousStore) => ({
      ...previousStore,
      workingWeights: { ...previousStore.workingWeights, [exercise]: weight },
    }));
  };

  const handleCompleteOneRepMaxSetup = (
    estimatedOneRepMax: Record<ExerciseName, number>,
  ) => {
    update((previousStore) => ({
      ...previousStore,
      estimatedOneRepMax,
      hasConfiguredOneRepMax: true,
      workingWeights: buildStartingWeights(estimatedOneRepMax),
    }));
    trackAnalyticsEvent("Onboarding completed");
  };

  const stage: Stage = pendingResults
    ? "summary"
    : pendingSession
      ? "onerepmax"
      : "workout";

  const startWorkout = () => {
    setPendingSession(null);
    setPendingResults(null);
    update((previousStore) => ({
      ...previousStore,
      activeWorkout: {
        sessionType,
        exercises: buildInitialExercises(sessionType, previousStore.workingWeights),
      },
    }));
    trackAnalyticsEvent("Workout started");
    setWorkoutOpen(true);
  };

  const closeWorkout = () => {
    setWorkoutOpen(false);
    setPendingSession(null);
    setPendingResults(null);
    update((previousStore) => ({ ...previousStore, activeWorkout: null }));
  };

  const minimizeWorkout = () => {
    setWorkoutOpen(false);
  };

  const resumeWorkout = () => {
    trackAnalyticsEvent("Workout resumed");
    setWorkoutOpen(true);
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
        activeWorkout: null,
      };
    });
    trackAnalyticsEvent("Workout completed");

    closeWorkout();
  };

  if (!store.hasConfiguredOneRepMax) {
    return (
      <main className="home">
        <SetupOneRepMax onComplete={handleCompleteOneRepMaxSetup} />
      </main>
    );
  }

  return (
    <main className="home">
      <Toolbar
        title="Good morning"
        onShowProfile={() => setShowProfile(true)}
        onResumeWorkout={resumeWorkout}
        hasActiveWorkout={workoutActive}
      />
      <div className="home__dashboard">
        <UpcomingSession
          session={items}
          sessionType={sessionType}
          onStartWorkout={workoutActive ? resumeWorkout : startWorkout}
          isWorkoutActive={workoutActive}
        />
        <Summary items={items} />
        <PreviousSession
          session={items}
          onViewAllSessions={() => setShowSessionHistory(true)}
        />
        <Section className="home__trends">
          <div className="card__heading">
            <div>
              <Heading text="Progress" level="2" />
              <span className="card__description">Working weight by completed workout</span>
            </div>
          </div>
          <ChartComponent data={trendData} />
        </Section>
      </div>
      <Dialog
        title="Profile"
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile
          increments={store.increments}
          estimatedOneRepMax={store.estimatedOneRepMax}
          workingWeights={store.workingWeights}
          onOverrideWeight={handleOverrideWorkingWeight}
        />
      </Dialog>

      <Dialog
        title="Sessions"
        isOpen={showSessionHistory}
        onClose={() => setShowSessionHistory(false)}
      >
        <SessionHistory sessions={store.history} />
      </Dialog>

      <Dialog
        title={DIALOG_TITLES[stage]}
        isOpen={workoutOpen}
        onClose={minimizeWorkout}
        actionLabel="Minimize"
        actionAriaLabel="Minimize workout"
        actionIcon={Minimize2}
        destructiveAction={{
          label: "Discard workout",
          onClick: closeWorkout,
          ariaLabel: "Discard active workout",
        }}
      >
        {stage === "workout" && (
          <WorkoutSession
            sessionType={activeSessionType}
            exercises={store.activeWorkout?.exercises ?? []}
            onExercisesChange={(exercises) =>
              update((previousStore) =>
                previousStore.activeWorkout
                  ? {
                      ...previousStore,
                      activeWorkout: {
                        ...previousStore.activeWorkout,
                        exercises,
                      },
                    }
                  : previousStore,
              )
            }
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
    </main>
  );
};
