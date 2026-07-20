import "./Home.css";

import { Minimize2 } from "lucide-react";
import { useState } from "react";

import { ChartComponent, Heading, Section, Toolbar } from "../../components";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { trackAnalyticsEvent } from "../../helpers/analytics.helper";
import { getCombinedCatalog } from "../../helpers/exercise-catalog.helper";
import { calculateSessionOneRepMax } from "../../helpers/one-rep-max.helper";
import { buildOverviewFromStore } from "../../helpers/overview.helper";
import {
  calculateSessionProgression,
  getNextProgramSession,
  wasTrainedRecently,
  type ProgressionResult,
} from "../../helpers/progression.helper";
import {
  buildBodyWeightTrendData,
  upsertBodyWeightEntry,
} from "../../helpers/bodyweight.helper";
import { buildInitialExercises } from "../../helpers/session.helper";
import { buildStartingWeights } from "../../helpers/starting-weight.helper";
import { buildTrendData } from "../../helpers/trends.helper";
import { computeTrainingStatus, type TrainingStatus } from "../../helpers/status.helper";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import { useWorkoutStore } from "../../hooks/useWorkoutStore";
import type {
  LoggedExercise,
  SessionCheckIn,
  TrackedLiftId,
} from "../../types";
import { BodyWeight } from "../bodyweight/BodyWeight";
import { OneRepMax } from "../onerepmax/OneRepMax";
import { PostWorkout } from "../postworkout/PostWorkout";
import { Profile } from "../profile/Profile";
import { SessionHistory } from "../sessionhistory/SessionHistory";
import { SetupOneRepMax } from "../setuponepmax/SetupOneRepMax";
import { WorkoutSession } from "../workoutsession/Session";

type PendingSession = {
  exercises: LoggedExercise[];
};

type Stage = "workout" | "onerepmax" | "summary";

const DIALOG_TITLES: Record<Stage, string> = {
  workout: "Workout",
  onerepmax: "Estimated 1RM",
  summary: "Workout Summary",
};

const STATUS_LABELS: Record<TrainingStatus | "insufficient-data", string> = {
  comeback: "Comeback",
  gaining: "Gaining",
  maintaining: "Maintaining",
  declining: "Declining",
  "insufficient-data": "Not enough data yet",
};

export const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(
    null,
  );
  const [pendingResults, setPendingResults] = useState<
    ProgressionResult[] | null
  >(null);

  const { store, update } = useWorkoutStore();
  const catalog = getCombinedCatalog(store);
  const activeProgram =
    store.programs.find((program) => program.id === store.activeProgramId) ??
    null;
  const nextSession = activeProgram
    ? getNextProgramSession(activeProgram, store.lastCompletedSessionId)
    : null;
  const workoutActive = store.activeWorkout !== null;
  const items = buildOverviewFromStore(store);
  const trendData = buildTrendData(store.history);
  const bodyWeightTrendData = buildBodyWeightTrendData(store.bodyWeightLog);
  const trainingStatus = computeTrainingStatus(store.history);

  const handleLogBodyWeight = (weight: number) => {
    update((previousStore) => ({
      ...previousStore,
      bodyWeightLog: upsertBodyWeightEntry(
        previousStore.bodyWeightLog,
        new Date().toISOString(),
        weight,
      ),
    }));
  };

  const handleOverrideWorkingWeight = (
    exercise: TrackedLiftId,
    weight: number,
  ) => {
    update((previousStore) => ({
      ...previousStore,
      workingWeights: { ...previousStore.workingWeights, [exercise]: weight },
    }));
  };

  const handleCompleteOneRepMaxSetup = (
    estimatedOneRepMax: Record<TrackedLiftId, number>,
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
        programId: activeProgram?.id ?? null,
        sessionId: nextSession?.id ?? null,
        sessionLabel: nextSession?.name ?? "Workout",
        exercises: buildInitialExercises(
          nextSession,
          catalog,
          previousStore.workingWeights,
          previousStore.history,
        ),
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

  const handleBackToWorkout = () => {
    if (!pendingSession || !store.activeWorkout) {
      return;
    }

    update((previousStore) =>
      previousStore.activeWorkout
        ? {
            ...previousStore,
            activeWorkout: {
              ...previousStore.activeWorkout,
              exercises: pendingSession.exercises,
            },
          }
        : previousStore,
    );
    setPendingResults(null);
    setPendingSession(null);
  };

  const handleContinueFromOneRepMax = () => {
    if (!pendingSession) {
      return;
    }

    setPendingResults(
      calculateSessionProgression(pendingSession.exercises, store.increments),
    );
  };

  const handleConfirmPostWorkout = (
    finalIncrements: Record<TrackedLiftId, number>,
    checkIn: SessionCheckIn,
  ) => {
    if (!pendingResults || !pendingSession || !store.activeWorkout) {
      return;
    }

    update((prev) => {
      if (!prev.activeWorkout) {
        return prev;
      }

      const workingWeights = { ...prev.workingWeights };
      pendingResults.forEach((result) => {
        if (result.tracked && result.completed) {
          workingWeights[result.exerciseId as TrackedLiftId] =
            result.previousWeight +
            (finalIncrements[result.exerciseId as TrackedLiftId] ??
              result.proposedIncrement!);
        }
      });

      return {
        ...prev,
        workingWeights,
        increments: { ...prev.increments, ...finalIncrements },
        lastCompletedSessionId:
          prev.activeWorkout.sessionId ?? prev.lastCompletedSessionId,
        history: [
          ...prev.history,
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            programId: prev.activeWorkout.programId,
            sessionId: prev.activeWorkout.sessionId,
            sessionLabel: prev.activeWorkout.sessionLabel,
            exercises: pendingSession.exercises,
            checkIn,
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
        onShowBodyWeight={() => setShowBodyWeight(true)}
        onResumeWorkout={resumeWorkout}
        hasActiveWorkout={workoutActive}
      />
      <div className="home__dashboard">
        <UpcomingSession
          session={items}
          nextSession={nextSession}
          onStartWorkout={workoutActive ? resumeWorkout : startWorkout}
          isWorkoutActive={workoutActive}
          isUpcoming={wasTrainedRecently(store.history)}
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
            <span className={`status-badge status-badge--${trainingStatus}`}>
              {STATUS_LABELS[trainingStatus]}
            </span>
          </div>
          <ChartComponent data={trendData} />
        </Section>
        <Section className="home__trends">
          <div className="card__heading">
            <div>
              <Heading text="Body weight" level="2" />
              <span className="card__description">Logged body weight over time</span>
            </div>
          </div>
          <SingleLineChart
            data={bodyWeightTrendData}
            dataKey="weight"
            label="Weight"
            unit="kg"
            color="var(--warning)"
          />
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
        title="Body weight"
        isOpen={showBodyWeight}
        onClose={() => setShowBodyWeight(false)}
      >
        <BodyWeight log={store.bodyWeightLog} onLog={handleLogBodyWeight} />
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
            sessionLabel={store.activeWorkout?.sessionLabel ?? ""}
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
            onBack={handleBackToWorkout}
          />
        )}
      </Dialog>
    </main>
  );
};
